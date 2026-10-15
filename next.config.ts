import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/cv/francisco-vacs-cv-es.pdf",
        destination: "/api/cv/es",
        permanent: false,
      },
      {
        source: "/cv/francisco-vacs-cv-en.pdf",
        destination: "/api/cv/en",
        permanent: false,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
