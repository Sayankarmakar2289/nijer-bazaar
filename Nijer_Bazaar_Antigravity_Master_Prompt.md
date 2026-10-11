# NIJER BAZAAR — MASTER ANTIGRAVITY BUILD PROMPT

**Project:** Nijer Bazaar (নিজের বাজার)  
**Tagline:** Your Market. Your Way.  
**Bengali tagline:** নিজের বাজার, নিজের মতো  
**Deliverable:** One polished, fully interactive demo web application connecting the customer storefront and seller dashboard.

> **INSTRUCTIONS FOR GOOGLE ANTIGRAVITY:** Act as a senior full-stack engineer, product designer, accessibility specialist, and QA engineer. Build and test the application in the workspace. Do not merely describe, scaffold, or provide screenshots. The demo is for showing potential customers and shopkeepers how the future business will work. All shops, prices, reviews, orders, sales, and payments must be marked fictional or illustrative. No live orders, real payment processing, or fake claims of operating partnerships.

---

## 1. Product vision and demo goals

Nijer Bazaar is a mobile-first hyperlocal marketplace connecting consumers with existing neighbourhood shops in India. It supports groceries/kirana, vegetables, fruits, chicken, mutton, fish, dairy, eggs, and everyday essentials. Shops retain their own inventory; the marketplace helps customers discover nearby sellers and place orders for pickup or delivery where available.

The demo is successful only if a potential customer or vendor can understand it in five minutes and the following flows work end to end:

1. Customer selects a shop, adds items, and places a **simulated** order.
2. The order appears in the **corresponding seller's** dashboard.
3. Seller accepts and prepares the order, and its status updates on the customer's tracking screen.
4. Seller changes a price or stock availability; customer-facing listings reflect the update.
5. Seller pauses ordering; the customer sees ordering disabled for that shop.
6. All demo data persists after browser refresh and can be restored using **Reset Demo**.

Prioritize a gorgeous, reliable product over unnecessary features. Do **not** build a warehouse, delivery dispatch system, microservices, live payments, OTP service, or AI recommendation engine.

## 2. Tech stack and runtime requirements

Use compatible current stable releases of:

- Next.js App Router, React, strict TypeScript
- Tailwind CSS and shadcn/ui components
- Lucide icons
- Manrope for English and Hind Siliguri for Bengali
- Zustand for shared state with explicit versioned localStorage persistence
- React Hook Form + Zod for validated forms
- Recharts for meaningful seller analytics
- Motion/Framer Motion **only for lightweight interaction animations**
- Next.js Image for optimized product photos if properly configured
- Built-in Next.js routing and Vercel-compatible build

Start with a local demo, **no external database or paid API**. Provide seeded JSON/TypeScript data and reusable components. SSR/CSR hydration must be handled carefully for localStorage, time-dependent data, and user-selected locales. Synchronize changes among tabs in the same browser where feasible; explain clearly that **different devices will not synchronize** without a hosted backend.

Use integer paise (not floating-point rupees) for monetary calculations. Use robust TypeScript domain models and separate seed data, logic, and presentation. Include no real credentials, secret keys, external phone messages, or payment collection.

## 3. Brand identity and distinctive UI

The design must be original: a **warm, modern neighbourhood market** aesthetic, not a copy of Blinkit, Zepto, or Swiggy. It should evoke freshness, trust, lively local commerce, and premium yet accessible technology.

### Mandatory design tokens

| Token | Hex | Usage |
|---|---|---|
| Forest Teal | `#123F3A` | Brand, primary actions, seller sidebar, headlines |
| Fresh Lime | `#CBF379` | Secondary CTAs, visual accents, active emphasis |
| Warm Ivory | `#FFF9ED` | Customer page background |
| Market Coral | `#FF8068` | Limited promotional highlights, illustrations |
| Deep Ink | `#1A302D` | Main dark text |
| Soft Sage | `#E8F3E9` | Seller dashboard background, subtle panels |
| White | `#FFFFFF` | Product cards and surfaces |
| Muted Slate | `#64748B` | Secondary text |
| Soft Border | `#E4EAE3` | Borders |
| Success | `#16865D` | Positive status |
| Warning | `#D97706` | Attention status |
| Error | `#DC4545` | Errors and destructive actions |

Ensure AA contrast for text and controls, especially on lime and coral backgrounds. Use Manrope + Hind Siliguri with a strong typographic scale. Cards: ~16–20px radius; buttons: ~10–14px radius. Use meaningful asymmetry and whitespace, not repetitive generic cards or gaudy gradients. Use crisp high-quality legitimately reusable product imagery or locally authored SVG illustrations and graceful fallbacks.

