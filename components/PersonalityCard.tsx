import Link from "next/link";
import { Personality } from "@/data/personalities";

interface Props {
  personality: Personality;
  href?: string;
}

const emojiMap: Record<string, string> = {
  sofa: "🛋️", yolo: "🔥", gucci: "👗", gps: "🧭", "404": "🌲",
  bling: "💎", npc: "🎮", drama: "🎭", ice: "🧊", wifi: "📶",
  sensei: "🎓", vip: "👑", penguin: "🐧", pro: "⭐", couple: "💕",
  collector: "📍", park: "🏂", photo: "📸", drunk: "🍷", early: "🌅",
  rental: "🏷️", safety: "⛑️", groupie: "👥", zen: "🧘", flex: "✈️",
};

export default function PersonalityCard({ personality, href }: Props) {
  const target = href ?? `/type/${personality.slug}`;
  const emoji = emojiMap[personality.slug] ?? "⛷️";

  return (
    <Link
      href={target}
      className="block bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] p-5 hover:shadow-md transition-shadow"
    >
      <div className="text-3xl mb-2">{emoji}</div>
      <div className="text-xs text-[var(--color-text-secondary)] mb-1">
        你的人格类型是：
      </div>
      <div className="text-xs font-mono text-[var(--color-text-secondary)] mb-2">
        {personality.code}
      </div>
      <h3 className="text-xl font-bold mb-1">{personality.name}</h3>
      <p className="text-sm text-[var(--color-text-secondary)]">
        {personality.slogan}
      </p>
    </Link>
  );
}
