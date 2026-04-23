import { useMemo } from 'react';
import { useStore } from '@/context/StoreContext';
import { Gift, Tag, Percent } from 'lucide-react';
import { Category } from '@/types';

export default function OffersPanel() {
  const { purchaseHistory, products } = useStore();

  const personalizedOffers = useMemo(() => {
    // Count category frequency from purchase history
    const catCount: Record<string, number> = {};
    purchaseHistory.forEach(r => r.items.forEach(item => {
      catCount[item.category] = (catCount[item.category] || 0) + item.quantity;
    }));

    const sorted = Object.entries(catCount).sort((a, b) => b[1] - a[1]);
    const offers: { category: string; discount: number; suggestion: string; productName?: string }[] = [];

    sorted.slice(0, 3).forEach(([cat, count]) => {
      const categoryProducts = products.filter(p => p.category === cat && p.quantity > 0);
      const suggestion = count > 5
        ? `You love ${cat}! Here's a special 15% discount`
        : `You buy ${cat} often → 10% off today`;
      const discount = count > 5 ? 15 : 10;
      const topProduct = categoryProducts[0];
      offers.push({ category: cat, discount, suggestion, productName: topProduct?.name });
    });

    return offers;
  }, [purchaseHistory, products]);

  // Combo offers for slow-moving + popular items
  const comboOffers = useMemo(() => {
    const combos: { name: string; items: string[]; discount: number }[] = [];
    const dairyItems = products.filter(p => p.category === 'Dairy' && p.quantity > 0);
    const snackItems = products.filter(p => p.category === 'Snacks' && p.quantity > 0);
    if (dairyItems.length && snackItems.length) {
      combos.push({ name: 'Dairy + Snacks Combo', items: [dairyItems[0].name, snackItems[0].name], discount: 12 });
    }
    const bevItems = products.filter(p => p.category === 'Beverage' && p.quantity > 0);
    if (bevItems.length && snackItems.length > 1) {
      combos.push({ name: 'Drink & Munch Deal', items: [bevItems[0].name, snackItems[1]?.name || snackItems[0].name], discount: 10 });
    }
    return combos;
  }, [products]);

  return (
    <div className="container py-6 max-w-3xl space-y-6 animate-fade-in">
      <h1 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
        <Gift className="h-6 w-6 text-primary" /> Offers For You
      </h1>

      {personalizedOffers.length === 0 && comboOffers.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Tag className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p>Shop more to unlock personalized offers!</p>
        </div>
      ) : (
        <>
          {personalizedOffers.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-heading font-semibold text-foreground">Personalized Offers</h3>
              {personalizedOffers.map((offer, i) => (
                <div key={i} className="rounded-xl border bg-card p-4 shadow-sm flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Percent className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-card-foreground">{offer.suggestion}</p>
                    {offer.productName && <p className="text-sm text-muted-foreground">Try: {offer.productName}</p>}
                  </div>
                  <span className="text-lg font-heading font-bold text-safe">-{offer.discount}%</span>
                </div>
              ))}
            </div>
          )}

          {comboOffers.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-heading font-semibold text-foreground">🎁 Combo Deals</h3>
              {comboOffers.map((combo, i) => (
                <div key={i} className="rounded-xl border bg-card p-4 shadow-sm">
                  <p className="font-medium text-card-foreground">{combo.name}</p>
                  <p className="text-sm text-muted-foreground">{combo.items.join(' + ')}</p>
                  <span className="inline-block mt-2 px-3 py-1 rounded-full bg-safe/10 text-safe text-sm font-medium">Save {combo.discount}%</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
