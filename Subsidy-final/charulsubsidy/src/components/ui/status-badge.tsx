import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      status: {
        approved: "bg-success/10 text-success border border-success/20",
        pending: "bg-warning/10 text-warning border border-warning/20",
        rejected: "bg-danger/10 text-danger border border-danger/20",
        flagged: "bg-flagged/10 text-flagged border border-flagged/20",
        default: "bg-muted text-muted-foreground border border-border",
      },
    },
    defaultVariants: {
      status: "default",
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  children: React.ReactNode;
}

export function StatusBadge({ className, status, children, ...props }: StatusBadgeProps) {
  return (
    <span className={cn(statusBadgeVariants({ status }), className)} {...props}>
      {children}
    </span>
  );
}
