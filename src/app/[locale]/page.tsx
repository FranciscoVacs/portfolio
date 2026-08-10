import { About } from "@/components/home/About";
import { Contact } from "@/components/home/Contact";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { Hero } from "@/components/home/Hero";
import { Timeline } from "@/components/home/Timeline";
import { Container } from "@/components/layout/Container";

export default function HomePage() {
  return (
    <Container>
      <Hero />
      <About />
      <Timeline />
      <FeaturedWork />
      <Contact />
    </Container>
  );
}
