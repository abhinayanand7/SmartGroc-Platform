import { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SHOP_CATEGORIES } from '@/types';
import { toast } from 'sonner';
import { Store } from 'lucide-react';

export default function CreateShopPage() {
  const { addShop, userId } = useStore();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !category || !address.trim() || !deliveryTime.trim()) {
      toast.error('Please fill all fields');
      return;
    }
    addShop({
      ownerId: userId,
      name: name.trim(),
      category,
      address: address.trim(),
      deliveryTime: deliveryTime.trim(),
      rating: 4.0 + Math.random() * 0.9,
    });
    toast.success('Shop created! Awaiting admin approval.');
  };

  return (
    <div className="container py-12 max-w-lg animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary text-primary-foreground mb-4">
          <Store className="h-8 w-8" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Create Your Shop</h1>
        <p className="text-muted-foreground mt-1">Set up your grocery store to start selling</p>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Shop Name</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Fresh Mart" />
          </div>
          <div>
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {SHOP_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Address</Label>
            <Input value={address} onChange={e => setAddress(e.target.value)} placeholder="123 Market Street" />
          </div>
          <div>
            <Label>Estimated Delivery Time</Label>
            <Input value={deliveryTime} onChange={e => setDeliveryTime(e.target.value)} placeholder="e.g. 15 mins" />
          </div>
          <Button type="submit" className="w-full" size="lg">Create Shop</Button>
        </form>
      </div>
    </div>
  );
}
