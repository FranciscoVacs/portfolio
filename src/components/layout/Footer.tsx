import { DottedLink } from "@/components/ui/DottedLink";
import { profile } from "@/content/profile";
import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="mt-20 border-border border-t py-8">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-4 text-foreground text-sm">
          <span>
            © {new Date().getFullYear()} {profile.name}
          </span>
          <div className="flex gap-4">
            <DottedLink href={profile.github} external>
              GitHub
            </DottedLink>
            <DottedLink href={profile.linkedin} external>
              LinkedIn
            </DottedLink>
            <DottedLink href={`mailto:${profile.email}`}>Email</DottedLink>
          </div>
        </div>
      </Container>
    </footer>
  );
}
