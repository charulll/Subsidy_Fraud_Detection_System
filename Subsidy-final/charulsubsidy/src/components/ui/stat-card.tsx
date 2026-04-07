import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'flagged';
  className?: string;
}

const variantStyles = {
  default: "before:bg-primary",
  success: "before:bg-success",
  warning: "before:bg-warning",
  danger: "before:bg-danger",
  flagged: "before:bg-flagged",
};

export function StatCard({ title, value, icon: Icon, trend, variant = 'default', className }: StatCardProps) {
  return (
    <div className={cn(
      "stat-card relative overflow-hidden rounded-xl bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover",
      "before:absolute before:top-0 before:left-0 before:right-0 before:h-1",
      variantStyles[variant],
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold font-heading text-foreground">{value}</p>
          {trend && (
            <p className={cn(
              "text-xs font-medium",
              trend.isPositive ? "text-success" : "text-danger"
            )}>
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}% from last month
            </p>
          )}
        </div>
        <div className={cn(
          "rounded-lg p-3",
          variant === 'default' && "bg-primary/10 text-primary",
          variant === 'success' && "bg-success/10 text-success",
          variant === 'warning' && "bg-warning/10 text-warning",
          variant === 'danger' && "bg-danger/10 text-danger",
          variant === 'flagged' && "bg-flagged/10 text-flagged",
        )}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
