import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-[shimmer_1.8s_ease-in-out_infinite] rounded-[var(--radius-md)] bg-gradient-to-r from-[var(--bg-surface)] via-[var(--bg-hover)] to-[var(--bg-surface)] bg-[length:200%_100%]",
        className
      )}
    />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-36 rounded-[var(--radius-xl)]" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-[var(--radius-lg)]" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-72 rounded-[var(--radius-lg)]" />
        <Skeleton className="h-72 rounded-[var(--radius-lg)]" />
      </div>
    </div>
  );
}