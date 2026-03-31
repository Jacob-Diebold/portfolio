import Link from "next/link";

import { LinkButton } from "@/components/link-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { site } from "@/lib/site";

const nav = [
  { href: "#about", label: "About" },
  { href: "#projects", label: "Work" },
  { href: "#contact", label: "Contact" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="font-heading text-sm font-semibold tracking-tight text-foreground hover:text-foreground/80"
        >
          {site.name}
        </Link>
        <nav
          className="-mx-1 flex max-w-[55vw] flex-1 justify-end gap-0.5 overflow-x-auto sm:max-w-none sm:flex-none sm:justify-center"
          aria-label="Primary"
        >
          {nav.map((item) => (
            <LinkButton key={item.href} href={item.href} variant="ghost" size="sm">
              {item.label}
            </LinkButton>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-1">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
