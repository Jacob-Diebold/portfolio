import Link from "next/link";

import { Separator } from "@/components/ui/separator";
import { site } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/80 bg-muted/10">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            © {year} {site.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <Link
              href={site.links.linkedin}
              className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              rel="noopener noreferrer"
              target="_blank"
            >
              LinkedIn
            </Link>
            <Separator orientation="vertical" className="hidden h-4 sm:block" />
            <Link
              href={site.links.github}
              className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              rel="noopener noreferrer"
              target="_blank"
            >
              GitHub
            </Link>
            <Separator orientation="vertical" className="hidden h-4 sm:block" />
            <Link
              href={site.links.email}
              className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Email
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
