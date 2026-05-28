import { cn } from "@/lib/utils";

export function PageHeader({ eyebrow, title, description, icon: Icon, actions }: {
  eyebrow?: string;
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
      <div className="flex items-start gap-4">
        {Icon && (
          <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow shrink-0">
            <Icon className="h-6 w-6 text-primary-foreground" />
          </div>
        )}
        <div>
          {eyebrow && <div className="text-xs uppercase tracking-widest text-primary mb-1">{eyebrow}</div>}
          <h1 className="text-3xl sm:text-4xl font-display font-semibold">{title}</h1>
          {description && <p className="text-muted-foreground mt-2 max-w-2xl">{description}</p>}
        </div>
      </div>
      {actions}
    </div>
  );
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn(
      "rounded-2xl border border-border bg-gradient-surface shadow-elegant p-5 sm:p-6",
      className,
    )}>
      {children}
    </div>
  );
}

export function SkeletonBlock({ className }: { className?: string }) {
  return <div className={cn("rounded-md bg-muted shimmer", className)} />;
}

export function LoadingState({ label = "Generating with AI…" }: { label?: string }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-primary">
        <span className="h-2 w-2 rounded-full bg-primary animate-pulse-dot" />
        <span className="h-2 w-2 rounded-full bg-primary-glow animate-pulse-dot" style={{ animationDelay: "0.15s" }} />
        <span className="h-2 w-2 rounded-full bg-accent animate-pulse-dot" style={{ animationDelay: "0.3s" }} />
        <span className="ml-2 text-muted-foreground">{label}</span>
      </div>
      <SkeletonBlock className="h-3 w-3/4" />
      <SkeletonBlock className="h-3 w-full" />
      <SkeletonBlock className="h-3 w-5/6" />
      <SkeletonBlock className="h-3 w-2/3" />
    </div>
  );
}
