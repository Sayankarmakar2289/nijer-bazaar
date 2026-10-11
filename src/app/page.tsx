'use client';

import Link from 'next/link';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import MobileBottomNav from '@/components/shared/MobileBottomNav';
import { useStore } from '@/store';
import { formatPaise, categoryLabels, categoryEmojis, isShopOpen } from '@/lib/utils';
import { ShoppingCart, MapPin, Clock, Truck, Store, ArrowRight, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const shops = useStore((s) => s.shops);
  const products = useStore((s) => s.products);
  const addToCart = useStore((s) => s.addToCart);

  useEffect(() => setMounted(true), []);

  const categories = [
    { slug: 'grocery', label: 'Grocery & Staples', emoji: '🛒' },
    { slug: 'vegetables', label: 'Fresh Vegetables', emoji: '🥬' },
    { slug: 'fruits', label: 'Seasonal Fruits', emoji: '🍎' },
    { slug: 'chicken', label: 'Chicken', emoji: '🍗' },
    { slug: 'mutton', label: 'Mutton', emoji: '🥩' },
    { slug: 'fish', label: 'Fish & Seafood', emoji: '🐟' },
    { slug: 'dairy', label: 'Dairy & Eggs', emoji: '🥛' },
    { slug: 'essentials', label: 'Daily Essentials', emoji: '🧴' },
  ];

  const featuredShops = mounted ? shops.filter((s) => !s.isPaused).slice(0, 4) : [];
  const featuredProducts = mounted ? products.filter((p) => p.isAvailable && !p.isArchived && p.stock > 0).slice(0, 8) : [];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--warm-ivory)]">
      <Header />

      <main className="flex-1 pb-20 md:pb-0">
        {/* ── Hero ────────────────────────────── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[var(--forest-teal)] to-[#0D2E2A]">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-10 w-64 h-64 bg-[var(--fresh-lime)] rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 w-48 h-48 bg-[var(--market-coral)] rounded-full blur-3xl" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28 relative">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
                <MapPin size={14} className="text-[var(--fresh-lime)]" />
                <span className="text-xs font-medium text-white/90">Demo Neighbourhood, Kolkata</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
                Your Neighbourhood Market,{' '}
                <span className="text-[var(--fresh-lime)]">Now Online.</span>
              </h1>
              <p className="text-base sm:text-lg text-white/80 leading-relaxed mb-8 max-w-lg">
                From fresh vegetables and daily groceries to fish, meat and everyday essentials — discover and shop from your favourite local stores.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/shops"
                  className="inline-flex items-center gap-2 bg-[var(--fresh-lime)] text-[var(--forest-teal)] font-semibold px-6 py-3 rounded-xl hover:brightness-105 transition-all text-sm"
                >
                  Explore Nearby Shops
                  <ArrowRight size={16} />
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 border border-white/30 text-white font-medium px-6 py-3 rounded-xl hover:bg-white/10 transition-all text-sm"
                >
                  See How It Works
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── Categories ─────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--deep-ink)] mb-2">Shop by Category</h2>
          <p className="text-sm text-[var(--muted-slate)] mb-8">Everything your kitchen needs, from one neighbourhood.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-[var(--soft-border)] hover:border-[var(--forest-teal)] hover:shadow-md transition-all group"
              >
                <span className="text-3xl group-hover:scale-110 transition-transform">{cat.emoji}</span>
                <span className="text-xs font-medium text-center text-[var(--deep-ink)]">{cat.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Featured Shops ─────────────────── */}
        {mounted && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--deep-ink)] mb-1">
                  Your favourite shops, closer than ever.
                </h2>
                <p className="text-sm text-[var(--muted-slate)]">Fictional neighbourhood shops for demonstration.</p>
              </div>
              <Link href="/shops" className="hidden sm:flex items-center gap-1 text-sm font-medium text-[var(--forest-teal)] hover:underline">
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredShops.map((shop) => (
                <Link
                  key={shop.id}
                  href={`/shops/${shop.slug}`}
                  className="bg-white rounded-2xl border border-[var(--soft-border)] overflow-hidden hover:shadow-lg transition-all group"
                >
                  <div className="h-32 img-placeholder text-4xl">
                    {categoryEmojis[shop.category] || '🏪'}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-[var(--deep-ink)] text-sm group-hover:text-[var(--forest-teal)] transition-colors">
                        {shop.name}
                      </h3>
                      <span className={`shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        isShopOpen(shop.hours)
                          ? 'bg-green-50 text-[var(--success)]'
                          : 'bg-red-50 text-[var(--error)]'
                      }`}>
                        {isShopOpen(shop.hours) ? 'Open' : 'Closed'}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--muted-slate)] mb-3 line-clamp-2">{shop.description}</p>
                    <div className="flex items-center gap-3 text-xs text-[var(--muted-slate)]">
                      <span className="flex items-center gap-1"><MapPin size={12} />{shop.distance}</span>
                      <span className="flex items-center gap-1"><Clock size={12} />{shop.hours.open}–{shop.hours.close}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {shop.supportsPickup && (
                        <span className="flex items-center gap-1 text-[10px] text-[var(--forest-teal)] bg-[var(--soft-sage)] px-2 py-0.5 rounded-full">
                          <Store size={10} /> Pickup
                        </span>
                      )}
                      {shop.supportsDelivery && (
                        <span className="flex items-center gap-1 text-[10px] text-[var(--forest-teal)] bg-[var(--soft-sage)] px-2 py-0.5 rounded-full">
                          <Truck size={10} /> Delivery
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Featured Products ──────────────── */}
        {mounted && (
          <section className="bg-white py-12 sm:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--deep-ink)] mb-1">Fresh from Your Neighbourhood</h2>
              <p className="text-sm text-[var(--muted-slate)] mb-8">Popular products from local shops. Prices are illustrative.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {featuredProducts.map((product) => {
                  const shop = shops.find((s) => s.id === product.shopId);
                  return (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      className="bg-[var(--warm-ivory)] rounded-2xl border border-[var(--soft-border)] overflow-hidden hover:shadow-md transition-all group"
                    >
                      <div className="h-32 sm:h-40 img-placeholder text-3xl">
                        {categoryEmojis[product.category] || '📦'}
                      </div>
                      <div className="p-3">
                        <p className="text-[10px] text-[var(--muted-slate)] mb-0.5">{shop?.name}</p>
                        <h3 className="font-semibold text-sm text-[var(--deep-ink)] mb-1 line-clamp-1 group-hover:text-[var(--forest-teal)] transition-colors">
                          {product.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-sm font-bold text-[var(--forest-teal)]">
                              {formatPaise(product.pricePaise)}
                            </span>
                            <span className="text-xs text-[var(--muted-slate)] ml-1">/{product.unit}</span>
                          </div>
                          {product.stock <= 5 && product.stock > 0 && (
                            <span className="text-[10px] text-[var(--warning)] font-medium">Low stock</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ── How It Works ───────────────────── */}
        <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--deep-ink)] text-center mb-2">How It Works</h2>
          <p className="text-sm text-[var(--muted-slate)] text-center mb-10">Three simple steps to shop from your neighbourhood.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Discover', desc: 'Browse shops and products near you. Filter by category, search for what you need.', icon: '🔍' },
              { step: '02', title: 'Add to Cart', desc: 'Pick items from a shop, choose quantities and variants. Review your cart.', icon: '🛒' },
              { step: '03', title: 'Pickup or Delivery', desc: 'Choose pickup or home delivery. Pay cash on delivery or at the shop.', icon: '📦' },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-2xl border border-[var(--soft-border)] p-6 text-center hover:shadow-md transition-all">
                <span className="text-4xl mb-4 block">{item.icon}</span>
                <div className="text-xs font-bold text-[var(--fresh-lime)] bg-[var(--forest-teal)] w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-3">
                  {item.step}
                </div>
                <h3 className="font-semibold text-[var(--deep-ink)] mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--muted-slate)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Become a Seller CTA ────────────── */}
        <section className="bg-[var(--forest-teal)] py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
              Your Shop Deserves to Be Online.
            </h2>
            <p className="text-sm text-white/70 max-w-md mx-auto mb-6 leading-relaxed">
              Join Nijer Bazaar and let your neighbourhood customers find you, order from you, and keep coming back.
            </p>
            <Link
              href="/become-a-seller"
              className="inline-flex items-center gap-2 bg-[var(--fresh-lime)] text-[var(--forest-teal)] font-semibold px-6 py-3 rounded-xl hover:brightness-105 transition-all text-sm"
            >
              Become a Seller
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
