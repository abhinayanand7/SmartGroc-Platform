## Plan: Multi-Role Shop Marketplace

### 1. Extend Types & Data
- Add `Shop`, `User` types to `src/types/index.ts`
- Create `src/data/shops.ts` with sample shops and shop-product mapping

### 2. Auth Context (`src/context/StoreContext.tsx`)
- Extend role to `'customer' | 'shopkeeper' | 'admin'`
- Add `shops`, `users` state with localStorage persistence
- Add shop CRUD methods, user management methods

### 3. Update Login/Register
- Update `LoginPage.tsx` with 3-role selection
- Add `RegisterPage.tsx`

### 4. Customer Flow
- `src/pages/customer/CustomerDashboard.tsx` - Shop list (Zepto-style cards)
- `src/pages/customer/ShopDetailPage.tsx` - Browse shop products, add to cart

### 5. Shopkeeper Flow
- `src/pages/shopkeeper/ShopkeeperDashboard.tsx` - Manage their shop
- `src/pages/shopkeeper/CreateShopPage.tsx` - Create/edit shop

### 6. Admin Flow
- `src/pages/admin/AdminDashboard.tsx` - Full control panel

### 7. Update App.tsx routing
- Role-based route rendering for all 3 roles

### Preserves: All existing features (inventory, cart, expiry, credit, insights, etc.)