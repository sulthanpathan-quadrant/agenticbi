import { KPI } from '@/components/types/dashboard';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  kpi: KPI;
  delay?: number;
}

export function KPICard({ kpi, delay = 0 }: KPICardProps) {
  const isPositive = kpi.change >= 0;
  
  return (
    <div 
      className="kpi-card animate-slide-up opacity-0 p-4"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted-foreground truncate">{kpi.label}</p>
          <p className="text-lg font-bold text-foreground font-mono mt-0.5">{kpi.value}</p>
        </div>
        <div className={cn(
          'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full shrink-0',
          isPositive ? 'text-chart-green bg-chart-green/10' : 'text-destructive bg-destructive/10'
        )}>
          {isPositive ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          <span>{kpi.changeLabel}</span>
        </div>
      </div>
    </div>
  );
}