import { useState, useMemo } from 'react';
import { useStore } from '@/context/StoreContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Trash2, Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';
import { Expense } from '@/types';

const EXPENSE_CATEGORIES = ['Groceries', 'Dairy', 'Snacks', 'Beverages', 'Household', 'Other'];

export default function ExpensesPage() {
  const { expenses, addExpense, deleteExpense, role } = useStore();
  const [formOpen, setFormOpen] = useState(false);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Groceries');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month');

  const filteredExpenses = useMemo(() => {
    const now = new Date();
    return expenses.filter(e => {
      const d = new Date(e.date);
      switch (period) {
        case 'day': return d.toDateString() === now.toDateString();
        case 'week': {
          const weekAgo = new Date(now);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return d >= weekAgo;
        }
        case 'month': return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        case 'year': return d.getFullYear() === now.getFullYear();
      }
    });
  }, [expenses, period]);

  const totals = useMemo(() => {
    const income = filteredExpenses.filter(e => e.type === 'income').reduce((s, e) => s + e.amount, 0);
    const expense = filteredExpenses.filter(e => e.type === 'expense').reduce((s, e) => s + e.amount, 0);
    return { income, expense, net: income - expense };
  }, [filteredExpenses]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc.trim() || !amount) { toast.error('Fill all fields'); return; }
    addExpense({
      description: desc.trim(),
      amount: parseFloat(amount),
      category,
      type,
      date: new Date().toISOString(),
    });
    toast.success('Expense added!');
    setFormOpen(false);
    setDesc(''); setAmount('');
  };

  return (
    <div className="container py-6 max-w-3xl space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-foreground">
          {role === 'admin' ? 'Store Expenses' : 'My Expenses'}
        </h1>
        <Button onClick={() => setFormOpen(true)}><Plus className="h-4 w-4 mr-1" /> Add</Button>
      </div>

      <div className="flex gap-2">
        {(['day', 'week', 'month', 'year'] as const).map(p => (
          <Button key={p} variant={period === p ? 'default' : 'outline'} size="sm" onClick={() => setPeriod(p)} className="capitalize">
            {p}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-1"><TrendingUp className="h-4 w-4 text-safe" /><span className="text-xs text-muted-foreground">Income</span></div>
          <span className="text-xl font-heading font-bold text-card-foreground">₹{totals.income.toFixed(0)}</span>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-1"><TrendingDown className="h-4 w-4 text-destructive" /><span className="text-xs text-muted-foreground">Expenses</span></div>
          <span className="text-xl font-heading font-bold text-card-foreground">₹{totals.expense.toFixed(0)}</span>
        </div>
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-1"><Wallet className="h-4 w-4 text-primary" /><span className="text-xs text-muted-foreground">Net</span></div>
          <span className={`text-xl font-heading font-bold ${totals.net >= 0 ? 'text-safe' : 'text-destructive'}`}>₹{totals.net.toFixed(0)}</span>
        </div>
      </div>

      {filteredExpenses.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Wallet className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p>No expenses for this period</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredExpenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(exp => (
            <div key={exp.id} className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm">
              <div>
                <p className="font-medium text-card-foreground">{exp.description}</p>
                <p className="text-xs text-muted-foreground">{exp.category} · {new Date(exp.date).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`font-heading font-bold ${exp.type === 'income' ? 'text-safe' : 'text-destructive'}`}>
                  {exp.type === 'income' ? '+' : '-'}₹{exp.amount}
                </span>
                <button onClick={() => { deleteExpense(exp.id); toast.success('Deleted'); }} className="text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="font-heading">Add Expense</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Description</Label>
              <Input value={desc} onChange={e => setDesc(e.target.value)} placeholder="e.g. Monthly groceries" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Amount (₹)</Label>
                <Input type="number" min="0" value={amount} onChange={e => setAmount(e.target.value)} />
              </div>
              <div>
                <Label>Type</Label>
                <Select value={type} onValueChange={(v) => setType(v as 'income' | 'expense')}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
