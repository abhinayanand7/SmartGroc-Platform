import { useMemo } from 'react';
import { useStore } from '@/context/StoreContext';
import { ShoppingBag, Clock, Star } from 'lucide-react';

export default function PurchaseHistory() {
  const { purchaseHistory } = useStore();

  const frequentItems = useMemo(() => {
    const countMap: Record<string, { name: string; count: number; category: string }> = {};
    purchaseHistory.forEach(r => r.items.forEach(item => {
      if (!countMap[item.productId]) countMap[item.productId] = { name: item.productName, count: 0, category: item.category };
      countMap[item.productId].count += item.quantity;
    }));
    return Object.values(countMap).sort((a, b) => b.count - a.count).slice(0, 5);
  }, [purchaseHistory]);

  const recentPurchases = useMemo(() => {
    return [...purchaseHistory].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);
  }, [purchaseHistory]);

  return (
    <div className="container py-6 max-w-3xl space-y-6 animate-fade-in">
      <h1 className="font-heading text-2xl font-bold text-foreground">Purchase History</h1>

      {purchaseHistory.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <ShoppingBag className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p>No purchases yet. Checkout to see history.</p>
        </div>
      ) : (
        <>
          {frequentItems.length > 0 && (
            <div className="rounded-xl border bg-card p-5 shadow-sm">
              <h3 className="font-heading font-semibold text-card-foreground mb-3 flex items-center gap-2">
                <Star className="h-4 w-4 text-warning" /> Frequently Bought
              </h3>
              <div className="flex flex-wrap gap-2">
                {frequentItems.map(item => (
                  <span key={item.name} className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                    {item.name} × {item.count}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" /> Recent Orders
            </h3>
            {recentPurchases.map(record => (
              <div key={record.id} className="rounded-xl border bg-card p-4 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-xs text-muted-foreground">{new Date(record.date).toLocaleDateString()} {new Date(record.date).toLocaleTimeString()}</p>
                  <span className="font-heading font-bold text-primary">₹{record.total}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {record.items.map((item, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                      {item.productName} × {item.quantity}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
