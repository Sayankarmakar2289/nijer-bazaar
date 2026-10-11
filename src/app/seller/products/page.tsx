'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import SellerNav from '@/components/seller/SellerNav';
import { useStore } from '@/store';
import { formatPaise, categoryEmojis, categoryLabels } from '@/lib/utils';
import { Product } from '@/types';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

export default function SellerProductsPage() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editPriceRupees, setEditPriceRupees] = useState('');
  const [editStock, setEditStock] = useState('');

  const shops = useStore((s) => s.shops);
  const products = useStore((s) => s.products);
  const selectedSellerId = useStore((s) => s.selectedSellerId);
  const updateProduct = useStore((s) => s.updateProduct);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[var(--soft-sage)]">
        <div className="p-8 text-center text-sm text-[var(--muted-slate)]">Loading products...</div>
      </div>
    );
  }

  const currentShop = shops.find((s) => s.id === selectedSellerId) || shops[0];
  const shopProducts = products.filter((p) => p.shopId === currentShop.id && !p.isArchived);

  const filteredProducts = shopProducts.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleToggleAvailable = (product: Product) => {
    updateProduct(product.id, { isAvailable: !product.isAvailable });
  };

  const handleArchive = (productId: string) => {
    if (confirm('Archive this product? It will no longer appear in the customer store.')) {
      updateProduct(productId, { isArchived: true });
    }
  };

  const handleStartEdit = (product: Product) => {
    setEditingProduct(product);
    setEditPriceRupees((product.pricePaise / 100).toString());
    setEditStock(product.stock.toString());
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const parsedPriceRupees = parseFloat(editPriceRupees);
    const parsedStock = parseInt(editStock, 10);

    if (isNaN(parsedPriceRupees) || parsedPriceRupees < 0) {
      alert('Please enter a valid price');
      return;
    }
    if (isNaN(parsedStock) || parsedStock < 0) {
      alert('Please enter a valid stock amount');
      return;
    }

    updateProduct(editingProduct.id, {
      pricePaise: Math.round(parsedPriceRupees * 100),
      stock: parsedStock,
      isAvailable: parsedStock > 0 ? editingProduct.isAvailable : false,
    });

    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--soft-sage)]">
      <SellerNav />

      <main className="flex-1 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-black text-[var(--deep-ink)]">
                Product Catalog
              </h1>
              <p className="text-xs text-[var(--muted-slate)] mt-0.5">
                Manage inventory, pricing, and availability for <strong>{currentShop.name}</strong>
              </p>
            </div>

            <Link
              href="/seller/products/new"
              className="inline-flex items-center gap-1.5 bg-[var(--forest-teal)] text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:brightness-110 shadow-sm self-start"
            >
              <Plus size={16} /> Add New Product
            </Link>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white rounded-2xl border border-[var(--soft-border)] p-4 shadow-sm mb-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-slate)]" />
              <input
                type="text"
                placeholder="Search products by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-[var(--soft-border)] text-xs focus:outline-none focus:ring-2 focus:ring-[var(--forest-teal)] bg-[var(--warm-ivory)]"
              />
            </div>
          </div>

          {/* Product Cards Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[var(--soft-border)] p-12 text-center max-w-md mx-auto my-6">
              <p className="text-4xl mb-3">📦</p>
              <h3 className="font-bold text-base text-[var(--deep-ink)] mb-1">No products found</h3>
              <p className="text-xs text-[var(--muted-slate)] mb-6">
                Try adjusting your search filter or add a new product.
              </p>
              <Link
                href="/seller/products/new"
                className="inline-flex items-center gap-1.5 bg-[var(--forest-teal)] text-white text-xs font-bold px-4 py-2 rounded-xl"
              >
                <Plus size={14} /> Add Product
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((p) => {
                const isOutOfStock = p.stock <= 0 || !p.isAvailable;

                return (
                  <div
                    key={p.id}
                    className={`bg-white rounded-3xl border p-5 shadow-sm flex flex-col justify-between transition-all ${
                      isOutOfStock ? 'border-amber-200 bg-amber-50/20' : 'border-[var(--soft-border)]'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="w-12 h-12 rounded-2xl bg-[var(--soft-sage)] flex items-center justify-center text-2xl shrink-0">
                          {categoryEmojis[p.category] || '📦'}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleAvailable(p)}
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-colors ${
                              p.isAvailable && p.stock > 0
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {p.isAvailable && p.stock > 0 ? 'In Stock' : 'Unavailable'}
                          </button>
                        </div>
                      </div>

                      <h3 className="font-bold text-sm text-[var(--deep-ink)] mb-1">{p.name}</h3>
                      <p className="text-xs text-[var(--muted-slate)] line-clamp-2 mb-3">
                        {p.description}
                      </p>

                      <div className="bg-[var(--warm-ivory)] p-3 rounded-2xl border border-[var(--soft-border)] flex items-center justify-between text-xs mb-3">
                        <div>
                          <span className="text-[10px] text-[var(--muted-slate)] uppercase font-bold block">
                            Selling Price
                          </span>
                          <span className="text-sm font-black text-[var(--deep-ink)]">
                            {formatPaise(p.pricePaise)} / {p.unit}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-[var(--muted-slate)] uppercase font-bold block">
                            Available Stock
                          </span>
                          <span className={`text-sm font-black ${p.stock <= 5 ? 'text-amber-600' : 'text-emerald-700'}`}>
                            {p.stock} {p.unit}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-3 border-t border-[var(--soft-border)] text-xs">
                      <button
                        onClick={() => handleStartEdit(p)}
                        className="flex-1 bg-[var(--soft-sage)] text-[var(--forest-teal)] font-bold py-2 rounded-xl hover:brightness-95 flex items-center justify-center gap-1.5"
                      >
                        <Edit2 size={13} /> Edit Price & Stock
                      </button>

                      <button
                        onClick={() => handleArchive(p.id)}
                        className="p-2 rounded-xl text-[var(--muted-slate)] hover:text-[var(--error)] hover:bg-red-50 transition-colors"
                        title="Archive product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Quick Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveEdit}
            className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-xl border border-[var(--soft-border)] space-y-4"
          >
            <h3 className="font-bold text-base text-[var(--deep-ink)]">
              Update {editingProduct.name}
            </h3>

            <div>
              <label className="text-xs font-semibold text-[var(--deep-ink)] mb-1 block">
                Price in Rupees (₹)
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={editPriceRupees}
                onChange={(e) => setEditPriceRupees(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[var(--soft-border)] text-xs focus:ring-2 focus:ring-[var(--forest-teal)]"
              />
              <span className="text-[10px] text-[var(--muted-slate)] mt-0.5 block">
                Updates customer catalog immediately
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--deep-ink)] mb-1 block">
                Available Stock ({editingProduct.unit})
              </label>
              <input
                type="number"
                required
                value={editStock}
                onChange={(e) => setEditStock(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[var(--soft-border)] text-xs focus:ring-2 focus:ring-[var(--forest-teal)]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--muted-slate)] hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[var(--forest-teal)] text-white hover:brightness-110 shadow-sm"
              >
                Save Updates
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
