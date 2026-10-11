'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/shared/Header';
import MobileBottomNav from '@/components/shared/MobileBottomNav';
import { useStore } from '@/store';
import { formatPaise } from '@/lib/utils';
import { ArrowLeft, MapPin, Phone, User, FileText, Truck, Store, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const cart = useStore((s) => s.cart);
  const shops = useStore((s) => s.shops);
  const placeOrder = useStore((s) => s.placeOrder);
  const customerName = useStore((s) => s.customerName);
  const customerPhone = useStore((s) => s.customerPhone);
  const customerAddress = useStore((s) => s.customerAddress);

  const [name, setName] = useState(customerName);
  const [phone, setPhone] = useState(customerPhone);
  const [address, setAddress] = useState(customerAddress);
  const [instructions, setInstructions] = useState('');
  const [fulfilment, setFulfilment] = useState<'pickup' | 'delivery'>('delivery');
  const [payment, setPayment] = useState<'cash-on-delivery' | 'pay-at-shop'>('cash-on-delivery');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="min-h-screen bg-[var(--warm-ivory)]"><Header /></div>;

  const shop = shops.find((s) => s.id === cart.shopId);

  if (!shop || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--warm-ivory)]">
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <p className="text-4xl mb-3">🛒</p>
          <h1 className="text-xl font-bold mb-2">Nothing to Checkout</h1>
          <Link href="/shops" className="text-[var(--forest-teal)] hover:underline">← Browse shops</Link>
        </div>
        <MobileBottomNav />
      </div>
    );
  }

  const subtotal = cart.items.reduce((sum, item) => sum + item.pricePaise * item.quantity, 0);
  const deliveryFee = fulfilment === 'delivery' ? shop.deliveryFee : 0;
  const total = subtotal + deliveryFee;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Name is required';
    if (!phone.trim() || phone.trim().length < 10) errs.phone = 'Valid phone number required';
    if (fulfilment === 'delivery' && !address.trim()) errs.address = 'Delivery address is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate() || submitting) return;
    setSubmitting(true);

    const order = placeOrder(fulfilment, payment, instructions, name, phone, address);
    if (order) {
      router.push(`/orders/${order.id}`);
    } else {
      setSubmitting(false);
      setErrors({ general: 'Failed to place order. The shop may be paused or items unavailable.' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--warm-ivory)]">
      <Header />
      <main className="flex-1 pb-20 md:pb-0">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
          <Link href="/cart" className="text-xs text-[var(--muted-slate)] hover:text-[var(--forest-teal)] flex items-center gap-1 mb-4">
            <ArrowLeft size={12} /> Back to Cart
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--deep-ink)] mb-1">Checkout</h1>
          <p className="text-sm text-[var(--muted-slate)] mb-6">Ordering from <strong>{shop.name}</strong> — Simulated checkout</p>

          {errors.general && (
            <div className="flex items-center gap-2 bg-red-50 text-[var(--error)] text-sm px-4 py-3 rounded-xl mb-4">
              <AlertCircle size={16} /> {errors.general}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form */}
            <div className="lg:col-span-2 space-y-4">
              {/* Customer Info */}
              <div className="bg-white rounded-2xl border border-[var(--soft-border)] p-4 space-y-3">
                <h2 className="font-semibold text-[var(--deep-ink)] flex items-center gap-2"><User size={16} /> Customer Details</h2>
                <div>
                  <label className="text-xs font-medium text-[var(--deep-ink)] mb-1 block">Name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} className={`w-full px-3 py-2.5 rounded-xl border ${errors.name ? 'border-[var(--error)]' : 'border-[var(--soft-border)]'} text-sm focus:outline-none focus:ring-2 focus:ring-[var(--forest-teal)]`} placeholder="Demo Customer" />
                  {errors.name && <p className="text-xs text-[var(--error)] mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium text-[var(--deep-ink)] mb-1 block">Phone (demo)</label>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} className={`w-full px-3 py-2.5 rounded-xl border ${errors.phone ? 'border-[var(--error)]' : 'border-[var(--soft-border)]'} text-sm focus:outline-none focus:ring-2 focus:ring-[var(--forest-teal)]`} placeholder="9900000001" />
                  {errors.phone && <p className="text-xs text-[var(--error)] mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium text-[var(--deep-ink)] mb-1 block">Address</label>
                  <input value={address} onChange={(e) => setAddress(e.target.value)} className={`w-full px-3 py-2.5 rounded-xl border ${errors.address ? 'border-[var(--error)]' : 'border-[var(--soft-border)]'} text-sm focus:outline-none focus:ring-2 focus:ring-[var(--forest-teal)]`} placeholder="7 Park Lane, Demo Neighbourhood" />
                  {errors.address && <p className="text-xs text-[var(--error)] mt-1">{errors.address}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium text-[var(--deep-ink)] mb-1 block">Special Instructions (optional)</label>
                  <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={2} className="w-full px-3 py-2.5 rounded-xl border border-[var(--soft-border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--forest-teal)] resize-none" placeholder="E.g. Ring the bell twice..." />
                </div>
              </div>

              {/* Fulfilment */}
              <div className="bg-white rounded-2xl border border-[var(--soft-border)] p-4">
                <h2 className="font-semibold text-[var(--deep-ink)] mb-3">Fulfilment Method</h2>
                <div className="flex gap-3">
                  {shop.supportsDelivery && (
                    <button
                      onClick={() => setFulfilment('delivery')}
                      className={`flex-1 flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-colors ${fulfilment === 'delivery' ? 'border-[var(--forest-teal)] bg-[var(--soft-sage)]' : 'border-[var(--soft-border)]'}`}
                    >
                      <Truck size={18} className="text-[var(--forest-teal)]" />
                      <div className="text-left">
                        <p className="font-semibold">Delivery</p>
                        <p className="text-[10px] text-[var(--muted-slate)]">Fee: {formatPaise(shop.deliveryFee)}</p>
                      </div>
                    </button>
                  )}
                  {shop.supportsPickup && (
                    <button
                      onClick={() => setFulfilment('pickup')}
                      className={`flex-1 flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-colors ${fulfilment === 'pickup' ? 'border-[var(--forest-teal)] bg-[var(--soft-sage)]' : 'border-[var(--soft-border)]'}`}
                    >
                      <Store size={18} className="text-[var(--forest-teal)]" />
                      <div className="text-left">
                        <p className="font-semibold">Pickup</p>
                        <p className="text-[10px] text-[var(--muted-slate)]">Free</p>
                      </div>
                    </button>
                  )}
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white rounded-2xl border border-[var(--soft-border)] p-4">
                <h2 className="font-semibold text-[var(--deep-ink)] mb-3">Payment (Simulation)</h2>
                <div className="flex gap-3">
                  <button
                    onClick={() => setPayment('cash-on-delivery')}
                    className={`flex-1 flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-colors ${payment === 'cash-on-delivery' ? 'border-[var(--forest-teal)] bg-[var(--soft-sage)]' : 'border-[var(--soft-border)]'}`}
                  >
                    <CreditCard size={18} className="text-[var(--forest-teal)]" />
                    <span>Cash on Delivery (Sim)</span>
                  </button>
                  <button
                    onClick={() => setPayment('pay-at-shop')}
                    className={`flex-1 flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-colors ${payment === 'pay-at-shop' ? 'border-[var(--forest-teal)] bg-[var(--soft-sage)]' : 'border-[var(--soft-border)]'}`}
                  >
                    <Store size={18} className="text-[var(--forest-teal)]" />
                    <span>Pay at Shop (Sim)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div>
              <div className="bg-white rounded-2xl border border-[var(--soft-border)] p-4 sticky top-20">
                <h2 className="font-semibold text-[var(--deep-ink)] mb-3">Order Summary</h2>
                <div className="space-y-2 mb-3">
                  {cart.items.map((item) => (
                    <div key={`${item.productId}-${item.variantId}`} className="flex justify-between text-sm">
                      <span className="text-[var(--muted-slate)] truncate mr-2">
                        {item.name} {item.variantLabel ? `(${item.variantLabel})` : ''} × {item.quantity}
                      </span>
                      <span className="font-medium shrink-0">{formatPaise(item.pricePaise * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[var(--soft-border)] pt-3 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-[var(--muted-slate)]">Subtotal</span><span>{formatPaise(subtotal)}</span></div>
                  <div className="flex justify-between"><span className="text-[var(--muted-slate)]">Delivery</span><span>{fulfilment === 'delivery' ? formatPaise(deliveryFee) : 'Free'}</span></div>
                  <div className="flex justify-between border-t border-[var(--soft-border)] pt-2">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-[var(--forest-teal)]">{formatPaise(total)}</span>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full mt-4 bg-[var(--forest-teal)] text-white font-semibold py-3 rounded-xl hover:brightness-110 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? 'Placing Order...' : (
                    <>
                      <CheckCircle size={16} />
                      Place Order — {formatPaise(total)}
                    </>
                  )}
                </button>

                <p className="text-[10px] text-center text-[var(--muted-slate)] mt-3">
                  This is a simulated order. No real payment will be processed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <MobileBottomNav />
    </div>
  );
}
