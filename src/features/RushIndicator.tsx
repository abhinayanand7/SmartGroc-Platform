import { useState, useEffect } from 'react';
import { getRushLevel } from '@/types';
import { Users, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function RushIndicator() {
  const [rush, setRush] = useState(getRushLevel());
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setRush(getRushLevel());
      setTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const bgMap = { Low: 'bg-safe/10', Medium: 'bg-warning/10', High: 'bg-destructive/10' };
  const barWidth = { Low: '30%', Medium: '60%', High: '90%' };
  const barColor = { Low: 'bg-safe', Medium: 'bg-warning', High: 'bg-destructive' };

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', bgMap[rush.level])}>
          <Users className={cn('h-5 w-5', rush.color)} />
        </div>
        <div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" /> {time.toLocaleTimeString()}
          </p>
          <p className={cn('font-heading font-bold text-lg', rush.color)}>
            {rush.level} Rush
          </p>
        </div>
      </div>
      <div className="h-2.5 rounded-full bg-muted overflow-hidden">
        <div className={cn('h-full rounded-full transition-all duration-500', barColor[rush.level])} style={{ width: barWidth[rush.level] }} />
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        {rush.level === 'High' ? 'Peak hours — expect more customers' : rush.level === 'Medium' ? 'Moderate traffic — stay prepared' : 'Quiet hours — good time for restocking'}
      </p>
    </div>
  );
}
