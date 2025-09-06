import { projects } from "@/lib/data";
import ProjectsCarousel from "@/components/projects-carousel";

export default function Projects() {
  return (
    <section id="projects" className="py-12">
      <h2 className="mb-6 text-xl md:text-2xl font-semibold">Projects</h2>
      <ProjectsCarousel items={projects} />
    </section>
  );
}
