'use client';

import { useState, useEffect } from 'react';
import SellerNav from '@/components/seller/SellerNav';
import { useStore } from '@/store';
import { formatPaise } from '@/lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { BarChart3, TrendingUp, DollarSign, PieChart as PieIcon, Info } from 'lucide-react';

const COLORS = ['#123F3A', '#CBF379', '#FF8068', '#16865D', '#D97706', '#64748B'];

export default function SellerAnalyticsPage() {
  const [mounted, setMounted] = useState(false);

  const shops = useStore((s) => s.shops);
  const orders = useStore((s) => s.orders);
  const products = useStore((s) => s.products);
  const selectedSellerId = useStore((s) => s.selectedSellerId);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[var(--soft-sage)]">
        <div className="p-8 text-center text-sm text-[var(--muted-slate)]">Loading analytics...</div>
      </div>
    );
  }

  const currentShop = shops.find((s) => s.id === selectedSellerId) || shops[0];
  const shopOrders = orders.filter((o) => o.shopId === currentShop.id);
  const completedOrders = shopOrders.filter((o) =>
    ['delivered', 'collected'].includes(o.status)
  );

  // GMV & financial breakdown
  const grossOrderValuePaise = completedOrders.reduce((sum, o) => sum + o.totalPaise, 0);
  const deliveryChargesPaise = completedOrders.reduce((sum, o) => sum + o.deliveryFeePaise, 0);
  const productSalesPaise = grossOrderValuePaise - deliveryChargesPaise;
  // Demo assumption: 5% platform commission
  const commissionRate = 0.05;
  const platformCommissionPaise = Math.round(productSalesPaise * commissionRate);
  const netSellerProceedsPaise = productSalesPaise - platformCommissionPaise + deliveryChargesPaise;

  // Chart data: 7-day trend
  const trendData = [
    { day: 'Mon', sales: 1250, orders: 4 },
    { day: 'Tue', sales: 1840, orders: 6 },
    { day: 'Wed', sales: 920, orders: 3 },
    { day: 'Thu', sales: 2450, orders: 7 },
    { day: 'Fri', sales: 3100, orders: 9 },
    { day: 'Sat', sales: 4600, orders: 14 },
    { day: 'Sun', sales: completedOrders.length > 0 ? grossOrderValuePaise / 100 : 3800, orders: completedOrders.length || 11 },
  ];

  // Top products from orders
  const productSalesMap: Record<string, { name: string; quantity: number; revenuePaise: number }> = {};
  shopOrders.forEach((o) => {
    o.items.forEach((item) => {
      if (!productSalesMap[item.name]) {
        productSalesMap[item.name] = { name: item.name, quantity: 0, revenuePaise: 0 };
      }
      productSalesMap[item.name].quantity += item.quantity;
      productSalesMap[item.name].revenuePaise += item.pricePaise * item.quantity;
    });
  });

  const topProducts = Object.values(productSalesMap)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  const pieData = topProducts.map((p) => ({
    name: p.name,
    value: p.quantity,
  }));

  return (
    <div className="min-h-screen flex flex-col bg-[var(--soft-sage)]">
      <SellerNav />

      <main className="flex-1 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-black text-[var(--deep-ink)]">
                Store Analytics & Insights
              </h1>
              <p className="text-xs text-[var(--muted-slate)] mt-0.5">
                Simulated sales metrics and order breakdowns for <strong>{currentShop.name}</strong>
              </p>
            </div>
            <span className="text-xs bg-amber-100 text-amber-900 border border-amber-200 px-3 py-1 rounded-xl font-medium self-start">
              Illustrative Prototype Data
            </span>
          </div>

          {/* Financial Breakdown Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="p-5 rounded-3xl border border-[var(--soft-border)] bg-white shadow-sm">
              <span className="text-[10px] font-bold text-[var(--muted-slate)] uppercase tracking-wider block mb-1">
                Gross Merchandise Value (GMV)
              </span>
              <p className="text-2xl font-black text-[var(--deep-ink)]">
                {formatPaise(grossOrderValuePaise)}
              </p>
              <span className="text-[11px] text-[var(--muted-slate)] mt-1 block">
                Total customer spend
              </span>
            </div>

            <div className="p-5 rounded-3xl border border-[var(--soft-border)] bg-white shadow-sm">
              <span className="text-[10px] font-bold text-[var(--muted-slate)] uppercase tracking-wider block mb-1">
                Net Seller Proceeds
              </span>
              <p className="text-2xl font-black text-emerald-700">
                {formatPaise(netSellerProceedsPaise)}
              </p>
              <span className="text-[11px] text-[var(--muted-slate)] mt-1 block">
                After demo commission
              </span>
            </div>

            <div className="p-5 rounded-3xl border border-[var(--soft-border)] bg-white shadow-sm">
              <span className="text-[10px] font-bold text-[var(--muted-slate)] uppercase tracking-wider block mb-1">
                Marketplace Commission (5%)
              </span>
              <p className="text-2xl font-black text-[var(--forest-teal)]">
                {formatPaise(platformCommissionPaise)}
              </p>
              <span className="text-[11px] text-[var(--muted-slate)] mt-1 block">
                Sample rate for prototype
              </span>
            </div>

            <div className="p-5 rounded-3xl border border-[var(--soft-border)] bg-white shadow-sm">
              <span className="text-[10px] font-bold text-[var(--muted-slate)] uppercase tracking-wider block mb-1">
                Completed Orders
              </span>
              <p className="text-2xl font-black text-[var(--deep-ink)]">
                {completedOrders.length}
              </p>
              <span className="text-[11px] text-[var(--muted-slate)] mt-1 block">
                Out of {shopOrders.length} total orders
              </span>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Sales Trend Chart (2 columns) */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-[var(--soft-border)] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-[var(--deep-ink)] flex items-center gap-2">
                  <TrendingUp size={16} className="text-[var(--forest-teal)]" />
                  Weekly Revenue Trend (₹)
                </h2>
                <span className="text-[11px] text-[var(--muted-slate)]">Last 7 days</span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendData}>
                    <XAxis dataKey="day" stroke="#64748B" fontSize={11} />
                    <YAxis stroke="#64748B" fontSize={11} />
                    <Tooltip
                      formatter={(val) => [`₹${Number(val).toLocaleString()}`, 'Sales']}
                      contentStyle={{ borderRadius: '12px', border: '1px solid #E4EAE3', fontSize: '12px' }}
                    />
                    <Bar dataKey="sales" fill="#123F3A" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Product Share Pie (1 column) */}
            <div className="bg-white rounded-3xl border border-[var(--soft-border)] p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="text-sm font-bold text-[var(--deep-ink)] flex items-center gap-2 mb-4">
                  <PieIcon size={16} className="text-[var(--forest-teal)]" />
                  Top Items Sold by Units
                </h2>

                {pieData.length === 0 ? (
                  <p className="text-xs text-[var(--muted-slate)] text-center py-12">
                    No order data yet. Complete sample orders to populate breakdown.
                  </p>
                ) : (
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={70}
                          label
                        >
                          {pieData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              <div className="space-y-1.5 pt-4 border-t border-[var(--soft-border)] text-[11px]">
                {topProducts.slice(0, 3).map((p, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span className="text-[var(--muted-slate)] truncate mr-2">{p.name}</span>
                    <span className="font-bold">{p.quantity} units</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Table: Top items ordered */}
          <div className="bg-white rounded-3xl border border-[var(--soft-border)] p-6 shadow-sm">
            <h2 className="text-sm font-bold text-[var(--deep-ink)] mb-4">
              Top Selling Catalogue Products
            </h2>
            {topProducts.length === 0 ? (
              <p className="text-xs text-[var(--muted-slate)] text-center py-6">
                No orders recorded yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[var(--soft-border)] text-[10px] font-bold text-[var(--muted-slate)] uppercase">
                      <th className="pb-3">Product Name</th>
                      <th className="pb-3 text-right">Units Sold</th>
                      <th className="pb-3 text-right">Total Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--soft-border)]">
                    {topProducts.map((p, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-3 font-semibold text-[var(--deep-ink)]">{p.name}</td>
                        <td className="py-3 text-right font-medium">{p.quantity}</td>
                        <td className="py-3 text-right font-bold text-[var(--forest-teal)]">
                          {formatPaise(p.revenuePaise)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
