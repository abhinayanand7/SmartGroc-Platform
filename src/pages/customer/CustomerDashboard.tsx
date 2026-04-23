import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '@/context/StoreContext';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Star, Clock, MapPin, Store, ChevronRight, Package } from 'lucide-react';
import { SHOP_CATEGORIES, getExpiryStatus, getSmartDiscount, getDiscountedPrice } from '@/types';

export default function CustomerDashboard() {
  const { shops, products } = useStore();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');

  const approvedShops = useMemo(() => {
    return shops.filter(s => {
      if (!s.isApproved) return false;
      if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (catFilter !== 'all' && s.category !== catFilter) return false;
      return true;
    });
  }, [shops, search, catFilter]);

  const offerProducts = useMemo(() => {
    return products
      .filter(p => getSmartDiscount(p.expiryDate) > 0 && p.quantity > 0 && getExpiryStatus(p.expiryDate) !== 'expired')
      .slice(0, 8);
  }, [products]);

  const usedCategories = useMemo(() => {
    const cats = new Set(shops.filter(s => s.isApproved).map(s => s.category));
    return SHOP_CATEGORIES.filter(c => cats.has(c));
  }, [shops]);

  const getShopTopProducts = (shopId: string) => {
    return products
      .filter(p => p.shopId === shopId && p.quantity > 0 && getExpiryStatus(p.expiryDate) !== 'expired')
      .sort((a, b) => (b.salesCount ?? 0) - (a.salesCount ?? 0))
      .slice(0, 4);
  };

  return (
    <div className="container py-6 space-y-8 animate-fade-in">
      {/* Hero search */}
      <div className="rounded-2xl gradient-hero p-8 text-primary-foreground">
        <h1 className="font-heading text-2xl md:text-3xl font-bold mb-2">What are you looking for?</h1>
        <p className="text-primary-foreground/80 mb-4 text-sm">Get groceries delivered in minutes</p>
        <div className="relative max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search shops..."
            className="pl-11 h-12 bg-card text-foreground rounded-xl border-0"
          />
        </div>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        <button
          onClick={() => setCatFilter('all')}
          className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            catFilter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-accent'
          }`}
        >
          All
        </button>
        {usedCategories.map(c => (
          <button
            key={c}
            onClick={() => setCatFilter(c)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              catFilter === c ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-accent'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Offers section */}
      {offerProducts.length > 0 && (
        <section>
          <h2 className="font-heading text-lg font-bold text-foreground mb-3">🔥 Today's Deals</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {offerProducts.map(p => {
              const discount = getSmartDiscount(p.expiryDate);
              const discounted = getDiscountedPrice(p);
              return (
                <div key={p.id} className="min-w-[160px] rounded-xl border bg-card p-3 shadow-sm">
                  <Badge variant="destructive" className="text-[10px] mb-2">{discount}% OFF</Badge>
                  <p className="text-sm font-semibold text-card-foreground truncate">{p.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-bold text-primary">₹{discounted}</span>
                    <span className="text-xs text-muted-foreground line-through">₹{p.originalPrice}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Shop cards */}
      <section>
        <h2 className="font-heading text-lg font-bold text-foreground mb-3">🏪 Shops Near You</h2>
        {approvedShops.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Store className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">No shops found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {approvedShops.map(shop => {
              const shopProductCount = products.filter(p => p.shopId === shop.id).length;
              const topProducts = getShopTopProducts(shop.id);
              return (
                <Link
                  key={shop.id}
                  to={`/shop/${shop.id}`}
                  className="group rounded-2xl border bg-card shadow-sm hover:shadow-lg transition-all hover:border-primary/30 overflow-hidden"
                >
                  {/* Shop header */}
                  <div className="p-5 pb-3">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-14 w-14 rounded-2xl gradient-primary flex items-center justify-center text-primary-foreground font-heading font-bold text-xl shrink-0">
                          {shop.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-heading font-bold text-card-foreground text-lg">{shop.name}</h3>
                          <Badge variant="secondary" className="text-[10px] mt-0.5">{shop.category}</Badge>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors mt-1" />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 text-warning fill-warning" /> {shop.rating.toFixed(1)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> {shop.deliveryTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Package className="h-3.5 w-3.5" /> {shopProductCount} items
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" /> {shop.address}
                    </div>
                  </div>

                  {/* Product preview row */}
                  {topProducts.length > 0 && (
                    <div className="px-5 pb-4">
                      <p className="text-[11px] text-muted-foreground mb-2 font-medium uppercase tracking-wide">Popular Items</p>
                      <div className="flex gap-2 overflow-hidden">
                        {topProducts.map(p => {
                          const discount = getSmartDiscount(p.expiryDate);
                          return (
                            <div key={p.id} className="flex-1 min-w-0 rounded-lg bg-secondary/50 p-2 text-center">
                              <p className="text-[11px] font-medium text-card-foreground truncate">{p.name}</p>
                              <p className="text-xs font-bold text-primary mt-0.5">₹{getDiscountedPrice(p)}</p>
                              {discount > 0 && (
                                <Badge variant="destructive" className="text-[9px] mt-1 px-1 py-0">{discount}% off</Badge>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
