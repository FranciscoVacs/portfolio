import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { profile } from "@/content/profile";

export function Contact() {
  const t = useTranslations("Home");

  const links = [
    { href: `mailto:${profile.email}`, label: profile.email, external: false },
    { href: profile.linkedin, label: "LinkedIn", external: true },
    { href: profile.github, label: "GitHub", external: true },
    ...(profile.whatsapp
      ? [{ href: profile.whatsapp, label: "WhatsApp", external: true }]
      : []),
  ];

  return (
    <Section title={t("contact")}>
      <ul className="flex flex-wrap gap-5 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              {...(link.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="text-primary underline underline-offset-4"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
