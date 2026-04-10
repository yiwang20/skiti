"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/types", label: "人格类型" },
  { href: "/about", label: "关于测试" },
  { href: "/test", label: "开始测试" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="border-b border-[var(--color-border)] bg-[var(--color-card)]">
      <nav className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold tracking-wide">
          SKTI
        </Link>
        <div className="flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors ${
                pathname === link.href
                  ? "text-[var(--color-primary)] font-medium"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
              } ${
                link.href === "/test"
                  ? "bg-[var(--color-primary)] text-white px-4 py-1.5 rounded-full text-sm hover:opacity-90"
                  : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
