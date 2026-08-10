export function TechBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-secondary px-2 py-1 font-medium text-muted-foreground text-xs transition-colors hover:bg-border">
      {children}
    </span>
  );
}
