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
            I&apos;m a full-stack developer in {site.location}. I build products end to end — mostly
            TypeScript, React, React Native, and Node — and I currently the only developer shipping
            software at Premier Roofing. Before engineering I led teams in the field, which still
            shapes how I design tools people will actually use.
          </p>
          <p>
            Below are some of my personal products that illustrate how I like to design and ship. If
            you have a full-time role available, I&apos;d love to hear from you.
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
            Personal Products
          </h2>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 sm:items-stretch lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <li key={project.title} className="flex h-full min-h-0">
                <Card className="flex h-full w-full flex-col transition-shadow hover:shadow-md">
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
                  <CardFooter className="shrink-0 justify-end border-t">
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
          Reach out about full-time opportunities or to connect.
        </p>
        <Card className="mt-8 max-w-xl">
          <CardHeader>
            <CardTitle>Say hello</CardTitle>
            <CardDescription>
              LinkedIn is the best place to reach me first; email is fine too.
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
          </CardContent>
        </Card>
      </section>
    </>
  );
}
