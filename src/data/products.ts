import { Product } from '@/types';

const today = new Date();
const daysFromNow = (days: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};
const daysAgo = (days: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0];
};

export const initialProducts: Product[] = [
  // ===== Shop 1: Fresh Mart (Supermarket) =====
  { id: '1', name: 'Amul Milk 500ml', category: 'Dairy', price: 28, originalPrice: 28, costPrice: 24, quantity: 15, expiryDate: daysFromNow(2), addedDate: daysAgo(10), shopId: 'shop-1', salesCount: 45 },
  { id: '2', name: 'Paneer 200g', category: 'Dairy', price: 85, originalPrice: 85, costPrice: 65, quantity: 8, expiryDate: daysFromNow(1), addedDate: daysAgo(7), shopId: 'shop-1', salesCount: 12 },
  { id: '3', name: 'Dettol Soap', category: 'Household', price: 45, originalPrice: 45, costPrice: 32, quantity: 50, expiryDate: daysFromNow(120), addedDate: daysAgo(60), shopId: 'shop-1', salesCount: 30 },
  { id: '4', name: 'Amul Butter 100g', category: 'Dairy', price: 55, originalPrice: 55, costPrice: 42, quantity: 10, expiryDate: daysFromNow(5), addedDate: daysAgo(10), shopId: 'shop-1', salesCount: 22 },
  { id: '5', name: 'Surf Excel 1kg', category: 'Household', price: 230, originalPrice: 230, costPrice: 185, quantity: 25, expiryDate: daysFromNow(365), addedDate: daysAgo(30), shopId: 'shop-1', salesCount: 8 },
  { id: '6', name: 'Tata Salt 1kg', category: 'Household', price: 28, originalPrice: 28, costPrice: 20, quantity: 40, expiryDate: daysFromNow(300), addedDate: daysAgo(45), shopId: 'shop-1', salesCount: 15 },
  { id: '7', name: 'Curd 400g', category: 'Dairy', price: 40, originalPrice: 40, costPrice: 30, quantity: 12, expiryDate: daysFromNow(3), addedDate: daysAgo(2), shopId: 'shop-1', salesCount: 18 },
  { id: '8', name: 'Vim Liquid 500ml', category: 'Household', price: 99, originalPrice: 99, costPrice: 75, quantity: 30, expiryDate: daysFromNow(200), addedDate: daysAgo(20), shopId: 'shop-1', salesCount: 5 },
  { id: '9', name: 'Cheese Slice Pack', category: 'Dairy', price: 120, originalPrice: 120, costPrice: 90, quantity: 6, expiryDate: daysFromNow(6), addedDate: daysAgo(5), shopId: 'shop-1', salesCount: 10 },
  { id: '10', name: 'Harpic 500ml', category: 'Household', price: 85, originalPrice: 85, costPrice: 62, quantity: 20, expiryDate: daysFromNow(250), addedDate: daysAgo(15), shopId: 'shop-1', salesCount: 7 },
  { id: '11', name: 'Mother Dairy Lassi', category: 'Beverage', price: 30, originalPrice: 30, costPrice: 22, quantity: 18, expiryDate: daysFromNow(2), addedDate: daysAgo(1), shopId: 'shop-1', salesCount: 25 },
  { id: '12', name: 'Ghee 500ml', category: 'Dairy', price: 350, originalPrice: 350, costPrice: 280, quantity: 5, expiryDate: daysFromNow(90), addedDate: daysAgo(10), shopId: 'shop-1', salesCount: 3 },
  { id: '13', name: 'Colin Glass Cleaner', category: 'Household', price: 75, originalPrice: 75, costPrice: 55, quantity: 15, expiryDate: daysFromNow(180), addedDate: daysAgo(25), shopId: 'shop-1', salesCount: 4 },
  { id: '14', name: 'Bread Loaf', category: 'Snacks', price: 45, originalPrice: 45, costPrice: 32, quantity: 20, expiryDate: daysFromNow(1), addedDate: daysAgo(2), shopId: 'shop-1', salesCount: 35 },
  { id: '15', name: 'Maaza 600ml', category: 'Beverage', price: 35, originalPrice: 35, costPrice: 25, quantity: 30, expiryDate: daysFromNow(60), addedDate: daysAgo(10), shopId: 'shop-1', salesCount: 20 },

  // ===== Shop 2: Green Basket (Fruits & Vegetables) =====
  { id: '16', name: 'Fresh Apples 1kg', category: 'Fruits', price: 180, originalPrice: 180, costPrice: 130, quantity: 30, expiryDate: daysFromNow(8), addedDate: daysAgo(2), shopId: 'shop-2', salesCount: 14 },
  { id: '17', name: 'Bananas 1 dozen', category: 'Fruits', price: 50, originalPrice: 50, costPrice: 35, quantity: 40, expiryDate: daysFromNow(3), addedDate: daysAgo(1), shopId: 'shop-2', salesCount: 30 },
  { id: '18', name: 'Organic Spinach 500g', category: 'Vegetables', price: 40, originalPrice: 40, costPrice: 25, quantity: 20, expiryDate: daysFromNow(2), addedDate: daysAgo(1), shopId: 'shop-2', salesCount: 18 },
  { id: '19', name: 'Tomatoes 1kg', category: 'Vegetables', price: 35, originalPrice: 35, costPrice: 20, quantity: 50, expiryDate: daysFromNow(5), addedDate: daysAgo(2), shopId: 'shop-2', salesCount: 40 },
  { id: '20', name: 'Onions 1kg', category: 'Vegetables', price: 30, originalPrice: 30, costPrice: 18, quantity: 60, expiryDate: daysFromNow(15), addedDate: daysAgo(3), shopId: 'shop-2', salesCount: 50 },
  { id: '21', name: 'Green Grapes 500g', category: 'Fruits', price: 90, originalPrice: 90, costPrice: 60, quantity: 15, expiryDate: daysFromNow(4), addedDate: daysAgo(1), shopId: 'shop-2', salesCount: 8 },
  { id: '22', name: 'Potatoes 2kg', category: 'Vegetables', price: 50, originalPrice: 50, costPrice: 30, quantity: 70, expiryDate: daysFromNow(20), addedDate: daysAgo(5), shopId: 'shop-2', salesCount: 35 },
  { id: '23', name: 'Carrots 500g', category: 'Vegetables', price: 35, originalPrice: 35, costPrice: 22, quantity: 25, expiryDate: daysFromNow(6), addedDate: daysAgo(2), shopId: 'shop-2', salesCount: 12 },
  { id: '24', name: 'Mangoes 1kg', category: 'Fruits', price: 250, originalPrice: 250, costPrice: 180, quantity: 10, expiryDate: daysFromNow(3), addedDate: daysAgo(1), shopId: 'shop-2', salesCount: 6 },
  { id: '25', name: 'Cucumber 500g', category: 'Vegetables', price: 25, originalPrice: 25, costPrice: 15, quantity: 35, expiryDate: daysFromNow(4), addedDate: daysAgo(1), shopId: 'shop-2', salesCount: 22 },
  { id: '26', name: 'Capsicum 250g', category: 'Vegetables', price: 40, originalPrice: 40, costPrice: 28, quantity: 18, expiryDate: daysFromNow(5), addedDate: daysAgo(2), shopId: 'shop-2', salesCount: 9 },
  { id: '27', name: 'Watermelon 1pc', category: 'Fruits', price: 60, originalPrice: 60, costPrice: 35, quantity: 8, expiryDate: daysFromNow(2), addedDate: daysAgo(1), shopId: 'shop-2', salesCount: 5 },
  { id: '28', name: 'Pomegranate 500g', category: 'Fruits', price: 120, originalPrice: 120, costPrice: 85, quantity: 12, expiryDate: daysFromNow(7), addedDate: daysAgo(2), shopId: 'shop-2', salesCount: 7 },
  { id: '29', name: 'Broccoli 250g', category: 'Vegetables', price: 55, originalPrice: 55, costPrice: 38, quantity: 10, expiryDate: daysFromNow(3), addedDate: daysAgo(1), shopId: 'shop-2', salesCount: 4 },
  { id: '30', name: 'Mushrooms 200g', category: 'Vegetables', price: 45, originalPrice: 45, costPrice: 30, quantity: 14, expiryDate: daysFromNow(1), addedDate: daysAgo(1), shopId: 'shop-2', salesCount: 11 },

  // ===== Shop 3: Daily Dairy =====
  { id: '31', name: 'Amul Gold Milk 1L', category: 'Dairy', price: 68, originalPrice: 68, costPrice: 58, quantity: 40, expiryDate: daysFromNow(3), addedDate: daysAgo(1), shopId: 'shop-3', salesCount: 60 },
  { id: '32', name: 'Amul Taaza 500ml', category: 'Dairy', price: 25, originalPrice: 25, costPrice: 20, quantity: 50, expiryDate: daysFromNow(2), addedDate: daysAgo(1), shopId: 'shop-3', salesCount: 55 },
  { id: '33', name: 'Amul Masti Curd 400g', category: 'Dairy', price: 35, originalPrice: 35, costPrice: 26, quantity: 20, expiryDate: daysFromNow(2), addedDate: daysAgo(1), shopId: 'shop-3', salesCount: 28 },
  { id: '34', name: 'Mother Dairy Dahi 1kg', category: 'Dairy', price: 65, originalPrice: 65, costPrice: 50, quantity: 15, expiryDate: daysFromNow(1), addedDate: daysAgo(1), shopId: 'shop-3', salesCount: 20 },
  { id: '35', name: 'Paneer Block 500g', category: 'Dairy', price: 175, originalPrice: 175, costPrice: 140, quantity: 10, expiryDate: daysFromNow(2), addedDate: daysAgo(2), shopId: 'shop-3', salesCount: 15 },
  { id: '36', name: 'Cream 200ml', category: 'Dairy', price: 55, originalPrice: 55, costPrice: 40, quantity: 12, expiryDate: daysFromNow(5), addedDate: daysAgo(3), shopId: 'shop-3', salesCount: 8 },
  { id: '37', name: 'Flavoured Yogurt', category: 'Dairy', price: 30, originalPrice: 30, costPrice: 20, quantity: 25, expiryDate: daysFromNow(6), addedDate: daysAgo(2), shopId: 'shop-3', salesCount: 18 },
  { id: '38', name: 'Buttermilk 500ml', category: 'Beverage', price: 20, originalPrice: 20, costPrice: 14, quantity: 30, expiryDate: daysFromNow(1), addedDate: daysAgo(1), shopId: 'shop-3', salesCount: 35 },
  { id: '39', name: 'Cheese Spread 200g', category: 'Dairy', price: 95, originalPrice: 95, costPrice: 72, quantity: 8, expiryDate: daysFromNow(15), addedDate: daysAgo(5), shopId: 'shop-3', salesCount: 6 },
  { id: '40', name: 'Whipped Cream 250ml', category: 'Dairy', price: 120, originalPrice: 120, costPrice: 90, quantity: 5, expiryDate: daysFromNow(10), addedDate: daysAgo(3), shopId: 'shop-3', salesCount: 3 },
  { id: '41', name: 'Milkshake Mango 200ml', category: 'Beverage', price: 35, originalPrice: 35, costPrice: 24, quantity: 20, expiryDate: daysFromNow(3), addedDate: daysAgo(1), shopId: 'shop-3', salesCount: 22 },
  { id: '42', name: 'Cottage Cheese 250g', category: 'Dairy', price: 90, originalPrice: 90, costPrice: 65, quantity: 7, expiryDate: daysFromNow(2), addedDate: daysAgo(2), shopId: 'shop-3', salesCount: 9 },
  { id: '43', name: 'Shrikhand 100g', category: 'Dairy', price: 45, originalPrice: 45, costPrice: 32, quantity: 15, expiryDate: daysFromNow(4), addedDate: daysAgo(2), shopId: 'shop-3', salesCount: 12 },
  { id: '44', name: 'Khoya 250g', category: 'Dairy', price: 130, originalPrice: 130, costPrice: 100, quantity: 6, expiryDate: daysFromNow(1), addedDate: daysAgo(1), shopId: 'shop-3', salesCount: 4 },
  { id: '45', name: 'Ice Cream 500ml', category: 'Dairy', price: 150, originalPrice: 150, costPrice: 110, quantity: 10, expiryDate: daysFromNow(30), addedDate: daysAgo(5), shopId: 'shop-3', salesCount: 7 },

  // ===== Shop 4: Snack Corner (General Store) =====
  { id: '46', name: 'Lays Classic Chips', category: 'Snacks', price: 20, originalPrice: 20, costPrice: 15, quantity: 60, expiryDate: daysFromNow(45), addedDate: daysAgo(20), shopId: 'shop-4', salesCount: 40 },
  { id: '47', name: 'Kurkure Masala', category: 'Snacks', price: 20, originalPrice: 20, costPrice: 15, quantity: 50, expiryDate: daysFromNow(30), addedDate: daysAgo(15), shopId: 'shop-4', salesCount: 35 },
  { id: '48', name: 'Dairy Milk Silk', category: 'Snacks', price: 80, originalPrice: 80, costPrice: 62, quantity: 30, expiryDate: daysFromNow(60), addedDate: daysAgo(10), shopId: 'shop-4', salesCount: 25 },
  { id: '49', name: 'Maggi Noodles Pack', category: 'Snacks', price: 14, originalPrice: 14, costPrice: 11, quantity: 100, expiryDate: daysFromNow(180), addedDate: daysAgo(30), shopId: 'shop-4', salesCount: 80 },
  { id: '50', name: 'Coca-Cola 750ml', category: 'Beverage', price: 40, originalPrice: 40, costPrice: 30, quantity: 40, expiryDate: daysFromNow(90), addedDate: daysAgo(15), shopId: 'shop-4', salesCount: 30 },
  { id: '51', name: 'Pepsi 600ml', category: 'Beverage', price: 35, originalPrice: 35, costPrice: 26, quantity: 35, expiryDate: daysFromNow(85), addedDate: daysAgo(12), shopId: 'shop-4', salesCount: 28 },
  { id: '52', name: 'Red Bull 250ml', category: 'Beverage', price: 125, originalPrice: 125, costPrice: 100, quantity: 15, expiryDate: daysFromNow(120), addedDate: daysAgo(20), shopId: 'shop-4', salesCount: 10 },
  { id: '53', name: 'Oreo Biscuits', category: 'Snacks', price: 30, originalPrice: 30, costPrice: 22, quantity: 45, expiryDate: daysFromNow(50), addedDate: daysAgo(10), shopId: 'shop-4', salesCount: 32 },
  { id: '54', name: 'Bournvita 500g', category: 'Beverage', price: 220, originalPrice: 220, costPrice: 175, quantity: 12, expiryDate: daysFromNow(200), addedDate: daysAgo(25), shopId: 'shop-4', salesCount: 6 },
  { id: '55', name: 'Hide & Seek Biscuit', category: 'Snacks', price: 35, originalPrice: 35, costPrice: 25, quantity: 40, expiryDate: daysFromNow(2), addedDate: daysAgo(40), shopId: 'shop-4', salesCount: 20 },
  { id: '56', name: 'Parle-G Biscuit', category: 'Snacks', price: 10, originalPrice: 10, costPrice: 7, quantity: 80, expiryDate: daysFromNow(90), addedDate: daysAgo(15), shopId: 'shop-4', salesCount: 60 },
  { id: '57', name: 'Frooti 600ml', category: 'Beverage', price: 30, originalPrice: 30, costPrice: 22, quantity: 25, expiryDate: daysFromNow(40), addedDate: daysAgo(8), shopId: 'shop-4', salesCount: 15 },
  { id: '58', name: 'Peanut Butter 500g', category: 'Snacks', price: 250, originalPrice: 250, costPrice: 185, quantity: 8, expiryDate: daysFromNow(90), addedDate: daysAgo(20), shopId: 'shop-4', salesCount: 4 },
  { id: '59', name: 'Notebook A4', category: 'Stationery', price: 60, originalPrice: 60, costPrice: 40, quantity: 100, expiryDate: daysFromNow(365), addedDate: daysAgo(30), shopId: 'shop-4', salesCount: 12 },
  { id: '60', name: 'Face Wash 100ml', category: 'Beauty', price: 120, originalPrice: 120, costPrice: 85, quantity: 20, expiryDate: daysFromNow(150), addedDate: daysAgo(30), shopId: 'shop-4', salesCount: 8 },

  // Near-expiry items spread across shops (will get auto-discount)
  { id: '61', name: 'Yogurt Cup 100g', category: 'Dairy', price: 15, originalPrice: 15, costPrice: 10, quantity: 5, expiryDate: daysFromNow(1), addedDate: daysAgo(5), shopId: 'shop-1', salesCount: 2 },
  { id: '62', name: 'Fresh Orange Juice', category: 'Beverage', price: 60, originalPrice: 60, costPrice: 40, quantity: 4, expiryDate: daysFromNow(1), addedDate: daysAgo(3), shopId: 'shop-2', salesCount: 3 },
  { id: '63', name: 'Flavoured Milk 200ml', category: 'Dairy', price: 25, originalPrice: 25, costPrice: 18, quantity: 8, expiryDate: daysFromNow(1), addedDate: daysAgo(2), shopId: 'shop-3', salesCount: 5 },
  { id: '64', name: 'Cake Rusk Pack', category: 'Snacks', price: 40, originalPrice: 40, costPrice: 28, quantity: 10, expiryDate: daysFromNow(2), addedDate: daysAgo(15), shopId: 'shop-4', salesCount: 6 },
];
