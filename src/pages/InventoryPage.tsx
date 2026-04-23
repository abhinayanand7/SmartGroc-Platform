import { useState, useMemo } from 'react';
import { useStore } from '@/context/StoreContext';
import ProductCard from '@/components/ProductCard';
import ProductForm from '@/components/ProductForm';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, Search, Package, AlertTriangle, Clock, ShieldCheck } from 'lucide-react';
import { Product, CATEGORIES, getExpiryStatus, ExpiryStatus } from '@/types';
import RushIndicator from '@/features/RushIndicator';

export default function InventoryPage() {
  const { products, role } = useStore();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    return products.filter(p => {
      // Hide expired products from user view
      if (role === 'customer' && getExpiryStatus(p.expiryDate) === 'expired') return false;
      // Hide out-of-stock from customer view
      if (role === 'customer' && p.quantity <= 0) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
      if (statusFilter !== 'all' && getExpiryStatus(p.expiryDate) !== statusFilter) return false;
      return true;
    });
  }, [products, search, categoryFilter, statusFilter, role]);

  const stats = useMemo(() => {
    const total = products.length;
    const expired = products.filter(p => getExpiryStatus(p.expiryDate) === 'expired').length;
    const nearExpiry = products.filter(p => getExpiryStatus(p.expiryDate) === 'near-expiry' || getExpiryStatus(p.expiryDate) === 'critical').length;
    const safe = products.filter(p => getExpiryStatus(p.expiryDate) === 'safe').length;
    const lowStock = products.filter(p => p.quantity < 10).length;
    return { total, expired, nearExpiry, safe, lowStock };
  }, [products]);

  const statCards = [
    { label: 'Total Products', value: stats.total, icon: Package, color: 'text-primary' },
    { label: 'Expired', value: stats.expired, icon: AlertTriangle, color: 'text-destructive' },
    { label: 'Near Expiry', value: stats.nearExpiry, icon: Clock, color: 'text-warning' },
    { label: 'Safe', value: stats.safe, icon: ShieldCheck, color: 'text-safe' },
  ];

  return (
    <div className="container py-6 space-y-6 animate-fade-in">
      {role === 'admin' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map(s => (
            <div key={s.label} className="rounded-xl border bg-card p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <s.icon className={`h-4 w-4 ${s.color}`} />
                <span className="text-xs text-muted-foreground">{s.label}</span>
              </div>
              <span className="text-2xl font-heading font-bold text-card-foreground">{s.value}</span>
            </div>
          ))}
        </div>
      )}

      {role === 'admin' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RushIndicator />
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="All Categories" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="All Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="safe">Safe</SelectItem>
            <SelectItem value="near-expiry">Near Expiry</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
        {role === 'admin' && (
          <Button onClick={() => { setEditProduct(null); setFormOpen(true); }}>
            <Plus className="h-4 w-4 mr-1" /> Add Product
          </Button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="font-heading font-medium">No products found</p>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(p => (
            <ProductCard
              key={p.id}
              product={p}
              onEdit={(product) => { setEditProduct(product); setFormOpen(true); }}
            />
          ))}
        </div>
      )}

      <ProductForm
        open={formOpen}
        onOpenChange={setFormOpen}
        editProduct={editProduct}
      />
    </div>
  );
}
