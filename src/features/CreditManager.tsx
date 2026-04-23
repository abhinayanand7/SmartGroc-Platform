import { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Trash2, CreditCard, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function CreditManager() {
  const { creditCustomers, addCreditCustomer, addCredit, recordPayment, deleteCreditCustomer } = useStore();
  const [addOpen, setAddOpen] = useState(false);
  const [txnOpen, setTxnOpen] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [txnAmount, setTxnAmount] = useState('');
  const [txnDesc, setTxnDesc] = useState('');
  const [txnType, setTxnType] = useState<'credit' | 'payment'>('credit');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast.error('Enter customer name'); return; }
    addCreditCustomer(name.trim(), phone.trim() || undefined);
    toast.success('Customer added');
    setAddOpen(false);
    setName(''); setPhone('');
  };

  const handleTxn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txnOpen || !txnAmount) return;
    const amt = parseFloat(txnAmount);
    if (amt <= 0) { toast.error('Enter valid amount'); return; }
    if (txnType === 'credit') addCredit(txnOpen, amt, txnDesc || undefined);
    else recordPayment(txnOpen, amt, txnDesc || undefined);
    toast.success(txnType === 'credit' ? 'Credit added' : 'Payment recorded');
    setTxnOpen(null);
    setTxnAmount(''); setTxnDesc('');
  };

  const totalPending = creditCustomers.reduce((s, c) => s + c.balance, 0);

  return (
    <div className="container py-6 max-w-3xl space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-foreground">Credit / Udhaar</h1>
        <Button onClick={() => setAddOpen(true)}><Plus className="h-4 w-4 mr-1" /> Add Customer</Button>
      </div>

      <div className="rounded-xl border bg-card p-4 shadow-sm flex items-center gap-3">
        <CreditCard className="h-5 w-5 text-warning" />
        <div>
          <p className="text-xs text-muted-foreground">Total Pending</p>
          <p className="text-xl font-heading font-bold text-foreground">₹{totalPending.toFixed(0)}</p>
        </div>
      </div>

      {creditCustomers.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <CreditCard className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p>No credit customers yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {creditCustomers.map(c => (
            <div key={c.id} className="rounded-xl border bg-card shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}>
                <div>
                  <p className="font-medium text-card-foreground">{c.name}</p>
                  {c.phone && <p className="text-xs text-muted-foreground">{c.phone}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-heading font-bold ${c.balance > 0 ? 'text-destructive' : 'text-safe'}`}>
                    ₹{c.balance.toFixed(0)} {c.balance > 0 ? 'pending' : 'clear'}
                  </span>
                </div>
              </div>
              {expandedId === c.id && (
                <div className="border-t p-4 space-y-3 bg-muted/30">
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => { setTxnType('credit'); setTxnOpen(c.id); }}>
                      <ArrowUpCircle className="h-3.5 w-3.5 mr-1" /> Add Credit
                    </Button>
                    <Button size="sm" onClick={() => { setTxnType('payment'); setTxnOpen(c.id); }}>
                      <ArrowDownCircle className="h-3.5 w-3.5 mr-1" /> Record Payment
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => { deleteCreditCustomer(c.id); toast.success('Removed'); }}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  {c.history.length > 0 && (
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {c.history.slice().reverse().map(t => (
                        <div key={t.id} className="flex justify-between text-sm py-1 border-b border-border/50 last:border-0">
                          <span className="text-muted-foreground">
                            {t.type === 'credit' ? '🔴 Credit' : '🟢 Payment'} {t.description && `— ${t.description}`}
                          </span>
                          <span className={`font-medium ${t.type === 'credit' ? 'text-destructive' : 'text-safe'}`}>
                            {t.type === 'credit' ? '+' : '-'}₹{t.amount}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Customer Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="font-heading">Add Credit Customer</DialogTitle></DialogHeader>
          <form onSubmit={handleAddCustomer} className="space-y-4">
            <div><Label>Name</Label><Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Rahul" /></div>
            <div><Label>Phone (optional)</Label><Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="9876543210" /></div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
              <Button type="submit">Add</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Transaction Dialog */}
      <Dialog open={!!txnOpen} onOpenChange={() => setTxnOpen(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="font-heading">{txnType === 'credit' ? 'Add Credit' : 'Record Payment'}</DialogTitle></DialogHeader>
          <form onSubmit={handleTxn} className="space-y-4">
            <div><Label>Amount (₹)</Label><Input type="number" min="1" value={txnAmount} onChange={e => setTxnAmount(e.target.value)} /></div>
            <div><Label>Note (optional)</Label><Input value={txnDesc} onChange={e => setTxnDesc(e.target.value)} placeholder="e.g. Milk purchase" /></div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setTxnOpen(null)}>Cancel</Button>
              <Button type="submit">{txnType === 'credit' ? 'Add Credit' : 'Record Payment'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
