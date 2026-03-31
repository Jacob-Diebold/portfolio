"use client";
import { ArrowUpRight } from "lucide-react";

import { LinkButton } from "@/components/link-button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { featuredProjects, site } from "@/lib/site";
import { FlipDotHero } from "@/features/flipdot";
import { useTheme } from "next-themes";

export default function HomePage() {
  const { theme } = useTheme();

  const isDark = theme?.includes("dark");

  const onColor = isDark ? "white" : "#18181b";
  const offColor = isDark ? "#3f3f46" : "#f8fafc";

  return (
    <>
      <section className="border-b border-border/80 bg-muted/30" aria-labelledby="hero-heading">
        <FlipDotHero
          rows={9}
          cols={40}
          colors={{
            on: onColor,
            off: offColor,
            rim: onColor,
          }}
          tickIntervalMs={175}
        />
      </section>

      <section
        id="about"
        className="mx-auto max-w-5xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24"
        aria-labelledby="about-heading"
      >
        <h2 id="about-heading" className="font-heading text-2xl font-semibold tracking-tight">
          About
        </h2>
        <Separator className="my-6 max-w-xs" />
        <div className="max-w-2xl space-y-4 text-muted-foreground leading-relaxed">
          <p>
            Use this section for a short bio: your focus areas, tools you like, and what you are
            looking for next. Keep it human and specific — you can refine the copy whenever you
            like.
          </p>
          <p>
            The layout is set up so you can drop in a richer hero above without touching the rest of
            the page.
          </p>
        </div>
      </section>

      <section
        id="projects"
        className="border-y border-border/80 bg-muted/20"
        aria-labelledby="projects-heading"
      >
        <div className="mx-auto max-w-5xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24">
          <h2 id="projects-heading" className="font-heading text-2xl font-semibold tracking-tight">
            Selected work
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Placeholder projects — replace titles, tags, and links with real work.
          </p>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <li key={project.title}>
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardHeader>
                    <CardTitle>{project.title}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </CardContent>
                  <CardFooter className="justify-end border-t">
                    <LinkButton
                      href={project.href}
                      variant="ghost"
                      size="sm"
                      className="gap-1 pr-0"
                      {...(project.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      View
                      <ArrowUpRight className="size-4" />
                    </LinkButton>
                  </CardFooter>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="contact"
        className="mx-auto max-w-5xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24"
        aria-labelledby="contact-heading"
      >
        <h2 id="contact-heading" className="font-heading text-2xl font-semibold tracking-tight">
          Contact
        </h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Swap this CTA for a form, calendar link, or your preferred channel.
        </p>
        <Card className="mt-8 max-w-xl">
          <CardHeader>
            <CardTitle>Say hello</CardTitle>
            <CardDescription>
              Direct line for collaborations, freelance, or full-time conversations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LinkButton href={site.links.email} size="default">
              Send an email
            </LinkButton>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
