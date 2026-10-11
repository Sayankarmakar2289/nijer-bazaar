// All monetary values in integer paise (1 rupee = 100 paise)

export type ShopCategory =
  | 'grocery'
  | 'vegetables'
  | 'fruits'
  | 'chicken'
  | 'mutton'
  | 'fish'
  | 'dairy'
  | 'essentials';

export type ProductUnit = 'kg' | 'g' | 'litre' | 'ml' | 'piece' | 'dozen' | 'pack' | 'bundle';

export type FulfilmentMethod = 'pickup' | 'delivery';

export type DemoPaymentMethod = 'cash-on-delivery' | 'pay-at-shop';

export type OrderStatus =
  | 'placed'
  | 'accepted'
  | 'preparing'
  | 'ready'
  | 'out-for-delivery'
  | 'delivered'
  | 'collected'
  | 'rejected'
  | 'cancelled';

export interface ShopHours {
  open: string; // "09:00"
  close: string; // "21:00"
  days: number[]; // 0=Sun, 1=Mon, ...6=Sat
}

export interface Shop {
  id: string;
  slug: string;
  name: string;
  category: ShopCategory;
  description: string;
  address: string;
  phone: string;
  bannerImage: string;
  logoImage: string;
  hours: ShopHours;
  supportsPickup: boolean;
  supportsDelivery: boolean;
  deliveryFee: number; // paise
  isPaused: boolean;
  distance: string; // illustrative, e.g. "0.8 km"
}

export interface ProductVariant {
  id: string;
  label: string; // e.g. "500g", "1kg", "Whole", "Cut Pieces"
  pricePaise: number;
  unit: ProductUnit;
  quantity: number; // e.g. 500 for 500g
}

export interface Product {
  id: string;
  shopId: string;
  name: string;
  category: ShopCategory;
  description: string;
  image: string;
  unit: ProductUnit;
  pricePaise: number; // base price
  variants: ProductVariant[];
  stock: number;
  reservedStock: number;
  isAvailable: boolean;
  isArchived: boolean;
  preparationNotes?: string; // for meat/fish: cleaning, cutting options
}

export interface CartItem {
  productId: string;
  variantId?: string;
  quantity: number;
  // snapshot at add time for display; re-validated at checkout
  name: string;
  image: string;
  pricePaise: number;
  unit: ProductUnit;
  variantLabel?: string;
  notes?: string;
}

export interface Cart {
  shopId: string | null;
  shopName: string;
  items: CartItem[];
}

export interface OrderItem {
  productId: string;
  variantId?: string;
  name: string;
  image: string;
  pricePaise: number; // snapshot
  unit: ProductUnit;
  quantity: number;
  variantLabel?: string;
  notes?: string;
}

export interface OrderStatusEvent {
  status: OrderStatus;
  timestamp: string; // ISO
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  shopId: string;
  shopName: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  instructions: string;
  fulfilment: FulfilmentMethod;
  payment: DemoPaymentMethod;
  items: OrderItem[];
  subtotalPaise: number;
  deliveryFeePaise: number;
  totalPaise: number;
  status: OrderStatus;
  statusHistory: OrderStatusEvent[];
  createdAt: string; // ISO
  rejectionReason?: string;
}

export interface SellerInterestForm {
  id: string;
  ownerName: string;
  shopName: string;
  category: ShopCategory;
  locality: string;
  phone: string;
  hasDelivery: boolean;
  notes: string;
  submittedAt: string;
}

export interface DemoState {
  shops: Shop[];
  products: Product[];
  orders: Order[];
  cart: Cart;
  sellerInterestForms: SellerInterestForm[];
  selectedSellerId: string | null; // shop id for seller view
  currentRole: 'customer' | 'seller';
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  version: number;
}
