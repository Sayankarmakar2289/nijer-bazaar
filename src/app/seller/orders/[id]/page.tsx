'use client';

import { Suspense, use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SellerNav from '@/components/seller/SellerNav';
import { useStore } from '@/store';
import { formatPaise, formatOrderDate, orderStatusLabels, orderStatusColors } from '@/lib/utils';
import { OrderStatus } from '@/types';
import {
  ArrowLeft,
  ShoppingBag,
  Truck,
  Store,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  ExternalLink,
} from 'lucide-react';

function SellerOrderDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const orders = useStore((s) => s.orders);
  const shops = useStore((s) => s.shops);
  const selectedSellerId = useStore((s) => s.selectedSellerId);
  const updateOrderStatus = useStore((s) => s.updateOrderStatus);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[var(--soft-sage)]">
        <div className="p-8 text-center text-sm text-[var(--muted-slate)]">Loading order...</div>
      </div>
    );
  }

  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--soft-sage)]">
        <SellerNav />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="text-center bg-white p-8 rounded-3xl border border-[var(--soft-border)] max-w-md">
            <h2 className="text-lg font-bold mb-2">Order Not Found</h2>
            <Link
              href="/seller/orders"
              className="text-xs text-[var(--forest-teal)] font-bold hover:underline"
            >
              ← Back to Orders List
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const isDelivery = order.fulfilment === 'delivery';

  const handleAction = (nextStatus: OrderStatus, note?: string) => {
    updateOrderStatus(order.id, nextStatus, note);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--soft-sage)]">
      <SellerNav />

      <main className="flex-1 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/seller/orders"
              className="text-xs text-[var(--forest-teal)] font-bold flex items-center gap-1 hover:underline"
            >
              <ArrowLeft size={14} /> Back to Orders
            </Link>

            <Link
              href={`/orders/${order.id}`}
              target="_blank"
              className="text-xs text-[var(--muted-slate)] hover:text-[var(--forest-teal)] flex items-center gap-1 font-medium"
            >
              View Customer Tracking <ExternalLink size={12} />
            </Link>
          </div>

          <div className="bg-white rounded-3xl border border-[var(--soft-border)] p-6 sm:p-8 shadow-sm space-y-6">
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--soft-border)] pb-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-black text-[var(--deep-ink)]">{order.orderNumber}</h1>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-bold ${
                      orderStatusColors[order.status] || 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {orderStatusLabels[order.status]}
                  </span>
                </div>
                <p className="text-xs text-[var(--muted-slate)] mt-1">
                  Received at {formatOrderDate(order.createdAt)}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-2">
                {order.status === 'placed' && (
                  <>
                    <button
                      onClick={() => handleAction('rejected', 'Rejected by seller')}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--error)] border border-[var(--error)]/30 hover:bg-red-50"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleAction('accepted', 'Accepted by shopkeeper')}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                    >
                      Accept Order
                    </button>
                  </>
                )}
                {order.status === 'accepted' && (
                  <button
                    onClick={() => handleAction('preparing', 'Items being prepared and packed')}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
                  >
                    Start Preparing
                  </button>
                )}
                {order.status === 'preparing' && (
                  <button
                    onClick={() => handleAction('ready', isDelivery ? 'Packed and ready for dispatch' : 'Ready at counter')}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 text-white hover:bg-purple-700 shadow-sm"
                  >
                    {isDelivery ? 'Ready for Dispatch' : 'Ready for Pickup'}
                  </button>
                )}
                {order.status === 'ready' && (
                  <>
                    {isDelivery ? (
                      <button
                        onClick={() => handleAction('out-for-delivery', 'Dispatched for delivery')}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 text-white hover:bg-cyan-700 shadow-sm"
                      >
                        Out for Delivery
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAction('collected', 'Handed over to customer')}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                      >
                        Mark Handed Over / Collected
                      </button>
                    )}
                  </>
                )}
                {order.status === 'out-for-delivery' && (
                  <button
                    onClick={() => handleAction('delivered', 'Delivered to customer')}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                  >
                    Mark Delivered
                  </button>
                )}
              </div>
            </div>

            {/* Customer & Fulfillment Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[var(--soft-sage)] text-xs space-y-2">
                <span className="font-bold text-[var(--muted-slate)] uppercase text-[10px]">Customer Details</span>
                <p className="font-bold text-sm text-[var(--deep-ink)]">{order.customerName}</p>
                <p className="flex items-center gap-1.5 text-[var(--deep-ink)] font-medium">
                  <Phone size={13} /> {order.customerPhone}
                </p>
                {isDelivery && (
                  <p className="flex items-start gap-1.5 text-[var(--deep-ink)] font-medium">
                    <MapPin size={13} className="shrink-0 mt-0.5" /> {order.customerAddress}
                  </p>
                )}
                {order.instructions && (
                  <p className="italic text-[var(--muted-slate)] bg-white p-2 rounded-xl border border-[var(--soft-border)]">
                    Note: &ldquo;{order.instructions}&rdquo;
                  </p>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-[var(--warm-ivory)] text-xs space-y-2">
                <span className="font-bold text-[var(--muted-slate)] uppercase text-[10px]">Fulfillment & Payment</span>
                <p className="font-bold text-sm text-[var(--deep-ink)] capitalize flex items-center gap-1.5">
                  {isDelivery ? <Truck size={14} className="text-[var(--forest-teal)]" /> : <Store size={14} className="text-[var(--forest-teal)]" />}
                  {order.fulfilment === 'delivery' ? 'Home Delivery' : 'Shop Counter Pickup'}
                </p>
                <p className="text-[var(--deep-ink)]">
                  Payment Mode: <strong className="capitalize">{order.payment === 'cash-on-delivery' ? 'Cash on Delivery (Simulated)' : 'Pay at Shop (Simulated)'}</strong>
                </p>
                <p className="text-[var(--muted-slate)]">
                  Delivery Fee: {order.deliveryFeePaise > 0 ? formatPaise(order.deliveryFeePaise) : 'Free'}
                </p>
              </div>
            </div>

            {/* Items Table */}
            <div>
              <h3 className="text-xs font-bold text-[var(--muted-slate)] uppercase tracking-wider mb-3">
                Items to Pack
              </h3>
              <div className="border border-[var(--soft-border)] rounded-2xl overflow-hidden divide-y divide-[var(--soft-border)]">
                {order.items.map((item, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-[var(--deep-ink)] text-sm">{item.name}</p>
                      <p className="text-[var(--muted-slate)]">
                        {item.variantLabel ? `${item.variantLabel} • ` : ''}
                        {formatPaise(item.pricePaise)} / {item.unit}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-[var(--deep-ink)] mr-4">Qty: {item.quantity}</span>
                      <span className="font-bold text-[var(--forest-teal)] text-sm">
                        {formatPaise(item.pricePaise * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 text-right space-y-1 text-xs">
                <p className="text-[var(--muted-slate)]">Subtotal: {formatPaise(order.subtotalPaise)}</p>
                <p className="text-[var(--muted-slate)]">Delivery Fee: {formatPaise(order.deliveryFeePaise)}</p>
                <p className="text-base font-black text-[var(--forest-teal)]">
                  Total Order Amount: {formatPaise(order.totalPaise)}
                </p>
              </div>
            </div>

            {/* Status History */}
            <div className="border-t border-[var(--soft-border)] pt-4">
              <h3 className="text-xs font-bold text-[var(--muted-slate)] uppercase tracking-wider mb-3">
                Audit Trail / History
              </h3>
              <div className="space-y-2">
                {order.statusHistory.map((h, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50">
                    <span className="font-bold capitalize text-[var(--deep-ink)]">
                      {orderStatusLabels[h.status] || h.status}
                      {h.note ? ` — ${h.note}` : ''}
                    </span>
                    <span className="text-[10px] text-[var(--muted-slate)]">
                      {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SellerOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--soft-sage)]" />}>
      <SellerOrderDetailContent params={params} />
    </Suspense>
  );
}