Create original vector brand assets:

- Horizontal `nijer bazaar.` wordmark
- Small favicon/app symbol inspired by a simple market stall roof / shopping basket
- Dark-on-light and light-on-dark variants

Customer website: ivory backgrounds, deep-teal navigation/CTA, vibrant category visuals, mobile-first product cards. Seller portal: sage background, clean panels, bold operational controls, deep-teal navigation, mobile card alternatives to desktop tables.

Respect reduced-motion preferences. Add focus indicators, working hover/pressed states, appropriate skeleton states, notifications, and empty/error states.

## 4. Information architecture and routes

Build **one** Next.js application with two connected interfaces plus a demo control centre:

**Customer**

- `/` — marketing + storefront homepage
- `/shops` — neighbourhood shop directory
- `/shops/[slug]` — shop details and products
- `/categories/[slug]` — category products/shops
- `/products/[id]` — product details and variants
- `/cart` — single-shop shopping cart
- `/checkout` — simulated checkout
- `/orders` — customer demo order history
- `/orders/[id]` — order tracking
- `/account` — demo customer profile
- `/help` — FAQs/support demonstration

**Seller**

- `/become-a-seller` — vendor value proposition + interest form
- `/seller` or `/seller/login` — **demo shop selector**, not actual authentication
- `/seller/dashboard` — seller homepage
- `/seller/orders` and `/seller/orders/[id]` — order operations
- `/seller/products` and `/seller/products/new` — product management
- `/seller/inventory` — stock adjustments
- `/seller/analytics` — sales/orders charts
- `/seller/store` — shop profile and hours
- `/seller/settings` — configuration

**Demo**

- `/demo/control-center` — guided customer→seller demos, active role/shop selection, reset demo

Provide sensible not-found routes, responsive layouts, deep linking, and refresh-safe behaviour. All visible links must route somewhere useful or be explicitly disabled with an explanation.

## 5. Customer homepage — premium experience

### Header/navigation

Desktop: logo, Explore Shops, Categories, How It Works, Become a Seller, location selector, search, Orders, account, cart. Sticky with understated scroll behaviour.

Mobile: performant header + bottom navigation Home / Shops / Search / Orders / Account, with visible cart indicator and sticky cart subtotal when relevant.

### Hero

**Headline:** “Your Neighbourhood Market, Now Online.”  
**Subheadline:** “From fresh vegetables and daily groceries to fish, meat and everyday essentials — discover and shop from your favourite local stores.”  
**Buttons:** “Explore Nearby Shops” and “See How It Works”

Add an original illustrated market/product composition, limited tasteful motion, and a fictional demo location selector defaulting to **Demo Neighbourhood, Kolkata** (not a real service commitment).

### Sections

1. Shop by Category: Grocery, Vegetables, Fruits, Chicken, Mutton, Fish, Dairy & Eggs, Daily Essentials — distinctive illustrated tiles and working routes.
2. “Your favourite shops, closer than ever.” — featured **fictional** shops with pictures, category, illustrative distance, hours, available pickup/delivery, and CTA.
3. Featured products — image, seller, quantity/unit, price, stock, Add button.
4. Useful editorial tiles: “Fresh from Your Neighbourhood”, “Everyday Essentials”, “Pick Up Nearby”; don't imply unverified discounts or speed.
5. How It Works: Discover → Add to Cart → Pickup or Delivery.
6. Merchant CTA: “Your Shop Deserves to Be Online.” → “Become a Seller”.
7. FAQs, About, Help, Terms/Privacy placeholder text clearly labelled prototype.

Do not create fake testimonials, store ratings, order counts, customers, or partnership statistics.

## 6. Shop discovery and catalogue

### Shop listing

Search and filter locally by keyword, category, open status, pickup availability, delivery availability, and illustrative distance. Sort by name/distance, with deterministic sample results. Design beautiful shop cards with operating status, banner, description, and clear entry point.

### Shop profile

Show name, banner, logo, description, category, fictional address, opening schedule, pickup/delivery availability, products by category, in-shop search, availability, and a clear paused/closed state. Derive demo opening times consistently and make them understandable.

### Product cards/detail

For each product: coherent image, name, category, shop, unit, variant, INR price, availability, Add control; support quantities in kg, grams, litre, pieces, dozen, pack. Detailed pages have image(s), seller, description, configurable weight/variant, quantity, and related items.

Fresh chicken/fish/mutton products can have selection for whole/cut, cleaning, preparation notes, and estimated weight. Show *estimated price* until a seller confirms actual weight; never imply live weighing/payment.

