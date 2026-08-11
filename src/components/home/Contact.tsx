import { useTranslations } from "next-intl";
import { DottedLink } from "@/components/ui/DottedLink";
import { Section } from "@/components/ui/Section";
import { profile } from "@/content/profile";
import { SOCIAL_ICONS } from "@/lib/social-icons";

export function Contact() {
  const t = useTranslations("Home");

  const links = [
    {
      href: `mailto:${profile.email}`,
      label: profile.email,
      icon: "email",
      external: false,
    },
    {
      href: profile.linkedin,
      label: "LinkedIn",
      icon: "linkedin",
      external: true,
    },
    { href: profile.github, label: "GitHub", icon: "github", external: true },
    ...(profile.whatsapp
      ? [
          {
            href: profile.whatsapp,
            label: "WhatsApp",
            icon: "whatsapp",
            external: true,
          },
        ]
      : []),
  ];

  return (
    <Section title={t("contact")}>
      <ul className="flex flex-wrap items-center gap-x-7 gap-y-3">
        {links.map((link) => {
          const icon = SOCIAL_ICONS[link.icon];
          return (
            <li key={link.href} className="flex items-center gap-2">
              {icon ? (
                <svg
                  viewBox="0 0 24 24"
                  width="15"
                  height="15"
                  fill={icon.hex}
                  aria-hidden="true"
                  className="shrink-0"
                >
                  <path d={icon.path} />
                </svg>
              ) : null}
              <DottedLink href={link.href} external={link.external}>
                {link.label}
              </DottedLink>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
