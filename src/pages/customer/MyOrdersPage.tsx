import { useStore } from '@/context/StoreContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Package, Clock, Bike, Phone } from 'lucide-react';
import { DELIVERY_STATUS_STEPS, maskPhone } from '@/types';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function MyOrdersPage() {
  const { getMyOrders } = useStore();
  const orders = getMyOrders().slice().reverse();

  if (orders.length === 0) {
    return (
      <div className="container py-16 text-center animate-fade-in">
        <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
        <h2 className="font-heading text-xl font-semibold mb-2">No orders yet</h2>
        <p className="text-muted-foreground mb-4">Your orders will appear here</p>
        <Link to="/"><Button>Browse Shops</Button></Link>
      </div>
    );
  }

  return (
    <div className="container py-6 max-w-2xl space-y-4 animate-fade-in">
      <h1 className="font-heading text-2xl font-bold text-foreground">My Orders</h1>

      {orders.map(order => {
        const stepIndex = DELIVERY_STATUS_STEPS.findIndex(s => s.status === order.deliveryStatus);
        const progress = ((stepIndex + 1) / DELIVERY_STATUS_STEPS.length) * 100;

        return (
          <Card key={order.id} className="overflow-hidden">
            <CardContent className="p-5 space-y-4">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-heading font-semibold text-card-foreground">{order.shopName}</h3>
                  <p className="text-xs text-muted-foreground">{new Date(order.date).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">₹{order.total}</p>
                  <Badge variant={order.deliveryMethod === 'home' ? 'default' : 'secondary'} className="mt-1">
                    {order.deliveryMethod === 'home' ? '🏠 Home Delivery' : '🏪 Store Pickup'}
                  </Badge>
                </div>
              </div>

              {/* Items */}
              <div className="text-sm text-muted-foreground">
                {order.items.map(i => `${i.productName} x${i.quantity}`).join(' • ')}
              </div>

              {/* Delivery Status Tracker */}
              {order.deliveryMethod === 'home' && (
                <div className="space-y-3">
                  <Progress value={progress} className="h-2" />
                  <div className="flex justify-between">
                    {DELIVERY_STATUS_STEPS.map((step, i) => (
                      <div key={step.status} className="flex flex-col items-center flex-1">
                        <div className={`h-3 w-3 rounded-full ${i <= stepIndex ? 'bg-primary' : 'bg-muted'}`} />
                        <span className={`text-[10px] mt-1 text-center leading-tight ${i <= stepIndex ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Partner info */}
                  {order.deliveryPartnerName && (
                    <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bike className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-card-foreground">{order.deliveryPartnerName}</p>
                        <p className="text-xs text-muted-foreground">{order.deliveryPartnerVehicle}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {order.deliveryPartnerPhone ? maskPhone(order.deliveryPartnerPhone) : 'N/A'}
                      </div>
                    </div>
                  )}

                  {/* ETA */}
                  {order.deliveryStatus !== 'delivered' && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Estimated: ~{order.estimatedTime} mins</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
