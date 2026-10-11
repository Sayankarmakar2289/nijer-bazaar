'use client';

import Link from 'next/link';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import MobileBottomNav from '@/components/shared/MobileBottomNav';
import { ArrowLeft, HelpCircle, Shield, ShoppingBag, Store, Clock } from 'lucide-react';

const faqs = [
  {
    q: 'What is Nijer Bazaar?',
    a: 'Nijer Bazaar (নিজের বাজার) is a mobile-first hyperlocal marketplace designed to connect residents with their favourite trusted neighbourhood stores in Kolkata. We support kirana/groceries, fresh vegetables, fruits, chicken, fish, mutton, dairy, and daily essentials.',
  },
  {
    q: 'How does ordering work?',
    a: 'You choose a shop in your neighbourhood, select your items, and choose either Home Delivery or Store Pickup. The shopkeeper receives your order directly on their seller dashboard, prepares the fresh items, and updates the tracking status in real time.',
  },
  {
    q: 'Why can I only order from one shop per cart?',
    a: 'Local neighbourhood shops manage their own inventories, packing, and billing. Keeping one shop per order ensures maximum freshness, direct vendor accountability, and fast turnaround without intermediate warehouses.',
  },
  {
    q: 'How does payment work?',
    a: 'In this interactive prototype, payments are simulated. Supported demo options are Cash on Delivery (COD) or Pay at Shop counter upon pickup. No actual transactions or credit cards are involved.',
  },
  {
    q: 'Can a seller pause or update their store?',
    a: 'Yes! Sellers have full operational autonomy. They can pause incoming orders during rush hours, adjust prices, restock inventory, or update opening times from their Seller Dashboard.',
  },
  {
    q: 'Is this an interactive demo?',
    a: 'Yes! All shops, products, prices, and orders in this application are fictional demonstrations. You can switch between customer and seller roles anytime to see how the marketplace functions end-to-end.',
  },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--warm-ivory)]">
      <Header />

      <main className="flex-1 pb-24 md:pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <Link
            href="/"
            className="text-xs text-[var(--muted-slate)] hover:text-[var(--forest-teal)] flex items-center gap-1 font-medium mb-4"
          >
            <ArrowLeft size={14} /> Back to Home
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-[var(--forest-teal)] text-[var(--fresh-lime)] flex items-center justify-center">
              <HelpCircle size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--deep-ink)]">Frequently Asked Questions</h1>
              <p className="text-xs text-[var(--muted-slate)]">Learn how Nijer Bazaar works for customers and sellers</p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-[var(--soft-border)] p-5 shadow-sm">
                <h3 className="text-sm font-bold text-[var(--deep-ink)] mb-2 flex items-start gap-2">
                  <span className="text-[var(--forest-teal)]">Q.</span>
                  {faq.q}
                </h3>
                <p className="text-xs text-[var(--muted-slate)] leading-relaxed pl-5">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-[var(--soft-sage)] border border-[var(--forest-teal)]/20 rounded-3xl p-6 text-center">
            <h2 className="text-sm font-bold text-[var(--forest-teal)] mb-1">Are you a neighbourhood shopkeeper?</h2>
            <p className="text-xs text-[var(--muted-slate)] max-w-md mx-auto mb-4">
              Bring your shop online in minutes. Manage your daily orders, stock, and customers effortlessly.
            </p>
            <Link
              href="/become-a-seller"
              className="inline-flex items-center gap-2 bg-[var(--forest-teal)] text-white text-xs font-semibold px-5 py-2.5 rounded-xl hover:brightness-110"
            >
              Learn More & Join as a Seller
            </Link>
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
