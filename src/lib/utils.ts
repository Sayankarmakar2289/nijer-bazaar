export function formatPaise(paise: number): string {
  const rupees = paise / 100;
  return `₹${rupees.toLocaleString('en-IN', { minimumFractionDigits: rupees % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })}`;
}

export function formatUnit(unit: string, quantity?: number): string {
  const labels: Record<string, string> = {
    kg: 'kg', g: 'g', litre: 'L', ml: 'ml',
    piece: quantity && quantity > 1 ? 'pcs' : 'pc',
    dozen: 'doz', pack: 'pack', bundle: 'bundle',
  };
  return labels[unit] || unit;
}

export function generateOrderNumber(): string {
  const num = Math.floor(Math.random() * 9000) + 1000;
  return `NB-${num}`;
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function isShopOpen(hours: { open: string; close: string; days: number[] }): boolean {
  const now = new Date();
  const day = now.getDay();
  if (!hours.days.includes(day)) return false;
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  return currentTime >= hours.open && currentTime <= hours.close;
}

export function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export const categoryLabels: Record<string, string> = {
  grocery: 'Grocery & Staples',
  vegetables: 'Vegetables',
  fruits: 'Fruits',
  chicken: 'Chicken',
  mutton: 'Mutton',
  fish: 'Fish & Seafood',
  dairy: 'Dairy & Eggs',
  essentials: 'Daily Essentials',
};

export const categoryEmojis: Record<string, string> = {
  grocery: '🛒',
  vegetables: '🥬',
  fruits: '🍎',
  chicken: '🍗',
  mutton: '🥩',
  fish: '🐟',
  dairy: '🥛',
  essentials: '🧴',
};

export const formatOrderDate = formatDate;

export const orderStatusLabels: Record<string, string> = {
  placed: 'Order Placed',
  accepted: 'Accepted',
  preparing: 'Preparing',
  ready: 'Ready',
  'out-for-delivery': 'Out for Delivery',
  delivered: 'Delivered',
  collected: 'Collected',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
};

export const orderStatusColors: Record<string, string> = {
  placed: 'bg-amber-100 text-amber-800 border-amber-200',
  accepted: 'bg-blue-100 text-blue-800 border-blue-200',
  preparing: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  ready: 'bg-purple-100 text-purple-800 border-purple-200',
  'out-for-delivery': 'bg-cyan-100 text-cyan-800 border-cyan-200',
  delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  collected: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  rejected: 'bg-rose-100 text-rose-800 border-rose-200',
  cancelled: 'bg-slate-100 text-slate-800 border-slate-200',
};
