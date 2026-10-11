'use client';

import { Suspense, use, useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import MobileBottomNav from '@/components/shared/MobileBottomNav';
import { useStore } from '@/store';
import { formatPaise, categoryLabels, categoryEmojis, isShopOpen } from '@/lib/utils';
import { MapPin, Clock, Truck, Store, Search, ShoppingCart, Plus, Minus, AlertCircle, ArrowLeft } from 'lucide-react';

function ShopDetailContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const shops = useStore((s) => s.shops);
  const products = useStore((s) => s.products);
  const cart = useStore((s) => s.cart);
  const addToCart = useStore((s) => s.addToCart);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const updateCartQuantity = useStore((s) => s.updateCartQuantity);
  const clearCart = useStore((s) => s.clearCart);
  const switchCartShop = useStore((s) => s.switchCartShop);

  const [shopSwitchModal, setShopSwitchModal] = useState<{ product: typeof products[0]; variant?: { id: string; label: string; pricePaise: number } } | null>(null);

  useEffect(() => setMounted(true), []);

  const shop = shops.find((s) => s.slug === slug);
  const shopProducts = useMemo(() => {
    if (!shop) return [];
    let result = products.filter((p) => p.shopId === shop.id && !p.isArchived);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }
    return result;
  }, [shop, products, searchQuery, selectedCategory]);

  const productCategories = useMemo(() => {
    if (!shop) return [];
    const cats = new Set(products.filter((p) => p.shopId === shop.id && !p.isArchived).map((p) => p.category));
    return Array.from(cats);
  }, [shop, products]);

  const getCartQuantity = (productId: string, variantId?: string) => {
    const item = cart.items.find((i) => i.productId === productId && i.variantId === variantId);
    return item?.quantity || 0;
  };

  const handleAddToCart = (product: typeof products[0], variant?: { id: string; label: string; pricePaise: number }) => {
    if (cart.shopId && cart.shopId !== product.shopId) {
      setShopSwitchModal({ product, variant });
      return;
    }
    addToCart(product, variant);
  };

  const handleSwitchShop = () => {
    if (!shopSwitchModal || !shop) return;
    switchCartShop(shop.id, shop.name);
    addToCart(shopSwitchModal.product, shopSwitchModal.variant);
    setShopSwitchModal(null);
  };

  if (!mounted) {
    return <div className="min-h-screen bg-[var(--warm-ivory)]"><Header /><div className="max-w-7xl mx-auto px-4 py-16 text-center text-[var(--muted-slate)]">Loading...</div></div>;
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-[var(--warm-ivory)]">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <p className="text-4xl mb-3">🏪</p>
          <h1 className="text-xl font-bold text-[var(--deep-ink)] mb-2">Shop Not Found</h1>
          <p className="text-[var(--muted-slate)] mb-4">The shop you&#39;re looking for doesn&#39;t exist.</p>
          <Link href="/shops" className="text-[var(--forest-teal)] font-medium hover:underline">← Browse all shops</Link>
        </div>
      </div>
    );
  }

  const cartSubtotal = cart.shopId === shop.id ? cart.items.reduce((s, i) => s + i.pricePaise * i.quantity, 0) : 0;
  const cartItemCount = cart.shopId === shop.id ? cart.items.reduce((s, i) => s + i.quantity, 0) : 0;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--warm-ivory)]">
      <Header />
      <main className="flex-1 pb-24 md:pb-0">
        {/* Shop Banner */}
        <div className="relative h-40 sm:h-56 img-placeholder text-6xl">
          {categoryEmojis[shop.category] || '🏪'}
          {shop.isPaused && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-[var(--error)] text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
                <AlertCircle size={16} /> Orders Paused
              </div>
            </div>
          )}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative">
          {/* Shop Info Card */}
          <div className="bg-white rounded-2xl border border-[var(--soft-border)] p-4 sm:p-6 mb-6 shadow-sm">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <Link href="/shops" className="text-xs text-[var(--muted-slate)] hover:text-[var(--forest-teal)] flex items-center gap-1 mb-2">
                  <ArrowLeft size={12} /> All Shops
                </Link>
                <h1 className="text-xl sm:text-2xl font-bold text-[var(--deep-ink)]">{shop.name}</h1>
              </div>
              <span className={`shrink-0 text-xs font-medium px-3 py-1 rounded-full ${
                shop.isPaused ? 'bg-red-50 text-[var(--error)]' :
                isShopOpen(shop.hours) ? 'bg-green-50 text-[var(--success)]' : 'bg-red-50 text-[var(--error)]'
              }`}>
                {shop.isPaused ? 'Paused' : isShopOpen(shop.hours) ? 'Open Now' : 'Currently Closed'}
              </span>
            </div>
            <p className="text-sm text-[var(--muted-slate)] mb-3">{shop.description}</p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--muted-slate)]">
              <span className="flex items-center gap-1"><MapPin size={12} />{shop.address}</span>
              <span className="flex items-center gap-1"><Clock size={12} />{shop.hours.open}–{shop.hours.close}</span>
              {shop.supportsPickup && <span className="flex items-center gap-1 text-[var(--forest-teal)]"><Store size={12} />Pickup</span>}
              {shop.supportsDelivery && <span className="flex items-center gap-1 text-[var(--forest-teal)]"><Truck size={12} />Delivery ({formatPaise(shop.deliveryFee)})</span>}
            </div>
          </div>

          {/* Search + Filter */}
          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-slate)]" />
              <input
                type="text"
                placeholder="Search products in this shop..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[var(--soft-border)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--forest-teal)]"
              />
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${selectedCategory === 'all' ? 'bg-[var(--forest-teal)] text-white' : 'bg-white border border-[var(--soft-border)] text-[var(--deep-ink)]'}`}
            >
              All Products
            </button>
            {productCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${selectedCategory === cat ? 'bg-[var(--forest-teal)] text-white' : 'bg-white border border-[var(--soft-border)] text-[var(--deep-ink)]'}`}
              >
                {categoryEmojis[cat]} {categoryLabels[cat] || cat}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          {shopProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-3xl mb-2">📦</p>
              <p className="text-[var(--muted-slate)]">No products found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {shopProducts.map((product) => {
                const defaultVariant = product.variants[0];
                const displayPrice = defaultVariant ? defaultVariant.pricePaise : product.pricePaise;
                const cartQty = getCartQuantity(product.id, defaultVariant?.id);
                const outOfStock = !product.isAvailable || product.stock <= 0;

                return (
                  <div key={product.id} className="bg-white rounded-2xl border border-[var(--soft-border)] overflow-hidden group">
                    <Link href={`/products/${product.id}`}>
                      <div className={`h-28 sm:h-36 img-placeholder text-3xl ${outOfStock ? 'opacity-50' : ''}`}>
                        {categoryEmojis[product.category] || '📦'}
                      </div>
                    </Link>
                    <div className="p-3">
                      <Link href={`/products/${product.id}`}>
                        <h3 className="font-semibold text-sm text-[var(--deep-ink)] mb-0.5 line-clamp-1 hover:text-[var(--forest-teal)] transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      {defaultVariant && (
                        <p className="text-[10px] text-[var(--muted-slate)] mb-1">{defaultVariant.label}</p>
                      )}
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm font-bold text-[var(--forest-teal)]">
                          {formatPaise(displayPrice)}
                        </span>
                        {outOfStock ? (
                          <span className="text-[10px] text-[var(--error)] font-medium">Out of stock</span>
                        ) : shop.isPaused ? (
                          <span className="text-[10px] text-[var(--warning)] font-medium">Shop paused</span>
                        ) : cartQty === 0 ? (
                          <button
                            onClick={() => handleAddToCart(product, defaultVariant)}
                            className="bg-[var(--forest-teal)] text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:brightness-110 transition-all"
                          >
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center gap-2 bg-[var(--forest-teal)] rounded-lg px-1">
                            <button
                              onClick={() => updateCartQuantity(product.id, defaultVariant?.id, cartQty - 1)}
                              className="text-white p-1 hover:bg-white/10 rounded"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-white text-xs font-bold min-w-[16px] text-center">{cartQty}</span>
                            <button
                              onClick={() => updateCartQuantity(product.id, defaultVariant?.id, cartQty + 1)}
                              className="text-white p-1 hover:bg-white/10 rounded"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                      {product.stock > 0 && product.stock <= 5 && (
                        <p className="text-[10px] text-[var(--warning)] mt-1">Only {product.stock} left</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sticky Cart Bar */}
        {cartItemCount > 0 && cart.shopId === shop.id && (
          <div className="fixed bottom-16 md:bottom-4 left-0 right-0 z-40 px-4">
            <Link
              href="/cart"
              className="max-w-7xl mx-auto flex items-center justify-between bg-[var(--forest-teal)] text-white rounded-2xl px-5 py-3.5 shadow-xl hover:brightness-110 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="bg-white/20 rounded-lg px-2 py-1 text-sm font-bold">{cartItemCount}</div>
                <span className="text-sm font-medium">{cartItemCount} item{cartItemCount > 1 ? 's' : ''} in cart</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">{formatPaise(cartSubtotal)}</span>
                <ShoppingCart size={18} />
              </div>
            </Link>
          </div>
        )}
      </main>

      {/* Shop Switch Modal */}
      {shopSwitchModal && (
        <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6">
            <h3 className="font-bold text-[var(--deep-ink)] mb-2">Switch Shop?</h3>
            <p className="text-sm text-[var(--muted-slate)] mb-4">
              Your cart has items from <strong>{cart.shopName}</strong>. Adding items from <strong>{shop.name}</strong> will clear your current cart.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShopSwitchModal(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--soft-border)] text-sm font-medium hover:bg-[var(--soft-sage)] transition-colors"
              >
                Keep Current Cart
              </button>
              <button
                onClick={handleSwitchShop}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--forest-teal)] text-white text-sm font-medium hover:brightness-110 transition-all"
              >
                Start New Cart
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <MobileBottomNav />
    </div>
  );
}

export default function ShopDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--warm-ivory)]" />}>
      <ShopDetailContent params={params} />
    </Suspense>
  );
}
