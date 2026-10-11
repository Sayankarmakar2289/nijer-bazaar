'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import MobileBottomNav from '@/components/shared/MobileBottomNav';
import { useStore } from '@/store';
import { formatPaise, categoryEmojis } from '@/lib/utils';
import {
  ShieldCheck,
  RotateCcw,
  Store,
  User,
  ArrowRight,
  Play,
  CheckCircle2,
  AlertCircle,
  PauseCircle,
  PlayCircle,
  Tag,
  Package,
  Layers,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';

export default function DemoControlCenterPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [scenarioMessage, setScenarioMessage] = useState<string | null>(null);

  const shops = useStore((s) => s.shops);
  const products = useStore((s) => s.products);
  const orders = useStore((s) => s.orders);
  const cart = useStore((s) => s.cart);
  const currentRole = useStore((s) => s.currentRole);
  const selectedSellerId = useStore((s) => s.selectedSellerId);
  const setCurrentRole = useStore((s) => s.setCurrentRole);
  const setSelectedSeller = useStore((s) => s.setSelectedSeller);
  const resetDemo = useStore((s) => s.resetDemo);
  const addToCart = useStore((s) => s.addToCart);
  const placeOrder = useStore((s) => s.placeOrder);
  const updateProduct = useStore((s) => s.updateProduct);
  const toggleShopPause = useStore((s) => s.toggleShopPause);

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

  const activeShop = shops.find((s) => s.id === selectedSellerId) || shops[0];

  const handleRoleToggle = (role: 'customer' | 'seller') => {
    setCurrentRole(role);
    if (role === 'seller') {
      router.push('/seller/dashboard');
    } else {
      router.push('/');
    }
  };

  const handleSelectShop = (shopId: string) => {
    setSelectedSeller(shopId);
  };

  const handleReset = () => {
    if (confirm('Reset all demo state to initial seed data?')) {
      resetDemo();
      setScenarioMessage('Demo state restored to original clean seed data.');
      setTimeout(() => setScenarioMessage(null), 3000);
    }
  };

  // Scenario A: Automated Order Flow
  const triggerScenarioA = () => {
    const kiranaShop = shops.find((s) => s.category === 'grocery') || shops[0];
    const kiranaProducts = products.filter((p) => p.shopId === kiranaShop.id && p.stock > 0);

    if (kiranaProducts.length < 2) {
      alert('Not enough products to run scenario. Reset demo first.');
      return;
    }

    useStore.getState().clearCart();
    addToCart(kiranaProducts[0], undefined, 2);
    addToCart(kiranaProducts[1], undefined, 1);

    const order = placeOrder(
      'delivery',
      'cash-on-delivery',
      'Please ring the doorbell twice (Demo order)',
      'Subhojit Das',
      '9830123456',
      '14/2 Rashbehari Avenue, Kolkata'
    );

    if (order) {
      setSelectedSeller(kiranaShop.id);
      setScenarioMessage(`Scenario A Triggered: Order ${order.orderNumber} placed at ${kiranaShop.name}. Redirecting to live tracking...`);
      setTimeout(() => {
        router.push(`/orders/${order.id}`);
      }, 1500);
    }
  };

  // Scenario B: Stock Availability Test
  const triggerScenarioB = () => {
    const eggProduct = products.find((p) => p.name.toLowerCase().includes('egg') || p.name.toLowerCase().includes('rice')) || products[0];
    const newStock = eggProduct.stock > 0 ? 0 : 25;
    const newAvailable = newStock > 0;

    updateProduct(eggProduct.id, {
      stock: newStock,
      isAvailable: newAvailable,
    });

    setScenarioMessage(
      `Scenario B: Set "${eggProduct.name}" to ${newStock === 0 ? 'OUT OF STOCK' : 'IN STOCK (25 units)'}.`
    );
    setTimeout(() => {
      router.push(`/products/${eggProduct.id}`);
    }, 1500);
  };

  // Scenario C: Price Change Test
  const triggerScenarioC = () => {
    const targetProduct = products.find((p) => p.name.toLowerCase().includes('oil') || p.name.toLowerCase().includes('atta')) || products[0];
    const newPriceRupees = targetProduct.pricePaise === 18000 ? 195 : 180;

    updateProduct(targetProduct.id, {
      pricePaise: newPriceRupees * 100,
    });

    setScenarioMessage(
      `Scenario C: Updated price of "${targetProduct.name}" to ₹${newPriceRupees}. Historical placed orders retain their locked snapshot price.`
    );
    setTimeout(() => {
      router.push(`/products/${targetProduct.id}`);
    }, 1500);
  };

  // Scenario D: Pause Shop Test
  const triggerScenarioD = () => {
    const shopToToggle = activeShop;
    toggleShopPause(shopToToggle.id);
    const updatedStatus = !shopToToggle.isPaused;

    setScenarioMessage(
      `Scenario D: "${shopToToggle.name}" is now ${updatedStatus ? 'PAUSED (Ordering disabled)' : 'OPEN (Taking orders)'}.`
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--warm-ivory)]">
      <Header />

      <main className="flex-1 pb-24 md:pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎛️</span>
                <h1 className="text-2xl font-black text-[var(--deep-ink)]">
                  Demo Control Center
                </h1>
              </div>
              <p className="text-xs text-[var(--muted-slate)] mt-0.5">
                Switch user roles, select merchant stores, and trigger end-to-end interactive scenarios
              </p>
            </div>

            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 bg-red-50 text-[var(--error)] border border-red-200 text-xs font-bold px-4 py-2 rounded-xl hover:bg-red-100 transition-colors self-start"
            >
              <RotateCcw size={14} /> Reset Demo Data
            </button>
          </div>

          {/* Toast / Alert Message */}
          {scenarioMessage && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs p-4 rounded-2xl mb-6 flex items-center gap-2 animate-fade-in shadow-xs">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span className="font-semibold">{scenarioMessage}</span>
            </div>
          )}

          {/* Role & Store Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* 1. Active Role Switcher */}
            <div className="bg-white rounded-3xl border border-[var(--soft-border)] p-6 shadow-sm">
              <h2 className="text-xs font-bold text-[var(--muted-slate)] uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <User size={14} /> 1. Active User Role
              </h2>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  onClick={() => handleRoleToggle('customer')}
                  className={`p-4 rounded-2xl border text-center transition-all ${
                    currentRole === 'customer'
                      ? 'border-[var(--forest-teal)] bg-[var(--soft-sage)] ring-2 ring-[var(--forest-teal)]/20'
                      : 'border-[var(--soft-border)] hover:bg-slate-50'
                  }`}
                >
                  <p className="text-2xl mb-1">🛒</p>
                  <p className="font-bold text-xs text-[var(--deep-ink)]">Customer View</p>
                  <p className="text-[10px] text-[var(--muted-slate)]">Storefront, Cart & Tracking</p>
                </button>

                <button
                  onClick={() => handleRoleToggle('seller')}
                  className={`p-4 rounded-2xl border text-center transition-all ${
                    currentRole === 'seller'
                      ? 'border-[var(--forest-teal)] bg-[var(--soft-sage)] ring-2 ring-[var(--forest-teal)]/20'
                      : 'border-[var(--soft-border)] hover:bg-slate-50'
                  }`}
                >
                  <p className="text-2xl mb-1">🏪</p>
                  <p className="font-bold text-xs text-[var(--deep-ink)]">Seller View</p>
                  <p className="text-[10px] text-[var(--muted-slate)]">Orders, Stock & Analytics</p>
                </button>
              </div>

              <div className="flex gap-2">
                <Link
                  href="/"
                  className="flex-1 text-center bg-white border border-[var(--soft-border)] text-[var(--deep-ink)] text-xs font-bold py-2 rounded-xl hover:bg-slate-50"
                >
                  Go to Storefront →
                </Link>
                <Link
                  href="/seller/dashboard"
                  className="flex-1 text-center bg-[var(--forest-teal)] text-white text-xs font-bold py-2 rounded-xl hover:brightness-110"
                >
                  Go to Seller Station →
                </Link>
              </div>
            </div>

            {/* 2. Active Merchant Shop Picker */}
            <div className="bg-white rounded-3xl border border-[var(--soft-border)] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-bold text-[var(--muted-slate)] uppercase tracking-wider flex items-center gap-1.5">
                  <Store size={14} /> 2. Selected Shopkeeper
                </h2>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  activeShop.isPaused ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {activeShop.isPaused ? 'Currently Paused' : 'Currently Open'}
                </span>
              </div>

              <p className="text-xs text-[var(--deep-ink)] mb-3">
                Active: <strong>{activeShop.name}</strong> ({activeShop.category})
              </p>

              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {shops.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSelectShop(s.id)}
                    className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      s.id === activeShop.id
                        ? 'bg-[var(--forest-teal)] text-white font-bold'
                        : 'bg-[var(--warm-ivory)] hover:bg-[var(--soft-sage)] text-[var(--deep-ink)]'
                    }`}
                  >
                    <span className="truncate">{s.name}</span>
                    <span className="text-[10px] opacity-75 capitalize shrink-0 ml-2">
                      {s.distance} • {s.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Guided Scenarios */}
          <div className="bg-white rounded-3xl border border-[var(--soft-border)] p-6 sm:p-8 shadow-sm mb-8">
            <h2 className="text-base font-black text-[var(--deep-ink)] mb-1">
              End-to-End Walkthrough Scenarios
            </h2>
            <p className="text-xs text-[var(--muted-slate)] mb-6">
              One-click demonstrations proving complete synchronization between customer and seller
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Scenario A */}
              <div className="border border-[var(--soft-border)] rounded-2xl p-5 hover:border-[var(--forest-teal)] transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-lg bg-[var(--soft-sage)] text-[var(--forest-teal)] font-bold text-xs flex items-center justify-center">
                      A
                    </span>
                    <h3 className="font-bold text-sm text-[var(--deep-ink)]">
                      Order Lifecycle Flow
                    </h3>
                  </div>
                  <p className="text-xs text-[var(--muted-slate)] leading-relaxed mb-4">
                    Puts Kirana items into cart → places simulated order → switches to seller → demonstrates <em>Placed &rarr; Accepted &rarr; Preparing &rarr; Ready &rarr; Delivered</em> timeline.
                  </p>
                </div>
                <button
                  onClick={triggerScenarioA}
                  className="w-full bg-[var(--forest-teal)] text-white font-bold text-xs py-2.5 rounded-xl hover:brightness-110 flex items-center justify-center gap-2 shadow-xs"
                >
                  <Play size={13} /> Run Scenario A
                </button>
              </div>

              {/* Scenario B */}
              <div className="border border-[var(--soft-border)] rounded-2xl p-5 hover:border-[var(--forest-teal)] transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-lg bg-[var(--soft-sage)] text-[var(--forest-teal)] font-bold text-xs flex items-center justify-center">
                      B
                    </span>
                    <h3 className="font-bold text-sm text-[var(--deep-ink)]">
                      Stock Availability & Deduction
                    </h3>
                  </div>
                  <p className="text-xs text-[var(--muted-slate)] leading-relaxed mb-4">
                    Seller toggles product stock to 0 &rarr; customer storefront immediately blocks add-to-cart and marks item as Out of Stock.
                  </p>
                </div>
                <button
                  onClick={triggerScenarioB}
                  className="w-full bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl hover:bg-slate-900 flex items-center justify-center gap-2 shadow-xs"
                >
                  <Package size={13} /> Run Scenario B
                </button>
              </div>

              {/* Scenario C */}
              <div className="border border-[var(--soft-border)] rounded-2xl p-5 hover:border-[var(--forest-teal)] transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-lg bg-[var(--soft-sage)] text-[var(--forest-teal)] font-bold text-xs flex items-center justify-center">
                      C
                    </span>
                    <h3 className="font-bold text-sm text-[var(--deep-ink)]">
                      Price Update vs Historical Snapshot
                    </h3>
                  </div>
                  <p className="text-xs text-[var(--muted-slate)] leading-relaxed mb-4">
                    Seller updates product price &rarr; fresh carts display the new price while previously placed orders preserve their original frozen prices.
                  </p>
                </div>
                <button
                  onClick={triggerScenarioC}
                  className="w-full bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl hover:bg-slate-900 flex items-center justify-center gap-2 shadow-xs"
                >
                  <Tag size={13} /> Run Scenario C
                </button>
              </div>

              {/* Scenario D */}
              <div className="border border-[var(--soft-border)] rounded-2xl p-5 hover:border-[var(--forest-teal)] transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-lg bg-[var(--soft-sage)] text-[var(--forest-teal)] font-bold text-xs flex items-center justify-center">
                      D
                    </span>
                    <h3 className="font-bold text-sm text-[var(--deep-ink)]">
                      Shop Pause / Resume
                    </h3>
                  </div>
                  <p className="text-xs text-[var(--muted-slate)] leading-relaxed mb-4">
                    Toggle pause on <strong>{activeShop.name}</strong> &rarr; verifies customer storefront displays shop paused banner and blocks checkout.
                  </p>
                </div>
                <button
                  onClick={triggerScenarioD}
                  className="w-full bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl hover:bg-slate-900 flex items-center justify-center gap-2 shadow-xs"
                >
                  <PauseCircle size={13} /> Toggle Shop Pause
                </button>
              </div>
            </div>
          </div>

          {/* System State Diagnostics */}
          <div className="bg-[var(--soft-sage)] rounded-3xl border border-[var(--forest-teal)]/20 p-6 text-xs text-[var(--deep-ink)] flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-bold text-sm text-[var(--forest-teal)]">Local Demo State Diagnostics</p>
              <p className="text-[11px] text-[var(--muted-slate)] mt-0.5">
                {shops.length} Shops • {products.length} Products • {orders.length} Simulated Orders • {cart.items.length} Items in Current Cart
              </p>
            </div>
            <div className="text-[11px] text-[var(--muted-slate)]">
              Storage: <span className="font-bold text-emerald-800">localStorage (persisted)</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
