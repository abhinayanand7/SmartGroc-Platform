import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CreditCard, Smartphone, Banknote, Loader2, CheckCircle2, PackageCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export type PaymentMethod = 'card' | 'upi' | 'cod';

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: number;
  /** Called when the simulated payment finishes successfully. Receives the chosen method. */
  onPaymentComplete: (method: PaymentMethod) => void;
}

type Stage = 'select' | 'processing' | 'success';

const OPTIONS: { id: PaymentMethod; label: string; desc: string; Icon: typeof CreditCard }[] = [
  { id: 'card', label: 'Card Payment', desc: 'Visa, Mastercard, Rupay', Icon: CreditCard },
  { id: 'upi', label: 'UPI Payment', desc: 'GPay, PhonePe, Paytm', Icon: Smartphone },
  { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when you receive', Icon: Banknote },
];

export default function PaymentModal({ open, onOpenChange, amount, onPaymentComplete }: PaymentModalProps) {
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [stage, setStage] = useState<Stage>('select');

  const reset = () => {
    setMethod(null);
    setStage('select');
  };

  const handleClose = (next: boolean) => {
    if (stage === 'processing') return; // prevent closing during processing
    if (!next) reset();
    onOpenChange(next);
  };

  const handleProceed = () => {
    if (!method) return;
    setStage('processing');
    const delay = method === 'cod' ? 5000 : 3000;
    setTimeout(() => {
      setStage('success');
      // Notify parent so it can place the order, clear cart, navigate, etc.
      onPaymentComplete(method);
      // Auto-close shortly after showing success
      setTimeout(() => {
        onOpenChange(false);
        reset();
      }, 1500);
    }, delay);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {stage === 'select' && (
          <>
            <DialogHeader>
              <DialogTitle className="font-heading">Choose Payment Method</DialogTitle>
              <DialogDescription>
                Total payable: <span className="font-semibold text-primary">₹{amount.toFixed(2)}</span>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2.5 mt-2">
              {OPTIONS.map(({ id, label, desc, Icon }) => {
                const selected = method === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setMethod(id)}
                    className={cn(
                      'w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all',
                      selected
                        ? 'border-primary bg-secondary'
                        : 'border-border hover:border-primary/40'
                    )}
                  >
                    <div
                      className={cn(
                        'h-10 w-10 rounded-lg flex items-center justify-center shrink-0',
                        selected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn('font-semibold', selected ? 'text-primary' : 'text-foreground')}>
                        {label}
                      </p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                    <div
                      className={cn(
                        'h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0',
                        selected ? 'border-primary' : 'border-muted-foreground/30'
                      )}
                    >
                      {selected && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <Button className="w-full mt-2" size="lg" disabled={!method} onClick={handleProceed}>
              Proceed to Pay ₹{amount.toFixed(2)}
            </Button>
          </>
        )}

        {stage === 'processing' && (
          <div className="py-10 text-center">
            <div className="relative mx-auto mb-6 h-20 w-20">
              <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" />
              <div className="relative h-20 w-20 rounded-full bg-primary/15 flex items-center justify-center">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
              </div>
            </div>
            <h2 className="font-heading text-xl font-bold text-foreground mb-1">
              {method === 'cod' ? 'Confirming your order…' : 'Processing Payment…'}
            </h2>
            <p className="text-muted-foreground text-sm">
              {method === 'cod'
                ? 'Please wait while we confirm your COD order'
                : 'Securely processing your payment, please wait'}
            </p>
          </div>
        )}

        {stage === 'success' && (
          <div className="py-8 text-center animate-fade-in">
            <div className="mx-auto mb-5 h-20 w-20 rounded-full bg-safe/15 flex items-center justify-center">
              {method === 'cod' ? (
                <PackageCheck className="h-10 w-10 text-safe" />
              ) : (
                <CheckCircle2 className="h-10 w-10 text-safe" />
              )}
            </div>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-1">
              {method === 'cod' ? 'Order Confirmed' : 'Payment Successful'}
            </h2>
            <p className="text-muted-foreground">
              {method === 'cod' ? '💵 Pay on Delivery' : '🎉 Thank you for your purchase!'}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
