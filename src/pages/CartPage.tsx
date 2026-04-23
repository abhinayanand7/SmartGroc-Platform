import { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Minus, Plus, Trash2, ShoppingBag, MapPin, Store, Truck } from 'lucide-react';
import { getDiscountedPrice, DeliveryMethod } from '@/types';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import PaymentModal, { PaymentMethod } from '@/components/PaymentModal';

export default function CartPage() {
  const {
    cart, updateCartQty, removeFromCart, cartTotal, placeOrder, shops, clearCart,
    deliveryMethod, setDeliveryMethod, deliveryAddress, setDeliveryAddress, deliveryFee,
  } = useStore();
  const navigate = useNavigate();
  const [paymentOpen, setPaymentOpen] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="container py-16 text-center animate-fade-in">
        <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
        <h2 className="font-heading text-xl font-semibold text-foreground mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-4">Browse products and add items to your cart</p>
        <Link to="/"><Button>Continue Shopping</Button></Link>
      </div>
    );
  }

  // Group cart items by shop
  const shopGroups = cart.reduce<Record<string, typeof cart>>((acc, item) => {
    const sid = item.product.shopId || 'unknown';
    if (!acc[sid]) acc[sid] = [];
    acc[sid].push(item);
    return acc;
  }, {});

  const totalPayable = cartTotal + (deliveryMethod === 'home' ? deliveryFee : 0);

  const handleCheckout = () => {
    if (deliveryMethod === 'home' && !deliveryAddress.trim()) {
      toast.error('Please enter a delivery address');
      return;
    }
    setPaymentOpen(true);
  };

  const handlePaymentComplete = (method: PaymentMethod) => {
    // Place one order per shop (existing logic preserved)
    Object.entries(shopGroups).forEach(([shopId, items]) => {
      const shop = shops.find(s => s.id === shopId);
      placeOrder(shopId, shop?.name || 'Unknown Shop', items, deliveryMethod, deliveryMethod === 'home' ? deliveryFee : 0, deliveryAddress);
    });

    // Persist a paid/pending-order snapshot for the simulated payment flow
    try {
      const order = {
        id: Date.now(),
        items: cart,
        paymentMethod: method,
        totalAmount: totalPayable,
        status: method === 'cod' ? 'pending' : 'paid',
        createdAt: new Date().toISOString(),
      };
      const existing = JSON.parse(localStorage.getItem('orders') || '[]');
      localStorage.setItem('orders', JSON.stringify([...existing, order]));
    } catch {
      /* noop */
    }

    clearCart();
    toast.success(method === 'cod' ? 'Order confirmed! 📦' : 'Payment successful! 🎉');

    if (deliveryMethod === 'home') {
      navigate('/assigning-delivery');
    } else {
      navigate('/orders');
    }
  };

  return (
    <div className="container py-6 max-w-2xl animate-fade-in">
      <h1 className="font-heading text-2xl font-bold text-foreground mb-6">My Cart</h1>

      <div className="space-y-3">
        {cart.map(item => {
          const price = getDiscountedPrice(item.product);
          return (
            <div key={item.product.id} className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-card-foreground truncate">{item.product.name}</h3>
                <p className="text-sm text-muted-foreground">{item.product.category}</p>
                <p className="text-sm font-semibold text-primary mt-1">₹{price}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateCartQty(item.product.id, item.quantity - 1)}
                  className="h-8 w-8 rounded-lg border flex items-center justify-center hover:bg-accent transition-colors"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-6 text-center font-medium">{item.quantity}</span>
                <button
                  onClick={() => updateCartQty(item.product.id, item.quantity + 1)}
                  className="h-8 w-8 rounded-lg border flex items-center justify-center hover:bg-accent transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => { removeFromCart(item.product.id); toast.success('Removed from cart'); }}
                  className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-destructive/10 text-destructive transition-colors ml-1"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delivery Method Selection */}
      <div className="mt-6 rounded-xl border bg-card p-5 shadow-sm space-y-4">
        <h3 className="font-heading font-semibold text-card-foreground">Delivery Method</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setDeliveryMethod('pickup')}
            className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
              deliveryMethod === 'pickup'
                ? 'border-primary bg-secondary text-primary'
                : 'border-border text-muted-foreground hover:border-primary/40'
            }`}
          >
            <Store className="h-5 w-5" />
            <div className="text-left">
              <p className="text-sm font-semibold">Store Pickup</p>
              <p className="text-xs opacity-75">Free</p>
            </div>
          </button>
          <button
            onClick={() => setDeliveryMethod('home')}
            className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
              deliveryMethod === 'home'
                ? 'border-primary bg-secondary text-primary'
                : 'border-border text-muted-foreground hover:border-primary/40'
            }`}
          >
            <Truck className="h-5 w-5" />
            <div className="text-left">
              <p className="text-sm font-semibold">Home Delivery</p>
              <p className="text-xs opacity-75">₹{deliveryFee}</p>
            </div>
          </button>
        </div>

        {deliveryMethod === 'home' && (
          <div>
            <Label htmlFor="address" className="flex items-center gap-1 mb-1.5">
              <MapPin className="h-3.5 w-3.5" /> Delivery Address
            </Label>
            <Input
              id="address"
              value={deliveryAddress}
              onChange={e => setDeliveryAddress(e.target.value)}
              placeholder="Enter your full address..."
            />
          </div>
        )}
      </div>

      {/* Order Summary */}
      <div className="mt-4 rounded-xl border bg-card p-5 shadow-sm space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">₹{cartTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Delivery</span>
          <span className="font-medium">{deliveryMethod === 'home' ? `₹${deliveryFee.toFixed(2)}` : 'Free'}</span>
        </div>
        <div className="border-t pt-3 flex justify-between">
          <span className="font-heading font-semibold text-lg">Total</span>
          <span className="font-heading font-bold text-lg text-primary">₹{(cartTotal + deliveryFee).toFixed(2)}</span>
        </div>
        <Button className="w-full" size="lg" onClick={handleCheckout}>
          <ShoppingBag className="h-4 w-4 mr-2" /> Pay ₹{totalPayable.toFixed(2)} & Place Order
        </Button>
      </div>

      <PaymentModal
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        amount={totalPayable}
        onPaymentComplete={handlePaymentComplete}
      />
    </div>
  );
}
