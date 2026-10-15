import { resolveCv } from "@/lib/cv-bridge";

// Stable URLs always resolve to the currently deployed snapshot, never an old PDF.
export async function GET(
  request: Request,
  { params }: { params: Promise<{ format: string }> },
) {
  const { format } = await params;
  if (!["es", "en", "europass"].includes(format))
    return new Response("Formato inexistente", { status: 404 });
  const url = new URL(request.url),
    id = url.searchParams.get("profile") || undefined;
  const { content } = resolveCv(format === "es" ? "es" : "en", id);
  const pdf =
    format === "europass" ? content?.pdf.europass : content?.pdf.classic;
  if (!pdf)
    return new Response(
      "El CV actualizado todavía no está disponible en este idioma.",
      { status: 404, headers: { "Cache-Control": "no-store" } },
    );
  return new Response(null, {
    status: 307,
    headers: { Location: new URL(pdf, url).href, "Cache-Control": "no-store" },
  });
}
