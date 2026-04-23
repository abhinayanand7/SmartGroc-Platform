import { useMemo } from 'react';
import { useStore } from '@/context/StoreContext';
import { getExpiryStatus, isSlowMoving, getShelfPriority, getDaysLeft } from '@/types';
import { Lightbulb, AlertTriangle, RefreshCw, TrendingUp, MapPin } from 'lucide-react';

export default function SmartInsights() {
  const { products } = useStore();

  const insights = useMemo(() => {
    const suggestions: { icon: React.ReactNode; title: string; description: string; type: 'warning' | 'info' | 'success' }[] = [];

    // Near-expiry discount suggestions
    products.filter(p => {
      const s = getExpiryStatus(p.expiryDate);
      return s === 'near-expiry' || s === 'critical';
    }).slice(0, 3).forEach(p => {
      suggestions.push({
        icon: <AlertTriangle className="h-4 w-4" />,
        title: `Discount ${p.name}`,
        description: `${getDaysLeft(p.expiryDate)} days left — apply deeper discount to avoid waste`,
        type: 'warning',
      });
    });

    // Low stock restock suggestions
    products.filter(p => p.quantity < 5 && getExpiryStatus(p.expiryDate) !== 'expired').slice(0, 3).forEach(p => {
      suggestions.push({
        icon: <RefreshCw className="h-4 w-4" />,
        title: `Restock ${p.name}`,
        description: `Only ${p.quantity} units left — reorder soon`,
        type: 'info',
      });
    });

    // Slow-moving promotion
    products.filter(p => isSlowMoving(p) && p.quantity > 0 && getExpiryStatus(p.expiryDate) !== 'expired').slice(0, 3).forEach(p => {
      suggestions.push({
        icon: <TrendingUp className="h-4 w-4" />,
        title: `Promote ${p.name}`,
        description: `Slow-moving item — consider a promotion or bundle deal`,
        type: 'info',
      });
    });

    // Shelf priority suggestions
    products.filter(p => getShelfPriority(p).priority === 'high').slice(0, 3).forEach(p => {
      const sp = getShelfPriority(p);
      suggestions.push({
        icon: <MapPin className="h-4 w-4" />,
        title: `Place ${p.name} at front`,
        description: sp.reason,
        type: 'success',
      });
    });

    return suggestions;
  }, [products]);

  const typeStyles = {
    warning: 'bg-warning/10 border-warning/20 text-warning',
    info: 'bg-primary/10 border-primary/20 text-primary',
    success: 'bg-safe/10 border-safe/20 text-safe',
  };

  return (
    <div className="container py-6 max-w-3xl space-y-6 animate-fade-in">
      <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
        <Lightbulb className="h-6 w-6 text-warning" /> Smart Daily Insights
      </h1>

      {insights.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Lightbulb className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p>Everything looks good! No suggestions right now.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Today's actionable suggestions ({insights.length})</p>
          {insights.map((ins, i) => (
            <div key={i} className={`rounded-xl border p-4 shadow-sm flex items-start gap-3 ${typeStyles[ins.type]}`}>
              <div className="mt-0.5">{ins.icon}</div>
              <div>
                <p className="font-medium text-card-foreground">{ins.title}</p>
                <p className="text-sm text-muted-foreground">{ins.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
