import Image from "next/image";
import Link from "next/link";
import { Github, ExternalLink } from "lucide-react";

type Props = {
  title: string;
  description: string;
  image?: string;   // e.g. "/projects/strideguard.png"
  tech?: string[];  // e.g. ["Next.js", "Tailwind"]
  repo?: string;    // GitHub URL
  link?: string;    // Live demo URL
};

export default function ProjectCard({
  title,
  description,
  image,
  tech = [],
  repo,
  link,
}: Props) {
  return (
    <article className="group overflow-hidden rounded-2xl border bg-card transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-md">
      {image && (
        <div className="relative h-56 w-full">
          <Image
            src={image}
            alt={`${title} screenshot`}
            fill
            sizes="(min-width:1280px) 1100px, (min-width:1024px) 900px, (min-width:768px) 700px, 90vw"
            className="object-cover"
            priority={false}
          />
        </div>
      )}

      <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold leading-tight">{title}</h3>
          <div className="flex items-center gap-3 text-sm">
            {link && (
              <Link
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 underline"
                aria-label={`Open live site for ${title}`}
              >
                <ExternalLink size={16} /> Live
              </Link>
            )}
            {repo && (
              <Link
                href={repo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 underline"
                aria-label={`Open GitHub repo for ${title}`}
              >
                <Github size={16} /> GitHub
              </Link>
            )}
          </div>
        </div>

        <p className="mt-3 text-sm text-muted-foreground">{description}</p>

        {tech.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tech.map((t) => (
              <span key={t} className="text-xs rounded-full border px-2 py-0.5">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
