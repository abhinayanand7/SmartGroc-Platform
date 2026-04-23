import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle2, Phone, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PARTNERS = [
  { name: 'Rahul Kumar', phone: '9876543210' },
  { name: 'Amit Sharma', phone: '9123456780' },
  { name: 'Suresh Yadav', phone: '9988776655' },
];

const SIMULATION_MS = 30000;

export default function AssigningDelivery() {
  const navigate = useNavigate();
  const [assigned, setAssigned] = useState<{ name: string; phone: string } | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(Math.floor(SIMULATION_MS / 1000));

  useEffect(() => {
    const timer = setTimeout(() => {
      const partner = PARTNERS[Math.floor(Math.random() * PARTNERS.length)];
      setAssigned(partner);
    }, SIMULATION_MS);

    const interval = setInterval(() => {
      setSecondsLeft(s => (s > 0 ? s - 1 : 0));
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 bg-gradient-to-br from-secondary/40 to-background">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-lg text-center animate-fade-in">
        {!assigned ? (
          <>
            <div className="relative mx-auto mb-6 h-20 w-20">
              <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" />
              <div className="relative h-20 w-20 rounded-full bg-primary/15 flex items-center justify-center">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
              </div>
            </div>
            <h1 className="font-heading text-2xl font-bold text-foreground mb-2">
              Assigning a delivery partner
            </h1>
            <p className="text-muted-foreground mb-6">
              We are assigning a delivery partner to you. Please wait a moment…
            </p>
            <div className="flex justify-center gap-1.5 mb-4">
              <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <p className="text-xs text-muted-foreground">~{secondsLeft}s remaining</p>
          </>
        ) : (
          <>
            <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-safe/15 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-safe" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-foreground mb-1">
              Partner Assigned!
            </h1>
            <p className="text-muted-foreground mb-6">Your order is on the way 🚀</p>

            <div className="rounded-xl border bg-secondary/40 p-5 text-left space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/15 flex items-center justify-center">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Delivery Partner</p>
                  <p className="font-heading font-semibold text-foreground">{assigned.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <a href={`tel:${assigned.phone}`} className="font-medium text-foreground hover:text-primary">
                    {assigned.phone}
                  </a>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={() => navigate('/orders')}>
                View Orders
              </Button>
              <Button onClick={() => navigate('/')}>Continue Shopping</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
