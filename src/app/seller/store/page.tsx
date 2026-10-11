'use client';

import { useState, useEffect } from 'react';
import SellerNav from '@/components/seller/SellerNav';
import { useStore } from '@/store';
import { formatPaise } from '@/lib/utils';
import { Store, Truck, Clock, Phone, MapPin, Check, PauseCircle, PlayCircle } from 'lucide-react';

export default function SellerStoreSettingsPage() {
  const [mounted, setMounted] = useState(false);
  const [saved, setSaved] = useState(false);

  const shops = useStore((s) => s.shops);
  const selectedSellerId = useStore((s) => s.selectedSellerId);
  const updateShop = useStore((s) => s.updateShop);

  const currentShop = shops.find((s) => s.id === selectedSellerId) || shops[0];

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [supportsPickup, setSupportsPickup] = useState(true);
  const [supportsDelivery, setSupportsDelivery] = useState(true);
  const [deliveryFeeRupees, setDeliveryFeeRupees] = useState('');
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    setMounted(true);
    setName(currentShop.name);
    setDescription(currentShop.description);
    setAddress(currentShop.address);
    setPhone(currentShop.phone);
    setSupportsPickup(currentShop.supportsPickup);
    setSupportsDelivery(currentShop.supportsDelivery);
    setDeliveryFeeRupees((currentShop.deliveryFee / 100).toString());
    setIsPaused(currentShop.isPaused);
  }, [currentShop]);

  if (!mounted) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const feeRupees = parseFloat(deliveryFeeRupees) || 0;

    updateShop(currentShop.id, {
      name: name.trim(),
      description: description.trim(),
      address: address.trim(),
      phone: phone.trim(),
      supportsPickup,
      supportsDelivery,
      deliveryFee: Math.round(feeRupees * 100),
      isPaused,
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--soft-sage)]">
      <SellerNav />

      <main className="flex-1 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-black text-[var(--deep-ink)]">
              Store Profile & Operating Controls
            </h1>
            <p className="text-xs text-[var(--muted-slate)] mt-0.5">
              Configure store hours, delivery options, and pause status for <strong>{currentShop.name}</strong>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Store Pause Emergency Card */}
            <div className={`p-6 rounded-3xl border transition-all ${
              isPaused
                ? 'bg-rose-50 border-rose-300'
                : 'bg-white border-[var(--soft-border)] shadow-sm'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[var(--deep-ink)]">
                      Order Acceptance Status
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isPaused ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {isPaused ? 'Orders Blocked' : 'Open for Business'}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--muted-slate)] mt-1 max-w-md">
                    Pause new orders during afternoon rest or counter rush hours. Customers will see your shop as paused and cannot checkout.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPaused(!isPaused)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 shrink-0 ${
                    isPaused
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-[var(--error)] text-white hover:bg-red-700'
                  }`}
                >
                  {isPaused ? <PlayCircle size={15} /> : <PauseCircle size={15} />}
                  <span>{isPaused ? 'Reopen Store' : 'Pause Orders Now'}</span>
                </button>
              </div>
            </div>

            {/* General Info */}
            <div className="bg-white rounded-3xl border border-[var(--soft-border)] p-6 sm:p-8 shadow-sm space-y-4 text-xs">
              <h2 className="text-sm font-bold text-[var(--deep-ink)] uppercase tracking-wider text-[var(--muted-slate)] mb-1">
                Store Identity
              </h2>

              <div>
                <label className="font-bold text-[var(--deep-ink)] block mb-1">Shop Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[var(--soft-border)] text-xs focus:ring-2 focus:ring-[var(--forest-teal)]"
                />
              </div>

              <div>
                <label className="font-bold text-[var(--deep-ink)] block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[var(--soft-border)] text-xs focus:ring-2 focus:ring-[var(--forest-teal)] resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-[var(--deep-ink)] block mb-1">Address / Landmark</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[var(--soft-border)] text-xs focus:ring-2 focus:ring-[var(--forest-teal)]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[var(--deep-ink)] block mb-1">Phone Number (Demo)</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[var(--soft-border)] text-xs focus:ring-2 focus:ring-[var(--forest-teal)]"
                  />
                </div>
              </div>
            </div>

            {/* Fulfillment Options */}
            <div className="bg-white rounded-3xl border border-[var(--soft-border)] p-6 sm:p-8 shadow-sm space-y-4 text-xs">
              <h2 className="text-sm font-bold text-[var(--deep-ink)] uppercase tracking-wider text-[var(--muted-slate)] mb-1">
                Fulfilment & Delivery
              </h2>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="pickup"
                    checked={supportsPickup}
                    onChange={(e) => setSupportsPickup(e.target.checked)}
                    className="w-4 h-4 rounded text-[var(--forest-teal)] focus:ring-[var(--forest-teal)]"
                  />
                  <label htmlFor="pickup" className="font-semibold text-[var(--deep-ink)]">
                    Offer Counter Store Pickup (Free for customers)
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="delivery"
                    checked={supportsDelivery}
                    onChange={(e) => setSupportsDelivery(e.target.checked)}
                    className="w-4 h-4 rounded text-[var(--forest-teal)] focus:ring-[var(--forest-teal)]"
                  />
                  <label htmlFor="delivery" className="font-semibold text-[var(--deep-ink)]">
                    Offer Local Home Delivery
                  </label>
                </div>
              </div>

              {supportsDelivery && (
                <div className="pt-2">
                  <label className="font-bold text-[var(--deep-ink)] block mb-1">
                    Delivery Fee in Rupees (₹)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={deliveryFeeRupees}
                    onChange={(e) => setDeliveryFeeRupees(e.target.value)}
                    className="w-40 p-2.5 rounded-xl border border-[var(--soft-border)] text-xs focus:ring-2 focus:ring-[var(--forest-teal)]"
                  />
                  <span className="text-[10px] text-[var(--muted-slate)] mt-0.5 block">
                    Charged to customer when selecting delivery
                  </span>
                </div>
              )}
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-[var(--forest-teal)] text-white font-bold text-xs px-6 py-3 rounded-xl hover:brightness-110 shadow-sm flex items-center gap-2"
              >
                {saved ? <Check size={16} className="text-[var(--fresh-lime)]" /> : null}
                <span>{saved ? 'Changes Saved!' : 'Save Store Settings'}</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
