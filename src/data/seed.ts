import { Shop, Product, Order, OrderStatus } from '@/types';

// ─── SHOPS ──────────────────────────────────────────────
export const seedShops: Shop[] = [
  {
    id: 'shop-1',
    slug: 'green-basket-vegetables',
    name: 'Green Basket Vegetables',
    category: 'vegetables',
    description: 'Fresh seasonal vegetables sourced daily from local farms. Quality produce for your kitchen.',
    address: '12 Market Lane, Demo Neighbourhood, Kolkata',
    phone: '9800000001',
    bannerImage: '/images/shops/vegetables-banner.jpg',
    logoImage: '/images/shops/vegetables-logo.jpg',
    hours: { open: '07:00', close: '21:00', days: [0, 1, 2, 3, 4, 5, 6] },
    supportsPickup: true,
    supportsDelivery: true,
    deliveryFee: 2000, // ₹20
    isPaused: false,
    distance: '0.5 km',
  },
  {
    id: 'shop-2',
    slug: 'daily-needs-kirana',
    name: 'Daily Needs Kirana',
    category: 'grocery',
    description: 'Your trusted neighbourhood grocery store. Rice, dal, oil, spices, and all daily essentials.',
    address: '45 Main Road, Demo Neighbourhood, Kolkata',
    phone: '9800000002',
    bannerImage: '/images/shops/grocery-banner.jpg',
    logoImage: '/images/shops/grocery-logo.jpg',
    hours: { open: '08:00', close: '22:00', days: [0, 1, 2, 3, 4, 5, 6] },
    supportsPickup: true,
    supportsDelivery: true,
    deliveryFee: 1500, // ₹15
    isPaused: false,
    distance: '0.8 km',
  },
  {
    id: 'shop-3',
    slug: 'fresh-catch-fish-corner',
    name: 'Fresh Catch Fish Corner',
    category: 'fish',
    description: 'Premium river and sea fish, cleaned and cut to your preference. Fresh catch every morning.',
    address: '8 Lake Market, Demo Neighbourhood, Kolkata',
    phone: '9800000003',
    bannerImage: '/images/shops/fish-banner.jpg',
    logoImage: '/images/shops/fish-logo.jpg',
    hours: { open: '06:00', close: '14:00', days: [1, 2, 3, 4, 5, 6] }, // closed Sunday
    supportsPickup: true,
    supportsDelivery: true,
    deliveryFee: 3000, // ₹30
    isPaused: false,
    distance: '1.2 km',
  },
  {
    id: 'shop-4',
    slug: 'farm-fresh-chicken',
    name: 'Farm Fresh Chicken',
    category: 'chicken',
    description: 'Farm-raised chicken, dressed fresh daily. Whole, curry cut, boneless — your choice.',
    address: '22 Bazaar Street, Demo Neighbourhood, Kolkata',
    phone: '9800000004',
    bannerImage: '/images/shops/chicken-banner.jpg',
    logoImage: '/images/shops/chicken-logo.jpg',
    hours: { open: '07:00', close: '20:00', days: [0, 1, 2, 3, 4, 5, 6] },
    supportsPickup: true,
    supportsDelivery: false,
    deliveryFee: 0,
    isPaused: false,
    distance: '0.6 km',
  },
  {
    id: 'shop-5',
    slug: 'city-fruits-house',
    name: 'City Fruits House',
    category: 'fruits',
    description: 'Seasonal and imported fruits. Bananas, apples, mangoes, oranges and more.',
    address: '5 Park Street, Demo Neighbourhood, Kolkata',
    phone: '9800000005',
    bannerImage: '/images/shops/fruits-banner.jpg',
    logoImage: '/images/shops/fruits-logo.jpg',
    hours: { open: '08:00', close: '21:00', days: [0, 1, 2, 3, 4, 5, 6] },
    supportsPickup: true,
    supportsDelivery: true,
    deliveryFee: 2000,
    isPaused: false,
    distance: '1.0 km',
  },
  {
    id: 'shop-6',
    slug: 'milk-and-more-dairy',
    name: 'Milk & More Dairy',
    category: 'dairy',
    description: 'Fresh milk, paneer, curd, ghee, butter, and eggs. Delivered from the dairy every morning.',
    address: '31 College Road, Demo Neighbourhood, Kolkata',
    phone: '9800000006',
    bannerImage: '/images/shops/dairy-banner.jpg',
    logoImage: '/images/shops/dairy-logo.jpg',
    hours: { open: '06:00', close: '20:00', days: [0, 1, 2, 3, 4, 5, 6] },
    supportsPickup: true,
    supportsDelivery: true,
    deliveryFee: 1500,
    isPaused: false,
    distance: '0.3 km',
  },
  {
    id: 'shop-7',
    slug: 'local-mutton-house',
    name: 'Local Mutton House',
    category: 'mutton',
    description: 'Premium goat meat cuts. Fresh mutton for your weekend feasts and everyday cooking.',
    address: '17 Meat Market, Demo Neighbourhood, Kolkata',
    phone: '9800000007',
    bannerImage: '/images/shops/mutton-banner.jpg',
    logoImage: '/images/shops/mutton-logo.jpg',
    hours: { open: '07:00', close: '18:00', days: [1, 2, 3, 4, 5, 6] }, // closed Sunday
    supportsPickup: true,
    supportsDelivery: false,
    deliveryFee: 0,
    isPaused: false,
    distance: '1.5 km',
  },
  {
    id: 'shop-8',
    slug: 'everyday-essentials',
    name: 'Everyday Essentials',
    category: 'essentials',
    description: 'Soap, shampoo, toothpaste, cleaning supplies, snacks, and everything you need daily.',
    address: '9 Central Avenue, Demo Neighbourhood, Kolkata',
    phone: '9800000008',
    bannerImage: '/images/shops/essentials-banner.jpg',
    logoImage: '/images/shops/essentials-logo.jpg',
    hours: { open: '09:00', close: '22:00', days: [0, 1, 2, 3, 4, 5, 6] },
    supportsPickup: true,
    supportsDelivery: true,
    deliveryFee: 2000,
    isPaused: false,
    distance: '0.7 km',
  },
];

