'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { DemoState, Cart, Order, Product, Shop, OrderStatus, OrderStatusEvent, CartItem, SellerInterestForm } from '@/types';
import { seedShops, seedProducts, seedOrders } from '@/data/seed';
import { generateId, generateOrderNumber } from '@/lib/utils';

const STORE_VERSION = 1;

const initialCart: Cart = { shopId: null, shopName: '', items: [] };

function getInitialState(): DemoState {
  return {
    shops: JSON.parse(JSON.stringify(seedShops)),
    products: JSON.parse(JSON.stringify(seedProducts)),
    orders: JSON.parse(JSON.stringify(seedOrders)),
    cart: { ...initialCart },
    sellerInterestForms: [],
    selectedSellerId: null,
    currentRole: 'customer',
    customerName: 'Demo Customer',
    customerPhone: '9900000001',
    customerAddress: '7 Park Lane, Demo Neighbourhood, Kolkata',
    version: STORE_VERSION,
  };
}

// Valid order transitions
const validTransitions: Record<OrderStatus, OrderStatus[]> = {
  placed: ['accepted', 'rejected', 'cancelled'],
  accepted: ['preparing', 'rejected', 'cancelled'],
  preparing: ['ready'],
  ready: ['out-for-delivery', 'collected', 'delivered'],
  'out-for-delivery': ['delivered'],
  delivered: [],
  collected: [],
  rejected: [],
  cancelled: [],
};

interface StoreActions {
  // Cart
  addToCart: (product: Product, variant?: { id: string; label: string; pricePaise: number }, quantity?: number, notes?: string) => boolean;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateCartQuantity: (productId: string, variantId: string | undefined, quantity: number) => void;
  clearCart: () => void;
  switchCartShop: (shopId: string, shopName: string) => void;

  // Orders
  placeOrder: (fulfilment: 'pickup' | 'delivery', payment: 'cash-on-delivery' | 'pay-at-shop', instructions: string, customerName: string, customerPhone: string, customerAddress: string) => Order | null;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string) => boolean;

  // Products (seller)
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  addProduct: (product: Omit<Product, 'id' | 'reservedStock' | 'isArchived'>) => void;
  adjustStock: (productId: string, delta: number) => void;

  // Shop
  updateShop: (shopId: string, updates: Partial<Shop>) => void;
  toggleShopPause: (shopId: string) => void;

  // Demo
  setCurrentRole: (role: 'customer' | 'seller') => void;
  setSelectedSeller: (shopId: string | null) => void;
  submitSellerInterest: (form: Omit<SellerInterestForm, 'id' | 'submittedAt'>) => void;
  resetDemo: () => void;
}

