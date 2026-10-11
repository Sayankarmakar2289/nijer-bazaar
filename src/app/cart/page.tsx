'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/shared/Header';
import MobileBottomNav from '@/components/shared/MobileBottomNav';
import { useStore } from '@/store';
import { formatPaise, categoryEmojis } from '@/lib/utils';
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const cart = useStore((s) => s.cart);
  const shops = useStore((s) => s.shops);
  const products = useStore((s) => s.products);
  const removeFromCart = useStore((s) => s.removeFromCart);
  const updateCartQuantity = useStore((s) => s.updateCartQuantity);
  const clearCart = useStore((s) => s.clearCart);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="min-h-screen bg-[var(--warm-ivory)]"><Header /></div>;
  }

  const shop = shops.find((s) => s.id === cart.shopId);
  const subtotal = cart.items.reduce((sum, item) => sum + item.pricePaise * item.quantity, 0);
  const deliveryFee = shop?.deliveryFee || 0;

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--warm-ivory)]">
        <Header />
        <main className="flex-1 flex items-center justify-center pb-20 md:pb-0">
          <div className="text-center px-4">
            <p className="text-6xl mb-4">🛒</p>
            <h1 className="text-xl font-bold text-[var(--deep-ink)] mb-2">Your cart is empty</h1>
            <p className="text-sm text-[var(--muted-slate)] mb-6">Browse shops and add items to get started.</p>
            <Link
              href="/shops"
              className="inline-flex items-center gap-2 bg-[var(--forest-teal)] text-white font-semibold px-6 py-3 rounded-xl hover:brightness-110 transition-all text-sm"
            >
              Explore Shops
              <ArrowRight size={16} />
            </Link>
          </div>
        </main>
        <MobileBottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--warm-ivory)]">
      <Header />
      <main className="flex-1 pb-20 md:pb-0">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[var(--deep-ink)]">Your Cart</h1>
              <p className="text-sm text-[var(--muted-slate)]">
                from <Link href={`/shops/${shop?.slug}`} className="text-[var(--forest-teal)] hover:underline font-medium">{cart.shopName}</Link>
              </p>
            </div>
            <button
              onClick={clearCart}
              className="text-xs text-[var(--error)] hover:text-red-700 font-medium flex items-center gap-1"
            >
              <Trash2 size={14} /> Clear
            </button>
          </div>

          {/* Items */}
          <div className="space-y-3 mb-6">
            {cart.items.map((item) => {
              const product = products.find((p) => p.id === item.productId);
              const outOfStock = product && (!product.isAvailable || product.stock <= 0);

              return (
                <div key={`${item.productId}-${item.variantId}`} className={`bg-white rounded-2xl border border-[var(--soft-border)] p-4 flex gap-4 ${outOfStock ? 'opacity-60' : ''}`}>
                  <div className="w-16 h-16 shrink-0 img-placeholder text-xl rounded-xl">
                    {product ? categoryEmojis[product.category] || '📦' : '📦'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-sm text-[var(--deep-ink)]">{item.name}</h3>
                        {item.variantLabel && <p className="text-xs text-[var(--muted-slate)]">{item.variantLabel}</p>}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.productId, item.variantId)}
                        className="text-[var(--muted-slate)] hover:text-[var(--error)] p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    {outOfStock && <p className="text-[10px] text-[var(--error)] mt-0.5">This item is no longer available</p>}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 border border-[var(--soft-border)] rounded-lg px-1">
                        <button onClick={() => updateCartQuantity(item.productId, item.variantId, item.quantity - 1)} className="p-1 hover:bg-[var(--soft-sage)] rounded"><Minus size={14} /></button>
                        <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                        <button onClick={() => updateCartQuantity(item.productId, item.variantId, item.quantity + 1)} className="p-1 hover:bg-[var(--soft-sage)] rounded"><Plus size={14} /></button>
                      </div>
                      <span className="font-bold text-sm text-[var(--forest-teal)]">{formatPaise(item.pricePaise * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="bg-white rounded-2xl border border-[var(--soft-border)] p-4 mb-6">
            <h3 className="font-semibold text-[var(--deep-ink)] mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--muted-slate)]">Subtotal ({cart.items.length} item{cart.items.length > 1 ? 's' : ''})</span>
                <span className="font-medium">{formatPaise(subtotal)}</span>
              </div>
              {shop?.supportsDelivery && (
                <div className="flex justify-between">
                  <span className="text-[var(--muted-slate)]">Delivery fee</span>
                  <span className="font-medium">{formatPaise(deliveryFee)}</span>
                </div>
              )}
              <div className="border-t border-[var(--soft-border)] pt-2 flex justify-between">
                <span className="font-semibold text-[var(--deep-ink)]">Estimated Total</span>
                <span className="font-bold text-[var(--forest-teal)]">{formatPaise(subtotal + (shop?.supportsDelivery ? deliveryFee : 0))}</span>
              </div>
            </div>
          </div>

          {shop?.isPaused ? (
            <div className="bg-amber-50 text-[var(--warning)] text-sm font-medium px-4 py-3 rounded-xl text-center">
              This shop has paused orders. You cannot proceed to checkout.
            </div>
          ) : (
            <Link
              href="/checkout"
              className="w-full flex items-center justify-center gap-2 bg-[var(--forest-teal)] text-white font-semibold py-3.5 rounded-xl hover:brightness-110 transition-all text-sm"
            >
              Proceed to Checkout
              <ArrowRight size={16} />
            </Link>
          )}
        </div>
      </main>
      <MobileBottomNav />
    </div>
  );
}
