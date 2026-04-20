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
    <div className="relative isolate overflow-x-clip">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-128 opacity-70"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 55% 42% at 50% 0%, color-mix(in oklch, var(--foreground), transparent 94%), transparent 72%)",
        }}
      />

      <section className="border-b border-border/80 bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 pb-8 pt-8 sm:px-6 sm:pb-10 sm:pt-12">
          <div className="mx-auto max-w-3xl text-center">
            <p className="inline-flex rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium tracking-wide text-muted-foreground backdrop-blur">
              Full-stack developer open to full-time roles
            </p>
            <h1 className="mt-5 font-heading text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
              I build practical products that look sharp and ship fast.
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              I&apos;m Jacob Diebold in {site.location}. I design and ship full-stack apps with
              TypeScript, React, React Native, Node, and AWS, with a focus on tools that make real
              operations smoother.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
              <LinkButton
                href={site.links.linkedin}
                size="lg"
                target="_blank"
                rel="noopener noreferrer"
                className="gap-1.5"
              >
                Connect on LinkedIn
                <ArrowUpRight className="size-4" />
              </LinkButton>
              <LinkButton href="#projects" variant="outline" size="lg">
                View my work
              </LinkButton>
              <LinkButton
                href={site.links.github}
                variant="ghost"
                size="lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </LinkButton>
            </div>
          </div>
        </div>

        <FlipDotHero
          rows={9}
          cols={80}
          defaultMode="traitsShowcase"
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
        className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24"
        aria-labelledby="about-heading"
      >
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-10">
          <div>
            <h2 id="about-heading" className="font-heading text-2xl font-semibold tracking-tight">
              About
            </h2>
            <Separator className="my-6 max-w-xs" />
            <div className="max-w-2xl space-y-4 text-muted-foreground leading-relaxed">
              <p>
                I build products end to end and currently serve as the only developer; shipping
                software at Premier Roofing. Before engineering, I led teams in the field, which
                shapes how I design software for speed, clarity, and real-world use.
              </p>
              <p>
                These projects show how I think through UX, architecture, and execution. If you have
                a full-time role where ownership matters, I&apos;d love to connect.
              </p>
            </div>
          </div>

          <Card className="h-fit border-border/70 bg-linear-to-b from-card to-muted/20 shadow-sm">
            <CardHeader>
              <CardTitle>What I bring</CardTitle>
              <CardDescription>
                Product-minded engineering with a strong bias for shipping.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="rounded-lg border border-border/70 bg-background/70 p-3">
                <p className="text-sm font-medium">Owns full stack delivery</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  From UI details to backend architecture and deployment.
                </p>
              </div>
              <div className="rounded-lg border border-border/70 bg-background/70 p-3">
                <p className="text-sm font-medium">Strong product instincts</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Prioritizes features that drive usability and outcomes.
                </p>
              </div>
              <div className="rounded-lg border border-border/70 bg-background/70 p-3">
                <p className="text-sm font-medium">Comfortable with ambiguity</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Brings structure to messy, fast-moving environments.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section
        id="projects"
        className="border-y border-border/80 bg-muted/20"
        aria-labelledby="projects-heading"
      >
        <div className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24">
          <h2 id="projects-heading" className="font-heading text-2xl font-semibold tracking-tight">
            Personal products
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            A few projects that show how I design, build, and ship from idea to usable product.
          </p>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 sm:items-stretch lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <li key={project.title} className="flex h-full min-h-0">
                <Card className="group flex h-full w-full flex-col border-border/70 bg-card/85 transition-all hover:-translate-y-0.5 hover:shadow-lg">
                  <CardHeader className="shrink-0">
                    <CardTitle>{project.title}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <div className="min-h-0 flex-1" aria-hidden />
                  <CardContent className="shrink-0 pt-0">
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="shrink-0 justify-end border-t border-border/70">
                    <LinkButton
                      href={project.href}
                      variant="ghost"
                      size="sm"
                      className="gap-1 pr-0"
                      {...(project.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      View project
                      <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
        className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24"
        aria-labelledby="contact-heading"
      >
        <h2 id="contact-heading" className="font-heading text-2xl font-semibold tracking-tight">
          Contact
        </h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Reach out about full-time opportunities, contract work, or just to connect.
        </p>
        <Card className="mt-8 max-w-2xl border-border/70 bg-linear-to-b from-card to-muted/20 shadow-sm">
          <CardHeader>
            <CardTitle>Let&apos;s talk</CardTitle>
            <CardDescription>
              LinkedIn is the fastest way to reach me, and email works great too.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <LinkButton
              href={site.links.linkedin}
              size="default"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </LinkButton>
            <LinkButton href={site.links.email} variant="outline" size="default">
              Email
            </LinkButton>
            <LinkButton
              href={site.links.github}
              variant="ghost"
              size="default"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </LinkButton>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
