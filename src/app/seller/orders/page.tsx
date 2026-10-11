'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import SellerNav from '@/components/seller/SellerNav';
import { useStore } from '@/store';
import { formatPaise, formatOrderDate, orderStatusLabels, orderStatusColors } from '@/lib/utils';
import { OrderStatus, Order } from '@/types';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Truck,
  Store,
  MapPin,
  Phone,
  FileText,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

function SellerOrdersContent() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get('status') as OrderStatus | null;

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(initialStatus || 'all');
  const [rejectOrderId, setRejectOrderId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Item currently unavailable at shop');

  const shops = useStore((s) => s.shops);
  const orders = useStore((s) => s.orders);
  const selectedSellerId = useStore((s) => s.selectedSellerId);
  const updateOrderStatus = useStore((s) => s.updateOrderStatus);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[var(--soft-sage)]">
        <div className="p-8 text-center text-sm text-[var(--muted-slate)]">Loading orders...</div>
      </div>
    );
  }

  const currentShop = shops.find((s) => s.id === selectedSellerId) || shops[0];
  const shopOrders = orders
    .filter((o) => o.shopId === currentShop.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const tabs = [
    { id: 'all', label: 'All', count: shopOrders.length },
    { id: 'placed', label: 'New', count: shopOrders.filter((o) => o.status === 'placed').length },
    { id: 'accepted', label: 'Accepted', count: shopOrders.filter((o) => o.status === 'accepted').length },
    { id: 'preparing', label: 'Preparing', count: shopOrders.filter((o) => o.status === 'preparing').length },
    { id: 'ready', label: 'Ready', count: shopOrders.filter((o) => ['ready', 'out-for-delivery'].includes(o.status)).length },
    { id: 'completed', label: 'Completed', count: shopOrders.filter((o) => ['delivered', 'collected'].includes(o.status)).length },
    { id: 'cancelled', label: 'Cancelled', count: shopOrders.filter((o) => ['cancelled', 'rejected'].includes(o.status)).length },
  ];

  const filteredOrders = shopOrders.filter((order) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'ready') return order.status === 'ready' || order.status === 'out-for-delivery';
    if (activeTab === 'completed') return order.status === 'delivered' || order.status === 'collected';
    if (activeTab === 'cancelled') return order.status === 'cancelled' || order.status === 'rejected';
    return order.status === activeTab;
  });

  const handleAction = (orderId: string, nextStatus: OrderStatus, note?: string) => {
    updateOrderStatus(orderId, nextStatus, note);
  };

  const handleConfirmReject = () => {
    if (rejectOrderId) {
      updateOrderStatus(rejectOrderId, 'rejected', rejectionReason);
      setRejectOrderId(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--soft-sage)]">
      <SellerNav />

      <main className="flex-1 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-black text-[var(--deep-ink)]">
                Order Fulfillment
              </h1>
              <p className="text-xs text-[var(--muted-slate)] mt-0.5">
                Manage incoming orders for <strong>{currentShop.name}</strong>
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-[var(--forest-teal)] text-white shadow-sm'
                    : 'bg-white text-[var(--muted-slate)] hover:text-[var(--deep-ink)] border border-[var(--soft-border)]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    activeTab === tab.id
                      ? 'bg-white/20 text-white'
                      : tab.id === 'placed' && tab.count > 0
                      ? 'bg-red-100 text-red-700 font-black'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Orders list */}
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[var(--soft-border)] p-12 text-center max-w-md mx-auto my-6">
              <p className="text-4xl mb-3">📋</p>
              <h3 className="font-bold text-base text-[var(--deep-ink)] mb-1">No orders in this tab</h3>
              <p className="text-xs text-[var(--muted-slate)]">
                Try switching tabs or place a customer order to test the lifecycle.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const isDelivery = order.fulfilment === 'delivery';

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-3xl border border-[var(--soft-border)] p-5 sm:p-6 shadow-sm space-y-4"
                  >
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--soft-border)] pb-3">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/seller/orders/${order.id}`}
                          className="font-black text-base text-[var(--deep-ink)] hover:text-[var(--forest-teal)] flex items-center gap-1"
                        >
                          {order.orderNumber}
                          <ChevronRight size={14} />
                        </Link>
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                            orderStatusColors[order.status] || 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {orderStatusLabels[order.status]}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs text-[var(--muted-slate)]">
                          {formatOrderDate(order.createdAt)}
                        </span>
                        <span className="text-sm font-black text-[var(--forest-teal)] bg-[var(--soft-sage)] px-3 py-1 rounded-xl">
                          {formatPaise(order.totalPaise)}
                        </span>
                      </div>
                    </div>

                    {/* Middle details: customer & items */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {/* Customer / Fulfilment info */}
                      <div className="space-y-1.5 bg-[var(--warm-ivory)] p-3.5 rounded-2xl border border-[var(--soft-border)]">
                        <div className="flex items-center justify-between font-bold text-[var(--deep-ink)]">
                          <span>{order.customerName}</span>
                          <span className="flex items-center gap-1 text-[var(--forest-teal)]">
                            {isDelivery ? <Truck size={13} /> : <Store size={13} />}
                            <span className="capitalize">{order.fulfilment}</span>
                          </span>
                        </div>
                        <p className="text-[var(--muted-slate)] flex items-center gap-1">
                          <Phone size={12} /> {order.customerPhone}
                        </p>
                        {isDelivery && (
                          <p className="text-[var(--deep-ink)] flex items-start gap-1">
                            <MapPin size={12} className="shrink-0 mt-0.5" /> {order.customerAddress}
                          </p>
                        )}
                        {order.instructions && (
                          <p className="text-[var(--muted-slate)] italic bg-white/60 p-1.5 rounded-lg border border-[var(--soft-border)]">
                            &ldquo;{order.instructions}&rdquo;
                          </p>
                        )}
                        <p className="text-[10px] text-[var(--muted-slate)]">
                          Payment: <span className="font-semibold capitalize text-[var(--deep-ink)]">{order.payment === 'cash-on-delivery' ? 'Cash on Delivery' : 'Pay at Shop'}</span>
                        </p>
                      </div>

                      {/* Items Ordered */}
                      <div className="space-y-1.5 bg-white p-3.5 rounded-2xl border border-[var(--soft-border)]">
                        <p className="font-bold text-[var(--deep-ink)] uppercase tracking-wider text-[10px] text-[var(--muted-slate)]">
                          Ordered Items ({order.items.reduce((s, i) => s + i.quantity, 0)})
                        </p>
                        <div className="divide-y divide-[var(--soft-border)] max-h-32 overflow-y-auto">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="py-1 flex justify-between">
                              <span className="font-medium text-[var(--deep-ink)] truncate mr-2">
                                {item.name} {item.variantLabel ? `(${item.variantLabel})` : ''} × {item.quantity}
                              </span>
                              <span className="font-bold shrink-0">
                                {formatPaise(item.pricePaise * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Operational Action Buttons Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[var(--soft-border)]">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/orders/${order.id}`}
                          target="_blank"
                          className="text-xs text-[var(--muted-slate)] hover:text-[var(--forest-teal)] flex items-center gap-1 font-medium"
                        >
                          Customer View <ExternalLink size={12} />
                        </Link>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* 1. Placed state actions */}
                        {order.status === 'placed' && (
                          <>
                            <button
                              onClick={() => setRejectOrderId(order.id)}
                              className="px-3.5 py-2 rounded-xl text-xs font-bold text-[var(--error)] hover:bg-red-50 border border-[var(--error)]/30 transition-colors"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => handleAction(order.id, 'accepted', 'Shopkeeper confirmed order')}
                              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition-all"
                            >
                              Accept Order
                            </button>
                          </>
                        )}

                        {/* 2. Accepted state actions */}
                        {order.status === 'accepted' && (
                          <button
                            onClick={() => handleAction(order.id, 'preparing', 'Items being prepared and packed')}
                            className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-all"
                          >
                            Start Preparing
                          </button>
                        )}

                        {/* 3. Preparing state actions */}
                        {order.status === 'preparing' && (
                          <button
                            onClick={() => handleAction(order.id, 'ready', isDelivery ? 'Packed and ready for dispatch' : 'Ready at shop counter')}
                            className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 text-white hover:bg-purple-700 shadow-sm transition-all"
                          >
                            {isDelivery ? 'Mark Ready for Delivery' : 'Mark Ready for Pickup'}
                          </button>
                        )}

                        {/* 4. Ready state actions */}
                        {order.status === 'ready' && (
                          <>
                            {isDelivery ? (
                              <button
                                onClick={() => handleAction(order.id, 'out-for-delivery', 'Delivery partner dispatched')}
                                className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 text-white hover:bg-cyan-700 shadow-sm transition-all"
                              >
                                Mark Out for Delivery
                              </button>
                            ) : (
                              <button
                                onClick={() => handleAction(order.id, 'collected', 'Collected by customer at shop counter')}
                                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition-all"
                              >
                                Mark Collected (Completed)
                              </button>
                            )}
                          </>
                        )}

                        {/* 5. Out for Delivery actions */}
                        {order.status === 'out-for-delivery' && (
                          <button
                            onClick={() => handleAction(order.id, 'delivered', 'Order successfully delivered to customer')}
                            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition-all"
                          >
                            Mark Delivered (Completed)
                          </button>
                        )}

                        {/* Terminal statuses info */}
                        {['delivered', 'collected'].includes(order.status) && (
                          <span className="text-xs text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-3 py-1 rounded-xl">
                            <CheckCircle2 size={14} /> Completed
                          </span>
                        )}

                        {['rejected', 'cancelled'].includes(order.status) && (
                          <span className="text-xs text-rose-700 font-bold flex items-center gap-1 bg-rose-50 px-3 py-1 rounded-xl">
                            <XCircle size={14} /> {order.status === 'rejected' ? 'Rejected' : 'Cancelled'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Reject Reason Modal */}
      {rejectOrderId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-[var(--soft-border)]">
            <h3 className="font-bold text-base text-[var(--deep-ink)] mb-2">
              Reject Incoming Order
            </h3>
            <p className="text-xs text-[var(--muted-slate)] mb-4">
              Reserved inventory will be immediately restored and the customer will see this notice.
            </p>
            <div className="space-y-2 mb-4">
              <label className="text-xs font-semibold text-[var(--deep-ink)]">Reason for rejection:</label>
              <select
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[var(--soft-border)] text-xs bg-white"
              >
                <option value="Item currently out of stock at counter">Item currently out of stock at counter</option>
                <option value="Shop closing early / power cut">Shop closing early / power cut</option>
                <option value="Delivery boy currently unavailable">Delivery boy currently unavailable</option>
                <option value="Customer address outside delivery radius">Customer address outside delivery radius</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setRejectOrderId(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--muted-slate)] hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[var(--error)] text-white hover:bg-red-700 shadow-sm"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SellerOrdersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--soft-sage)]" />}>
      <SellerOrdersContent />
    </Suspense>
  );
}
