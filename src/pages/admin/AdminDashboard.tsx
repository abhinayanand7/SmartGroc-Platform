import { useState, useMemo } from 'react';
import { useStore } from '@/context/StoreContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Store, Package, TrendingUp, CheckCircle, Trash2, Ban, Unlock, AlertTriangle, Bike, IndianRupee } from 'lucide-react';
import { getExpiryStatus, isSlowMoving } from '@/types';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const {
    users, shops, products, orders, deliveryPartners,
    approveShop, deleteShop,
    blockUser, unblockUser, deleteUser,
    deleteProduct,
    approvePartner, blockPartner, deletePartner,
  } = useStore();

  const stats = useMemo(() => ({
    totalUsers: users.length,
    totalShops: shops.length,
    approvedShops: shops.filter(s => s.isApproved).length,
    pendingShops: shops.filter(s => !s.isApproved).length,
    totalProducts: products.length,
    expiredProducts: products.filter(p => getExpiryStatus(p.expiryDate) === 'expired').length,
    slowMoving: products.filter(p => isSlowMoving(p)).length,
    totalOrders: orders.length,
    totalPartners: deliveryPartners.length,
    totalDeliveryEarnings: orders.reduce((s, o) => s + o.deliveryFee, 0),
  }), [users, shops, products, orders, deliveryPartners]);

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-primary' },
    { label: 'Total Shops', value: stats.totalShops, icon: Store, color: 'text-safe' },
    { label: 'Total Orders', value: stats.totalOrders, icon: Package, color: 'text-warning' },
    { label: 'Delivery Partners', value: stats.totalPartners, icon: Bike, color: 'text-primary' },
  ];

  const statusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'on_delivery': return 'bg-amber-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="container py-6 space-y-6 animate-fade-in">
      <h1 className="font-heading text-2xl font-bold text-foreground">Admin Dashboard</h1>

      {/* Stats */}
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

      <Tabs defaultValue="shops">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="shops">Shops</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="delivery">Delivery</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>

        {/* Shops Tab */}
        <TabsContent value="shops" className="space-y-3 mt-4">
          {shops.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No shops yet</p>
          ) : (
            shops.map(shop => (
              <Card key={shop.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <h3 className="font-heading font-semibold text-card-foreground">{shop.name}</h3>
                    <p className="text-sm text-muted-foreground">{shop.category} • {shop.address}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={shop.isApproved ? 'default' : 'secondary'}>
                        {shop.isApproved ? 'Approved' : 'Pending'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {products.filter(p => p.shopId === shop.id).length} products
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!shop.isApproved && (
                      <Button size="sm" onClick={() => { approveShop(shop.id); toast.success('Shop approved'); }}>
                        <CheckCircle className="h-4 w-4 mr-1" /> Approve
                      </Button>
                    )}
                    <Button size="sm" variant="destructive" onClick={() => { deleteShop(shop.id); toast.success('Shop deleted'); }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-3 mt-4">
          {users.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No registered users yet</p>
          ) : (
            users.map(user => (
              <Card key={user.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <h3 className="font-heading font-semibold text-card-foreground">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="capitalize">{user.role}</Badge>
                      {user.isBlocked && <Badge variant="destructive">Blocked</Badge>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {user.isBlocked ? (
                      <Button size="sm" variant="outline" onClick={() => { unblockUser(user.id); toast.success('User unblocked'); }}>
                        <Unlock className="h-4 w-4 mr-1" /> Unblock
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => { blockUser(user.id); toast.success('User blocked'); }}>
                        <Ban className="h-4 w-4 mr-1" /> Block
                      </Button>
                    )}
                    <Button size="sm" variant="destructive" onClick={() => { deleteUser(user.id); toast.success('User deleted'); }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Delivery Partners Tab */}
        <TabsContent value="delivery" className="space-y-4 mt-4">
          {/* Delivery earnings summary */}
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <IndianRupee className="h-4 w-4 text-primary" />
              <span className="font-heading font-semibold text-card-foreground">Platform Delivery Earnings</span>
            </div>
            <p className="text-2xl font-bold text-primary">₹{stats.totalDeliveryEarnings}</p>
            <p className="text-xs text-muted-foreground">Total collected from {orders.filter(o => o.deliveryMethod === 'home').length} home deliveries</p>
          </div>

          {/* Live status grid */}
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <h3 className="font-heading font-semibold text-card-foreground mb-3">Live Status</h3>
            <div className="flex flex-wrap gap-3">
              {deliveryPartners.map(dp => (
                <div key={dp.id} className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2">
                  <div className={`h-3 w-3 rounded-full ${statusColor(dp.status)}`} />
                  <span className="text-sm font-medium text-card-foreground">{dp.name}</span>
                  <span className="text-xs text-muted-foreground capitalize">({dp.status.replace(/_/g, ' ')})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Partner list */}
          {deliveryPartners.map(dp => (
            <Card key={dp.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading font-semibold text-card-foreground">{dp.name}</h3>
                      <div className={`h-2.5 w-2.5 rounded-full ${statusColor(dp.status)}`} />
                    </div>
                    <p className="text-sm text-muted-foreground">{dp.vehicleType} • ⭐ {dp.rating} • {dp.email}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span>Today: {dp.todayDeliveries} deliveries</span>
                      <span>₹{dp.todayEarnings} earned</span>
                      <Badge variant={dp.isApproved ? 'default' : 'secondary'} className="text-xs">
                        {dp.isApproved ? 'Approved' : 'Pending'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!dp.isApproved ? (
                      <Button size="sm" onClick={() => { approvePartner(dp.id); toast.success('Partner approved'); }}>
                        <CheckCircle className="h-4 w-4 mr-1" /> Approve
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => { blockPartner(dp.id); toast.success('Partner blocked'); }}>
                        <Ban className="h-4 w-4 mr-1" /> Block
                      </Button>
                    )}
                    <Button size="sm" variant="destructive" onClick={() => { deletePartner(dp.id); toast.success('Partner deleted'); }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-3 mt-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="destructive">{stats.expiredProducts} expired</Badge>
            <Badge variant="secondary">{stats.slowMoving} slow-moving</Badge>
          </div>
          {products.filter(p => getExpiryStatus(p.expiryDate) === 'expired' || isSlowMoving(p)).map(p => (
            <Card key={p.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <h3 className="font-heading font-semibold text-card-foreground">{p.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {shops.find(s => s.id === p.shopId)?.name || 'Unknown shop'} • ₹{p.price}
                  </p>
                  <div className="flex gap-2 mt-1">
                    {getExpiryStatus(p.expiryDate) === 'expired' && <Badge variant="destructive">Expired</Badge>}
                    {isSlowMoving(p) && <Badge variant="secondary">Slow Moving</Badge>}
                  </div>
                </div>
                <Button size="sm" variant="destructive" onClick={() => { deleteProduct(p.id); toast.success('Product removed'); }}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
          {products.filter(p => getExpiryStatus(p.expiryDate) === 'expired' || isSlowMoving(p)).length === 0 && (
            <p className="text-center text-muted-foreground py-8">All products are healthy ✅</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
