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
import { FlipDotContainer } from "@/features/flipdot";
import { useCallback, useEffect, useState } from "react";
import { useTheme } from "next-themes";

type Mode = "random" | "static" | "on" | "off" | "wipe";

export default function HomePage() {
  const [rows, setRows] = useState(8);
  const [cols, setCols] = useState(60);
  const [board, setBoard] = useState<number[][]>([]);
  const [mode, setMode] = useState<Mode>("static");
  const [wipeValue, setWipeValue] = useState<0 | 1>(1);

  const setCell = useCallback((row: number, col: number, value: 0 | 1) => {
    setBoard((prev) => {
      if (row < 0 || row >= prev.length || col < 0 || col >= (prev[row]?.length ?? 0)) return prev;
      if ((prev[row][col] !== 0 ? 1 : 0) === value) return prev;
      const next = prev.map((r) => r.slice());
      next[row][col] = value;
      return next;
    });
  }, []);

  useEffect(() => {
    if (mode !== "random") return;
    const interval = setInterval(() => {
      setCell(
        Math.floor(Math.random() * rows),
        Math.floor(Math.random() * cols),
        Math.random() > 0.5 ? 1 : 0,
      );
    }, 1);
    return () => clearInterval(interval);
  }, [mode, rows, cols, setCell]);

  useEffect(() => {
    if (mode !== "on" && mode !== "off") return;
    const tempBoard: number[][] = [];
    const value = mode === "on" ? 1 : 0;
    for (let i = 0; i < rows; i++) {
      tempBoard.push(Array.from({ length: cols }, () => value));
    }
    setBoard(tempBoard);
  }, [mode, rows, cols]);

  useEffect(() => {
    if (mode !== "wipe") return;
    const msPerCell = 10;
    const timeouts: number[] = [];
    let cancelled = false;
    let passValue: 0 | 1 = wipeValue;

    const schedulePass = () => {
      for (let j = 0; j < cols; j++) {
        for (let i = 0; i < rows; i++) {
          const delay = msPerCell * (i * cols + j);
          timeouts.push(
            window.setTimeout(() => {
              if (!cancelled) setCell(i, j, passValue);
            }, delay),
          );
        }
      }
      const lastCellDelay = msPerCell * (rows * cols - 1);
      timeouts.push(
        window.setTimeout(() => {
          if (cancelled) return;
          passValue = passValue === 0 ? 1 : 0;
          setWipeValue(passValue);
          schedulePass();
        }, lastCellDelay + msPerCell),
      );
    };

    schedulePass();

    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
    };
    // `wipeValue` is only the seed when `mode` flips to "wipe`; omitting it from deps avoids restarting (and clearing timeouts) on each toggle inside the loop.
  }, [mode, rows, cols, setCell]);

  useEffect(() => {
    const tempBoard: number[][] = [];
    for (let i = 0; i < rows; i++) {
      tempBoard.push(Array.from({ length: cols }, () => (Math.random() > 0.5 ? 1 : 0) as number));
    }
    setBoard(tempBoard);
  }, [rows, cols]);

  const { theme } = useTheme();

  const isDark = theme?.includes("dark");

  const onColor = isDark ? "white" : "#18181b";
  const offColor = isDark ? "#3f3f46" : "#f8fafc";

  return (
    <>
      {/* Replace this block with your hero concept — kept minimal on purpose. */}
      <section
        className="border-b border-border/80 bg-muted/30 h-screen"
        aria-labelledby="hero-heading"
      >
        <div className="flex gap-5 items-center justify-center">
          {/* TODO: Add better buttons and move them to the features folder */}
          <button onClick={() => setMode("random")}>Random</button>
          <button onClick={() => setMode("static")}>Static</button>
          <button onClick={() => setMode("on")}>On</button>
          <button onClick={() => setMode("off")}>Off</button>
          <button onClick={() => setMode("wipe")}>Wipe</button>
        </div>
        <FlipDotContainer
          rows={rows}
          cols={cols}
          board={board}
          onSetCell={setCell}
          // TODO: Update these colors to allow the user to change the colors of the flipdot board
          colors={{
            on: onColor,
            off: offColor,
            rim: onColor,
          }}
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
