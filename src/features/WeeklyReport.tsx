import { useMemo } from 'react';
import { useStore } from '@/context/StoreContext';
import { getExpiryStatus, getProductProfit } from '@/types';
import { TrendingUp, TrendingDown, Award, AlertTriangle, BarChart3 } from 'lucide-react';

export default function WeeklyReport() {
  const { products, purchaseHistory, expenses } = useStore();

  const weekAgo = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d;
  }, []);

  const weeklyPurchases = useMemo(() => purchaseHistory.filter(p => new Date(p.date) >= weekAgo), [purchaseHistory, weekAgo]);
  const weeklyExpenses = useMemo(() => expenses.filter(e => new Date(e.date) >= weekAgo), [expenses, weekAgo]);

  const revenue = weeklyPurchases.reduce((s, p) => s + p.total, 0);
  const expenseTotal = weeklyExpenses.filter(e => e.type === 'expense').reduce((s, e) => s + e.amount, 0);
  const expired = products.filter(p => getExpiryStatus(p.expiryDate) === 'expired');
  const loss = expired.reduce((s, p) => s + p.originalPrice * p.quantity, 0);

  const topProduct = useMemo(() => {
    const countMap: Record<string, { name: string; qty: number }> = {};
    weeklyPurchases.forEach(r => r.items.forEach(item => {
      if (!countMap[item.productId]) countMap[item.productId] = { name: item.productName, qty: 0 };
      countMap[item.productId].qty += item.quantity;
    }));
    const sorted = Object.values(countMap).sort((a, b) => b.qty - a.qty);
    return sorted[0] || null;
  }, [weeklyPurchases]);

  const totalProfit = products.reduce((s, p) => s + getProductProfit(p) * Math.min(p.salesCount || 0, p.quantity), 0);

  return (
    <div className="container py-6 max-w-3xl space-y-6 animate-fade-in">
      <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
        <BarChart3 className="h-6 w-6 text-primary" /> Weekly Report
      </h1>

      <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
        <h3 className="font-heading font-semibold text-card-foreground">This Week Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-safe/10 p-4">
            <div className="flex items-center gap-2 mb-1"><TrendingUp className="h-4 w-4 text-safe" /><span className="text-xs text-muted-foreground">Revenue</span></div>
            <p className="text-xl font-heading font-bold text-foreground">₹{revenue.toFixed(0)}</p>
          </div>
          <div className="rounded-lg bg-destructive/10 p-4">
            <div className="flex items-center gap-2 mb-1"><TrendingDown className="h-4 w-4 text-destructive" /><span className="text-xs text-muted-foreground">Loss (Expired)</span></div>
            <p className="text-xl font-heading font-bold text-foreground">₹{loss.toFixed(0)}</p>
          </div>
          <div className="rounded-lg bg-primary/10 p-4">
            <div className="flex items-center gap-2 mb-1"><TrendingUp className="h-4 w-4 text-primary" /><span className="text-xs text-muted-foreground">Profit</span></div>
            <p className="text-xl font-heading font-bold text-foreground">₹{totalProfit.toFixed(0)}</p>
          </div>
          <div className="rounded-lg bg-warning/10 p-4">
            <div className="flex items-center gap-2 mb-1"><Award className="h-4 w-4 text-warning" /><span className="text-xs text-muted-foreground">Top Product</span></div>
            <p className="text-lg font-heading font-bold text-foreground">{topProduct ? topProduct.name : 'N/A'}</p>
            {topProduct && <p className="text-xs text-muted-foreground">{topProduct.qty} units sold</p>}
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h3 className="font-heading font-semibold text-card-foreground mb-3 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-warning" /> Expired Products ({expired.length})
        </h3>
        {expired.length === 0 ? (
          <p className="text-sm text-muted-foreground">No expired products this week 🎉</p>
        ) : (
          <div className="space-y-2">
            {expired.slice(0, 5).map(p => (
              <div key={p.id} className="flex justify-between text-sm py-1 border-b border-border/50 last:border-0">
                <span className="text-muted-foreground">{p.name}</span>
                <span className="text-destructive font-medium">₹{p.originalPrice} × {p.quantity}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