Product images must match their actual categories. Avoid random stock images, watermarks and broken assets.

## 7. Single-shop cart and simulated checkout

Cart supports add/remove, +/- quantity, clear cart, validations, subtotal, delivery fee, order total, availability warnings. **One shop per cart.** If a user adds items from another shop, show a confirmation modal: “Keep Current Cart” / “Start New Cart”.

Checkout fields: demo customer name, fictional phone number, address, optional instructions, pickup/delivery selection, order summary. Payment options only **“Cash on Delivery (Simulation)”** or **“Pay at Shop (Simulation)”**. Do not ask for card numbers, bank details, real UPI IDs, or send a transaction to any server.

On order submission:

1. Validate fields and current stock.
2. Assign a unique demo order number.
3. Snapshot price/name/quantity/unit and fulfilment method into the order.
4. Make a consistent stock **reservation** in demo state.
5. Persist the order.
6. Navigate to confirmation/tracking.
7. Ensure the order appears only for its own seller.

Show a clear status timeline:

- Delivery: Placed → Accepted → Preparing → Ready → Out for Delivery → Delivered
- Pickup: Placed → Accepted → Preparing → Ready for Pickup → Collected
- Rejected / Cancelled: terminal states with reasons; restore reserved stock where appropriate.

Allow demo order history and reorder, using the *current* product price/availability for newly created carts. Customer cancellation request can operate only at sensible early states; handle statuses consistently.

## 8. Seller demo login and dashboard

Seller login is **a demo shop selection screen**, not secure production authentication. Clearly label it. Include a prominent role switcher and currently selected shop name. A selected seller must see only that shop's data.

Seller dashboard widgets computed from shared demo state:

- Today's Orders
- Pending Orders
- Completed Orders
- Today's Sales Value
- Total Products
- Low/Out-of-Stock Products
- Recent Orders
- Popular Products
- Illustrative Sales Trend

Quick actions: View Orders, Add Product, Update Stock, Pause/Resume Shop. Keep layouts friendly for time-pressed, non-technical shopkeepers; main actions must be large and obvious on Android mobile screens.

## 9. Seller order operations — top priority

Create tabs New, Accepted, Preparing, Ready, Completed, Cancelled. Each order shows number, time, customer demo display name, items, quantities, subtotal/fees, payment mode, fulfilment mode, notes, status.

Permitted actions as relevant:

- Accept
- Reject with reason
- Start Preparing
- Mark Ready / Ready for Pickup
- Mark Out for Delivery (delivery only)
- Mark Delivered / Collected
- View Details

Confirm destructive actions. Enforce valid transitions; completed/rejected/cancelled orders must not be fulfilled again. Rejecting/cancelling restores reserved inventory without double-restocking. For variable-weight products, seller can confirm actual quantity and revise simulated amount with a visible customer-facing adjustment; no real payment adjustment.

An order placed in the customer interface **must instantly become visible after switching into the correct seller account**. Seller status updates **must reflect** on the customer's existing order detail page.

## 10. Seller products and inventory

Products page supports search/filter, category, name, photo, price, unit, stock, status, and actions. Implement Add, Edit, Archive/Delete, Stock +/- adjustment, Mark Out of Stock, Restore. Validate price ≥ 0, sensible units/quantities, and required fields. Product photos can be selected from a bundled/demo gallery or previewed as temporary local files; do not falsely claim permanent cloud upload.

Inventory dashboard: total SKUs, low stock, out of stock, adjustments, editable availability, fast restock controls, basic movement history. Make the distinction between available stock and reserved stock explicit in code and suitably simplified in UI. A seller's stock changes must update the correct customer-facing product listing immediately.

Handle offline walk-in sales only as optional seller-entered stock adjustments; do not claim POS integration.

## 11. Seller store and analytics

### Store settings

Edit shop name/description/category, fictional address, demo contact, opening hours, pickup/delivery toggles, **Pause Orders** and **Reopen**. A paused shop must show a clear customer-facing message and block new checkout, while existing orders can still be managed.

### Sales analytics

Use Recharts to show daily orders, order-value trend, category mix, top-selling demo items, completed/cancelled breakdown. Date filters if straightforward. All data must come from seeded/orders state; no fabricated real traction. Distinguish:

- Gross merchandise/order value (GMV)
- Illustrative commission
- Seller proceeds (simplified)
- Delivery charges

Never confuse product sales with the platform's revenue. Clearly mark any commission percentages as editable demo assumptions.

## 12. Seller acquisition landing page

