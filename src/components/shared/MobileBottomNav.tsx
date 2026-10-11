'use client';

import Link from 'next/link';
import { Home, Store, Search, Package, User } from 'lucide-react';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/shops', label: 'Shops', icon: Store },
  { href: '/shops?search=true', label: 'Search', icon: Search },
  { href: '/orders', label: 'Orders', icon: Package },
  { href: '/account', label: 'Account', icon: User },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[var(--soft-border)] safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href.split('?')[0]));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-xl transition-colors min-w-[56px] ${
                isActive
                  ? 'text-[var(--forest-teal)]'
                  : 'text-[var(--muted-slate)] hover:text-[var(--forest-teal)]'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
