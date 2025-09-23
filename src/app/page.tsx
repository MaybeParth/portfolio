import Hero from "@/components/hero";
import SkillsGrid from "@/components/skills-grid";
import Projects from "@/components/projects";
import ContactForm from "@/components/contact-form";

export default function Home() {
  return (
    <>
      <Hero />
      <div className="mt-4" />
      <SkillsGrid />
      <Projects />
      <section id="contact" className="py-12">
        <h2 className="text-xl md:text-2xl font-semibold mb-6">Contact</h2>
        <ContactForm />
      </section>
    </>
  );
}