// ─── PRODUCTS ───────────────────────────────────────────
export const seedProducts: Product[] = [
  // Green Basket Vegetables (shop-1)
  { id: 'p-1', shopId: 'shop-1', name: 'Potato (Aloo)', category: 'vegetables', description: 'Fresh locally grown potatoes, perfect for curries and fries.', image: '/images/products/potato.jpg', unit: 'kg', pricePaise: 3000, variants: [{ id: 'v-1a', label: '500g', pricePaise: 1500, unit: 'g', quantity: 500 }, { id: 'v-1b', label: '1 kg', pricePaise: 3000, unit: 'kg', quantity: 1 }, { id: 'v-1c', label: '2 kg', pricePaise: 5800, unit: 'kg', quantity: 2 }], stock: 50, reservedStock: 0, isAvailable: true, isArchived: false },
  { id: 'p-2', shopId: 'shop-1', name: 'Onion (Peyaj)', category: 'vegetables', description: 'Red onions, essential for every kitchen.', image: '/images/products/onion.jpg', unit: 'kg', pricePaise: 4000, variants: [{ id: 'v-2a', label: '500g', pricePaise: 2000, unit: 'g', quantity: 500 }, { id: 'v-2b', label: '1 kg', pricePaise: 4000, unit: 'kg', quantity: 1 }], stock: 40, reservedStock: 0, isAvailable: true, isArchived: false },
  { id: 'p-3', shopId: 'shop-1', name: 'Tomato', category: 'vegetables', description: 'Ripe red tomatoes for curries, salads, and chutneys.', image: '/images/products/tomato.jpg', unit: 'kg', pricePaise: 5000, variants: [{ id: 'v-3a', label: '500g', pricePaise: 2500, unit: 'g', quantity: 500 }, { id: 'v-3b', label: '1 kg', pricePaise: 5000, unit: 'kg', quantity: 1 }], stock: 30, reservedStock: 0, isAvailable: true, isArchived: false },
  { id: 'p-4', shopId: 'shop-1', name: 'Brinjal (Begun)', category: 'vegetables', description: 'Fresh purple brinjal for bharta and curries.', image: '/images/products/brinjal.jpg', unit: 'kg', pricePaise: 4000, variants: [{ id: 'v-4a', label: '500g', pricePaise: 2000, unit: 'g', quantity: 500 }, { id: 'v-4b', label: '1 kg', pricePaise: 4000, unit: 'kg', quantity: 1 }], stock: 25, reservedStock: 0, isAvailable: true, isArchived: false },
  { id: 'p-5', shopId: 'shop-1', name: 'Cauliflower (Fulkopi)', category: 'vegetables', description: 'Large, fresh cauliflower heads.', image: '/images/products/cauliflower.jpg', unit: 'piece', pricePaise: 3500, variants: [], stock: 20, reservedStock: 0, isAvailable: true, isArchived: false },
  { id: 'p-6', shopId: 'shop-1', name: 'Green Chilli', category: 'vegetables', description: 'Hot green chillies for that extra kick.', image: '/images/products/green-chilli.jpg', unit: 'g', pricePaise: 1000, variants: [{ id: 'v-6a', label: '100g', pricePaise: 1000, unit: 'g', quantity: 100 }, { id: 'v-6b', label: '250g', pricePaise: 2200, unit: 'g', quantity: 250 }], stock: 100, reservedStock: 0, isAvailable: true, isArchived: false },

  // Daily Needs Kirana (shop-2)
  { id: 'p-7', shopId: 'shop-2', name: 'Miniket Rice', category: 'grocery', description: 'Premium quality miniket rice. A Bengali kitchen staple.', image: '/images/products/rice.jpg', unit: 'kg', pricePaise: 6500, variants: [{ id: 'v-7a', label: '1 kg', pricePaise: 6500, unit: 'kg', quantity: 1 }, { id: 'v-7b', label: '5 kg', pricePaise: 31000, unit: 'kg', quantity: 5 }], stock: 100, reservedStock: 0, isAvailable: true, isArchived: false },
  { id: 'p-8', shopId: 'shop-2', name: 'Whole Wheat Atta', category: 'grocery', description: 'Fresh ground whole wheat flour for rotis and parathas.', image: '/images/products/atta.jpg', unit: 'kg', pricePaise: 4500, variants: [{ id: 'v-8a', label: '1 kg', pricePaise: 4500, unit: 'kg', quantity: 1 }, { id: 'v-8b', label: '5 kg', pricePaise: 21000, unit: 'kg', quantity: 5 }], stock: 60, reservedStock: 0, isAvailable: true, isArchived: false },
  { id: 'p-9', shopId: 'shop-2', name: 'Masoor Dal', category: 'grocery', description: 'Red lentils, a daily protein source.', image: '/images/products/dal.jpg', unit: 'kg', pricePaise: 12000, variants: [{ id: 'v-9a', label: '500g', pricePaise: 6200, unit: 'g', quantity: 500 }, { id: 'v-9b', label: '1 kg', pricePaise: 12000, unit: 'kg', quantity: 1 }], stock: 40, reservedStock: 0, isAvailable: true, isArchived: false },
  { id: 'p-10', shopId: 'shop-2', name: 'Mustard Oil (Sorisher Tel)', category: 'grocery', description: 'Pure kachi ghani mustard oil, the heart of Bengali cooking.', image: '/images/products/mustard-oil.jpg', unit: 'litre', pricePaise: 18000, variants: [{ id: 'v-10a', label: '500 ml', pricePaise: 9500, unit: 'ml', quantity: 500 }, { id: 'v-10b', label: '1 litre', pricePaise: 18000, unit: 'litre', quantity: 1 }], stock: 35, reservedStock: 0, isAvailable: true, isArchived: false },
  { id: 'p-11', shopId: 'shop-2', name: 'Turmeric Powder (Holud)', category: 'grocery', description: 'Ground turmeric for cooking and health.', image: '/images/products/turmeric.jpg', unit: 'g', pricePaise: 3000, variants: [{ id: 'v-11a', label: '100g', pricePaise: 3000, unit: 'g', quantity: 100 }, { id: 'v-11b', label: '200g', pricePaise: 5500, unit: 'g', quantity: 200 }], stock: 50, reservedStock: 0, isAvailable: true, isArchived: false },
  { id: 'p-12', shopId: 'shop-2', name: 'Sugar', category: 'grocery', description: 'Refined white sugar.', image: '/images/products/sugar.jpg', unit: 'kg', pricePaise: 4500, variants: [{ id: 'v-12a', label: '1 kg', pricePaise: 4500, unit: 'kg', quantity: 1 }, { id: 'v-12b', label: '2 kg', pricePaise: 8800, unit: 'kg', quantity: 2 }], stock: 45, reservedStock: 0, isAvailable: true, isArchived: false },
  { id: 'p-13', shopId: 'shop-2', name: 'Salt', category: 'grocery', description: 'Iodized table salt.', image: '/images/products/salt.jpg', unit: 'kg', pricePaise: 2500, variants: [{ id: 'v-13a', label: '1 kg', pricePaise: 2500, unit: 'kg', quantity: 1 }], stock: 60, reservedStock: 0, isAvailable: true, isArchived: false },
  { id: 'p-14', shopId: 'shop-2', name: 'Cumin Seeds (Jeera)', category: 'grocery', description: 'Whole cumin seeds for tempering.', image: '/images/products/cumin.jpg', unit: 'g', pricePaise: 4000, variants: [{ id: 'v-14a', label: '100g', pricePaise: 4000, unit: 'g', quantity: 100 }, { id: 'v-14b', label: '250g', pricePaise: 9500, unit: 'g', quantity: 250 }], stock: 55, reservedStock: 0, isAvailable: true, isArchived: false },

  // Fresh Catch Fish Corner (shop-3)
  { id: 'p-15', shopId: 'shop-3', name: 'Rohu (Rui) Fish', category: 'fish', description: 'Fresh river Rohu, the king of Bengali fish curries. Cleaned and cut to order.', image: '/images/products/rohu.jpg', unit: 'kg', pricePaise: 20000, variants: [{ id: 'v-15a', label: 'Whole (1 kg est.)', pricePaise: 20000, unit: 'kg', quantity: 1 }, { id: 'v-15b', label: 'Curry Cut (1 kg)', pricePaise: 22000, unit: 'kg', quantity: 1 }], stock: 15, reservedStock: 0, isAvailable: true, isArchived: false, preparationNotes: 'Cleaning and scaling included. Specify whole or curry cut.' },
  { id: 'p-16', shopId: 'shop-3', name: 'Katla Fish', category: 'fish', description: 'Large Katla, ideal for kalia and jhol. Cut options available.', image: '/images/products/katla.jpg', unit: 'kg', pricePaise: 25000, variants: [{ id: 'v-16a', label: 'Whole (1 kg est.)', pricePaise: 25000, unit: 'kg', quantity: 1 }, { id: 'v-16b', label: 'Curry Cut (1 kg)', pricePaise: 27000, unit: 'kg', quantity: 1 }], stock: 10, reservedStock: 0, isAvailable: true, isArchived: false, preparationNotes: 'Specify whole, curry cut, or steaks.' },
  { id: 'p-17', shopId: 'shop-3', name: 'Prawns (Chingri)', category: 'fish', description: 'Medium-sized river prawns, deveined on request.', image: '/images/products/prawns.jpg', unit: 'kg', pricePaise: 45000, variants: [{ id: 'v-17a', label: '250g', pricePaise: 12000, unit: 'g', quantity: 250 }, { id: 'v-17b', label: '500g', pricePaise: 23000, unit: 'g', quantity: 500 }], stock: 12, reservedStock: 0, isAvailable: true, isArchived: false, preparationNotes: 'Deveining available on request.' },
  { id: 'p-18', shopId: 'shop-3', name: 'Hilsa (Ilish)', category: 'fish', description: 'Seasonal Hilsa, the pride of Bengal. Limited availability.', image: '/images/products/hilsa.jpg', unit: 'kg', pricePaise: 80000, variants: [{ id: 'v-18a', label: 'Whole (est. 800g–1.2kg)', pricePaise: 80000, unit: 'kg', quantity: 1 }], stock: 5, reservedStock: 0, isAvailable: true, isArchived: false, preparationNotes: 'Price is estimated. Seller confirms actual weight.' },
  { id: 'p-19', shopId: 'shop-3', name: 'Tilapia', category: 'fish', description: 'Farm-raised tilapia, mild taste, great for fry.', image: '/images/products/tilapia.jpg', unit: 'kg', pricePaise: 15000, variants: [{ id: 'v-19a', label: '1 kg', pricePaise: 15000, unit: 'kg', quantity: 1 }], stock: 20, reservedStock: 0, isAvailable: true, isArchived: false },

  // Farm Fresh Chicken (shop-4)
  { id: 'p-20', shopId: 'shop-4', name: 'Chicken (Whole)', category: 'chicken', description: 'Farm-raised whole chicken, dressed fresh.', image: '/images/products/chicken-whole.jpg', unit: 'kg', pricePaise: 22000, variants: [{ id: 'v-20a', label: 'Whole (~1.2 kg)', pricePaise: 26400, unit: 'kg', quantity: 1 }, { id: 'v-20b', label: 'Curry Cut (1 kg)', pricePaise: 22000, unit: 'kg', quantity: 1 }], stock: 20, reservedStock: 0, isAvailable: true, isArchived: false, preparationNotes: 'Cleaning included. Specify whole, curry cut, or biryani cut.' },
  { id: 'p-21', shopId: 'shop-4', name: 'Chicken Breast (Boneless)', category: 'chicken', description: 'Skinless boneless chicken breast.', image: '/images/products/chicken-breast.jpg', unit: 'kg', pricePaise: 30000, variants: [{ id: 'v-21a', label: '500g', pricePaise: 15500, unit: 'g', quantity: 500 }, { id: 'v-21b', label: '1 kg', pricePaise: 30000, unit: 'kg', quantity: 1 }], stock: 15, reservedStock: 0, isAvailable: true, isArchived: false },
  { id: 'p-22', shopId: 'shop-4', name: 'Chicken Liver', category: 'chicken', description: 'Fresh chicken liver, great for starters.', image: '/images/products/chicken-liver.jpg', unit: 'g', pricePaise: 8000, variants: [{ id: 'v-22a', label: '250g', pricePaise: 4000, unit: 'g', quantity: 250 }, { id: 'v-22b', label: '500g', pricePaise: 8000, unit: 'g', quantity: 500 }], stock: 10, reservedStock: 0, isAvailable: true, isArchived: false },
  { id: 'p-23', shopId: 'shop-4', name: 'Chicken Leg (Tangri)', category: 'chicken', description: 'Whole chicken legs with thigh. Perfect for tandoori.', image: '/images/products/chicken-leg.jpg', unit: 'kg', pricePaise: 26000, variants: [{ id: 'v-23a', label: '500g (~3 pcs)', pricePaise: 13000, unit: 'g', quantity: 500 }, { id: 'v-23b', label: '1 kg (~6 pcs)', pricePaise: 26000, unit: 'kg', quantity: 1 }], stock: 18, reservedStock: 0, isAvailable: true, isArchived: false },

  // City Fruits House (shop-5)
  { id: 'p-24', shopId: 'shop-5', name: 'Banana (Kola)', category: 'fruits', description: 'Ripe Kathali bananas, naturally sweet.', image: '/images/products/banana.jpg', unit: 'dozen', pricePaise: 6000, variants: [{ id: 'v-24a', label: '6 pcs', pricePaise: 3000, unit: 'piece', quantity: 6 }, { id: 'v-24b', label: '1 dozen', pricePaise: 6000, unit: 'dozen', quantity: 1 }], stock: 40, reservedStock: 0, isAvailable: true, isArchived: false },
  { id: 'p-25', shopId: 'shop-5', name: 'Apple (Shimla)', category: 'fruits', description: 'Crisp Shimla apples from Himachal.', image: '/images/products/apple.jpg', unit: 'kg', pricePaise: 18000, variants: [{ id: 'v-25a', label: '500g (~3 pcs)', pricePaise: 9000, unit: 'g', quantity: 500 }, { id: 'v-25b', label: '1 kg (~6 pcs)', pricePaise: 18000, unit: 'kg', quantity: 1 }], stock: 25, reservedStock: 0, isAvailable: true, isArchived: false },
  { id: 'p-26', shopId: 'shop-5', name: 'Orange (Komola)', category: 'fruits', description: 'Juicy Nagpur oranges. Sweet and tangy.', image: '/images/products/orange.jpg', unit: 'kg', pricePaise: 12000, variants: [{ id: 'v-26a', label: '500g', pricePaise: 6000, unit: 'g', quantity: 500 }, { id: 'v-26b', label: '1 kg', pricePaise: 12000, unit: 'kg', quantity: 1 }], stock: 30, reservedStock: 0, isAvailable: true, isArchived: false },
  { id: 'p-27', shopId: 'shop-5', name: 'Papaya (Pepe)', category: 'fruits', description: 'Ripe papaya, sweet and healthy.', image: '/images/products/papaya.jpg', unit: 'piece', pricePaise: 5000, variants: [{ id: 'v-27a', label: '1 piece (~1 kg)', pricePaise: 5000, unit: 'piece', quantity: 1 }], stock: 15, reservedStock: 0, isAvailable: true, isArchived: false },
  { id: 'p-28', shopId: 'shop-5', name: 'Guava (Peyara)', category: 'fruits', description: 'Crunchy local guavas, rich in vitamin C.', image: '/images/products/guava.jpg', unit: 'kg', pricePaise: 8000, variants: [{ id: 'v-28a', label: '500g', pricePaise: 4000, unit: 'g', quantity: 500 }, { id: 'v-28b', label: '1 kg', pricePaise: 8000, unit: 'kg', quantity: 1 }], stock: 20, reservedStock: 0, isAvailable: true, isArchived: false },
  { id: 'p-29', shopId: 'shop-5', name: 'Watermelon (Tormuj)', category: 'fruits', description: 'Whole watermelon, perfectly ripe.', image: '/images/products/watermelon.jpg', unit: 'piece', pricePaise: 6000, variants: [{ id: 'v-29a', label: '1 piece (~3 kg)', pricePaise: 6000, unit: 'piece', quantity: 1 }], stock: 10, reservedStock: 0, isAvailable: true, isArchived: false },

  // Milk & More Dairy (shop-6)
  { id: 'p-30', shopId: 'shop-6', name: 'Full Cream Milk', category: 'dairy', description: 'Fresh full cream milk, delivered daily from the dairy.', image: '/images/products/milk.jpg', unit: 'litre', pricePaise: 6800, variants: [{ id: 'v-30a', label: '500 ml', pricePaise: 3500, unit: 'ml', quantity: 500 }, { id: 'v-30b', label: '1 litre', pricePaise: 6800, unit: 'litre', quantity: 1 }], stock: 50, reservedStock: 0, isAvailable: true, isArchived: false },
  { id: 'p-31', shopId: 'shop-6', name: 'Paneer', category: 'dairy', description: 'Fresh cottage cheese, soft and creamy.', image: '/images/products/paneer.jpg', unit: 'g', pricePaise: 8000, variants: [{ id: 'v-31a', label: '200g', pricePaise: 8000, unit: 'g', quantity: 200 }, { id: 'v-31b', label: '500g', pricePaise: 19000, unit: 'g', quantity: 500 }], stock: 20, reservedStock: 0, isAvailable: true, isArchived: false },
  { id: 'p-32', shopId: 'shop-6', name: 'Curd (Doi)', category: 'dairy', description: 'Set curd made from full cream milk. Thick and creamy.', image: '/images/products/curd.jpg', unit: 'g', pricePaise: 4000, variants: [{ id: 'v-32a', label: '250g', pricePaise: 4000, unit: 'g', quantity: 250 }, { id: 'v-32b', label: '500g', pricePaise: 7500, unit: 'g', quantity: 500 }], stock: 30, reservedStock: 0, isAvailable: true, isArchived: false },
  { id: 'p-33', shopId: 'shop-6', name: 'Eggs (Dim)', category: 'dairy', description: 'Farm fresh eggs, protein packed.', image: '/images/products/eggs.jpg', unit: 'dozen', pricePaise: 7200, variants: [{ id: 'v-33a', label: '6 pcs', pricePaise: 3600, unit: 'piece', quantity: 6 }, { id: 'v-33b', label: '1 dozen', pricePaise: 7200, unit: 'dozen', quantity: 1 }], stock: 40, reservedStock: 0, isAvailable: true, isArchived: false },
  { id: 'p-34', shopId: 'shop-6', name: 'Ghee (Desi)', category: 'dairy', description: 'Pure cow ghee, aromatic and rich.', image: '/images/products/ghee.jpg', unit: 'g', pricePaise: 12000, variants: [{ id: 'v-34a', label: '200g', pricePaise: 12000, unit: 'g', quantity: 200 }, { id: 'v-34b', label: '500g', pricePaise: 28000, unit: 'g', quantity: 500 }], stock: 15, reservedStock: 0, isAvailable: true, isArchived: false },
  { id: 'p-35', shopId: 'shop-6', name: 'Butter', category: 'dairy', description: 'Fresh salted butter, smooth and creamy.', image: '/images/products/butter.jpg', unit: 'g', pricePaise: 5500, variants: [{ id: 'v-35a', label: '100g', pricePaise: 5500, unit: 'g', quantity: 100 }, { id: 'v-35b', label: '200g', pricePaise: 10000, unit: 'g', quantity: 200 }], stock: 25, reservedStock: 0, isAvailable: true, isArchived: false },

  // Local Mutton House (shop-7)
  { id: 'p-36', shopId: 'shop-7', name: 'Mutton Curry Cut', category: 'mutton', description: 'Bone-in goat meat curry pieces. Ideal for kosha mangsho.', image: '/images/products/mutton-curry.jpg', unit: 'kg', pricePaise: 80000, variants: [{ id: 'v-36a', label: '500g', pricePaise: 40000, unit: 'g', quantity: 500 }, { id: 'v-36b', label: '1 kg', pricePaise: 80000, unit: 'kg', quantity: 1 }], stock: 12, reservedStock: 0, isAvailable: true, isArchived: false, preparationNotes: 'Cleaned and cut. Specify small or large pieces.' },
  { id: 'p-37', shopId: 'shop-7', name: 'Mutton Keema', category: 'mutton', description: 'Freshly minced goat meat for keema and kebabs.', image: '/images/products/mutton-keema.jpg', unit: 'g', pricePaise: 45000, variants: [{ id: 'v-37a', label: '250g', pricePaise: 22500, unit: 'g', quantity: 250 }, { id: 'v-37b', label: '500g', pricePaise: 45000, unit: 'g', quantity: 500 }], stock: 8, reservedStock: 0, isAvailable: true, isArchived: false },
  { id: 'p-38', shopId: 'shop-7', name: 'Mutton Leg (Raan)', category: 'mutton', description: 'Whole leg of goat, perfect for slow roasting or biryani.', image: '/images/products/mutton-leg.jpg', unit: 'kg', pricePaise: 90000, variants: [{ id: 'v-38a', label: '1 piece (~1 kg)', pricePaise: 90000, unit: 'kg', quantity: 1 }], stock: 5, reservedStock: 0, isAvailable: true, isArchived: false, preparationNotes: 'Weight is estimated. Seller confirms actual weight.' },
  { id: 'p-39', shopId: 'shop-7', name: 'Mutton Liver', category: 'mutton', description: 'Fresh goat liver, great for fry and starters.', image: '/images/products/mutton-liver.jpg', unit: 'g', pricePaise: 25000, variants: [{ id: 'v-39a', label: '250g', pricePaise: 12500, unit: 'g', quantity: 250 }], stock: 6, reservedStock: 0, isAvailable: true, isArchived: false },

  // Everyday Essentials (shop-8)
  { id: 'p-40', shopId: 'shop-8', name: 'Dish Wash Liquid', category: 'essentials', description: 'Lemon-scented dish washing liquid.', image: '/images/products/dishwash.jpg', unit: 'ml', pricePaise: 9900, variants: [{ id: 'v-40a', label: '250 ml', pricePaise: 9900, unit: 'ml', quantity: 250 }, { id: 'v-40b', label: '500 ml', pricePaise: 17500, unit: 'ml', quantity: 500 }], stock: 30, reservedStock: 0, isAvailable: true, isArchived: false },
  { id: 'p-41', shopId: 'shop-8', name: 'Laundry Detergent', category: 'essentials', description: 'Washing powder for clean, bright clothes.', image: '/images/products/detergent.jpg', unit: 'kg', pricePaise: 13500, variants: [{ id: 'v-41a', label: '500g', pricePaise: 7000, unit: 'g', quantity: 500 }, { id: 'v-41b', label: '1 kg', pricePaise: 13500, unit: 'kg', quantity: 1 }], stock: 25, reservedStock: 0, isAvailable: true, isArchived: false },
  { id: 'p-42', shopId: 'shop-8', name: 'Toothpaste', category: 'essentials', description: 'Fluoride toothpaste for cavity protection.', image: '/images/products/toothpaste.jpg', unit: 'piece', pricePaise: 9900, variants: [{ id: 'v-42a', label: '100g tube', pricePaise: 9900, unit: 'piece', quantity: 1 }], stock: 40, reservedStock: 0, isAvailable: true, isArchived: false },
  { id: 'p-43', shopId: 'shop-8', name: 'Bathing Soap', category: 'essentials', description: 'Moisturizing bathing soap bar.', image: '/images/products/soap.jpg', unit: 'piece', pricePaise: 4500, variants: [{ id: 'v-43a', label: '1 bar (125g)', pricePaise: 4500, unit: 'piece', quantity: 1 }, { id: 'v-43b', label: '3 bars', pricePaise: 12000, unit: 'pack', quantity: 3 }], stock: 50, reservedStock: 0, isAvailable: true, isArchived: false },
  { id: 'p-44', shopId: 'shop-8', name: 'Shampoo', category: 'essentials', description: 'Anti-dandruff shampoo for daily use.', image: '/images/products/shampoo.jpg', unit: 'ml', pricePaise: 18000, variants: [{ id: 'v-44a', label: '200 ml', pricePaise: 18000, unit: 'ml', quantity: 200 }], stock: 20, reservedStock: 0, isAvailable: true, isArchived: false },
  { id: 'p-45', shopId: 'shop-8', name: 'Floor Cleaner', category: 'essentials', description: 'Disinfecting floor cleaner, pine scent.', image: '/images/products/floor-cleaner.jpg', unit: 'ml', pricePaise: 12000, variants: [{ id: 'v-45a', label: '500 ml', pricePaise: 12000, unit: 'ml', quantity: 500 }, { id: 'v-45b', label: '1 litre', pricePaise: 21000, unit: 'litre', quantity: 1 }], stock: 15, reservedStock: 0, isAvailable: true, isArchived: false },
  { id: 'p-46', shopId: 'shop-8', name: 'Cooking Oil (Soybean)', category: 'essentials', description: 'Refined soybean cooking oil.', image: '/images/products/soybean-oil.jpg', unit: 'litre', pricePaise: 14000, variants: [{ id: 'v-46a', label: '1 litre', pricePaise: 14000, unit: 'litre', quantity: 1 }, { id: 'v-46b', label: '5 litres', pricePaise: 65000, unit: 'litre', quantity: 5 }], stock: 20, reservedStock: 0, isAvailable: true, isArchived: false },
];

