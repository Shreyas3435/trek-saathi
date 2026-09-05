import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  className?: string;
}

export function StatCard({ label, value, icon: Icon, className }: StatCardProps) {
  return (
    <Card className={cn("p-5", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-moss">{label}</span>
        {Icon && <Icon className="h-4 w-4 text-moss" />}
      </div>
      <p className="num mt-2 text-3xl font-display font-semibold text-pine">{value}</p>
    </Card>
  );
}
