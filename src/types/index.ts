export type Category = 'Dairy' | 'Snacks' | 'Household' | 'Beverage' | 'Beauty' | 'Stationery' | 'Fruits' | 'Vegetables';

export type ExpiryStatus = 'safe' | 'near-expiry' | 'critical' | 'expired';

export type UserRole = 'customer' | 'shopkeeper' | 'admin' | 'delivery';

export type DeliveryStatus = 'pending' | 'confirmed' | 'partner_assigned' | 'picked_up' | 'out_for_delivery' | 'delivered';
export type DeliveryMethod = 'pickup' | 'home';
export type PartnerStatus = 'online' | 'offline' | 'on_delivery';
export type VehicleType = 'Bicycle' | 'Bike' | 'Auto';

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  originalPrice: number;
  costPrice?: number;
  quantity: number;
  expiryDate: string;
  addedDate: string;
  image?: string;
  salesCount?: number;
  lastSoldDate?: string;
  shopId?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: 'income' | 'expense';
}

export interface CreditCustomer {
  id: string;
  name: string;
  phone?: string;
  balance: number;
  history: CreditTransaction[];
}

export interface CreditTransaction {
  id: string;
  type: 'credit' | 'payment';
  amount: number;
  description?: string;
  date: string;
}

export interface PurchaseRecord {
  id: string;
  items: { productId: string; productName: string; category: Category; quantity: number; price: number }[];
  total: number;
  date: string;
}

export interface Shop {
  id: string;
  ownerId: string;
  name: string;
  category: string;
  address: string;
  deliveryTime: string;
  rating: number;
  image?: string;
  isApproved: boolean;
  createdAt: string;
}

export interface AppUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  isBlocked: boolean;
}

export interface DeliveryPartner {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  vehicleType: VehicleType;
  status: PartnerStatus;
  rating: number;
  totalDeliveries: number;
  totalEarnings: number;
  todayDeliveries: number;
  todayEarnings: number;
  todayKm: number;
  isApproved: boolean;
  createdAt: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerEmail: string;
  shopId: string;
  shopName: string;
  items: { productId: string; productName: string; category: Category; quantity: number; price: number }[];
  total: number;
  deliveryMethod: DeliveryMethod;
  deliveryFee: number;
  deliveryPartnerId: string | null;
  deliveryPartnerName: string | null;
  deliveryPartnerVehicle: VehicleType | null;
  deliveryPartnerPhone: string | null;
  deliveryStatus: DeliveryStatus;
  estimatedTime: number;
  customerAddress: string;
  date: string;
}

export const CATEGORIES: Category[] = ['Dairy', 'Snacks', 'Household', 'Beverage', 'Beauty', 'Stationery', 'Fruits', 'Vegetables'];

export const SHOP_CATEGORIES = ['Grocery', 'Dairy', 'Fruits & Vegetables', 'Bakery', 'Organic', 'General Store', 'Supermarket', 'Mini Mart'];

export const DELIVERY_STATUS_STEPS: { status: DeliveryStatus; label: string }[] = [
  { status: 'pending', label: 'Order Placed' },
  { status: 'confirmed', label: 'Shop Confirmed' },
  { status: 'partner_assigned', label: 'Partner Assigned' },
  { status: 'picked_up', label: 'Picked Up' },
  { status: 'out_for_delivery', label: 'Out for Delivery' },
  { status: 'delivered', label: 'Delivered' },
];