// ─── SAMPLE ORDERS (for analytics) ─────────────────────
const now = new Date();
const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600000).toISOString();

function makeStatusHistory(statuses: { s: OrderStatus; hoursAgo: number; note?: string }[]): { status: OrderStatus; timestamp: string; note?: string }[] {
  return statuses.map(({ s, hoursAgo: h, note }) => ({ status: s, timestamp: hoursAgo(h), note }));
}

export const seedOrders: Order[] = [
  {
    id: 'ord-1', orderNumber: 'NB-1001', shopId: 'shop-2', shopName: 'Daily Needs Kirana',
    customerName: 'Demo Customer', customerPhone: '9900000001', customerAddress: '7 Park Lane, Demo Neighbourhood',
    instructions: '', fulfilment: 'delivery', payment: 'cash-on-delivery',
    items: [
      { productId: 'p-7', name: 'Miniket Rice', image: '/images/products/rice.jpg', pricePaise: 31000, unit: 'kg', quantity: 1, variantId: 'v-7b', variantLabel: '5 kg' },
      { productId: 'p-10', name: 'Mustard Oil (Sorisher Tel)', image: '/images/products/mustard-oil.jpg', pricePaise: 18000, unit: 'litre', quantity: 1, variantId: 'v-10b', variantLabel: '1 litre' },
    ],
    subtotalPaise: 49000, deliveryFeePaise: 1500, totalPaise: 50500,
    status: 'delivered',
    statusHistory: makeStatusHistory([
      { s: 'placed', hoursAgo: 72 }, { s: 'accepted', hoursAgo: 71 }, { s: 'preparing', hoursAgo: 70 },
      { s: 'ready', hoursAgo: 69 }, { s: 'out-for-delivery', hoursAgo: 68 }, { s: 'delivered', hoursAgo: 67 },
    ]),
    createdAt: daysAgo(3),
  },
  {
    id: 'ord-2', orderNumber: 'NB-1002', shopId: 'shop-1', shopName: 'Green Basket Vegetables',
    customerName: 'Demo Customer', customerPhone: '9900000001', customerAddress: '7 Park Lane, Demo Neighbourhood',
    instructions: 'Please select firm tomatoes', fulfilment: 'pickup', payment: 'pay-at-shop',
    items: [
      { productId: 'p-1', name: 'Potato (Aloo)', image: '/images/products/potato.jpg', pricePaise: 3000, unit: 'kg', quantity: 2, variantId: 'v-1b', variantLabel: '1 kg' },
      { productId: 'p-3', name: 'Tomato', image: '/images/products/tomato.jpg', pricePaise: 2500, unit: 'g', quantity: 1, variantId: 'v-3a', variantLabel: '500g' },
    ],
    subtotalPaise: 8500, deliveryFeePaise: 0, totalPaise: 8500,
    status: 'collected',
    statusHistory: makeStatusHistory([
      { s: 'placed', hoursAgo: 48 }, { s: 'accepted', hoursAgo: 47 }, { s: 'preparing', hoursAgo: 46 },
      { s: 'ready', hoursAgo: 45 }, { s: 'collected', hoursAgo: 44 },
    ]),
    createdAt: daysAgo(2),
  },
  {
    id: 'ord-3', orderNumber: 'NB-1003', shopId: 'shop-3', shopName: 'Fresh Catch Fish Corner',
    customerName: 'Demo Customer', customerPhone: '9900000001', customerAddress: '7 Park Lane, Demo Neighbourhood',
    instructions: 'Curry cut please', fulfilment: 'delivery', payment: 'cash-on-delivery',
    items: [
      { productId: 'p-15', name: 'Rohu (Rui) Fish', image: '/images/products/rohu.jpg', pricePaise: 22000, unit: 'kg', quantity: 1, variantId: 'v-15b', variantLabel: 'Curry Cut (1 kg)' },
    ],
    subtotalPaise: 22000, deliveryFeePaise: 3000, totalPaise: 25000,
    status: 'delivered',
    statusHistory: makeStatusHistory([
      { s: 'placed', hoursAgo: 26 }, { s: 'accepted', hoursAgo: 25 }, { s: 'preparing', hoursAgo: 24 },
      { s: 'ready', hoursAgo: 23 }, { s: 'out-for-delivery', hoursAgo: 22 }, { s: 'delivered', hoursAgo: 21 },
    ]),
    createdAt: daysAgo(1),
  },
  {
    id: 'ord-4', orderNumber: 'NB-1004', shopId: 'shop-6', shopName: 'Milk & More Dairy',
    customerName: 'Demo Customer', customerPhone: '9900000001', customerAddress: '7 Park Lane, Demo Neighbourhood',
    instructions: '', fulfilment: 'delivery', payment: 'cash-on-delivery',
    items: [
      { productId: 'p-30', name: 'Full Cream Milk', image: '/images/products/milk.jpg', pricePaise: 6800, unit: 'litre', quantity: 2, variantId: 'v-30b', variantLabel: '1 litre' },
      { productId: 'p-33', name: 'Eggs (Dim)', image: '/images/products/eggs.jpg', pricePaise: 7200, unit: 'dozen', quantity: 1, variantId: 'v-33b', variantLabel: '1 dozen' },
    ],
    subtotalPaise: 20800, deliveryFeePaise: 1500, totalPaise: 22300,
    status: 'delivered',
    statusHistory: makeStatusHistory([
      { s: 'placed', hoursAgo: 50 }, { s: 'accepted', hoursAgo: 49 }, { s: 'preparing', hoursAgo: 48 },
      { s: 'ready', hoursAgo: 47 }, { s: 'out-for-delivery', hoursAgo: 46 }, { s: 'delivered', hoursAgo: 45 },
    ]),
    createdAt: daysAgo(2),
  },
  {
    id: 'ord-5', orderNumber: 'NB-1005', shopId: 'shop-4', shopName: 'Farm Fresh Chicken',
    customerName: 'Demo Customer', customerPhone: '9900000001', customerAddress: '7 Park Lane, Demo Neighbourhood',
    instructions: 'Biryani cut please', fulfilment: 'pickup', payment: 'pay-at-shop',
    items: [
      { productId: 'p-20', name: 'Chicken (Whole)', image: '/images/products/chicken-whole.jpg', pricePaise: 22000, unit: 'kg', quantity: 1, variantId: 'v-20b', variantLabel: 'Curry Cut (1 kg)' },
    ],
    subtotalPaise: 22000, deliveryFeePaise: 0, totalPaise: 22000,
    status: 'collected',
    statusHistory: makeStatusHistory([
      { s: 'placed', hoursAgo: 30 }, { s: 'accepted', hoursAgo: 29 }, { s: 'preparing', hoursAgo: 28 },
      { s: 'ready', hoursAgo: 27 }, { s: 'collected', hoursAgo: 26 },
    ]),
    createdAt: daysAgo(1),
  },
  {
    id: 'ord-6', orderNumber: 'NB-1006', shopId: 'shop-2', shopName: 'Daily Needs Kirana',
    customerName: 'Demo Customer', customerPhone: '9900000001', customerAddress: '7 Park Lane, Demo Neighbourhood',
    instructions: '', fulfilment: 'delivery', payment: 'cash-on-delivery',
    items: [
      { productId: 'p-9', name: 'Masoor Dal', image: '/images/products/dal.jpg', pricePaise: 12000, unit: 'kg', quantity: 1, variantId: 'v-9b', variantLabel: '1 kg' },
      { productId: 'p-12', name: 'Sugar', image: '/images/products/sugar.jpg', pricePaise: 4500, unit: 'kg', quantity: 1, variantId: 'v-12a', variantLabel: '1 kg' },
    ],
    subtotalPaise: 16500, deliveryFeePaise: 1500, totalPaise: 18000,
    status: 'rejected',
    statusHistory: makeStatusHistory([
      { s: 'placed', hoursAgo: 20 }, { s: 'rejected', hoursAgo: 19, note: 'Items currently out of stock. Apologies.' },
    ]),
    createdAt: hoursAgo(20),
    rejectionReason: 'Items currently out of stock. Apologies.',
  },
];
