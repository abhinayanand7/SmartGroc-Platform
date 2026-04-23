import { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Bike, MapPin, Package, Clock, IndianRupee, Navigation, Phone, CheckCircle2 } from 'lucide-react';
import { DeliveryStatus, maskPhone } from '@/types';
import { toast } from 'sonner';

export default function DeliveryDashboard() {
  const {
    getMyPartnerProfile, updatePartnerStatus, getPartnerOrders,
    updateOrderStatus, assignDeliveryPartner, orders,
  } = useStore();

  const partner = getMyPartnerProfile();
  const partnerOrders = getPartnerOrders();

  if (!partner) {
    return (
      <div className="container py-16 text-center animate-fade-in">
        <Bike className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
        <h2 className="font-heading text-xl font-semibold mb-2">Delivery Partner Profile Not Found</h2>
        <p className="text-muted-foreground">Please register as a delivery partner first.</p>
      </div>
    );
  }

  const isOnline = partner.status !== 'offline';
  const pendingOrders = partnerOrders.filter(o => !o.deliveryPartnerId && o.deliveryStatus === 'confirmed');
  const myActiveOrders = partnerOrders.filter(o => o.deliveryPartnerId === partner.id && o.deliveryStatus !== 'delivered');
  const myDelivered = orders.filter(o => o.deliveryPartnerId === partner.id && o.deliveryStatus === 'delivered');

  const handleToggle = () => {
    const newStatus = isOnline ? 'offline' : 'online';
    updatePartnerStatus(newStatus);
    toast.success(newStatus === 'online' ? '🟢 You are now Online!' : '⚫ You are now Offline');
  };

  const handleAccept = (orderId: string) => {
    assignDeliveryPartner(orderId, partner.id);
    toast.success('Order accepted! Head to the shop for pickup.');
  };

  const handleStatusUpdate = (orderId: string, status: DeliveryStatus) => {
    updateOrderStatus(orderId, status);
    const labels: Record<string, string> = {
      picked_up: '📦 Marked as Picked Up',
      out_for_delivery: '🚀 Out for Delivery!',
      delivered: '✅ Delivered successfully!',
    };
    toast.success(labels[status] || 'Status updated');
  };

  const getNextAction = (status: DeliveryStatus): { label: string; next: DeliveryStatus } | null => {
    switch (status) {
      case 'partner_assigned': return { label: 'Picked Up', next: 'picked_up' };
      case 'picked_up': return { label: 'Out for Delivery', next: 'out_for_delivery' };
      case 'out_for_delivery': return { label: 'Delivered', next: 'delivered' };
      default: return null;
    }
  };

  return (
    <div className="container py-6 space-y-6 animate-fade-in">
      {/* Header with toggle */}
      <div className="rounded-xl gradient-hero p-5 text-primary-foreground">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Bike className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold">{partner.name}</h1>
              <p className="text-primary-foreground/80 text-sm">{partner.vehicleType} • ⭐ {partner.rating}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">{isOnline ? '🟢 Online' : '⚫ Offline'}</span>
            <Switch checked={isOnline} onCheckedChange={handleToggle} />
          </div>
        </div>
      </div>

      {/* Today's Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Deliveries', value: partner.todayDeliveries, icon: Package },
          { label: 'Earnings', value: `₹${partner.todayEarnings}`, icon: IndianRupee },
          { label: 'Km Travelled', value: `${partner.todayKm} km`, icon: Navigation },
        ].map(s => (
          <div key={s.label} className="rounded-xl border bg-card p-4 shadow-sm text-center">
            <s.icon className="h-5 w-5 mx-auto mb-1 text-primary" />
            <p className="text-xl font-heading font-bold text-card-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <Tabs defaultValue="active">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="available">Available ({pendingOrders.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({myActiveOrders.length})</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
        </TabsList>

        {/* Available orders to accept */}
        <TabsContent value="available" className="space-y-3 mt-4">
          {!isOnline ? (
            <p className="text-center text-muted-foreground py-8">Go online to see available orders</p>
          ) : pendingOrders.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No orders available right now</p>
          ) : (
            pendingOrders.map(order => (
              <Card key={order.id}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-heading font-semibold text-card-foreground">{order.shopName}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> Shop pickup
                      </p>
                    </div>
                    <Badge className="bg-primary/10 text-primary">₹{order.deliveryFee} earn</Badge>
                  </div>
                  <div className="text-sm space-y-1">
                    <p className="text-muted-foreground">
                      <span className="font-medium text-card-foreground">Customer:</span> {order.customerEmail}
                    </p>
                    <p className="text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {order.customerAddress || 'No address provided'}
                    </p>
                    <p className="text-muted-foreground">
                      {order.items.length} items • Total: ₹{order.total}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={() => handleAccept(order.id)}>
                      <CheckCircle2 className="h-4 w-4 mr-1" /> Accept Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Active deliveries */}
        <TabsContent value="active" className="space-y-3 mt-4">
          {myActiveOrders.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No active deliveries</p>
          ) : (
            myActiveOrders.map(order => {
              const nextAction = getNextAction(order.deliveryStatus);
              return (
                <Card key={order.id}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-heading font-semibold text-card-foreground">{order.shopName}</h3>
                        <Badge variant="secondary" className="capitalize mt-1">{order.deliveryStatus.replace(/_/g, ' ')}</Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-primary">₹{order.deliveryFee}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" /> ~{order.estimatedTime} min
                        </p>
                      </div>
                    </div>
                    <div className="text-sm space-y-1">
                      <p className="text-muted-foreground">
                        <span className="font-medium text-card-foreground">Deliver to:</span> {order.customerAddress || order.customerEmail}
                      </p>
                      <p className="text-muted-foreground">{order.items.map(i => `${i.productName} x${i.quantity}`).join(', ')}</p>
                    </div>
                    {nextAction && (
                      <Button className="w-full" onClick={() => handleStatusUpdate(order.id, nextAction.next)}>
                        Mark as {nextAction.label}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>

        {/* Earnings history */}
        <TabsContent value="earnings" className="space-y-3 mt-4">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <h3 className="font-heading font-semibold text-card-foreground mb-3">Earnings Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Today</p>
                <p className="text-lg font-bold text-primary">₹{partner.todayEarnings}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-lg font-bold text-card-foreground">₹{partner.totalEarnings}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Today Deliveries</p>
                <p className="text-lg font-bold text-card-foreground">{partner.todayDeliveries}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Deliveries</p>
                <p className="text-lg font-bold text-card-foreground">{partner.totalDeliveries}</p>
              </div>
            </div>
          </div>

          {myDelivered.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No completed deliveries yet</p>
          ) : (
            myDelivered.slice().reverse().map(order => (
              <Card key={order.id}>
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-card-foreground text-sm">{order.shopName}</p>
                    <p className="text-xs text-muted-foreground">{new Date(order.date).toLocaleDateString()} • {order.items.length} items</p>
                  </div>
                  <p className="font-semibold text-primary">+₹{order.deliveryFee}</p>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
