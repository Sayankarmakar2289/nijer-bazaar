'use client';

import { Suspense, use, useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/shared/Header';
import MobileBottomNav from '@/components/shared/MobileBottomNav';
import { useStore } from '@/store';
import { formatPaise, categoryEmojis } from '@/lib/utils';
import { ArrowLeft, Minus, Plus, ShoppingCart } from 'lucide-react';

function ProductDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [mounted, setMounted] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const products = useStore((s) => s.products);
  const shops = useStore((s) => s.shops);
  const cart = useStore((s) => s.cart);
  const addToCart = useStore((s) => s.addToCart);
  const switchCartShop = useStore((s) => s.switchCartShop);
  const [showSwitchModal, setShowSwitchModal] = useState(false);

  useEffect(() => setMounted(true), []);

  const product = products.find((p) => p.id === id);
  const shop = product ? shops.find((s) => s.id === product.shopId) : null;

  useEffect(() => {
    if (product?.variants.length) {
      setSelectedVariantId(product.variants[0].id);
    }
  }, [product]);

  if (!mounted) {
    return <div className="min-h-screen bg-[var(--warm-ivory)]"><Header /></div>;
  }

  if (!product || !shop) {
    return (
      <div className="min-h-screen bg-[var(--warm-ivory)]">
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <p className="text-4xl mb-3">📦</p>
          <h1 className="text-xl font-bold mb-2">Product Not Found</h1>
          <Link href="/shops" className="text-[var(--forest-teal)] hover:underline">← Browse shops</Link>
        </div>
      </div>
    );
  }

  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId);
  const displayPrice = selectedVariant ? selectedVariant.pricePaise : product.pricePaise;
  const outOfStock = !product.isAvailable || product.stock <= 0;

  const handleAdd = () => {
    if (cart.shopId && cart.shopId !== product.shopId) {
      setShowSwitchModal(true);
      return;
    }
    addToCart(product, selectedVariant ? { id: selectedVariant.id, label: selectedVariant.label, pricePaise: selectedVariant.pricePaise } : undefined, quantity);
  };

  const handleSwitch = () => {
    switchCartShop(shop.id, shop.name);
    addToCart(product, selectedVariant ? { id: selectedVariant.id, label: selectedVariant.label, pricePaise: selectedVariant.pricePaise } : undefined, quantity);
    setShowSwitchModal(false);
  };

  const relatedProducts = products.filter((p) => p.shopId === product.shopId && p.id !== product.id && !p.isArchived).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--warm-ivory)]">
      <Header />
      <main className="flex-1 pb-20 md:pb-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <Link href={`/shops/${shop.slug}`} className="text-xs text-[var(--muted-slate)] hover:text-[var(--forest-teal)] flex items-center gap-1 mb-4">
            <ArrowLeft size={12} /> Back to {shop.name}
          </Link>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Image */}
            <div className={`h-64 sm:h-80 img-placeholder text-6xl rounded-2xl ${outOfStock ? 'opacity-50' : ''}`}>
              {categoryEmojis[product.category] || '📦'}
            </div>

            {/* Details */}
            <div>
              <p className="text-xs text-[var(--muted-slate)] mb-1">{shop.name}</p>
              <h1 className="text-2xl font-bold text-[var(--deep-ink)] mb-2">{product.name}</h1>
              <p className="text-sm text-[var(--muted-slate)] leading-relaxed mb-4">{product.description}</p>

              {product.preparationNotes && (
                <p className="text-xs text-[var(--warning)] bg-amber-50 px-3 py-2 rounded-lg mb-4">
                  📝 {product.preparationNotes}
                </p>
              )}

              {/* Variants */}
              {product.variants.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-[var(--deep-ink)] mb-2">Select Option:</p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariantId(v.id)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                          selectedVariantId === v.id
                            ? 'bg-[var(--forest-teal)] text-white border-[var(--forest-teal)]'
                            : 'bg-white text-[var(--deep-ink)] border-[var(--soft-border)] hover:border-[var(--forest-teal)]'
                        }`}
                      >
                        {v.label} — {formatPaise(v.pricePaise)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-2xl font-bold text-[var(--forest-teal)]">{formatPaise(displayPrice)}</span>
                <span className="text-sm text-[var(--muted-slate)]">/{product.unit}</span>
              </div>

              {/* Stock */}
              {outOfStock ? (
                <p className="text-sm text-[var(--error)] font-medium mb-4">Currently out of stock</p>
              ) : product.stock <= 5 ? (
                <p className="text-sm text-[var(--warning)] font-medium mb-4">Only {product.stock} left in stock</p>
              ) : (
                <p className="text-sm text-[var(--success)] font-medium mb-4">In Stock</p>
              )}

              {/* Quantity + Add */}
              {!outOfStock && !shop.isPaused && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 border border-[var(--soft-border)] rounded-xl px-2">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-[var(--soft-sage)] rounded"><Minus size={16} /></button>
                    <span className="w-8 text-center font-semibold">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:bg-[var(--soft-sage)] rounded"><Plus size={16} /></button>
                  </div>
                  <button
                    onClick={handleAdd}
                    className="flex-1 flex items-center justify-center gap-2 bg-[var(--forest-teal)] text-white font-semibold py-3 rounded-xl hover:brightness-110 transition-all"
                  >
                    <ShoppingCart size={18} />
                    Add to Cart — {formatPaise(displayPrice * quantity)}
                  </button>
                </div>
              )}

              {shop.isPaused && !outOfStock && (
                <p className="text-sm text-[var(--warning)] bg-amber-50 px-4 py-3 rounded-xl">This shop has paused orders temporarily.</p>
              )}
            </div>
          </div>

          {/* Related */}
          {relatedProducts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-lg font-bold text-[var(--deep-ink)] mb-4">More from {shop.name}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {relatedProducts.map((rp) => (
                  <Link key={rp.id} href={`/products/${rp.id}`} className="bg-white rounded-2xl border border-[var(--soft-border)] overflow-hidden hover:shadow-md transition-all">
                    <div className="h-24 img-placeholder text-2xl">{categoryEmojis[rp.category] || '📦'}</div>
                    <div className="p-2.5">
                      <h3 className="text-xs font-semibold text-[var(--deep-ink)] line-clamp-1">{rp.name}</h3>
                      <p className="text-xs font-bold text-[var(--forest-teal)] mt-0.5">{formatPaise(rp.pricePaise)}/{rp.unit}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {showSwitchModal && (
        <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6">
            <h3 className="font-bold text-[var(--deep-ink)] mb-2">Switch Shop?</h3>
            <p className="text-sm text-[var(--muted-slate)] mb-4">
              Your cart has items from <strong>{cart.shopName}</strong>. Adding this item will clear your current cart.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowSwitchModal(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--soft-border)] text-sm font-medium">Keep Cart</button>
              <button onClick={handleSwitch} className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--forest-teal)] text-white text-sm font-medium">Start New Cart</button>
            </div>
          </div>
        </div>
      )}

      <MobileBottomNav />
    </div>
  );
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--warm-ivory)]" />}>
      <ProductDetailContent params={params} />
    </Suspense>
  );
}
