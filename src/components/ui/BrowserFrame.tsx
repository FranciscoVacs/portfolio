function getHostname(url: string): string | null {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

/**
 * Envoltorio decorativo que simula la ventana de un navegador alrededor de
 * una miniatura estática (no hay vistas en vivo, sólo imágenes).
 */
export function BrowserFrame({
  url,
  children,
}: {
  url?: string;
  children: React.ReactNode;
}) {
  const hostname = url ? getHostname(url) : null;

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-muted">
      <div
        aria-hidden="true"
        className="flex h-6 items-center gap-3 border-border border-b bg-background px-3"
      >
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-border" />
          <span className="h-2 w-2 rounded-full bg-border" />
          <span className="h-2 w-2 rounded-full bg-border" />
        </div>
        {hostname ? (
          <span className="truncate rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] text-foreground">
            {hostname}
          </span>
        ) : null}
      </div>
      {children}
    </div>
  );
}
