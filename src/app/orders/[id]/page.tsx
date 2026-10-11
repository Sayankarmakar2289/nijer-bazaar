'use client';

import { Suspense, use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/shared/Header';
import MobileBottomNav from '@/components/shared/MobileBottomNav';
import { useStore } from '@/store';
import { formatPaise, formatOrderDate, orderStatusLabels, orderStatusColors } from '@/lib/utils';
import { OrderStatus } from '@/types';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Package,
  Truck,
  Store,
  MapPin,
  Phone,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

const deliverySteps: { status: OrderStatus; label: string; desc: string }[] = [
  { status: 'placed', label: 'Order Placed', desc: 'Sent to shopkeeper' },
  { status: 'accepted', label: 'Accepted', desc: 'Shopkeeper confirmed order' },
  { status: 'preparing', label: 'Preparing', desc: 'Packing your fresh items' },
  { status: 'ready', label: 'Ready', desc: 'Packed and ready for delivery' },
  { status: 'out-for-delivery', label: 'Out for Delivery', desc: 'Delivery partner on the way' },
  { status: 'delivered', label: 'Delivered', desc: 'Delivered to your address' },
];

const pickupSteps: { status: OrderStatus; label: string; desc: string }[] = [
  { status: 'placed', label: 'Order Placed', desc: 'Sent to shopkeeper' },
  { status: 'accepted', label: 'Accepted', desc: 'Shopkeeper confirmed order' },
  { status: 'preparing', label: 'Preparing', desc: 'Bagging your order at the counter' },
  { status: 'ready', label: 'Ready for Pickup', desc: 'Ready at shop counter' },
  { status: 'collected', label: 'Collected', desc: 'Handed over to customer' },
];

function OrderTrackingContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const orders = useStore((s) => s.orders);
  const shops = useStore((s) => s.shops);
  const updateOrderStatus = useStore((s) => s.updateOrderStatus);
  const setSelectedSeller = useStore((s) => s.setSelectedSeller);
  const setCurrentRole = useStore((s) => s.setCurrentRole);

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

  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--warm-ivory)]">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="text-center max-w-md bg-white p-8 rounded-3xl border border-[var(--soft-border)] shadow-sm">
            <p className="text-4xl mb-3">🔍</p>
            <h1 className="text-xl font-bold text-[var(--deep-ink)] mb-2">Order Not Found</h1>
            <p className="text-sm text-[var(--muted-slate)] mb-6">
              The order may have been cleared or does not exist in local demo state.
            </p>
            <Link
              href="/orders"
              className="inline-flex items-center gap-2 bg-[var(--forest-teal)] text-white font-medium px-5 py-2.5 rounded-xl hover:brightness-110 text-sm"
            >
              <ArrowLeft size={16} /> View All Orders
            </Link>
          </div>
        </main>
        <MobileBottomNav />
      </div>
    );
  }

  const shop = shops.find((s) => s.id === order.shopId);
  const isTerminal = ['delivered', 'collected', 'rejected', 'cancelled'].includes(order.status);
  const isCancelledOrRejected = order.status === 'cancelled' || order.status === 'rejected';
  const steps = order.fulfilment === 'delivery' ? deliverySteps : pickupSteps;

  const getStepIndex = (status: OrderStatus) => {
    return steps.findIndex((s) => s.status === status);
  };

  const currentStepIdx = getStepIndex(order.status);

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel this order?')) {
      updateOrderStatus(order.id, 'cancelled', 'Cancelled by customer');
    }
  };

  const handleSwitchToSeller = () => {
    setSelectedSeller(order.shopId);
    setCurrentRole('seller');
    router.push(`/seller/orders/${order.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--warm-ivory)]">
      <Header />

      <main className="flex-1 pb-24 md:pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
          {/* Top navigation */}
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/orders"
              className="text-xs text-[var(--muted-slate)] hover:text-[var(--forest-teal)] flex items-center gap-1 font-medium"
            >
              <ArrowLeft size={14} /> Back to My Orders
            </Link>
            <span className="text-xs bg-[var(--soft-sage)] text-[var(--forest-teal)] font-semibold px-2.5 py-1 rounded-full border border-[var(--forest-teal)]/20">
              Interactive Live Tracking
            </span>
          </div>

          {/* Banner connecting to seller flow */}
          <div className="bg-gradient-to-r from-[var(--forest-teal)] to-[#1b5952] text-white p-4 rounded-2xl mb-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-[var(--fresh-lime)] font-bold">
                Demo Quick-Switch
              </p>
              <p className="text-sm font-medium">
                Want to process this order as <strong>{order.shopName}</strong>?
              </p>
            </div>
            <button
              onClick={handleSwitchToSeller}
              className="inline-flex items-center justify-center gap-2 bg-[var(--fresh-lime)] text-[var(--forest-teal)] px-4 py-2 rounded-xl text-xs font-bold hover:brightness-105 transition-all shrink-0"
            >
              Open in Seller Dashboard <ExternalLink size={14} />
            </button>
          </div>

          {/* Main Status Card */}
          <div className="bg-white rounded-3xl border border-[var(--soft-border)] p-6 shadow-sm mb-6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--soft-border)] pb-4 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-[var(--deep-ink)]">{order.orderNumber}</h1>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                      orderStatusColors[order.status] || 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {orderStatusLabels[order.status]}
                  </span>
                </div>
                <p className="text-xs text-[var(--muted-slate)] mt-1">
                  Placed on {formatOrderDate(order.createdAt)} •{' '}
                  <span className="capitalize font-medium text-[var(--deep-ink)]">
                    {order.fulfilment === 'delivery' ? 'Home Delivery' : 'Store Pickup'}
                  </span>
                </p>
              </div>

              {order.status === 'placed' && (
                <button
                  onClick={handleCancel}
                  className="text-xs text-[var(--error)] hover:bg-red-50 border border-[var(--error)]/30 px-3 py-1.5 rounded-xl font-medium transition-colors"
                >
                  Cancel Order
                </button>
              )}
            </div>

            {/* Rejection / Cancellation Notice */}
            {isCancelledOrRejected && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
                <AlertTriangle className="text-[var(--error)] shrink-0 mt-0.5" size={18} />
                <div className="text-xs text-red-900">
                  <p className="font-bold">
                    {order.status === 'rejected' ? 'Order Rejected by Shopkeeper' : 'Order Cancelled'}
                  </p>
                  <p className="mt-0.5 text-red-700">
                    {order.rejectionReason || 'This order was stopped and reserved inventory has been restored.'}
                  </p>
                </div>
              </div>
            )}

            {/* Tracking Timeline */}
            {!isCancelledOrRejected && (
              <div className="py-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--muted-slate)] mb-6">
                  Live Status Timeline
                </h2>
                <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-[var(--soft-border)]">
                  {steps.map((step, idx) => {
                    const isPassed = currentStepIdx >= idx;
                    const isCurrent = currentStepIdx === idx;
                    const historyEntry = order.statusHistory.find((h) => h.status === step.status);

                    return (
                      <div key={step.status} className="relative flex items-start gap-3">
                        {/* Status node */}
                        <div
                          className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                            isCurrent
                              ? 'bg-[var(--forest-teal)] border-[var(--fresh-lime)] ring-4 ring-[var(--forest-teal)]/10 text-white'
                              : isPassed
                              ? 'bg-[var(--forest-teal)] border-[var(--forest-teal)] text-white'
                              : 'bg-white border-[var(--soft-border)] text-transparent'
                          }`}
                        >
                          {isPassed ? <CheckCircle2 size={12} /> : <div className="w-2 h-2 rounded-full bg-[var(--soft-border)]" />}
                        </div>

                        {/* Status text */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p
                              className={`text-sm font-semibold ${
                                isCurrent
                                  ? 'text-[var(--forest-teal)]'
                                  : isPassed
                                  ? 'text-[var(--deep-ink)]'
                                  : 'text-[var(--muted-slate)]'
                              }`}
                            >
                              {step.label}
                            </p>
                            {historyEntry && (
                              <span className="text-[10px] text-[var(--muted-slate)] shrink-0">
                                {new Date(historyEntry.timestamp).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[var(--muted-slate)] mt-0.5">{step.desc}</p>
                          {historyEntry?.note && (
                            <p className="text-xs bg-[var(--soft-sage)] text-[var(--forest-teal)] px-2.5 py-1 rounded-lg mt-1.5 inline-block">
                              Note: {historyEntry.note}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Shop and Delivery Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Shop info */}
            <div className="bg-white rounded-3xl border border-[var(--soft-border)] p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted-slate)] flex items-center gap-1.5">
                  <Store size={14} /> Shop Details
                </span>
                {shop && (
                  <Link
                    href={`/shops/${shop.slug}`}
                    className="text-xs text-[var(--forest-teal)] hover:underline font-medium flex items-center gap-0.5"
                  >
                    View Store <ChevronRight size={12} />
                  </Link>
                )}
              </div>
              <p className="font-bold text-sm text-[var(--deep-ink)]">{order.shopName}</p>
              {shop && (
                <>
                  <p className="text-xs text-[var(--muted-slate)] mt-1 flex items-center gap-1">
                    <MapPin size={12} /> {shop.address}
                  </p>
                  <p className="text-xs text-[var(--muted-slate)] mt-1 flex items-center gap-1">
                    <Phone size={12} /> {shop.phone} (Simulated)
                  </p>
                </>
              )}
            </div>

            {/* Fulfilment info */}
            <div className="bg-white rounded-3xl border border-[var(--soft-border)] p-5">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted-slate)] flex items-center gap-1.5 mb-3">
                {order.fulfilment === 'delivery' ? <Truck size={14} /> : <Store size={14} />}
                {order.fulfilment === 'delivery' ? 'Delivery Address' : 'Pickup Instructions'}
              </span>
              <p className="font-bold text-sm text-[var(--deep-ink)]">{order.customerName}</p>
              <p className="text-xs text-[var(--muted-slate)] mt-1">{order.customerPhone}</p>
              {order.fulfilment === 'delivery' && (
                <p className="text-xs text-[var(--deep-ink)] mt-1 bg-[var(--warm-ivory)] p-2 rounded-xl border border-[var(--soft-border)]">
                  {order.customerAddress}
                </p>
              )}
              {order.instructions && (
                <p className="text-xs text-[var(--muted-slate)] mt-2 italic">
                  &ldquo;{order.instructions}&rdquo;
                </p>
              )}
            </div>
          </div>

          {/* Ordered Items & Summary */}
          <div className="bg-white rounded-3xl border border-[var(--soft-border)] p-6 shadow-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--muted-slate)] mb-4">
              Items Ordered ({order.items.reduce((s, i) => s + i.quantity, 0)})
            </h2>

            <div className="divide-y divide-[var(--soft-border)]">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-[var(--deep-ink)] truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-[var(--muted-slate)]">
                      {item.variantLabel ? `${item.variantLabel} • ` : ''}
                      {formatPaise(item.pricePaise)} / {item.unit}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs text-[var(--muted-slate)] mr-3">Qty: {item.quantity}</span>
                    <span className="text-sm font-bold text-[var(--deep-ink)]">
                      {formatPaise(item.pricePaise * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[var(--soft-border)] pt-4 mt-2 space-y-2 text-sm">
              <div className="flex justify-between text-[var(--muted-slate)]">
                <span>Subtotal</span>
                <span>{formatPaise(order.subtotalPaise)}</span>
              </div>
              <div className="flex justify-between text-[var(--muted-slate)]">
                <span>Delivery Fee</span>
                <span>
                  {order.deliveryFeePaise > 0 ? formatPaise(order.deliveryFeePaise) : 'Free'}
                </span>
              </div>
              <div className="flex justify-between font-bold text-base text-[var(--deep-ink)] border-t border-[var(--soft-border)] pt-2">
                <span>Total Amount</span>
                <span className="text-[var(--forest-teal)]">{formatPaise(order.totalPaise)}</span>
              </div>
              <div className="flex justify-between text-xs text-[var(--muted-slate)] pt-1">
                <span>Payment Method</span>
                <span className="capitalize font-medium text-[var(--deep-ink)]">
                  {order.payment === 'cash-on-delivery' ? 'Cash on Delivery (Sim)' : 'Pay at Shop (Sim)'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
}

export default function OrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--warm-ivory)]" />}>
      <OrderTrackingContent params={params} />
    </Suspense>
  );
}
