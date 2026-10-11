'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import MobileBottomNav from '@/components/shared/MobileBottomNav';
import { useStore } from '@/store';
import { formatPaise, formatOrderDate, orderStatusLabels, orderStatusColors } from '@/lib/utils';
import { Package, ArrowRight, Clock, Store, ChevronRight, ShoppingBag } from 'lucide-react';

export default function CustomerOrdersPage() {
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const orders = useStore((s) => s.orders);

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

  // Sort orders newest first
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const filteredOrders = sortedOrders.filter((order) => {
    if (filter === 'active') {
      return ['placed', 'accepted', 'preparing', 'ready', 'out-for-delivery'].includes(order.status);
    }
    if (filter === 'completed') {
      return ['delivered', 'collected', 'rejected', 'cancelled'].includes(order.status);
    }
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[var(--warm-ivory)]">
      <Header />

      <main className="flex-1 pb-24 md:pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[var(--deep-ink)]">My Orders</h1>
              <p className="text-sm text-[var(--muted-slate)] mt-0.5">
                Track your local neighbourhood orders in real time
              </p>
            </div>
            <Link
              href="/shops"
              className="inline-flex items-center gap-2 bg-[var(--forest-teal)] text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:brightness-110 transition-all self-start"
            >
              <ShoppingBag size={14} /> Shop More
            </Link>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 border-b border-[var(--soft-border)] pb-3 mb-6">
            {(['all', 'active', 'completed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors ${
                  filter === tab
                    ? 'bg-[var(--forest-teal)] text-white'
                    : 'bg-white text-[var(--muted-slate)] hover:text-[var(--deep-ink)] border border-[var(--soft-border)]'
                }`}
              >
                {tab} Orders
              </button>
            ))}
          </div>

          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[var(--soft-border)] p-12 text-center max-w-md mx-auto my-8">
              <p className="text-5xl mb-4">📦</p>
              <h2 className="text-lg font-bold text-[var(--deep-ink)] mb-1">No orders found</h2>
              <p className="text-xs text-[var(--muted-slate)] mb-6">
                {filter === 'all'
                  ? "You haven't placed any orders yet. Discover your neighbourhood shops and order fresh items."
                  : `You have no ${filter} orders right now.`}
              </p>
              <Link
                href="/shops"
                className="inline-flex items-center gap-2 bg-[var(--forest-teal)] text-white text-xs font-semibold px-5 py-2.5 rounded-xl hover:brightness-110"
              >
                Browse Shops <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const totalItems = order.items.reduce((s, i) => s + i.quantity, 0);

                return (
                  <Link
                    key={order.id}
                    href={`/orders/${order.id}`}
                    className="block bg-white rounded-2xl border border-[var(--soft-border)] p-5 hover:border-[var(--forest-teal)] hover:shadow-sm transition-all group"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--soft-border)] pb-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[var(--deep-ink)] group-hover:text-[var(--forest-teal)]">
                            {order.orderNumber}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                              orderStatusColors[order.status] || 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {orderStatusLabels[order.status]}
                          </span>
                        </div>
                        <p className="text-[11px] text-[var(--muted-slate)] mt-0.5">
                          {formatOrderDate(order.createdAt)}
                        </p>
                      </div>

                      <span className="text-xs font-bold text-[var(--forest-teal)] bg-[var(--soft-sage)] px-3 py-1 rounded-xl">
                        {formatPaise(order.totalPaise)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[var(--deep-ink)] flex items-center gap-1.5 truncate">
                          <Store size={14} className="text-[var(--forest-teal)] shrink-0" />
                          {order.shopName}
                        </p>
                        <p className="text-xs text-[var(--muted-slate)] mt-1 truncate">
                          {order.items.map((i) => `${i.name} (×${i.quantity})`).join(', ')}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-medium text-[var(--forest-teal)] shrink-0">
                        <span>Track</span>
                        <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
