import { projects } from "@/lib/data";
import Link from "next/link";

export default function Projects() {
  return (
    <section id="projects" className="py-12">
      <h2 className="text-xl md:text-2xl font-semibold mb-6">Projects</h2>
      <div className="grid sm:grid-cols-2 gap-6">
        {projects.map(p => (
          <div key={p.title} className="p-5 rounded-2xl border">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold">{p.title}</h3>
              {p.repo && <Link className="text-sm underline" href={p.repo}>Code</Link>}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {p.tech.map(t => <span key={t} className="text-xs rounded-full border px-2 py-0.5">{t}</span>)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
