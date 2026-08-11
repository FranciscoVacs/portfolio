import type { Metadata } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/site";
import "../globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

/** Serif de los títulos: solo existe en un peso, de ahí el weight fijo. */
const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

/** Monoespaciada para fechas, etiquetas y todo lo que sea metadato. */
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-brand",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t("title"),
      template: "%s · Francisco Vacs",
    },
    description: t("description"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <head>
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: habilita el revelado sólo si hay JS
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add("js")`,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${display.variable} ${mono.variable} font-sans antialiased`}
      >
        <NextIntlClientProvider>
          <div className="flex min-h-screen flex-col">
            <Nav />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
