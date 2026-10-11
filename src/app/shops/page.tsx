'use client';

import Link from 'next/link';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import MobileBottomNav from '@/components/shared/MobileBottomNav';
import { useStore } from '@/store';
import { categoryLabels, categoryEmojis, isShopOpen } from '@/lib/utils';
import { MapPin, Clock, Truck, Store, Search, Filter, X } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ShopsPageContent() {
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showOpen, setShowOpen] = useState(false);
  const [showPickup, setShowPickup] = useState(false);
  const [showDelivery, setShowDelivery] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'distance'>('distance');

  const shops = useStore((s) => s.shops);

  useEffect(() => setMounted(true), []);

  const filteredShops = useMemo(() => {
    if (!mounted) return [];
    let result = [...shops];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.category.includes(q));
    }
    if (selectedCategory !== 'all') {
      result = result.filter(s => s.category === selectedCategory);
    }
    if (showOpen) {
      result = result.filter(s => isShopOpen(s.hours) && !s.isPaused);
    }
    if (showPickup) {
      result = result.filter(s => s.supportsPickup);
    }
    if (showDelivery) {
      result = result.filter(s => s.supportsDelivery);
    }
    result.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return parseFloat(a.distance) - parseFloat(b.distance);
    });
    return result;
  }, [mounted, shops, searchQuery, selectedCategory, showOpen, showPickup, showDelivery, sortBy]);

  const categories = ['all', 'grocery', 'vegetables', 'fruits', 'chicken', 'mutton', 'fish', 'dairy', 'essentials'];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--warm-ivory)]">
      <Header />
      <main className="flex-1 pb-20 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--deep-ink)] mb-1">Neighbourhood Shops</h1>
          <p className="text-sm text-[var(--muted-slate)] mb-6">Discover local stores near Demo Neighbourhood, Kolkata</p>

          {/* Search */}
          <div className="relative mb-4">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-slate)]" />
            <input
              type="text"
              placeholder="Search shops by name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-[var(--soft-border)] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--forest-teal)]"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-slate)] hover:text-[var(--deep-ink)]">
                <X size={16} />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {/* Category pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 flex-nowrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-[var(--forest-teal)] text-white'
                      : 'bg-white border border-[var(--soft-border)] text-[var(--deep-ink)] hover:bg-[var(--soft-sage)]'
                  }`}
                >
                  {cat === 'all' ? 'All' : categoryEmojis[cat]} {cat === 'all' ? '' : categoryLabels[cat] || cat}
                </button>
              ))}
            </div>

            {/* Toggle filters */}
            <div className="flex gap-2">
              <button onClick={() => setShowOpen(!showOpen)} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${showOpen ? 'bg-[var(--success)] text-white border-[var(--success)]' : 'bg-white border-[var(--soft-border)] text-[var(--deep-ink)] hover:bg-[var(--soft-sage)]'}`}>
                Open Now
              </button>
              <button onClick={() => setShowPickup(!showPickup)} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${showPickup ? 'bg-[var(--forest-teal)] text-white border-[var(--forest-teal)]' : 'bg-white border-[var(--soft-border)] text-[var(--deep-ink)] hover:bg-[var(--soft-sage)]'}`}>
                Pickup
              </button>
              <button onClick={() => setShowDelivery(!showDelivery)} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${showDelivery ? 'bg-[var(--forest-teal)] text-white border-[var(--forest-teal)]' : 'bg-white border-[var(--soft-border)] text-[var(--deep-ink)] hover:bg-[var(--soft-sage)]'}`}>
                Delivery
              </button>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'distance')}
              className="px-3 py-1.5 rounded-full text-xs font-medium border border-[var(--soft-border)] bg-white text-[var(--deep-ink)] focus:outline-none"
            >
              <option value="distance">Sort: Nearest</option>
              <option value="name">Sort: Name</option>
            </select>
          </div>

          {/* Results */}
          <p className="text-xs text-[var(--muted-slate)] mb-4">{filteredShops.length} shop{filteredShops.length !== 1 ? 's' : ''} found</p>

          {filteredShops.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">🏪</p>
              <p className="text-[var(--muted-slate)]">No shops match your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredShops.map((shop) => (
                <Link
                  key={shop.id}
                  href={`/shops/${shop.slug}`}
                  className="bg-white rounded-2xl border border-[var(--soft-border)] overflow-hidden hover:shadow-lg transition-all group"
                >
                  <div className="h-36 img-placeholder text-5xl relative">
                    {categoryEmojis[shop.category] || '🏪'}
                    {shop.isPaused && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="bg-[var(--error)] text-white text-xs font-semibold px-3 py-1 rounded-full">Orders Paused</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-[var(--deep-ink)] group-hover:text-[var(--forest-teal)] transition-colors">
                        {shop.name}
                      </h3>
                      <span className={`shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        shop.isPaused ? 'bg-red-50 text-[var(--error)]' :
                        isShopOpen(shop.hours) ? 'bg-green-50 text-[var(--success)]' : 'bg-red-50 text-[var(--error)]'
                      }`}>
                        {shop.isPaused ? 'Paused' : isShopOpen(shop.hours) ? 'Open' : 'Closed'}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--muted-slate)] mb-3 line-clamp-2">{shop.description}</p>
                    <div className="flex items-center gap-4 text-xs text-[var(--muted-slate)] mb-2">
                      <span className="flex items-center gap-1"><MapPin size={12} />{shop.distance}</span>
                      <span className="flex items-center gap-1"><Clock size={12} />{shop.hours.open}–{shop.hours.close}</span>
                    </div>
                    <div className="flex items-center gap-2">
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
          )}
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}

export default function ShopsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--warm-ivory)]" />}>
      <ShopsPageContent />
    </Suspense>
  );
}
