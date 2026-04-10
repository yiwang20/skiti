import Link from "next/link";
import { Personality } from "@/data/personalities";

interface Props {
  personality: Personality;
  href?: string;
}

export default function PersonalityCard({ personality, href }: Props) {
  const target = href ?? `/type/${personality.slug}`;

  return (
    <Link
      href={target}
      className="block bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] p-5 hover:shadow-md transition-shadow"
    >
      <div className="aspect-square mb-3 flex items-center justify-center bg-[var(--color-primary-light)] rounded-lg overflow-hidden">
        <img
          src={personality.image}
          alt={personality.name}
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>
      <div className="text-base font-mono font-semibold text-[var(--color-primary)] tracking-wider mb-1">
        {personality.code}
      </div>
      <h3 className="text-lg font-bold mb-1">{personality.name}</h3>
      <p className="text-xs text-[var(--color-text-secondary)]">
        {personality.slogan}
      </p>
    </Link>
  );
}
