import { experiences } from "@/lib/data";
import { Card } from "@/components/ui/card";

export default function Experience() {
  return (
    <section className="py-12">
      <h2 className="text-xl md:text-2xl font-semibold mb-6">Experience</h2>
      <div className="space-y-4">
        {experiences.map((e) => (
          <Card key={`${e.company}-${e.role}`} className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{e.role} · {e.company}</h3>
                <p className="text-sm text-muted-foreground">{e.period} · {e.location}</p>
              </div>
            </div>
            <ul className="mt-3 list-disc pl-5 text-sm text-muted-foreground space-y-1">
              {e.highlights.map((h) => <li key={h}>{h}</li>)}
            </ul>
          </Card>
        ))}
      </div>
    </section>
  );
}
