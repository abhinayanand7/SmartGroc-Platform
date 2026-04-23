import { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserRole } from '@/types';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { Store, ShoppingBag, Shield, Bike } from 'lucide-react';

const roles: { value: UserRole; label: string; icon: React.ReactNode; desc: string }[] = [
  { value: 'customer', label: 'Customer', icon: <ShoppingBag className="h-6 w-6" />, desc: 'Browse shops & buy products' },
  { value: 'shopkeeper', label: 'Shopkeeper', icon: <Store className="h-6 w-6" />, desc: 'Manage your shop & inventory' },
  { value: 'delivery', label: 'Delivery', icon: <Bike className="h-6 w-6" />, desc: 'Deliver orders & earn money' },
  { value: 'admin', label: 'Admin', icon: <Shield className="h-6 w-6" />, desc: 'Full system control' },
];

export default function LoginPage() {
  const { login } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('customer');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    login(email.trim(), role);
    toast.success(`Welcome! Logged in as ${role}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary font-heading text-xl font-bold text-primary-foreground mb-4">
            SG
          </div>
          <h1 className="font-heading text-3xl font-bold text-foreground">SmartGroc</h1>
          <p className="text-muted-foreground mt-2">Intelligent Grocery Management</p>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-lg">
          <h2 className="font-heading text-xl font-semibold mb-6 text-card-foreground">Sign In</h2>

          <div className="grid grid-cols-4 gap-2 mb-6">
            {roles.map(r => (
              <button
                key={r.value}
                type="button"
                onClick={() => setRole(r.value)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-center ${
                  role === r.value
                    ? 'border-primary bg-secondary text-primary'
                    : 'border-border text-muted-foreground hover:border-primary/40'
                }`}
              >
                {r.icon}
                <span className="text-xs font-semibold">{r.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <Button type="submit" className="w-full" size="lg">Login as {roles.find(r => r.value === role)?.label}</Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-medium hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
