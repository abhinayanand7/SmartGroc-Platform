import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Heart, LogOut, Menu, X } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const { isLoggedIn, userEmail, role, logout, cartCount, wishlist } = useStore();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = (() => {
    switch (role) {
      case 'admin':
        return [
          { to: '/', label: 'Dashboard' },
          { to: '/analytics', label: 'Analytics' },
          { to: '/credit', label: 'Credit' },
          { to: '/report', label: 'Report' },
          { to: '/insights', label: 'Insights' },
          { to: '/expenses', label: 'Expenses' },
        ];
      case 'shopkeeper':
        return [
          { to: '/', label: 'My Shop' },
          { to: '/credit', label: 'Credit' },
          { to: '/report', label: 'Report' },
          { to: '/insights', label: 'Insights' },
          { to: '/expenses', label: 'Expenses' },
        ];
      case 'delivery':
        return [
          { to: '/', label: 'Dashboard' },
          { to: '/earnings', label: 'Earnings' },
        ];
      case 'customer':
      default:
        return [
          { to: '/', label: 'Shops' },
          { to: '/orders', label: 'Orders' },
          { to: '/history', label: 'History' },
          { to: '/offers', label: 'Offers' },
          { to: '/expenses', label: 'My Expenses' },
        ];
    }
  })();

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary font-heading text-sm font-bold text-primary-foreground">
            SG
          </div>
          <span className="font-heading text-lg font-bold text-foreground">SmartGroc</span>
        </Link>

        {isLoggedIn && (
          <>
            <div className="hidden md:flex items-center gap-5">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    location.pathname === link.to ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden lg:inline text-sm text-muted-foreground">
                Hello, <span className="font-medium text-foreground">{userEmail}</span>
              </span>
              <span className="hidden sm:inline text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium capitalize">
                {role}
              </span>

              {role === 'customer' && (
                <>
                  <Link to="/wishlist" className="relative p-2 hover:bg-accent rounded-lg transition-colors">
                    <Heart className="h-5 w-5 text-muted-foreground" />
                    {wishlist.length > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center font-medium">
                        {wishlist.length}
                      </span>
                    )}
                  </Link>
                  <Link to="/cart" className="relative p-2 hover:bg-accent rounded-lg transition-colors">
                    <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                    {cartCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-medium">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </>
              )}

              <Button variant="destructive" size="sm" onClick={logout} className="hidden sm:flex">
                <LogOut className="h-4 w-4 mr-1" /> Logout
              </Button>

              <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </>
        )}
      </div>

      {mobileOpen && isLoggedIn && (
        <div className="md:hidden border-t bg-card p-4 animate-fade-in">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-sm font-medium text-foreground hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
          <Button variant="destructive" size="sm" onClick={logout} className="mt-2 w-full sm:hidden">
            <LogOut className="h-4 w-4 mr-1" /> Logout
          </Button>
        </div>
      )}
    </nav>
  );
}