`/become-a-seller`: premium lead-generation presentation with headline **“Bring Your Neighbourhood Shop Online.”** Explain digital storefronts, order handling, simple stock updates, and demo insights; make no guaranteed income claims.

Demo interest form: owner name, shop name, category, locality, phone (encourage fake/demo details), current delivery availability, brief notes, consent notice. Locally save submissions; show that they are **not actually sent to the company**. No sensitive KYC or identification-document collection.

## 13. Demo control center and guided pitch

Create `/demo/control-center` with:

- Customer / Seller role switcher
- Seller selector for seeded shops
- Guided buttons for end-to-end scenarios
- Clear demo mode notice
- Reset Demo Data button with confirm dialog

**Scenario A — Order flow:** customer shops at demo kirana store → selects rice/mustard oil → checkout → seller accepts → prepares → completes → customer sees updates.

**Scenario B — Stock:** seller sets a product unavailable → customer cannot add it.

**Scenario C — Price:** seller updates item price → fresh cart and product listings show new price; existing orders preserve snapshot prices.

**Scenario D — Pause:** seller pauses shop → new ordering disabled → shop reopens → ordering enabled.

Persist demo state after refresh. Reset should restore the complete dataset and active demo defaults without dangling stale references.

## 14. Sample fictional content

Default fictional location: **Demo Neighbourhood, Kolkata**. Seed **8 explicitly fictional shops**:

1. Green Basket Vegetables
2. Daily Needs Kirana
3. Fresh Catch Fish Corner
4. Farm Fresh Chicken
5. City Fruits House
6. Milk & More Dairy
7. Local Mutton House
8. Everyday Essentials

Seed **60–80 realistic products** across rice, atta, dal, mustard oil, spices, potato, onion, tomato, brinjal, cauliflower, banana, apple, orange, chicken variations, Rohu, Katla, prawns, mutton cuts, milk, paneer, curd, eggs, etc. Include realistic-looking **illustrative** Indian rupee prices, correct units, images, stock quantities, descriptions, categories, banners, schedules, and different availability states. Add meaningful sample orders per shop with valid lifecycle statuses and history for analytics.

Sample values (NOT live market data): Rice ₹65/kg, Potato ₹30/kg, Mustard Oil ₹180/litre, Eggs ₹72/dozen, Chicken ₹220/kg, Rohu ₹200/kg, Mutton ₹800/kg. Clearly tag prices as demo-only.

Use coherent fictional identities; never claim shops are actual Nijer Bazaar partners.

## 15. English and Bengali readiness

Create translation dictionaries and a working language toggle for primary customer UI including nav, category names, cart and checkout. Support correct Bengali text rendering with Hind Siliguri. Seller may be English-first but use a central i18n structure. Avoid incomplete mixed-language interfaces; gracefully fall back to English for untranslated strings.

## 16. Responsive, accessible, high-quality UX

Test at 375px, 430px, 768px, 1280px, and 1440px. No sideways overflow. Minimum comfortable tap targets, appropriate color contrast, labels, keyboard navigation, aria labels, focus states, descriptive validation, loading/empty/error UI.

**Customer details:** bottom nav, sticky cart CTA, beautiful search/filter UX, visible shop status, limited cart motion, order-success page, clear price breakdown.

**Seller details:** simple mobile order cards instead of overflowed tables, prominent accept/reject buttons, fast inline stock controls, status markers, responsive charts, confirmation toasts.

Don't invent functionality for visual polish. All main visible CTAs must have a real demo action.

## 17. Suggested domain types / logic

Define typed models for:

- DemoCustomer, DemoSeller, Shop, ShopHours
- Category, Product, ProductVariant
- InventoryRecord, InventoryMovement, Reservation
- Cart, CartItem
- Order, OrderItem, OrderStatusEvent
- Pickup/DeliveryMethod, DemoPaymentMethod
- SellerSettings, SellerInterestForm

Important invariants:

1. Store currency amounts as integer paise; format in INR in the UI.
2. Single vendor per cart/order.
3. Preserve price and item snapshots in submitted orders.
4. Keep inventory conservation consistent on order acceptance, rejection, cancellation, completion.
5. Seller sees and edits only selected shop's data **within the demo experience** (not secure auth).
6. Persist versioned state; recover from corrupted localStorage by offering reset.
7. When a shop is paused or product unavailable, block **new** ordering.
8. Avoid duplicate order submission and repeated stock deductions.
9. Never present state updates across two different devices as real-time with localStorage.
10. Don't calculate analytics from placeholder numbers unrelated to actual seed/order state.

## 18. Security and honest demo boundaries

The application is a local, publicly demonstrable prototype, not a system ready to accept actual customer orders. Prominently display:

