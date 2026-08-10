import { profile } from "@/content/profile";
import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="mt-20 border-border border-t py-8">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-4 text-muted-foreground text-sm">
          <span>
            © {new Date().getFullYear()} {profile.name}
          </span>
          <div className="flex gap-4">
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              GitHub
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              LinkedIn
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="transition-colors hover:text-foreground"
            >
              Email
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
