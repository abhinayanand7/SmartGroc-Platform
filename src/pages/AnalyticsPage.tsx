import { useMemo } from 'react';
import { useStore } from '@/context/StoreContext';
import { getExpiryStatus, CATEGORIES } from '@/types';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Package, AlertTriangle } from 'lucide-react';

const PIE_COLORS = ['#16a34a', '#eab308', '#ef4444', '#dc2626'];

export default function AnalyticsPage() {
  const { products } = useStore();

  const expiryDistribution = useMemo(() => {
    const counts = { safe: 0, 'near-expiry': 0, critical: 0, expired: 0 };
    products.forEach(p => { counts[getExpiryStatus(p.expiryDate)]++; });
    return [
      { name: 'Safe', value: counts.safe },
      { name: 'Near Expiry', value: counts['near-expiry'] },
      { name: 'Critical', value: counts.critical },
      { name: 'Expired', value: counts.expired },
    ].filter(d => d.value > 0);
  }, [products]);

  const categoryData = useMemo(() => {
    return CATEGORIES.map(cat => ({
      name: cat,
      count: products.filter(p => p.category === cat).length,
    })).filter(d => d.count > 0);
  }, [products]);

  const totalRevenue = products.reduce((s, p) => s + p.price * Math.min(p.quantity, 5), 0);
  const totalWaste = products.filter(p => getExpiryStatus(p.expiryDate) === 'expired').length;
  const healthScore = Math.round(((products.length - totalWaste) / Math.max(products.length, 1)) * 100);

  const financialOverview = useMemo(() => {
    const revenue = totalRevenue;
    const expenses = Math.round(revenue * 0.6);
    return { revenue, expenses, profit: revenue - expenses };
  }, [totalRevenue]);

  return (
    <div className="container py-6 space-y-6 animate-fade-in">
      <h1 className="font-heading text-2xl font-bold text-foreground">Analytics Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: `₹${financialOverview.revenue}`, icon: TrendingUp, color: 'text-safe' },
          { label: 'Expenses', value: `₹${financialOverview.expenses}`, icon: TrendingDown, color: 'text-destructive' },
          { label: 'Net Profit', value: `₹${financialOverview.profit}`, icon: TrendingUp, color: 'text-primary' },
          { label: 'Health Score', value: `${healthScore}%`, icon: Package, color: healthScore > 70 ? 'text-safe' : 'text-warning' },
        ].map(s => (
          <div key={s.label} className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <s.icon className={`h-4 w-4 ${s.color}`} />
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
            <span className="text-xl font-heading font-bold text-card-foreground">{s.value}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="font-heading font-semibold mb-4 text-card-foreground">Expiry Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={expiryDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                {expiryDistribution.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="font-heading font-semibold mb-4 text-card-foreground">Products by Category</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(150, 10%, 88%)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(145, 63%, 42%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="font-heading font-semibold mb-4 text-card-foreground">Financial Overview</h3>
          <div className="space-y-3">
            <div className="flex justify-between"><span className="text-muted-foreground">Revenue:</span><span className="font-semibold">₹{financialOverview.revenue.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Expenses:</span><span className="font-semibold">₹{financialOverview.expenses.toFixed(2)}</span></div>
            <div className="border-t pt-3 flex justify-between"><span className="font-semibold">Net Profit:</span><span className="font-bold text-primary">₹{financialOverview.profit.toFixed(2)}</span></div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="font-heading font-semibold mb-4 text-card-foreground">Weekly Sales & Wastage</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-muted-foreground">Sales</span>
                <span className="text-sm font-medium">{products.length - totalWaste} items</span>
              </div>
              <div className="h-3 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-safe" style={{ width: `${((products.length - totalWaste) / Math.max(products.length, 1)) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-muted-foreground">Wastage</span>
                <span className="text-sm font-medium">{totalWaste} items</span>
              </div>
              <div className="h-3 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-destructive" style={{ width: `${(totalWaste / Math.max(products.length, 1)) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: '⏰', title: 'Expiry Alerts', desc: 'Smart notifications before expiry to reduce waste.' },
          { icon: '💰', title: 'Auto Discounts', desc: 'System applies discounts automatically for near-expiry items.' },
          { icon: '🔍', title: 'Smart Search', desc: 'Quickly find items with search and filters.' },
          { icon: '📊', title: 'Analytics', desc: 'Visual insights on wastage and performance.' },
        ].map(f => (
          <div key={f.title} className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="text-2xl mb-2">{f.icon}</div>
            <h4 className="font-heading font-semibold text-card-foreground">{f.title}</h4>
            <p className="text-sm text-muted-foreground mt-1">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
