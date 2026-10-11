'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/store';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  BarChart3,
  Store,
  PauseCircle,
  PlayCircle,
  ArrowRightLeft,
  ChevronDown,
  ExternalLink,
  Menu,
  X,
  AlertCircle,
} from 'lucide-react';

export default function SellerNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopPickerOpen, setShopPickerOpen] = useState(false);

  const shops = useStore((s) => s.shops);
  const orders = useStore((s) => s.orders);
  const selectedSellerId = useStore((s) => s.selectedSellerId);
  const setSelectedSeller = useStore((s) => s.setSelectedSeller);
  const toggleShopPause = useStore((s) => s.toggleShopPause);
  const setCurrentRole = useStore((s) => s.setCurrentRole);

  const currentShop = shops.find((s) => s.id === selectedSellerId) || shops[0];

  // Count pending orders for this seller
  const pendingOrdersCount = orders.filter(
    (o) => o.shopId === currentShop.id && o.status === 'placed'
  ).length;

  const navLinks = [
    { href: '/seller/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/seller/orders', label: 'Orders', icon: ShoppingBag, badge: pendingOrdersCount },
    { href: '/seller/products', label: 'Products', icon: Package },
    { href: '/seller/inventory', label: 'Inventory', icon: Layers },
    { href: '/seller/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/seller/store', label: 'Store Settings', icon: Store },
  ];

  const handleSwitchShop = (shopId: string) => {
    setSelectedSeller(shopId);
    setShopPickerOpen(false);
  };

  const handleSwitchToCustomer = () => {
    setCurrentRole('customer');
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-[var(--forest-teal)] text-white shadow-md">
      {/* Top utility row */}
      <div className="border-b border-white/10 px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-wider uppercase text-[var(--fresh-lime)]">
            Seller Portal
          </span>
          <span className="text-white/40">•</span>
          <div className="relative">
            <button
              onClick={() => setShopPickerOpen(!shopPickerOpen)}
              className="flex items-center gap-1.5 font-semibold bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg transition-colors"
            >
              <Store size={14} className="text-[var(--fresh-lime)]" />
              <span>{currentShop.name}</span>
              <ChevronDown size={12} className="text-white/60" />
            </button>

            {/* Shop Picker Dropdown */}
            {shopPickerOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-64 bg-white rounded-2xl shadow-xl border border-[var(--soft-border)] text-[var(--deep-ink)] py-2 z-50">
                <p className="px-3 py-1 text-[10px] font-bold text-[var(--muted-slate)] uppercase">
                  Switch Active Shopkeeper:
                </p>
                {shops.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSwitchShop(s.id)}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[var(--soft-sage)] transition-colors ${
                      s.id === currentShop.id ? 'font-bold text-[var(--forest-teal)] bg-[var(--soft-sage)]' : ''
                    }`}
                  >
                    <span className="truncate">{s.name}</span>
                    <span className="text-[10px] text-[var(--muted-slate)] capitalize">
                      {s.category}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Pause / Resume Status Toggle */}
          <button
            onClick={() => toggleShopPause(currentShop.id)}
            className={`hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors ${
              currentShop.isPaused
                ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30'
                : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
            }`}
            title={currentShop.isPaused ? 'Click to Resume Orders' : 'Click to Pause Orders'}
          >
            {currentShop.isPaused ? (
              <>
                <PauseCircle size={13} /> Paused
              </>
            ) : (
              <>
                <PlayCircle size={13} /> Taking Orders
              </>
            )}
          </button>
        </div>

        {/* Role switchers */}
        <div className="flex items-center gap-2">
          <Link
            href="/demo/control-center"
            className="hidden md:inline-flex items-center gap-1 text-[var(--fresh-lime)] hover:underline"
          >
            Control Center
          </Link>
          <span className="text-white/40 hidden md:inline">•</span>
          <button
            onClick={handleSwitchToCustomer}
            className="flex items-center gap-1.5 bg-[var(--fresh-lime)] text-[var(--forest-teal)] px-3 py-1 rounded-lg font-bold hover:brightness-105 transition-all text-xs"
          >
            <ArrowRightLeft size={12} />
            <span>Customer View</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="px-4 sm:px-6 flex items-center justify-between h-14">
        {/* Brand / Title */}
        <div className="flex items-center gap-3">
          <Link href="/seller/dashboard" className="flex items-center gap-2.5 font-bold text-sm group">
            <div className="w-8 h-8 rounded-xl overflow-hidden bg-white border border-white/20 shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <Image src="/logo.png" alt="Nijer Bazaar" width={64} height={64} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-white text-sm leading-none">
                nijer bazaar<span className="text-[var(--fresh-lime)]">.</span>
              </span>
              <span className="text-[9px] uppercase tracking-wider text-[var(--fresh-lime)] font-bold mt-0.5">
                Merchant Station
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-white/20 text-white shadow-sm'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon size={16} />
                <span>{link.label}</span>
                {Boolean(link.badge) && (
                  <span className="bg-[var(--market-coral)] text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-white/10"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0e322e] border-t border-white/10 p-4 space-y-2">
          {/* Mobile shop pause toggle */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 mb-3">
            <span className="text-xs">Order Reception:</span>
            <button
              onClick={() => toggleShopPause(currentShop.id)}
              className={`px-3 py-1 rounded-lg text-xs font-bold ${
                currentShop.isPaused ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'
              }`}
            >
              {currentShop.isPaused ? 'Paused (Blocked)' : 'Open (Receiving)'}
            </button>
          </div>

          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold ${
                  active ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={18} />
                  <span>{link.label}</span>
                </div>
                {Boolean(link.badge) && (
                  <span className="bg-[var(--market-coral)] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-white/10">
            <Link
              href="/demo/control-center"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2.5 text-xs text-[var(--fresh-lime)] font-semibold"
            >
              Demo Control Center & Scenarios
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
