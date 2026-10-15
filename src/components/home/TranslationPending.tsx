import { useLocale } from "next-intl";
import { Container } from "@/components/layout/Container";
import { DottedLink } from "@/components/ui/DottedLink";
import { ProfilePicker } from "./ProfilePicker";

export function TranslationPending({ id }: { id: string }) {
  const es = useLocale() === "es";
  return (
    <Container>
      <ProfilePicker active={id} />
      <section className="py-14">
        <h1 className="text-[2.1rem] text-primary">
          {es ? "Traducción pendiente" : "Translation pending"}
        </h1>
        <p className="mt-4 text-foreground">
          {es
            ? "Este perfil todavía no tiene una traducción actualizada."
            : "The English version of this profile is being updated."}
        </p>
        <DottedLink href={`/es/perfil/${id}`} className="mt-6 inline-block">
          {es ? "Ver perfil en español" : "View Spanish profile"}
        </DottedLink>
      </section>
    </Container>
  );
}
