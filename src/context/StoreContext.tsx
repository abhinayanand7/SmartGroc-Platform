import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  Product, CartItem, Expense, UserRole, CreditCustomer, CreditTransaction,
  PurchaseRecord, Shop, AppUser, Order, DeliveryPartner, DeliveryMethod,
  DeliveryStatus, PartnerStatus, VehicleType,
  getDiscountedPrice, initialDeliveryPartners
} from '@/types';
import { initialProducts } from '@/data/products';
import { initialShops } from '@/data/shops';

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  expenses: Expense[];
  role: UserRole;
  isLoggedIn: boolean;
  userEmail: string;
  userId: string;
  wishlist: string[];
  creditCustomers: CreditCustomer[];
  purchaseHistory: PurchaseRecord[];
  shops: Shop[];
  users: AppUser[];
  orders: Order[];
  deliveryPartners: DeliveryPartner[];
  setRole: (role: UserRole) => void;
  login: (email: string, role: UserRole) => void;
  logout: () => void;
  register: (email: string, name: string, role: UserRole) => void;
  addProduct: (product: Omit<Product, 'id' | 'price'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  addCreditCustomer: (name: string, phone?: string) => void;
  addCredit: (customerId: string, amount: number, desc?: string) => void;
  recordPayment: (customerId: string, amount: number, desc?: string) => void;
  deleteCreditCustomer: (id: string) => void;
  checkout: () => void;
  cartTotal: number;
  cartCount: number;
  addShop: (shop: Omit<Shop, 'id' | 'createdAt' | 'isApproved'>) => void;
  updateShop: (id: string, updates: Partial<Shop>) => void;
  deleteShop: (id: string) => void;
  approveShop: (id: string) => void;
  getShopProducts: (shopId: string) => Product[];
  getShopById: (shopId: string) => Shop | undefined;
  getMyShop: () => Shop | undefined;
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
  deleteUser: (userId: string) => void;
  // Order & Delivery
  placeOrder: (shopId: string, shopName: string, items: CartItem[], deliveryMethod: DeliveryMethod, deliveryFee: number, customerAddress: string) => void;
  updateOrderStatus: (orderId: string, status: DeliveryStatus) => void;
  assignDeliveryPartner: (orderId: string, partnerId: string) => void;
  getMyOrders: () => Order[];
  getShopOrders: (shopId: string) => Order[];
  getPartnerOrders: () => Order[];
  // Delivery Partner
  registerDeliveryPartner: (name: string, email: string, phone: string, vehicleType: VehicleType) => void;
  updatePartnerStatus: (status: PartnerStatus) => void;
  getMyPartnerProfile: () => DeliveryPartner | undefined;
  approvePartner: (partnerId: string) => void;
  blockPartner: (partnerId: string) => void;
  deletePartner: (partnerId: string) => void;
  // Delivery checkout state
  deliveryMethod: DeliveryMethod;
  setDeliveryMethod: (m: DeliveryMethod) => void;
  deliveryAddress: string;
  setDeliveryAddress: (a: string) => void;
  deliveryFee: number;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('sg-products');
    if (saved) return JSON.parse(saved);
    return initialProducts;
  });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('sg-expenses');
    return saved ? JSON.parse(saved) : [];
  });
  const [role, setRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('sg-role');
    return (saved as UserRole) || 'customer';
  });
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('sg-loggedIn') === 'true';
  });
  const [userEmail, setUserEmail] = useState(() => {
    return localStorage.getItem('sg-email') || '';
  });
  const [userId, setUserId] = useState(() => {
    return localStorage.getItem('sg-userId') || '';
  });
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [creditCustomers, setCreditCustomers] = useState<CreditCustomer[]>(() => {
    const saved = localStorage.getItem('sg-credit');
    return saved ? JSON.parse(saved) : [];
  });
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseRecord[]>(() => {
    const saved = localStorage.getItem('sg-purchases');
    return saved ? JSON.parse(saved) : [];
  });
  const [shops, setShops] = useState<Shop[]>(() => {
    const saved = localStorage.getItem('sg-shops');
    return saved ? JSON.parse(saved) : initialShops;
  });
  const [users, setUsers] = useState<AppUser[]>(() => {
    const saved = localStorage.getItem('sg-users');
    return saved ? JSON.parse(saved) : [];
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('sg-orders');
    return saved ? JSON.parse(saved) : [];
  });
  const [deliveryPartners, setDeliveryPartners] = useState<DeliveryPartner[]>(() => {
    const saved = localStorage.getItem('sg-delivery-partners');
    return saved ? JSON.parse(saved) : initialDeliveryPartners;
  });
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const deliveryFee = deliveryMethod === 'home' ? 30 : 0;

  // Persist
  useEffect(() => { localStorage.setItem('sg-products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('sg-expenses', JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem('sg-credit', JSON.stringify(creditCustomers)); }, [creditCustomers]);
  useEffect(() => { localStorage.setItem('sg-purchases', JSON.stringify(purchaseHistory)); }, [purchaseHistory]);
  useEffect(() => { localStorage.setItem('sg-shops', JSON.stringify(shops)); }, [shops]);
  useEffect(() => { localStorage.setItem('sg-users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('sg-loggedIn', String(isLoggedIn)); }, [isLoggedIn]);
  useEffect(() => { localStorage.setItem('sg-email', userEmail); }, [userEmail]);
  useEffect(() => { localStorage.setItem('sg-userId', userId); }, [userId]);
  useEffect(() => { localStorage.setItem('sg-role', role); }, [role]);
  useEffect(() => { localStorage.setItem('sg-orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('sg-delivery-partners', JSON.stringify(deliveryPartners)); }, [deliveryPartners]);

  const login = useCallback((email: string, r: UserRole) => {
    const uid = `${r}-${email}`;
    setUserEmail(email);
    setRole(r);
    setUserId(uid);
    setIsLoggedIn(true);
  }, []);

  const register = useCallback((email: string, name: string, r: UserRole) => {
    const uid = `${r}-${email}`;
    setUsers(prev => {
      if (prev.find(u => u.email === email)) return prev;
      return [...prev, { id: uid, email, name, role: r, createdAt: new Date().toISOString(), isBlocked: false }];
    });
    setUserEmail(email);
    setRole(r);
    setUserId(uid);
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUserEmail('');
    setUserId('');
    setCart([]);
    localStorage.removeItem('sg-loggedIn');
    localStorage.removeItem('sg-email');
    localStorage.removeItem('sg-userId');
    localStorage.removeItem('sg-role');
  }, []);

  const addProduct = useCallback((product: Omit<Product, 'id' | 'price'>) => {
    const newProduct: Product = { ...product, id: Date.now().toString(), price: product.originalPrice };
    newProduct.price = getDiscountedPrice(newProduct);
    setProducts(prev => [...prev, newProduct]);
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => {
      if (p.id !== id) return p;
      const updated = { ...p, ...updates };
      updated.price = getDiscountedPrice(updated);
      return updated;
    }));
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const addToCart = useCallback((product: Product, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + qty } : item);
      }
      return [...prev, { product, quantity: qty }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  }, []);

  const updateCartQty = useCallback((productId: string, qty: number) => {
    if (qty <= 0) { setCart(prev => prev.filter(item => item.product.id !== productId)); return; }
    setCart(prev => prev.map(item => item.product.id === productId ? { ...item, quantity: qty } : item));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  }, []);

  const addExpense = useCallback((expense: Omit<Expense, 'id'>) => {
    setExpenses(prev => [...prev, { ...expense, id: Date.now().toString() }]);
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  }, []);

  const addCreditCustomer = useCallback((name: string, phone?: string) => {
    setCreditCustomers(prev => [...prev, { id: Date.now().toString(), name, phone, balance: 0, history: [] }]);
  }, []);

  const addCredit = useCallback((customerId: string, amount: number, desc?: string) => {
    setCreditCustomers(prev => prev.map(c => {
      if (c.id !== customerId) return c;
      const txn: CreditTransaction = { id: Date.now().toString(), type: 'credit', amount, description: desc, date: new Date().toISOString() };
      return { ...c, balance: c.balance + amount, history: [...c.history, txn] };
    }));
  }, []);

  const recordPayment = useCallback((customerId: string, amount: number, desc?: string) => {
    setCreditCustomers(prev => prev.map(c => {
      if (c.id !== customerId) return c;
      const txn: CreditTransaction = { id: Date.now().toString(), type: 'payment', amount, description: desc, date: new Date().toISOString() };
      return { ...c, balance: Math.max(0, c.balance - amount), history: [...c.history, txn] };
    }));
  }, []);

  const deleteCreditCustomer = useCallback((id: string) => {
    setCreditCustomers(prev => prev.filter(c => c.id !== id));
  }, []);

  const checkout = useCallback(() => {
    if (cart.length === 0) return;
    const record: PurchaseRecord = {
      id: Date.now().toString(),
      items: cart.map(item => ({ productId: item.product.id, productName: item.product.name, category: item.product.category, quantity: item.quantity, price: getDiscountedPrice(item.product) })),
      total: cart.reduce((s, item) => s + getDiscountedPrice(item.product) * item.quantity, 0),
      date: new Date().toISOString(),
    };
    setPurchaseHistory(prev => [...prev, record]);
    setProducts(prev => prev.map(p => {
      const cartItem = cart.find(c => c.product.id === p.id);
      if (!cartItem) return p;
      return { ...p, salesCount: (p.salesCount ?? 0) + cartItem.quantity, lastSoldDate: new Date().toISOString(), quantity: Math.max(0, p.quantity - cartItem.quantity) };
    }));
    setCart([]);
  }, [cart]);

  // Order & Delivery methods
  const placeOrder = useCallback((shopId: string, shopName: string, items: CartItem[], dMethod: DeliveryMethod, dFee: number, customerAddr: string) => {
    const order: Order = {
      id: `ord-${Date.now()}`,
      customerId: userId,
      customerEmail: userEmail,
      shopId,
      shopName,
      items: items.map(item => ({
        productId: item.product.id, productName: item.product.name,
        category: item.product.category, quantity: item.quantity, price: getDiscountedPrice(item.product),
      })),
      total: items.reduce((s, item) => s + getDiscountedPrice(item.product) * item.quantity, 0) + dFee,
      deliveryMethod: dMethod,
      deliveryFee: dFee,
      deliveryPartnerId: null,
      deliveryPartnerName: null,
      deliveryPartnerVehicle: null,
      deliveryPartnerPhone: null,
      deliveryStatus: 'pending',
      estimatedTime: dMethod === 'home' ? 25 + Math.floor(Math.random() * 20) : 10,
      customerAddress: customerAddr,
      date: new Date().toISOString(),
    };
    setOrders(prev => [...prev, order]);

    // Also record in purchase history and update stock
    const record: PurchaseRecord = {
      id: order.id,
      items: order.items,
      total: order.total,
      date: order.date,
    };
    setPurchaseHistory(prev => [...prev, record]);
    setProducts(prev => prev.map(p => {
      const cartItem = items.find(c => c.product.id === p.id);
      if (!cartItem) return p;
      return { ...p, salesCount: (p.salesCount ?? 0) + cartItem.quantity, lastSoldDate: new Date().toISOString(), quantity: Math.max(0, p.quantity - cartItem.quantity) };
    }));
    setCart([]);
    setDeliveryMethod('pickup');
    setDeliveryAddress('');
  }, [userId, userEmail]);

  const updateOrderStatus = useCallback((orderId: string, status: DeliveryStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, deliveryStatus: status } : o));
    // Update partner stats if delivered
    if (status === 'delivered') {
      setOrders(prev => {
        const order = prev.find(o => o.id === orderId);
        if (order?.deliveryPartnerId) {
          setDeliveryPartners(dp => dp.map(p =>
            p.id === order.deliveryPartnerId
              ? { ...p, status: 'online' as PartnerStatus, totalDeliveries: p.totalDeliveries + 1, todayDeliveries: p.todayDeliveries + 1, totalEarnings: p.totalEarnings + order.deliveryFee, todayEarnings: p.todayEarnings + order.deliveryFee, todayKm: p.todayKm + 3 }
              : p
          ));
        }
        return prev;
      });
    }
  }, []);

  const assignDeliveryPartner = useCallback((orderId: string, partnerId: string) => {
    setDeliveryPartners(prev => {
      const partner = prev.find(p => p.id === partnerId);
      if (partner) {
        setOrders(o => o.map(order =>
          order.id === orderId
            ? { ...order, deliveryPartnerId: partnerId, deliveryPartnerName: partner.name, deliveryPartnerVehicle: partner.vehicleType, deliveryPartnerPhone: partner.phone, deliveryStatus: 'partner_assigned' as DeliveryStatus }
            : order
        ));
        return prev.map(p => p.id === partnerId ? { ...p, status: 'on_delivery' as PartnerStatus } : p);
      }
      return prev;
    });
  }, []);

  const getMyOrders = useCallback(() => {
    return orders.filter(o => o.customerId === userId);
  }, [orders, userId]);

  const getShopOrders = useCallback((shopId: string) => {
    return orders.filter(o => o.shopId === shopId);
  }, [orders]);

  const getPartnerOrders = useCallback(() => {
    const partner = deliveryPartners.find(p => p.userId === userId);
    if (!partner) return [];
    return orders.filter(o => o.deliveryPartnerId === partner.id || (o.deliveryMethod === 'home' && o.deliveryStatus === 'confirmed' && !o.deliveryPartnerId));
  }, [orders, deliveryPartners, userId]);

  const registerDeliveryPartner = useCallback((name: string, email: string, phone: string, vehicleType: VehicleType) => {
    const dp: DeliveryPartner = {
      id: `dp-${Date.now()}`, userId: `delivery-${email}`, name, email, phone, vehicleType,
      status: 'offline', rating: 4.0, totalDeliveries: 0, totalEarnings: 0,
      todayDeliveries: 0, todayEarnings: 0, todayKm: 0,
      isApproved: true, createdAt: new Date().toISOString(),
    };
    setDeliveryPartners(prev => [...prev, dp]);
  }, []);

  const updatePartnerStatus = useCallback((status: PartnerStatus) => {
    setDeliveryPartners(prev => prev.map(p => p.userId === userId ? { ...p, status } : p));
  }, [userId]);

  const getMyPartnerProfile = useCallback(() => {
    return deliveryPartners.find(p => p.userId === userId);
  }, [deliveryPartners, userId]);

  const approvePartner = useCallback((partnerId: string) => {
    setDeliveryPartners(prev => prev.map(p => p.id === partnerId ? { ...p, isApproved: true } : p));
  }, []);

  const blockPartner = useCallback((partnerId: string) => {
    setDeliveryPartners(prev => prev.map(p => p.id === partnerId ? { ...p, isApproved: false } : p));
  }, []);

  const deletePartner = useCallback((partnerId: string) => {
    setDeliveryPartners(prev => prev.filter(p => p.id !== partnerId));
  }, []);

  const addShop = useCallback((shop: Omit<Shop, 'id' | 'createdAt' | 'isApproved'>) => {
    setShops(prev => [...prev, { ...shop, id: `shop-${Date.now()}`, createdAt: new Date().toISOString(), isApproved: false }]);
  }, []);

  const updateShop = useCallback((id: string, updates: Partial<Shop>) => {
    setShops(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, []);

  const deleteShop = useCallback((id: string) => {
    setShops(prev => prev.filter(s => s.id !== id));
    setProducts(prev => prev.filter(p => p.shopId !== id));
  }, []);

  const approveShop = useCallback((id: string) => {
    setShops(prev => prev.map(s => s.id === id ? { ...s, isApproved: true } : s));
  }, []);

  const getShopProducts = useCallback((shopId: string) => {
    return products.filter(p => p.shopId === shopId);
  }, [products]);

  const getShopById = useCallback((shopId: string) => {
    return shops.find(s => s.id === shopId);
  }, [shops]);

  const getMyShop = useCallback(() => {
    return shops.find(s => s.ownerId === userId);
  }, [shops, userId]);

  const blockUser = useCallback((uid: string) => {
    setUsers(prev => prev.map(u => u.id === uid ? { ...u, isBlocked: true } : u));
  }, []);

  const unblockUser = useCallback((uid: string) => {
    setUsers(prev => prev.map(u => u.id === uid ? { ...u, isBlocked: false } : u));
  }, []);

  const deleteUser = useCallback((uid: string) => {
    setUsers(prev => prev.filter(u => u.id !== uid));
  }, []);

  const cartTotal = cart.reduce((sum, item) => sum + getDiscountedPrice(item.product) * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <StoreContext.Provider value={{
      products, cart, expenses, role, isLoggedIn, userEmail, userId, wishlist,
      creditCustomers, purchaseHistory, shops, users, orders, deliveryPartners,
      setRole, login, logout, register,
      addProduct, updateProduct, deleteProduct,
      addToCart, removeFromCart, updateCartQty, clearCart, toggleWishlist,
      addExpense, deleteExpense,
      addCreditCustomer, addCredit, recordPayment, deleteCreditCustomer,
      checkout, cartTotal, cartCount,
      addShop, updateShop, deleteShop, approveShop,
      getShopProducts, getShopById, getMyShop,
      blockUser, unblockUser, deleteUser,
      placeOrder, updateOrderStatus, assignDeliveryPartner,
      getMyOrders, getShopOrders, getPartnerOrders,
      registerDeliveryPartner, updatePartnerStatus, getMyPartnerProfile,
      approvePartner, blockPartner, deletePartner,
      deliveryMethod, setDeliveryMethod, deliveryAddress, setDeliveryAddress, deliveryFee,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
}
