'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SellerNav from '@/components/seller/SellerNav';
import { useStore } from '@/store';
import { formatPaise, categoryEmojis } from '@/lib/utils';
import {
  Layers,
  Search,
  Plus,
  Minus,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  PackageCheck,
  RefreshCw,
} from 'lucide-react';

export default function SellerInventoryPage() {
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const shops = useStore((s) => s.shops);
  const products = useStore((s) => s.products);
  const selectedSellerId = useStore((s) => s.selectedSellerId);
  const adjustStock = useStore((s) => s.adjustStock);
  const updateProduct = useStore((s) => s.updateProduct);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[var(--soft-sage)]">
        <div className="p-8 text-center text-sm text-[var(--muted-slate)]">Loading inventory...</div>
      </div>
    );
  }

  const currentShop = shops.find((s) => s.id === selectedSellerId) || shops[0];
  const shopProducts = products.filter((p) => p.shopId === currentShop.id && !p.isArchived);

  const totalSKUs = shopProducts.length;
  const lowStockSKUs = shopProducts.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const outOfStockSKUs = shopProducts.filter((p) => p.stock <= 0 || !p.isAvailable).length;

  const filteredProducts = shopProducts.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (filter === 'low') return p.stock > 0 && p.stock <= 5;
    if (filter === 'out') return p.stock <= 0 || !p.isAvailable;
    return true;
  });

  const handleQuickAdjust = (productId: string, delta: number) => {
    adjustStock(productId, delta);
  };

  const handleToggleAvailability = (productId: string, current: boolean) => {
    updateProduct(productId, { isAvailable: !current });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--soft-sage)]">
      <SellerNav />

      <main className="flex-1 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-black text-[var(--deep-ink)]">
                Stock & Inventory Control
              </h1>
              <p className="text-xs text-[var(--muted-slate)] mt-0.5">
                Real-time stock tracking for <strong>{currentShop.name}</strong>
              </p>
            </div>
          </div>

          {/* Metrics Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`p-5 rounded-3xl border text-left transition-all ${
                filter === 'all'
                  ? 'bg-white border-[var(--forest-teal)] ring-2 ring-[var(--forest-teal)]/20 shadow-sm'
                  : 'bg-white/80 border-[var(--soft-border)] hover:bg-white'
              }`}
            >
              <span className="text-xs font-bold text-[var(--muted-slate)] uppercase tracking-wider block mb-1">
                Total Listed SKUs
              </span>
              <p className="text-3xl font-black text-[var(--deep-ink)]">{totalSKUs}</p>
            </button>

            <button
              onClick={() => setFilter('low')}
              className={`p-5 rounded-3xl border text-left transition-all ${
                filter === 'low'
                  ? 'bg-white border-amber-500 ring-2 ring-amber-500/20 shadow-sm'
                  : 'bg-white/80 border-[var(--soft-border)] hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                  Low Stock (&le; 5 units)
                </span>
                <AlertTriangle size={16} className="text-amber-500" />
              </div>
              <p className="text-3xl font-black text-amber-800">{lowStockSKUs}</p>
            </button>

            <button
              onClick={() => setFilter('out')}
              className={`p-5 rounded-3xl border text-left transition-all ${
                filter === 'out'
                  ? 'bg-white border-rose-500 ring-2 ring-rose-500/20 shadow-sm'
                  : 'bg-white/80 border-[var(--soft-border)] hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">
                  Out of Stock
                </span>
                <XCircle size={16} className="text-rose-500" />
              </div>
              <p className="text-3xl font-black text-rose-800">{outOfStockSKUs}</p>
            </button>
          </div>

          {/* Search bar */}
          <div className="bg-white rounded-2xl border border-[var(--soft-border)] p-4 shadow-sm mb-6">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-slate)]" />
              <input
                type="text"
                placeholder="Search inventory items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-[var(--soft-border)] text-xs focus:ring-2 focus:ring-[var(--forest-teal)] bg-[var(--warm-ivory)]"
              />
            </div>
          </div>

          {/* Inventory Items List */}
          <div className="bg-white rounded-3xl border border-[var(--soft-border)] shadow-sm divide-y divide-[var(--soft-border)] overflow-hidden">
            {filteredProducts.length === 0 ? (
              <div className="p-12 text-center text-xs text-[var(--muted-slate)]">
                No inventory items match the selected filter.
              </div>
            ) : (
              filteredProducts.map((p) => {
                const isLow = p.stock > 0 && p.stock <= 5;
                const isOut = p.stock <= 0 || !p.isAvailable;

                return (
                  <div
                    key={p.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-2xl bg-[var(--soft-sage)] flex items-center justify-center text-2xl shrink-0">
                        {categoryEmojis[p.category] || '📦'}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-sm text-[var(--deep-ink)] truncate">{p.name}</h3>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isOut
                                ? 'bg-rose-100 text-rose-800'
                                : isLow
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--muted-slate)] mt-0.5">
                          Price: <strong>{formatPaise(p.pricePaise)}</strong> / {p.unit}
                          {p.reservedStock > 0 && (
                            <span className="ml-2 text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded-md text-[10px]">
                              {p.reservedStock} {p.unit} reserved for pending orders
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Stock adjustments & fast controls */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 self-stretch sm:self-center">
                      {/* Current Stock Count Display */}
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-slate)] block">
                          Stock Balance
                        </span>
                        <span className={`text-base font-black ${isOut ? 'text-rose-600' : isLow ? 'text-amber-600' : 'text-emerald-700'}`}>
                          {p.stock} <span className="text-xs font-semibold">{p.unit}</span>
                        </span>
                      </div>

                      {/* Rapid adjust buttons */}
                      <div className="flex items-center gap-1 bg-[var(--soft-sage)] p-1 rounded-2xl border border-[var(--soft-border)]">
                        <button
                          onClick={() => handleQuickAdjust(p.id, -1)}
                          disabled={p.stock <= 0}
                          className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[var(--deep-ink)] hover:bg-slate-100 disabled:opacity-40 transition-colors shadow-xs"
                          title="Deduct 1"
                        >
                          <Minus size={14} />
                        </button>
                        <button
                          onClick={() => handleQuickAdjust(p.id, 1)}
                          className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-[var(--deep-ink)] hover:bg-slate-100 transition-colors shadow-xs"
                          title="Add 1"
                        >
                          <Plus size={14} />
                        </button>
                        <button
                          onClick={() => handleQuickAdjust(p.id, 5)}
                          className="px-2.5 h-8 rounded-xl bg-white text-[11px] font-bold text-[var(--forest-teal)] hover:bg-slate-100 transition-colors shadow-xs"
                          title="Restock 5 units"
                        >
                          +5
                        </button>
                        <button
                          onClick={() => handleQuickAdjust(p.id, 10)}
                          className="px-2.5 h-8 rounded-xl bg-[var(--forest-teal)] text-[11px] font-bold text-white hover:brightness-110 transition-colors shadow-xs"
                          title="Restock 10 units"
                        >
                          +10
                        </button>
                      </div>

                      {/* Enable/Disable toggle */}
                      <button
                        onClick={() => handleToggleAvailability(p.id, p.isAvailable)}
                        className={`text-[11px] font-bold px-3 py-1.5 rounded-xl border transition-colors ${
                          p.isAvailable
                            ? 'border-rose-200 text-rose-700 hover:bg-rose-50'
                            : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                        }`}
                      >
                        {p.isAvailable ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
