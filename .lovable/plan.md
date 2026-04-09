

# SimpleBill — Flutter Implementation Plan for Antigravity

## What This Plan Covers

A downloadable DOCX document containing a comprehensive, copy-paste-ready prompt for Antigravity to build the Flutter version of SimpleBill. The document will be structured as a single detailed technical specification covering:

---

## Document Structure

### 1. Project Overview & Tech Stack
- App name: SimpleBill — retail cash billing app for small Indian shops
- **Flutter** (mobile-first, phone view only — breakpoint < 768px)
- **Firebase Auth** (Email/Password + Google Sign-In)
- **Cloud Firestore** as database
- **mobile_scanner** package for barcode scanning
- **Iconsax** or **Hugeicons** icon library (closest match to Lucide used in web prototype)
- **GetX** for navigation, routing, and dependency injection
- **Riverpod** for state management
- **permission_handler** package for camera permissions
- **MVVM architecture**

### 2. Architecture Specification
- Folder structure following MVVM:
  ```
  lib/
  ├── models/
  ├── views/
  │   ├── screens/
  │   └── widgets/
  ├── viewmodels/
  ├── services/
  ├── repositories/
  └── core/
      ├── routes/
      ├── theme/
      └── utils/
  ```
- GetX route definitions for all 7 screens
- Riverpod providers for cart, transactions, tabs, auth, store settings
- Firebase service layer (AuthService, FirestoreService)
- Permission management flow for camera

### 3. Firestore Data Models & Collections
Document exact Firestore collection structures:
- `users/{uid}` — fullName, email, role, shopId, createdAt
- `shops/{shopId}` — storeName, ownerName, storeId, phone, address, currency, createdAt
- `shops/{shopId}/products/{productId}` — name, price, barcode, category, createdAt, deletedAt
- `shops/{shopId}/transactions/{txId}` — billNumber, customerName, customerPhone, items (array of maps), subtotal, total, paymentMethod, createdAt
- `shops/{shopId}/tabs/{tabId}` — customerName, customerPhone, items, total, paid, status, createdAt, settledAt

### 4. Screen-by-Screen Functional Specification
For each screen (user will provide screenshots separately):

**Login Screen** — Email/password fields, Google sign-in button, link to Register, Firebase Auth integration, validation

**Register Screen** — Shop name, owner name, email, password, phone (optional), Google sign-in, creates both user doc and shop doc in Firestore, generates unique storeId

**Dashboard** — Today's sales total (sum of today's transactions), transaction count, sales chart with 1W/1M/3M toggle (bar chart with mock/aggregated data), recent 4 transactions list (tappable to show detail modal), "View All" navigates to Transactions

**Billing** — Barcode scanner button (uses mobile_scanner with camera permission), collapsible customer details section (name + phone), cart list with quantity +/- controls and remove, subtotal/total display, cash received input with change calculation, "Mark as Paid" (creates transaction, shows receipt), "Save as Tab" (requires customer name, creates tab with partial payment), "Add Item" button opens AddProduct modal (name, price, category, barcode)

**Transactions** — Filter chips: Today, This Week, This Month, Custom, transaction cards showing customer/date/total/items count, "View Details" opens detail modal, "Share" toast, "Load More" pagination (10 at a time)

**Tabs** — List of active (unsettled) tabs showing customer info, total, paid, outstanding, "View Details" modal (full item breakdown + payment summary), "Mark as Paid" modal (enter amount, partial payment updates paid field, full payment settles tab and creates transaction, auto-removes settled tabs), empty state with checkmark when no tabs

**Settings** — Store name, owner name, phone, address (editable), store ID (read-only), currency selector (INR/USD/EUR), export/import data buttons, reset all data with confirmation dialog, app version

**Receipt Modal** — Monospace receipt layout (store name, GST, address, bill details, itemized list, total, payment method, thank you message), Print button, Share button, Close button

**Transaction Detail Modal** — Store name, date/time, customer info (phone partially masked), itemized list, subtotal, total, payment method, Close and Share buttons

### 5. Navigation Structure
- GetX named routes: `/login`, `/register`, `/dashboard`, `/billing`, `/transactions`, `/tabs`, `/settings`
- Bottom navigation bar with 5 tabs: Home, Billing, Transactions, Tabs, Settings
- Auth guard middleware: redirect to `/login` if not authenticated
- Top app bar showing page title + store ID

### 6. Key Business Logic Rules
- Cart: duplicate product scans increment quantity, quantity 0 removes item
- Mark as Paid: disabled if cash received > 0 but < total (insufficient)
- Save as Tab: requires customer name, paid amount = min(cash, total) or 0
- Tab settlement: partial payment updates `paid` field; full payment (amount >= outstanding) settles tab, creates transaction, removes from active tabs
- Receipt bill number: generated as `INV-{timestamp suffix}`

### 7. Permissions
- Camera permission required before barcode scanning (use permission_handler)
- Show rationale dialog if denied, open settings if permanently denied

---

## Output

A single DOCX file (`SimpleBill_Flutter_Implementation_Plan.docx`) written as a ready-to-paste Antigravity prompt, structured so the AI can build each screen with full context of data models, state management, navigation, and business logic.