export const useStore = create<DemoState & StoreActions>()(
  persist(
    (set, get) => ({
      ...getInitialState(),

      // ─── Cart ──────────────────────────────────
      addToCart: (product, variant, quantity = 1, notes) => {
        const state = get();
        const shop = state.shops.find(s => s.id === product.shopId);
        if (!shop || shop.isPaused || !product.isAvailable || product.stock <= 0) return false;

        const pricePaise = variant ? variant.pricePaise : product.pricePaise;
        const newItem: CartItem = {
          productId: product.id,
          variantId: variant?.id,
          quantity,
          name: product.name,
          image: product.image,
          pricePaise,
          unit: product.unit,
          variantLabel: variant?.label,
          notes,
        };

        set((state) => {
          // Different shop? Don't auto-switch — caller handles confirmation
          if (state.cart.shopId && state.cart.shopId !== product.shopId) {
            return state; // return false handled below
          }

          const existingIdx = state.cart.items.findIndex(
            i => i.productId === product.id && i.variantId === (variant?.id)
          );

          const newItems = [...state.cart.items];
          if (existingIdx >= 0) {
            newItems[existingIdx] = { ...newItems[existingIdx], quantity: newItems[existingIdx].quantity + quantity };
          } else {
            newItems.push(newItem);
          }

          return {
            cart: {
              shopId: product.shopId,
              shopName: shop.name,
              items: newItems,
            },
          };
        });

        // Check if it was actually added (shop mismatch case)
        const afterState = get();
        if (state.cart.shopId && state.cart.shopId !== product.shopId) {
          return false; // signal shop mismatch
        }
        return true;
      },

      removeFromCart: (productId, variantId) => {
        set((state) => ({
          cart: {
            ...state.cart,
            items: state.cart.items.filter(
              i => !(i.productId === productId && i.variantId === variantId)
            ),
          },
        }));
        // clear shopId if cart is now empty
        const after = get();
        if (after.cart.items.length === 0) {
          set({ cart: { ...initialCart } });
        }
      },

      updateCartQuantity: (productId, variantId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId, variantId);
          return;
        }
        set((state) => ({
          cart: {
            ...state.cart,
            items: state.cart.items.map(i =>
              i.productId === productId && i.variantId === variantId
                ? { ...i, quantity }
                : i
            ),
          },
        }));
      },

      clearCart: () => set({ cart: { ...initialCart } }),

      switchCartShop: (shopId, shopName) => {
        set({ cart: { shopId, shopName, items: [] } });
      },

      // ─── Orders ──────────────────────────────────
      placeOrder: (fulfilment, payment, instructions, customerName, customerPhone, customerAddress) => {
        const state = get();
        if (state.cart.items.length === 0 || !state.cart.shopId) return null;

        const shop = state.shops.find(s => s.id === state.cart.shopId);
        if (!shop || shop.isPaused) return null;

        const subtotalPaise = state.cart.items.reduce((sum, item) => sum + item.pricePaise * item.quantity, 0);
        const deliveryFeePaise = fulfilment === 'delivery' ? shop.deliveryFee : 0;

        const order: Order = {
          id: generateId(),
          orderNumber: generateOrderNumber(),
          shopId: state.cart.shopId,
          shopName: state.cart.shopName,
          customerName,
          customerPhone,
          customerAddress,
          instructions,
          fulfilment,
          payment,
          items: state.cart.items.map(item => ({
            productId: item.productId,
            variantId: item.variantId,
            name: item.name,
            image: item.image,
            pricePaise: item.pricePaise,
            unit: item.unit,
            quantity: item.quantity,
            variantLabel: item.variantLabel,
            notes: item.notes,
          })),
          subtotalPaise,
          deliveryFeePaise,
          totalPaise: subtotalPaise + deliveryFeePaise,
          status: 'placed',
          statusHistory: [{ status: 'placed', timestamp: new Date().toISOString() }],
          createdAt: new Date().toISOString(),
        };

        // Reserve stock
        const updatedProducts = state.products.map(p => {
          const orderItem = state.cart.items.find(ci => ci.productId === p.id);
          if (orderItem) {
            return { ...p, reservedStock: p.reservedStock + orderItem.quantity };
          }
          return p;
        });

        set({
          orders: [...state.orders, order],
          products: updatedProducts,
          cart: { ...initialCart },
        });

        return order;
      },

      updateOrderStatus: (orderId, newStatus, note) => {
        const state = get();
        const order = state.orders.find(o => o.id === orderId);
        if (!order) return false;

        if (!validTransitions[order.status]?.includes(newStatus)) return false;

        const event: OrderStatusEvent = {
          status: newStatus,
          timestamp: new Date().toISOString(),
          note,
        };

        let updatedProducts = state.products;

        // Restore reserved stock on rejection/cancellation
        if (newStatus === 'rejected' || newStatus === 'cancelled') {
          updatedProducts = state.products.map(p => {
            const orderItem = order.items.find(oi => oi.productId === p.id);
            if (orderItem) {
              return {
                ...p,
                reservedStock: Math.max(0, p.reservedStock - orderItem.quantity),
              };
            }
            return p;
          });
        }

        // On completion, release reserved stock and deduct actual stock
        if (newStatus === 'delivered' || newStatus === 'collected') {
          updatedProducts = state.products.map(p => {
            const orderItem = order.items.find(oi => oi.productId === p.id);
            if (orderItem) {
              return {
                ...p,
                stock: Math.max(0, p.stock - orderItem.quantity),
                reservedStock: Math.max(0, p.reservedStock - orderItem.quantity),
              };
            }
            return p;
          });
        }

        set({
          orders: state.orders.map(o =>
            o.id === orderId
              ? {
                  ...o,
                  status: newStatus,
                  statusHistory: [...o.statusHistory, event],
                  rejectionReason: newStatus === 'rejected' ? note : o.rejectionReason,
                }
              : o
          ),
          products: updatedProducts,
        });

        return true;
      },

      // ─── Products ──────────────────────────────────
      updateProduct: (productId, updates) => {
        set((state) => ({
          products: state.products.map(p =>
            p.id === productId ? { ...p, ...updates } : p
          ),
        }));
      },

      addProduct: (product) => {
        const newProduct: Product = {
          ...product,
          id: generateId(),
          reservedStock: 0,
          isArchived: false,
        };
        set((state) => ({ products: [...state.products, newProduct] }));
      },

      adjustStock: (productId, delta) => {
        set((state) => ({
          products: state.products.map(p =>
            p.id === productId
              ? { ...p, stock: Math.max(0, p.stock + delta), isAvailable: p.stock + delta > 0 ? p.isAvailable : false }
              : p
          ),
        }));
      },

      // ─── Shop ──────────────────────────────────
      updateShop: (shopId, updates) => {
        set((state) => ({
          shops: state.shops.map(s => (s.id === shopId ? { ...s, ...updates } : s)),
        }));
      },

      toggleShopPause: (shopId) => {
        set((state) => ({
          shops: state.shops.map(s =>
            s.id === shopId ? { ...s, isPaused: !s.isPaused } : s
          ),
        }));
      },

      // ─── Demo ──────────────────────────────────
      setCurrentRole: (role) => set({ currentRole: role }),
      setSelectedSeller: (shopId) => set({ selectedSellerId: shopId }),

      submitSellerInterest: (form) => {
        const entry: SellerInterestForm = {
          ...form,
          id: generateId(),
          submittedAt: new Date().toISOString(),
        };
        set((state) => ({
          sellerInterestForms: [...state.sellerInterestForms, entry],
        }));
      },

      resetDemo: () => set(getInitialState()),
    }),
    {
      name: 'nijer-bazaar-demo-v1',
      storage: createJSONStorage(() => {
        if (typeof window === 'undefined') {
          // SSR: return a no-op storage
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return localStorage;
      }),
      version: STORE_VERSION,
    }
  )
);
