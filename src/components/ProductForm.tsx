import { useState } from 'react';
import { Product, CATEGORIES, Category } from '@/types';
import { useStore } from '@/context/StoreContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editProduct?: Product | null;
  shopId?: string;
}

export default function ProductForm({ open, onOpenChange, editProduct, shopId }: ProductFormProps) {
  const { addProduct, updateProduct } = useStore();
  const [name, setName] = useState(editProduct?.name ?? '');
  const [category, setCategory] = useState<Category>(editProduct?.category ?? 'Dairy');
  const [price, setPrice] = useState(editProduct?.originalPrice?.toString() ?? '');
  const [quantity, setQuantity] = useState(editProduct?.quantity?.toString() ?? '');
  const [expiryDays, setExpiryDays] = useState('7');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price || !quantity) {
      toast.error('Please fill all required fields');
      return;
    }

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + parseInt(expiryDays));

    if (editProduct) {
      updateProduct(editProduct.id, {
        name: name.trim(),
        category,
        originalPrice: parseFloat(price),
        quantity: parseInt(quantity),
        expiryDate: expiryDate.toISOString().split('T')[0],
      });
      toast.success('Product updated!');
    } else {
      addProduct({
        name: name.trim(),
        category,
        originalPrice: parseFloat(price),
        quantity: parseInt(quantity),
        expiryDate: expiryDate.toISOString().split('T')[0],
        addedDate: new Date().toISOString().split('T')[0],
        shopId,
      });
      toast.success('Product added!');
    }
    onOpenChange(false);
    setName(''); setPrice(''); setQuantity(''); setExpiryDays('7');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">{editProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name *</Label>
            <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Enter product name" />
          </div>
          <div>
            <Label>Category *</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price (₹) *</Label>
              <Input id="price" type="number" min="0" value={price} onChange={e => setPrice(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="qty">Quantity *</Label>
              <Input id="qty" type="number" min="0" value={quantity} onChange={e => setQuantity(e.target.value)} />
            </div>
          </div>
          <div>
            <Label htmlFor="expiry">Expiry in Days *</Label>
            <Input id="expiry" type="number" value={expiryDays} onChange={e => setExpiryDays(e.target.value)} />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
