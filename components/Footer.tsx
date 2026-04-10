import Link from "next/link";

const footerLinks = [
  { href: "/", label: "首页" },
  { href: "/test", label: "开始测试" },
  { href: "/types", label: "人格类型" },
  { href: "/about", label: "关于测试" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <p className="text-xs text-[var(--color-text-secondary)]">
          SKTI — Ski Type Indicator
        </p>
      </div>
    </footer>
  );
}