export const initialDeliveryPartners: DeliveryPartner[] = [
  {
    id: 'dp-1', userId: 'delivery-raju@demo.com', name: 'Raju Chauhan', email: 'raju@demo.com',
    phone: '9876543210', vehicleType: 'Bike', status: 'online', rating: 4.5,
    totalDeliveries: 142, totalEarnings: 8520, todayDeliveries: 5, todayEarnings: 350, todayKm: 22,
    isApproved: true, createdAt: '2026-01-10T10:00:00Z',
  },
  {
    id: 'dp-2', userId: 'delivery-meena@demo.com', name: 'Meena Kumari', email: 'meena@demo.com',
    phone: '9876543211', vehicleType: 'Bicycle', status: 'offline', rating: 4.8,
    totalDeliveries: 89, totalEarnings: 4450, todayDeliveries: 0, todayEarnings: 0, todayKm: 0,
    isApproved: true, createdAt: '2026-02-05T10:00:00Z',
  },
  {
    id: 'dp-3', userId: 'delivery-vikram@demo.com', name: 'Vikram Singh', email: 'vikram@demo.com',
    phone: '9876543212', vehicleType: 'Bike', status: 'on_delivery', rating: 4.2,
    totalDeliveries: 210, totalEarnings: 12600, todayDeliveries: 8, todayEarnings: 560, todayKm: 35,
    isApproved: true, createdAt: '2025-12-01T10:00:00Z',
  },
];

export function maskPhone(phone: string): string {
  if (phone.length < 4) return phone;
  return phone.slice(0, 2) + 'XXXXX' + phone.slice(-3);
}

export function getDeliveryFee(method: DeliveryMethod): number {
  if (method === 'pickup') return 0;
  return 20 + Math.floor(Math.random() * 21); // ₹20-₹40
}

export function getExpiryStatus(expiryDate: string): ExpiryStatus {
  const now = new Date();
  const expiry = new Date(expiryDate);
  const daysLeft = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (daysLeft <= 0) return 'expired';
  if (daysLeft <= 3) return 'critical';
  if (daysLeft <= 7) return 'near-expiry';
  return 'safe';
}

export function getDaysLeft(expiryDate: string): number {
  const now = new Date();
  const expiry = new Date(expiryDate);
  return Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function getExpiryPercentage(addedDate: string, expiryDate: string): number {
  const added = new Date(addedDate).getTime();
  const expiry = new Date(expiryDate).getTime();
  const now = Date.now();
  const total = expiry - added;
  const elapsed = now - added;
  if (total <= 0) return 100;
  return Math.min(100, Math.max(0, (elapsed / total) * 100));
}

export function getSmartDiscount(expiryDate: string): number {
  const status = getExpiryStatus(expiryDate);
  switch (status) {
    case 'expired': return 50;
    case 'critical': return 40;
    case 'near-expiry': return 20;
    default: return 0;
  }
}

export function getDiscountedPrice(product: Product): number {
  const discount = getSmartDiscount(product.expiryDate);
  return Math.round(product.originalPrice * (1 - discount / 100));
}

export function getAlternativeProducts(products: Product[], category: Category, excludeId: string): Product[] {
  return products.filter(p => p.category === category && p.id !== excludeId && p.quantity > 0 && getExpiryStatus(p.expiryDate) !== 'expired');
}

export function isSlowMoving(product: Product): boolean {
  if (!product.lastSoldDate) return true;
  const daysSinceSold = Math.ceil((Date.now() - new Date(product.lastSoldDate).getTime()) / (1000 * 60 * 60 * 24));
  return daysSinceSold > 10;
}

export function getProductProfit(product: Product): number {
  const cost = product.costPrice ?? Math.round(product.originalPrice * 0.6);
  return getDiscountedPrice(product) - cost;
}

export function getShelfPriority(product: Product): { priority: 'high' | 'medium' | 'low'; reason: string } {
  const status = getExpiryStatus(product.expiryDate);
  if (status === 'critical' || status === 'near-expiry') return { priority: 'high', reason: 'Expiring soon' };
  if ((product.salesCount ?? 0) > 10) return { priority: 'high', reason: 'High demand' };
  if (isSlowMoving(product)) return { priority: 'medium', reason: 'Slow moving — needs promotion' };
  return { priority: 'low', reason: 'Normal shelf placement' };
}

export function getRushLevel(): { level: 'Low' | 'Medium' | 'High'; color: string } {
  const hour = new Date().getHours();
  if ((hour >= 18 && hour <= 20) || (hour >= 10 && hour <= 12)) return { level: 'High', color: 'text-destructive' };
  if ((hour >= 16 && hour < 18) || (hour >= 12 && hour < 14)) return { level: 'Medium', color: 'text-warning' };
  return { level: 'Low', color: 'text-safe' };
}
