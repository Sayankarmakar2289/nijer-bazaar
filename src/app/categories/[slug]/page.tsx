'use client';

import { Suspense, use, useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import MobileBottomNav from '@/components/shared/MobileBottomNav';
import { useStore } from '@/store';
import { formatPaise, categoryLabels, categoryEmojis, isShopOpen } from '@/lib/utils';
import { ShopCategory, Product } from '@/types';
import { ArrowLeft, Store, ShoppingCart, Check, Plus, MapPin } from 'lucide-react';

const allCategories: { slug: ShopCategory; label: string; emoji: string }[] = [
  { slug: 'grocery', label: 'Grocery & Staples', emoji: '🛒' },
  { slug: 'vegetables', label: 'Fresh Vegetables', emoji: '🥬' },
  { slug: 'fruits', label: 'Seasonal Fruits', emoji: '🍎' },
  { slug: 'chicken', label: 'Chicken', emoji: '🍗' },
  { slug: 'mutton', label: 'Mutton', emoji: '🥩' },
  { slug: 'fish', label: 'Fish & Seafood', emoji: '🐟' },
  { slug: 'dairy', label: 'Dairy & Eggs', emoji: '🥛' },
  { slug: 'essentials', label: 'Daily Essentials', emoji: '🧴' },
];

function CategoryContent({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = (resolvedParams.slug as ShopCategory) || 'grocery';
  const [mounted, setMounted] = useState(false);
  const [addedItem, setAddedItem] = useState<string | null>(null);

  const shops = useStore((s) => s.shops);
  const products = useStore((s) => s.products);
  const addToCart = useStore((s) => s.addToCart);
  const cart = useStore((s) => s.cart);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[var(--warm-ivory)]">
        <Header />
      </div>
    );
  }

  const categoryInfo = allCategories.find((c) => c.slug === slug);
  const title = categoryInfo?.label || 'Category';
  const emoji = categoryInfo?.emoji || '🛍️';

  const categoryShops = shops.filter((s) => s.category === slug);
  const categoryProducts = products.filter(
    (p) => p.category === slug && p.isAvailable && !p.isArchived
  );

  const handleAdd = (product: Product) => {
    const defaultVariant = product.variants && product.variants.length > 0 ? product.variants[0] : undefined;
    const ok = addToCart(product, defaultVariant, 1);
    if (ok) {
      setAddedItem(product.id);
      setTimeout(() => setAddedItem(null), 1500);
    } else {
      alert(`Your cart already contains items from "${cart.shopName}". Clear your cart or complete your order first.`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--warm-ivory)]">
      <Header />

      <main className="flex-1 pb-24 md:pb-12">
        {/* Category Header */}
        <div className="bg-white border-b border-[var(--soft-border)] py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/"
              className="text-xs text-[var(--muted-slate)] hover:text-[var(--forest-teal)] flex items-center gap-1 font-medium mb-3"
            >
              <ArrowLeft size={14} /> Back to Home
            </Link>

            <div className="flex items-center gap-3">
              <span className="text-4xl">{emoji}</span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[var(--deep-ink)]">{title}</h1>
                <p className="text-xs sm:text-sm text-[var(--muted-slate)]">
                  Locally sourced from verified neighbourhood shops in Demo Neighbourhood
                </p>
              </div>
            </div>

            {/* Category pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 mt-6 scrollbar-none">
              {allCategories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/categories/${c.slug}`}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    c.slug === slug
                      ? 'bg-[var(--forest-teal)] text-white shadow-sm'
                      : 'bg-[var(--soft-sage)] text-[var(--deep-ink)] hover:bg-[var(--forest-teal)]/10'
                  }`}
                >
                  <span>{c.emoji}</span>
                  <span>{c.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
          {/* Shops offering this category */}
          {categoryShops.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-[var(--deep-ink)] mb-4 flex items-center gap-2">
                <Store size={18} className="text-[var(--forest-teal)]" />
                Neighbourhood Stores
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryShops.map((shop) => {
                  const open = isShopOpen(shop.hours) && !shop.isPaused;
                  return (
                    <Link
                      key={shop.id}
                      href={`/shops/${shop.slug}`}
                      className="bg-white rounded-2xl border border-[var(--soft-border)] p-5 hover:border-[var(--forest-teal)] hover:shadow-sm transition-all group"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-bold text-base text-[var(--deep-ink)] group-hover:text-[var(--forest-teal)]">
                          {shop.name}
                        </h3>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            open ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {shop.isPaused ? 'Paused' : open ? 'Open' : 'Closed'}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--muted-slate)] line-clamp-2 mb-3">
                        {shop.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-[var(--muted-slate)] border-t border-[var(--soft-border)] pt-2">
                        <span className="flex items-center gap-1">
                          <MapPin size={12} /> {shop.distance}
                        </span>
                        <span>
                          {shop.supportsDelivery ? '🛵 Delivery' : ''}{' '}
                          {shop.supportsPickup ? '🛍️ Pickup' : ''}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* Products in this category */}
          <section>
            <h2 className="text-lg font-bold text-[var(--deep-ink)] mb-4">
              Available Products ({categoryProducts.length})
            </h2>

            {categoryProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[var(--soft-border)] p-8 text-center text-sm text-[var(--muted-slate)]">
                No products currently available in this category.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {categoryProducts.map((p) => {
                  const shop = shops.find((s) => s.id === p.shopId);
                  const isAdded = addedItem === p.id;

                  return (
                    <div
                      key={p.id}
                      className="bg-white rounded-2xl border border-[var(--soft-border)] p-4 flex flex-col justify-between hover:border-[var(--forest-teal)] transition-all group"
                    >
                      <div>
                        <div className="w-full aspect-square rounded-xl bg-[var(--soft-sage)] flex items-center justify-center text-3xl mb-3 group-hover:scale-105 transition-transform">
                          {emoji}
                        </div>
                        <p className="text-[10px] font-bold text-[var(--muted-slate)] uppercase tracking-wider truncate">
                          {shop?.name}
                        </p>
                        <Link href={`/products/${p.id}`}>
                          <h3 className="font-bold text-sm text-[var(--deep-ink)] hover:text-[var(--forest-teal)] line-clamp-2 mt-0.5">
                            {p.name}
                          </h3>
                        </Link>
                        <p className="text-xs text-[var(--muted-slate)] mt-0.5">
                          per {p.unit}
                        </p>
                      </div>

                      <div className="mt-4 pt-2 border-t border-[var(--soft-border)] flex items-center justify-between gap-2">
                        <div>
                          <span className="text-sm font-bold text-[var(--deep-ink)]">
                            {formatPaise(p.pricePaise)}
                          </span>
                        </div>
                        <button
                          onClick={() => handleAdd(p)}
                          className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                            isAdded
                              ? 'bg-[var(--forest-teal)] text-[var(--fresh-lime)]'
                              : 'bg-[var(--soft-sage)] text-[var(--forest-teal)] hover:bg-[var(--forest-teal)] hover:text-white'
                          }`}
                          aria-label={`Add ${p.name} to cart`}
                        >
                          {isAdded ? <Check size={16} /> : <Plus size={16} />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--warm-ivory)]" />}>
      <CategoryContent params={params} />
    </Suspense>
  );
}
