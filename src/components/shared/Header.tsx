'use client';

import Link from 'next/link';
import Logo from '@/components/shared/Logo';
import { ShoppingCart, Search, Menu, X, MapPin, User, Package, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '@/store';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const cart = useStore((s) => s.cart);
  const cartCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);

  const navLinks = [
    { href: '/shops', label: 'Explore Shops' },
    { href: '/categories/grocery', label: 'Categories' },
    { href: '/become-a-seller', label: 'Become a Seller' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[var(--soft-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo href="/" size="md" variant="dark" />

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[var(--deep-ink)] hover:text-[var(--forest-teal)] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Location + Actions */}
          <div className="flex items-center gap-3">
            {/* Location */}
            <button className="hidden lg:flex items-center gap-1 text-xs text-[var(--muted-slate)] hover:text-[var(--forest-teal)] transition-colors px-2 py-1 rounded-lg border border-[var(--soft-border)]">
              <MapPin size={14} />
              <span>Demo Neighbourhood</span>
              <ChevronDown size={12} />
            </button>

            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-lg hover:bg-[var(--soft-sage)] transition-colors"
              aria-label="Search"
            >
              <Search size={20} className="text-[var(--deep-ink)]" />
            </button>

            {/* Orders */}
            <Link
              href="/orders"
              className="hidden sm:flex p-2 rounded-lg hover:bg-[var(--soft-sage)] transition-colors"
              aria-label="Orders"
            >
              <Package size={20} className="text-[var(--deep-ink)]" />
            </Link>

            {/* Account */}
            <Link
              href="/account"
              className="hidden sm:flex p-2 rounded-lg hover:bg-[var(--soft-sage)] transition-colors"
              aria-label="Account"
            >
              <User size={20} className="text-[var(--deep-ink)]" />
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 rounded-lg hover:bg-[var(--soft-sage)] transition-colors"
              aria-label={`Cart with ${cartCount} items`}
            >
              <ShoppingCart size={20} className="text-[var(--deep-ink)]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[var(--market-coral)] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-[var(--soft-sage)] transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search Bar (expandable) */}
        {searchOpen && (
          <div className="pb-3">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-slate)]" />
              <input
                type="text"
                placeholder="Search shops, products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    window.location.href = `/shops?q=${encodeURIComponent(searchQuery.trim())}`;
                  }
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--soft-border)] bg-[var(--warm-ivory)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--forest-teal)] focus:border-transparent"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--soft-border)] bg-white">
          <nav className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--deep-ink)] hover:bg-[var(--soft-sage)] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/orders"
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--deep-ink)] hover:bg-[var(--soft-sage)] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              My Orders
            </Link>
            <Link
              href="/account"
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--deep-ink)] hover:bg-[var(--soft-sage)] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Account
            </Link>
            <Link
              href="/seller"
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--forest-teal)] bg-[var(--soft-sage)] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Seller Dashboard →
            </Link>
            <Link
              href="/demo/control-center"
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--market-coral)] hover:bg-red-50 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Demo Control Center
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
