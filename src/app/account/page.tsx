'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import MobileBottomNav from '@/components/shared/MobileBottomNav';
import { useStore } from '@/store';
import { User, Phone, MapPin, Store, RotateCcw, ShieldCheck, ChevronRight, Check } from 'lucide-react';

export default function AccountPage() {
  const [mounted, setMounted] = useState(false);
  const [saved, setSaved] = useState(false);

  const customerName = useStore((s) => s.customerName);
  const customerPhone = useStore((s) => s.customerPhone);
  const customerAddress = useStore((s) => s.customerAddress);
  const resetDemo = useStore((s) => s.resetDemo);
  const setCurrentRole = useStore((s) => s.setCurrentRole);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    setMounted(true);
    setName(customerName);
    setPhone(customerPhone);
    setAddress(customerAddress);
  }, [customerName, customerPhone, customerAddress]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[var(--warm-ivory)]">
        <Header />
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    useStore.setState({
      customerName: name,
      customerPhone: phone,
      customerAddress: address,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all demo data to default? This will restore initial shops, products, and sample orders.')) {
      resetDemo();
      setName('Demo Customer');
      setPhone('9900000001');
      setAddress('7 Park Lane, Demo Neighbourhood, Kolkata');
      alert('Demo data has been reset to default.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--warm-ivory)]">
      <Header />

      <main className="flex-1 pb-24 md:pb-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-[var(--forest-teal)] text-[var(--fresh-lime)] flex items-center justify-center font-bold text-lg">
              {name.charAt(0) || 'D'}
            </div>
            <div>
              <h1 className="text-xl font-bold text-[var(--deep-ink)]">{name}</h1>
              <p className="text-xs text-[var(--muted-slate)]">Simulated Customer Profile</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Profile Form */}
            <form onSubmit={handleSave} className="bg-white rounded-3xl border border-[var(--soft-border)] p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-[var(--deep-ink)] uppercase tracking-wider text-[var(--muted-slate)] mb-1">
                Customer Details
              </h2>

              <div>
                <label className="text-xs font-semibold text-[var(--deep-ink)] mb-1 block">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--soft-border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--forest-teal)]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--deep-ink)] mb-1 block">Phone Number (Demo)</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--soft-border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--forest-teal)]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[var(--deep-ink)] mb-1 block">Delivery Address</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--soft-border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--forest-teal)] resize-none"
                  required
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="submit"
                  className="bg-[var(--forest-teal)] text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:brightness-110 transition-all flex items-center gap-1.5"
                >
                  {saved ? <Check size={14} className="text-[var(--fresh-lime)]" /> : null}
                  {saved ? 'Saved Successfully' : 'Update Profile'}
                </button>
              </div>
            </form>

            {/* Quick Demo Navigation */}
            <div className="bg-white rounded-3xl border border-[var(--soft-border)] p-6 shadow-sm space-y-3">
              <h2 className="text-sm font-bold text-[var(--deep-ink)] uppercase tracking-wider text-[var(--muted-slate)] mb-1">
                Demo Shortcuts
              </h2>

              <Link
                href="/seller"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[var(--soft-sage)] text-[var(--forest-teal)] font-semibold text-sm hover:brightness-95 transition-all"
              >
                <div className="flex items-center gap-2">
                  <Store size={18} />
                  <span>Switch to Seller Dashboard</span>
                </div>
                <ChevronRight size={16} />
              </Link>

              <Link
                href="/demo/control-center"
                className="flex items-center justify-between p-3.5 rounded-2xl border border-[var(--soft-border)] text-[var(--deep-ink)] font-semibold text-sm hover:bg-[var(--warm-ivory)] transition-all"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-[var(--forest-teal)]" />
                  <span>Demo Control Center (Scenarios)</span>
                </div>
                <ChevronRight size={16} />
              </Link>

              <button
                type="button"
                onClick={handleReset}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-red-200 text-[var(--error)] hover:bg-red-50 font-semibold text-sm transition-all"
              >
                <div className="flex items-center gap-2">
                  <RotateCcw size={18} />
                  <span>Reset All Demo Data</span>
                </div>
                <span className="text-xs">Restore defaults</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
