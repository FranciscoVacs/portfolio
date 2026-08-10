export function TechBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-muted px-2 py-1 font-medium text-foreground text-xs transition-colors hover:bg-border">
      {children}
    </span>
  );
}
