import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '@/context/StoreContext';
import ProductCard from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, Star, Clock, MapPin, Package } from 'lucide-react';
import { CATEGORIES, getExpiryStatus, getDaysLeft } from '@/types';

export default function ShopDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getShopById, getShopProducts } = useStore();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const shop = getShopById(id || '');
  const allProducts = getShopProducts(id || '');

  const filtered = useMemo(() => {
    return allProducts
      .filter(p => {
        if (getExpiryStatus(p.expiryDate) === 'expired') return false;
        if (p.quantity <= 0) return false;
        if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
        if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
        return true;
      })
      .sort((a, b) => {
        // Near-expiry products first
        const daysA = getDaysLeft(a.expiryDate);
        const daysB = getDaysLeft(b.expiryDate);
        const aUrgent = daysA <= 7 ? 0 : 1;
        const bUrgent = daysB <= 7 ? 0 : 1;
        if (aUrgent !== bUrgent) return aUrgent - bUrgent;
        return daysA - daysB;
      });
  }, [allProducts, search, categoryFilter]);

  if (!shop) {
    return (
      <div className="container py-16 text-center">
        <p className="text-muted-foreground">Shop not found</p>
        <Link to="/" className="text-primary hover:underline mt-2 inline-block">← Back to shops</Link>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6 animate-fade-in">
      {/* Shop header */}
      <div className="rounded-2xl gradient-hero p-6 text-primary-foreground">
        <Link to="/" className="inline-flex items-center gap-1 text-primary-foreground/80 hover:text-primary-foreground text-sm mb-3">
          <ArrowLeft className="h-4 w-4" /> All Shops
        </Link>
        <div className="flex items-start gap-4">
          <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-heading font-bold">
            {shop.name.charAt(0)}
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold">{shop.name}</h1>
            <Badge className="mt-1 bg-white/20 text-primary-foreground border-0">{shop.category}</Badge>
            <div className="flex items-center gap-4 mt-2 text-sm text-primary-foreground/80">
              <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-current" /> {shop.rating.toFixed(1)}</span>
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {shop.deliveryTime}</span>
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {shop.address}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products in this shop..." className="pl-10" />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="All Categories" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Products */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="font-heading font-medium">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(p => (
            <ProductCard key={p.id} product={p} onEdit={() => {}} />
          ))}
        </div>
      )}
    </div>
  );
}
