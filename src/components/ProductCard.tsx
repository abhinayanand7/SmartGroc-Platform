import { Product, getExpiryStatus, getDaysLeft, getExpiryPercentage, getDiscountedPrice, getSmartDiscount, isSlowMoving, getProductProfit, getShelfPriority, getAlternativeProducts } from '@/types';
import { useStore } from '@/context/StoreContext';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Bookmark, AlertTriangle, MapPin, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
}

const statusConfig = {
  safe: { label: 'Safe', className: 'bg-safe/10 text-safe' },
  'near-expiry': { label: 'Near Expiry', className: 'bg-warning/10 text-warning' },
  critical: { label: 'Critical', className: 'bg-destructive/10 text-destructive' },
  expired: { label: 'Expired', className: 'bg-destructive/10 text-destructive' },
};

const barColors = {
  safe: 'bg-safe',
  'near-expiry': 'bg-warning',
  critical: 'bg-destructive',
  expired: 'bg-destructive',
};

export default function ProductCard({ product, onEdit }: ProductCardProps) {
  const { role, addToCart, toggleWishlist, wishlist, deleteProduct, products } = useStore();
  const status = getExpiryStatus(product.expiryDate);
  const daysLeft = getDaysLeft(product.expiryDate);
  const pct = getExpiryPercentage(product.addedDate, product.expiryDate);
  const discount = getSmartDiscount(product.expiryDate);
  const discountedPrice = getDiscountedPrice(product);
  const isWished = wishlist.includes(product.id);
  const slow = isSlowMoving(product);
  const profit = getProductProfit(product);
  const shelf = getShelfPriority(product);

  const handleAddToCart = () => {
    if (status === 'expired') {
      toast.error('Cannot add expired products to cart');
      return;
    }
    if (product.quantity <= 0) {
      // Suggest alternatives
      const alts = getAlternativeProducts(products, product.category, product.id);
      if (alts.length > 0) {
        toast.info(`Out of stock! Try "${alts[0].name}" instead`);
      } else {
        toast.error('Out of stock');
      }
      return;
    }
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="group rounded-xl border bg-card p-4 shadow-sm hover:shadow-md transition-all animate-fade-in">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-semibold text-card-foreground truncate">{product.name}</h3>
          <p className="text-sm text-muted-foreground">{product.category}</p>
        </div>
        <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap', statusConfig[status].className)}>
          {statusConfig[status].label}
        </span>
      </div>

      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-lg font-bold text-foreground">₹{discountedPrice}</span>
        {discount > 0 && (
          <>
            <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice}</span>
            <span className="text-xs font-medium text-safe">-{discount}%</span>
          </>
        )}
      </div>

      <div className="mb-3">
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all', barColors[status])}
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {daysLeft > 0 ? `${daysLeft} days left` : `Expired ${Math.abs(daysLeft)} days ago`}
          {' · '} Qty: {product.quantity}
        </p>
      </div>

      {/* Admin-only indicators */}
      {role === 'admin' && (
        <div className="mb-3 space-y-1">
          {slow && product.quantity > 0 && status !== 'expired' && (
            <p className="text-xs flex items-center gap-1 text-warning">
              <TrendingDown className="h-3 w-3" /> Slow-moving — no sale in 10+ days
            </p>
          )}
          {shelf.priority === 'high' && (
            <p className="text-xs flex items-center gap-1 text-primary">
              <MapPin className="h-3 w-3" /> Place at front — {shelf.reason}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            Profit/unit: <span className={profit >= 0 ? 'text-safe' : 'text-destructive'}>₹{profit}</span>
            {product.salesCount ? ` · Sold: ${product.salesCount}` : ''}
          </p>
        </div>
      )}

      <div className="flex items-center gap-2">
        {role === 'customer' ? (
          <>
            <Button size="sm" variant="outline" onClick={() => toast.info(`${product.name} reserved!`)}>
              <Bookmark className="h-3.5 w-3.5 mr-1" /> Reserve
            </Button>
            <button
              onClick={() => { toggleWishlist(product.id); toast.success(isWished ? 'Removed from wishlist' : 'Added to wishlist'); }}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
            >
              <Heart className={cn('h-4 w-4', isWished ? 'fill-destructive text-destructive' : 'text-muted-foreground')} />
            </button>
            <Button size="sm" onClick={handleAddToCart} disabled={status === 'expired' || product.quantity <= 0}>
              <ShoppingCart className="h-3.5 w-3.5 mr-1" /> {product.quantity <= 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </>
        ) : (
          <>
            <Button size="sm" variant="outline" onClick={() => onEdit?.(product)}>Edit</Button>
            <Button size="sm" variant="destructive" onClick={() => { deleteProduct(product.id); toast.success('Deleted'); }}>
              Delete
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
