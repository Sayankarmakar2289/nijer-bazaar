'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/store';
import { categoryEmojis, categoryLabels } from '@/lib/utils';
import { Store, ArrowRight, ShieldAlert, ArrowLeft } from 'lucide-react';

export default function SellerLoginPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const shops = useStore((s) => s.shops);
  const selectedSellerId = useStore((s) => s.selectedSellerId);
  const setSelectedSeller = useStore((s) => s.setSelectedSeller);
  const setCurrentRole = useStore((s) => s.setCurrentRole);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleSelectShop = (shopId: string) => {
    setSelectedSeller(shopId);
    setCurrentRole('seller');
    router.push('/seller/dashboard');
  };

  return (
    <div className="min-h-screen bg-[var(--soft-sage)] flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto w-full">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--forest-teal)] hover:underline mb-6"
        >
          <ArrowLeft size={14} /> Back to Customer Storefront
        </Link>

        {/* Disclaimer header */}
        <div className="bg-white rounded-3xl border border-[var(--soft-border)] p-6 sm:p-8 shadow-sm mb-6 text-center">
          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white border border-[var(--soft-border)] shadow-xs mx-auto mb-3">
            <Image src="/logo.png" alt="Nijer Bazaar Logo" width={112} height={112} className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--deep-ink)]">
            Seller Dashboard Demo Access
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted-slate)] max-w-xl mx-auto mt-2">
            No password or KYC required for this interactive prototype. Select any neighbourhood merchant below to manage their live orders, inventory, pricing, and analytics.
          </p>

          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-900 text-xs px-4 py-2 rounded-xl mt-4">
            <ShieldAlert size={14} className="text-amber-600 shrink-0" />
            <span>Interactive Demo Mode: All shops and customer orders are simulated.</span>
          </div>
        </div>

        {/* Shop Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {shops.map((shop) => {
            const isSelected = shop.id === selectedSellerId;
            return (
              <div
                key={shop.id}
                className={`bg-white rounded-3xl border p-5 flex flex-col justify-between transition-all hover:shadow-md ${
                  isSelected
                    ? 'border-[var(--forest-teal)] ring-2 ring-[var(--forest-teal)]/20 shadow-sm'
                    : 'border-[var(--soft-border)] hover:border-[var(--forest-teal)]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{categoryEmojis[shop.category] || '🏪'}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--forest-teal)] bg-[var(--soft-sage)] px-2 py-0.5 rounded-full">
                      {categoryLabels[shop.category]}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-[var(--deep-ink)] mb-1">{shop.name}</h3>
                  <p className="text-xs text-[var(--muted-slate)] line-clamp-2 mb-3">
                    {shop.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[var(--soft-border)]">
                  <button
                    onClick={() => handleSelectShop(shop.id)}
                    className="w-full bg-[var(--forest-teal)] text-white hover:brightness-110 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>Manage Shop</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-center text-xs text-[var(--muted-slate)] py-4">
        Need end-to-end walkthroughs? Visit the{' '}
        <Link href="/demo/control-center" className="text-[var(--forest-teal)] font-bold hover:underline">
          Demo Control Center
        </Link>
      </div>
    </div>
  );
}
