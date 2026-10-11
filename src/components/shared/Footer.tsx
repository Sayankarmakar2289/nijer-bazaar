import Link from 'next/link';
import Logo from '@/components/shared/Logo';

export default function Footer() {
  return (
    <footer className="bg-[var(--forest-teal)] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <Logo href="/" size="md" variant="light" />
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              Your Market. Your Way.<br />
              নিজের বাজার, নিজের মতো
            </p>
          </div>

          {/* For Customers */}
          <div>
            <h3 className="font-semibold mb-3 text-[var(--fresh-lime)]">For Customers</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/shops" className="hover:text-white transition-colors">Browse Shops</Link></li>
              <li><Link href="/orders" className="hover:text-white transition-colors">My Orders</Link></li>
              <li><Link href="/cart" className="hover:text-white transition-colors">Cart</Link></li>
              <li><Link href="/help" className="hover:text-white transition-colors">Help & FAQs</Link></li>
            </ul>
          </div>

          {/* For Sellers */}
          <div>
            <h3 className="font-semibold mb-3 text-[var(--fresh-lime)]">For Sellers</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/become-a-seller" className="hover:text-white transition-colors">Become a Seller</Link></li>
              <li><Link href="/seller" className="hover:text-white transition-colors">Seller Dashboard</Link></li>
            </ul>
          </div>

          {/* Demo */}
          <div>
            <h3 className="font-semibold mb-3 text-[var(--fresh-lime)]">Demo</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/demo/control-center" className="hover:text-white transition-colors">Control Center</Link></li>
            </ul>
            <p className="mt-4 text-xs text-white/50 leading-relaxed">
              This is an interactive prototype. All data is fictional and stored in your browser only. No real transactions occur.
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 text-center text-xs text-white/40">
          © 2026 Nijer Bazaar — Interactive Demo. Not a live commercial service.
        </div>
      </div>
    </footer>
  );
}
