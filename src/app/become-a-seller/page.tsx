'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import MobileBottomNav from '@/components/shared/MobileBottomNav';
import { useStore } from '@/store';
import { ShopCategory } from '@/types';
import {
  Store,
  TrendingUp,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Clock,
  Check,
} from 'lucide-react';

export default function BecomeASellerPage() {
  const submitSellerInterest = useStore((s) => s.submitSellerInterest);

  const [ownerName, setOwnerName] = useState('');
  const [shopName, setShopName] = useState('');
  const [category, setCategory] = useState<ShopCategory>('grocery');
  const [locality, setLocality] = useState('Demo Neighbourhood, Kolkata');
  const [phone, setPhone] = useState('');
  const [hasDelivery, setHasDelivery] = useState(true);
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitSellerInterest({
      ownerName,
      shopName,
      category,
      locality,
      phone,
      hasDelivery,
      notes,
    });
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--warm-ivory)]">
      <Header />

      <main className="flex-1 pb-24 md:pb-12">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[var(--forest-teal)] to-[#09221f] text-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block bg-white/10 text-[var(--fresh-lime)] text-xs font-bold px-3 py-1 rounded-full mb-4">
              🏪 Neighbourhood Partner Program
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4 leading-tight">
              Bring Your Neighbourhood Shop Online.
            </h1>
            <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              Connect with regular customers, accept pickup & delivery orders, and manage your inventory with ease — all from your phone.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="#interest-form"
                className="bg-[var(--fresh-lime)] text-[var(--forest-teal)] font-bold text-sm px-6 py-3 rounded-xl hover:brightness-105 transition-all shadow-md"
              >
                Register Your Shop (Demo)
              </a>
              <Link
                href="/seller"
                className="bg-white/10 text-white border border-white/20 font-bold text-sm px-6 py-3 rounded-xl hover:bg-white/20 transition-all"
              >
                Explore Seller Dashboard →
              </Link>
            </div>
          </div>
        </section>

        {/* Value Proposition Grid */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-[var(--deep-ink)]">
              Built for Neighbourhood Shopkeepers
            </h2>
            <p className="text-sm text-[var(--muted-slate)] mt-1">
              No complicated computers or technical expertise needed
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl border border-[var(--soft-border)] p-6 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-[var(--soft-sage)] text-[var(--forest-teal)] flex items-center justify-center mb-4">
                <Smartphone size={24} />
              </div>
              <h3 className="font-bold text-base text-[var(--deep-ink)] mb-2">
                Simple Mobile Management
              </h3>
              <p className="text-xs text-[var(--muted-slate)] leading-relaxed">
                Accept, prepare, and complete customer orders directly from your smartphone. Designed with large, intuitive touch controls.
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-[var(--soft-border)] p-6 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-[var(--soft-sage)] text-[var(--forest-teal)] flex items-center justify-center mb-4">
                <TrendingUp size={24} />
              </div>
              <h3 className="font-bold text-base text-[var(--deep-ink)] mb-2">
                Real-Time Stock & Prices
              </h3>
              <p className="text-xs text-[var(--muted-slate)] leading-relaxed">
                Adjust prices on seasonal produce or daily catch with one click. Pause ordering during peak hours when the shop counter is packed.
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-[var(--soft-border)] p-6 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-[var(--soft-sage)] text-[var(--forest-teal)] flex items-center justify-center mb-4">
                <Store size={24} />
              </div>
              <h3 className="font-bold text-base text-[var(--deep-ink)] mb-2">
                Your Brand, Your Customers
              </h3>
              <p className="text-xs text-[var(--muted-slate)] leading-relaxed">
                Retain your loyal local clientele while getting discovered by new families moving into the locality.
              </p>
            </div>
          </div>
        </section>

        {/* Demo Registration Form */}
        <section id="interest-form" className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-3xl border border-[var(--soft-border)] p-8 shadow-sm">
            <div className="text-center mb-6">
              <span className="text-3xl">📝</span>
              <h2 className="text-xl font-bold text-[var(--deep-ink)] mt-2">
                Vendor Interest Application
              </h2>
              <p className="text-xs text-[var(--muted-slate)] mt-1">
                Simulated demo registration — Feel free to use test details
              </p>
            </div>

            {submitted ? (
              <div className="bg-[var(--soft-sage)] border border-[var(--forest-teal)]/20 rounded-2xl p-6 text-center space-y-3">
                <CheckCircle2 size={36} className="text-[var(--forest-teal)] mx-auto" />
                <h3 className="font-bold text-base text-[var(--forest-teal)]">
                  Application Recorded in Demo!
                </h3>
                <p className="text-xs text-[var(--deep-ink)] leading-relaxed">
                  Thank you, <strong>{ownerName}</strong>! Your simulated interest for{' '}
                  <strong>{shopName}</strong> has been saved to the browser demo store.
                </p>
                <div className="pt-2">
                  <Link
                    href="/seller"
                    className="inline-flex items-center gap-2 bg-[var(--forest-teal)] text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:brightness-110"
                  >
                    Open Seller Portal Demo <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-[var(--deep-ink)] mb-1 block">
                    Shopkeeper / Owner Name
                  </label>
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="e.g. Ramesh Chandra Ghosh"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--soft-border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--forest-teal)]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--deep-ink)] mb-1 block">
                    Shop Name
                  </label>
                  <input
                    type="text"
                    required
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="e.g. Ghosh Brothers Kirana Store"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--soft-border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--forest-teal)]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[var(--deep-ink)] mb-1 block">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as ShopCategory)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--soft-border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--forest-teal)] bg-white"
                    >
                      <option value="grocery">Grocery & Staples</option>
                      <option value="vegetables">Fresh Vegetables</option>
                      <option value="fruits">Seasonal Fruits</option>
                      <option value="chicken">Chicken</option>
                      <option value="mutton">Mutton</option>
                      <option value="fish">Fish & Seafood</option>
                      <option value="dairy">Dairy & Eggs</option>
                      <option value="essentials">Daily Essentials</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--deep-ink)] mb-1 block">
                      Phone Number (Demo)
                    </label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9830000000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--soft-border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--forest-teal)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--deep-ink)] mb-1 block">
                    Locality / Address
                  </label>
                  <input
                    type="text"
                    required
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--soft-border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--forest-teal)]"
                  />
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <input
                    type="checkbox"
                    id="hasDelivery"
                    checked={hasDelivery}
                    onChange={(e) => setHasDelivery(e.target.checked)}
                    className="w-4 h-4 rounded text-[var(--forest-teal)] focus:ring-[var(--forest-teal)]"
                  />
                  <label htmlFor="hasDelivery" className="text-xs font-medium text-[var(--deep-ink)]">
                    We currently have staff or boys for local home delivery
                  </label>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--deep-ink)] mb-1 block">
                    Notes or questions (optional)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. In business for 15 years, specializing in fresh local vegetables"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--soft-border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--forest-teal)] resize-none"
                  />
                </div>

                <div className="bg-[var(--warm-ivory)] p-3 rounded-xl border border-[var(--soft-border)] text-[11px] text-[var(--muted-slate)]">
                  💡 Notice: This form is purely illustrative for this product prototype. No real personal information is collected or transmitted outside your local browser storage.
                </div>

                <button
                  type="submit"
                  className="w-full bg-[var(--forest-teal)] text-white font-bold py-3 rounded-xl hover:brightness-110 transition-all text-sm flex items-center justify-center gap-2"
                >
                  Submit Interest (Simulated) <ArrowRight size={16} />
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