> **Interactive Demo — All shops, products, prices, customers, and orders are fictional. No real payments or transactions.**

No live personal information collection, server storage, production auth, payment integrations, settlement claims, delivery partner dispatch, or misleading success claims. Provide a short privacy/demo disclaimer. If deployed publicly, all interactions remain simulated; do not expose real administrative functions or pretend the seller role switcher is secure.

## 19. Suggested code organization

```text
src/
  app/
    (customer)/
    seller/
    become-a-seller/
    demo/control-center/
  components/
    ui/
    shared/
    customer/
    seller/
    demo/
  data/
    seed/
  lib/
    cart/
    orders/
    inventory/
    formatting/
    validation/
  store/
  hooks/
  types/
  translations/
  styles/
public/
  images/
  branding/
README.md
```

Adjust route group organization as needed, but keep the domain logic separate from UI components. Use sensible abstractions, not premature microservices.

## 20. Implementation sequence — finish all phases

### Phase 1: Foundation and design system

1. Inspect existing workspace.
2. Set up Next.js app and dependencies.
3. Define colours, typography, spacing, responsive shell, logo assets.
4. Define types and seed fictional products, shops and orders.
5. Build shared state management with versioned persistence and reset.

### Phase 2: Customer interface

6. Build responsive homepage, categories and shop discovery.
7. Build shop/product detail and functional filters.
8. Implement single-shop cart and simulated checkout.
9. Implement order confirmation/history/tracking.

### Phase 3: Seller interface

10. Build demo seller selector and dashboard.
11. Implement order acceptance/rejection/preparation/completion.
12. Implement product/price/stock management.
13. Implement shop pause/settings and analytics.

### Phase 4: Connected flows

14. Connect customer checkout to the correct seller's order list.
15. Connect vendor status to customer tracking.
16. Connect stock/price changes to storefront.
17. Add demo control center, guided scenarios, reset.

### Phase 5: Polish and QA

18. Improve UI consistency, images, responsive layouts, loading/empty states.
19. Add working English/Bengali primary UI switch.
20. Test and fix all major workflows across sizes and page refresh.
21. Run lint, typecheck, and production build.
22. Provide setup, deployment and demo instructions.

Do not stop after finishing the homepage or creating dummy dashboards. The key metric is **a working customer-to-seller demo**.

## 21. Mandatory functional acceptance tests

Run and report pass/fail for:

**Customer**
- Homepage, categories, shop routes and search render.
- Filters and sort work.
- Product details show correct shop/price/unit/stock.
- Cart add/remove/quantity and one-shop enforcement work.
- Checkout validation and simulated order creation work.
- Customer sees new order and a tracking timeline.

**Seller**
- Seller selector selects a specific seeded shop.
- Correct incoming order appears only at corresponding seller.
- Seller can accept, reject, prepare and complete relevant orders.
- Invalid status transitions are blocked.
- Product add/edit, price changes, inventory updates work.
- Shop pause/resume impacts checkout.
- Analytics reflect seed and demo order data.

**Integration/persistence**
- Customer submits order; selected seller sees same ID/items/amount.
- Seller status update reflects in customer order tracking.
- Price change reflects in customer catalog but not old orders.
- Inventory update reflects in storefront; out-of-stock purchasing blocked.
- Rejection/cancellation releases inventory exactly once.
- Refresh preserves demo session and orders.
- Reset restores all seed data coherently.
- Cross-tab changes sync in the same browser where implemented.

**Quality**
- No broken links or images.
- No unhandled React/TypeScript/hydration errors.
- No horizontal overflow at target screen widths.
- Keyboard interactions and contrast are usable.
- `npm run build` succeeds.
- Explain any unavailable test execution honestly.

## 22. Final handoff

At completion, deliver:

1. Actual complete runnable source code in workspace.
2. Local setup/run commands and dependency information.
3. Customer and Seller demo URLs/routes.
4. A scripted **five-minute investor/vendor presentation** showing live demo order flow.
5. Explanation of how seeded data and Reset work.
6. Vercel deployment steps and environment-variable expectations (ideally none for local prototype).
7. Features completed and test results.
8. Clear limitations: local browser demo, no cross-device sync, no real auth/payments/inventory integrations.
9. Recommendation for next phase: hosted database (e.g. Supabase/Postgres), real role-based auth, real-time seller/customer sync **only when needed**.

**Definition of done:** Nijer Bazaar looks premium, works on phones, and customer → order → seller → fulfillment → customer tracking is genuinely interactive, with pricing and inventory consistency. Finish implementation, test, and fix errors before claiming completion.
