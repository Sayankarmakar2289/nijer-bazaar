'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SellerNav from '@/components/seller/SellerNav';
import { useStore } from '@/store';
import { ShopCategory, ProductUnit } from '@/types';
import { ArrowLeft, Plus, Check } from 'lucide-react';

export default function NewProductPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const shops = useStore((s) => s.shops);
  const selectedSellerId = useStore((s) => s.selectedSellerId);
  const addProduct = useStore((s) => s.addProduct);

  const currentShop = shops.find((s) => s.id === selectedSellerId) || shops[0];

  const [name, setName] = useState('');
  const [category, setCategory] = useState<ShopCategory>(currentShop.category);
  const [priceRupees, setPriceRupees] = useState('');
  const [unit, setUnit] = useState<ProductUnit>('kg');
  const [stock, setStock] = useState('20');
  const [description, setDescription] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedPrice = parseFloat(priceRupees);
    const parsedStock = parseInt(stock, 10);

    if (!name.trim()) return alert('Product name is required');
    if (isNaN(parsedPrice) || parsedPrice <= 0) return alert('Enter a valid price');
    if (isNaN(parsedStock) || parsedStock < 0) return alert('Enter a valid stock quantity');

    addProduct({
      shopId: currentShop.id,
      name: name.trim(),
      category,
      pricePaise: Math.round(parsedPrice * 100),
      unit,
      stock: parsedStock,
      description: description.trim() || `Fresh ${name.trim()} from ${currentShop.name}`,
      image: '',
      isAvailable: parsedStock > 0,
      variants: [],
    });

    router.push('/seller/products');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--soft-sage)]">
      <SellerNav />

      <main className="flex-1 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/seller/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--forest-teal)] hover:underline mb-6"
          >
            <ArrowLeft size={14} /> Back to Products
          </Link>

          <div className="bg-white rounded-3xl border border-[var(--soft-border)] p-6 sm:p-8 shadow-sm">
            <h1 className="text-xl font-black text-[var(--deep-ink)] mb-1">
              Add New Product to Store
            </h1>
            <p className="text-xs text-[var(--muted-slate)] mb-6">
              Listing item under <strong>{currentShop.name}</strong>
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[var(--deep-ink)] block mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Desi Ghee or Gobindobhog Rice"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[var(--soft-border)] text-xs focus:ring-2 focus:ring-[var(--forest-teal)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-[var(--deep-ink)] block mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ShopCategory)}
                    className="w-full p-2.5 rounded-xl border border-[var(--soft-border)] text-xs bg-white"
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
                  <label className="font-bold text-[var(--deep-ink)] block mb-1">
                    Unit of Measurement *
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as ProductUnit)}
                    className="w-full p-2.5 rounded-xl border border-[var(--soft-border)] text-xs bg-white"
                  >
                    <option value="kg">Kilogram (kg)</option>
                    <option value="g">Gram (g)</option>
                    <option value="litre">Litre (L)</option>
                    <option value="ml">Millilitre (ml)</option>
                    <option value="piece">Piece (pc)</option>
                    <option value="dozen">Dozen (doz)</option>
                    <option value="pack">Pack</option>
                    <option value="bundle">Bundle</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-[var(--deep-ink)] block mb-1">
                    Selling Price in Rupees (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="e.g. 120"
                    value={priceRupees}
                    onChange={(e) => setPriceRupees(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[var(--soft-border)] text-xs focus:ring-2 focus:ring-[var(--forest-teal)]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[var(--deep-ink)] block mb-1">
                    Initial Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[var(--soft-border)] text-xs focus:ring-2 focus:ring-[var(--forest-teal)]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[var(--deep-ink)] block mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Fresh quality item sourced locally..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[var(--soft-border)] text-xs focus:ring-2 focus:ring-[var(--forest-teal)] resize-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Link
                  href="/seller/products"
                  className="px-4 py-2.5 rounded-xl font-bold text-[var(--muted-slate)] hover:bg-slate-100"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold bg-[var(--forest-teal)] text-white hover:brightness-110 shadow-sm flex items-center gap-1.5"
                >
                  <Plus size={14} /> Add Product to Store
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
