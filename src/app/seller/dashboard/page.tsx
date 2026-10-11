'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SellerNav from '@/components/seller/SellerNav';
import { useStore } from '@/store';
import { formatPaise, formatOrderDate, orderStatusLabels, orderStatusColors } from '@/lib/utils';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  TrendingUp,
  Package,
  AlertTriangle,
  ArrowRight,
  Plus,
  PlayCircle,
  PauseCircle,
  ChevronRight,
} from 'lucide-react';

export default function SellerDashboardPage() {
  const [mounted, setMounted] = useState(false);

  const shops = useStore((s) => s.shops);
  const products = useStore((s) => s.products);
  const orders = useStore((s) => s.orders);
  const selectedSellerId = useStore((s) => s.selectedSellerId);
  const updateOrderStatus = useStore((s) => s.updateOrderStatus);
  const adjustStock = useStore((s) => s.adjustStock);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[var(--soft-sage)]">
        <div className="p-8 text-center text-sm text-[var(--muted-slate)]">Loading dashboard...</div>
      </div>
    );
  }

  const currentShop = shops.find((s) => s.id === selectedSellerId) || shops[0];
  const shopOrders = orders.filter((o) => o.shopId === currentShop.id);
  const shopProducts = products.filter((p) => p.shopId === currentShop.id && !p.isArchived);

  // Computations
  const pendingOrders = shopOrders.filter((o) => o.status === 'placed');
  const activeOrders = shopOrders.filter((o) =>
    ['placed', 'accepted', 'preparing', 'ready', 'out-for-delivery'].includes(o.status)
  );
  const completedOrders = shopOrders.filter((o) =>
    ['delivered', 'collected'].includes(o.status)
  );

  const totalSalesPaise = completedOrders.reduce((sum, o) => sum + o.totalPaise, 0);

  const lowStockProducts = shopProducts.filter((p) => p.isAvailable && p.stock <= 5);
  const recentOrders = [...shopOrders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5);

  const handleQuickAccept = (orderId: string) => {
    updateOrderStatus(orderId, 'accepted', 'Accepted by shopkeeper');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--soft-sage)]">
      <SellerNav />

      <main className="flex-1 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome and Shop Alert Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-black text-[var(--deep-ink)]">
                {currentShop.name} Dashboard
              </h1>
              <p className="text-xs text-[var(--muted-slate)] mt-0.5">
                Overview of incoming orders, sales, and inventory for today
              </p>
            </div>

            {/* Quick new product action */}
            <div className="flex items-center gap-3">
              <Link
                href="/seller/products/new"
                className="inline-flex items-center gap-1.5 bg-[var(--forest-teal)] text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:brightness-110 shadow-sm"
              >
                <Plus size={16} /> Add Product
              </Link>
            </div>
          </div>

          {/* Shop Paused Alert if applicable */}
          {currentShop.isPaused && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 mb-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <PauseCircle className="text-[var(--error)] shrink-0" size={20} />
                <div>
                  <p className="text-xs font-bold text-rose-900">
                    Store is currently Paused
                  </p>
                  <p className="text-[11px] text-rose-700">
                    Customers cannot place new orders until you reopen. Existing orders can still be fulfilled.
                  </p>
                </div>
              </div>
              <button
                onClick={() => useStore.getState().toggleShopPause(currentShop.id)}
                className="bg-emerald-600 text-white text-xs font-bold px-4 py-1.5 rounded-xl hover:bg-emerald-700 shrink-0"
              >
                Reopen Store
              </button>
            </div>
          )}

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Pending Orders Card */}
            <div className={`p-5 rounded-3xl border bg-white shadow-sm flex flex-col justify-between ${
              pendingOrders.length > 0 ? 'border-[var(--market-coral)] ring-2 ring-[var(--market-coral)]/20' : 'border-[var(--soft-border)]'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[var(--muted-slate)] uppercase tracking-wider">
                  New Orders
                </span>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  pendingOrders.length > 0 ? 'bg-red-50 text-[var(--market-coral)]' : 'bg-[var(--soft-sage)] text-[var(--forest-teal)]'
                }`}>
                  <Clock size={16} />
                </div>
              </div>
              <p className="text-3xl font-black text-[var(--deep-ink)]">
                {pendingOrders.length}
              </p>
              <div className="mt-2 text-xs">
                {pendingOrders.length > 0 ? (
                  <Link href="/seller/orders?status=placed" className="text-[var(--market-coral)] font-bold hover:underline flex items-center gap-1">
                    Accept now <ArrowRight size={12} />
                  </Link>
                ) : (
                  <span className="text-[var(--muted-slate)]">All caught up</span>
                )}
              </div>
            </div>

            {/* Total Today Sales */}
            <div className="p-5 rounded-3xl border border-[var(--soft-border)] bg-white shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[var(--muted-slate)] uppercase tracking-wider">
                  Delivered Sales
                </span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <TrendingUp size={16} />
                </div>
              </div>
              <p className="text-3xl font-black text-[var(--deep-ink)]">
                {formatPaise(totalSalesPaise)}
              </p>
              <span className="text-xs text-[var(--muted-slate)] mt-2">
                From {completedOrders.length} completed orders
              </span>
            </div>

            {/* Total Active SKUs */}
            <div className="p-5 rounded-3xl border border-[var(--soft-border)] bg-white shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[var(--muted-slate)] uppercase tracking-wider">
                  Active Products
                </span>
                <div className="w-8 h-8 rounded-xl bg-[var(--soft-sage)] text-[var(--forest-teal)] flex items-center justify-center">
                  <Package size={16} />
                </div>
              </div>
              <p className="text-3xl font-black text-[var(--deep-ink)]">
                {shopProducts.length}
              </p>
              <Link href="/seller/products" className="text-xs text-[var(--forest-teal)] font-bold hover:underline mt-2 flex items-center gap-1">
                View catalog <ArrowRight size={12} />
              </Link>
            </div>

            {/* Low Stock Warning */}
            <div className="p-5 rounded-3xl border border-[var(--soft-border)] bg-white shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[var(--muted-slate)] uppercase tracking-wider">
                  Low / Out Stock
                </span>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  lowStockProducts.length > 0 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                }`}>
                  <AlertTriangle size={16} />
                </div>
              </div>
              <p className="text-3xl font-black text-[var(--deep-ink)]">
                {lowStockProducts.length}
              </p>
              <Link href="/seller/inventory" className="text-xs text-amber-700 font-bold hover:underline mt-2 flex items-center gap-1">
                Restock inventory <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          {/* Two-column layout: Recent Orders + Quick Inventory Restock */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Orders Feed (2 columns) */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-[var(--soft-border)] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-[var(--deep-ink)] flex items-center gap-2">
                  <ShoppingBag size={18} className="text-[var(--forest-teal)]" />
                  Recent Incoming Orders
                </h2>
                <Link
                  href="/seller/orders"
                  className="text-xs text-[var(--forest-teal)] font-bold hover:underline flex items-center gap-1"
                >
                  All Orders ({shopOrders.length}) <ChevronRight size={14} />
                </Link>
              </div>

              {recentOrders.length === 0 ? (
                <div className="p-8 text-center text-xs text-[var(--muted-slate)]">
                  No orders received yet for {currentShop.name}. Place a test order as customer!
                </div>
              ) : (
                <div className="divide-y divide-[var(--soft-border)]">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Link href={`/seller/orders/${order.id}`} className="font-bold text-sm text-[var(--deep-ink)] hover:text-[var(--forest-teal)]">
                            {order.orderNumber}
                          </Link>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            orderStatusColors[order.status] || 'bg-slate-100 text-slate-700'
                          }`}>
                            {orderStatusLabels[order.status]}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--deep-ink)] font-medium mt-1">
                          {order.customerName} ({order.customerPhone}) •{' '}
                          <span className="capitalize">{order.fulfilment}</span>
                        </p>
                        <p className="text-[11px] text-[var(--muted-slate)] mt-0.5 truncate max-w-md">
                          {order.items.map((i) => `${i.name} × ${i.quantity}`).join(', ')}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                        <span className="text-sm font-black text-[var(--forest-teal)]">
                          {formatPaise(order.totalPaise)}
                        </span>

                        {order.status === 'placed' && (
                          <button
                            onClick={() => handleQuickAccept(order.id)}
                            className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-emerald-700 shadow-sm"
                          >
                            Accept
                          </button>
                        )}

                        <Link
                          href={`/seller/orders/${order.id}`}
                          className="bg-[var(--soft-sage)] text-[var(--forest-teal)] text-xs font-semibold px-3 py-1.5 rounded-xl hover:brightness-95"
                        >
                          Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Restock Widget (1 column) */}
            <div className="bg-white rounded-3xl border border-[var(--soft-border)] p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-[var(--deep-ink)] flex items-center gap-2">
                    <AlertTriangle size={18} className="text-amber-500" />
                    Low Stock Alerts
                  </h2>
                  <Link
                    href="/seller/inventory"
                    className="text-xs text-[var(--forest-teal)] font-bold hover:underline"
                  >
                    Inventory →
                  </Link>
                </div>

                {lowStockProducts.length === 0 ? (
                  <p className="text-xs text-[var(--muted-slate)] py-4 text-center">
                    All inventory levels look healthy (stock &gt; 5).
                  </p>
                ) : (
                  <div className="space-y-3">
                    {lowStockProducts.slice(0, 5).map((p) => (
                      <div key={p.id} className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-[var(--soft-sage)] text-xs">
                        <div className="min-w-0">
                          <p className="font-bold text-[var(--deep-ink)] truncate">{p.name}</p>
                          <p className="text-[10px] text-amber-700 font-semibold">
                            {p.stock <= 0 ? 'Out of stock' : `Only ${p.stock} ${p.unit} left`}
                          </p>
                        </div>
                        <button
                          onClick={() => adjustStock(p.id, 10)}
                          className="bg-white text-[var(--forest-teal)] border border-[var(--soft-border)] font-bold px-2.5 py-1 rounded-xl text-[11px] hover:bg-[var(--forest-teal)] hover:text-white transition-colors shrink-0"
                          title="Add 10 units"
                        >
                          +10 Restock
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-[var(--soft-border)] mt-6 text-center">
                <Link
                  href="/seller/products/new"
                  className="w-full inline-flex items-center justify-center gap-1.5 bg-[var(--soft-sage)] text-[var(--forest-teal)] font-bold text-xs py-2.5 rounded-xl hover:bg-[var(--forest-teal)] hover:text-white transition-all"
                >
                  <Plus size={14} /> Add New Catalog Item
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
