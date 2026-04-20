"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open) {
      if (!el.open) el.showModal();
    } else if (el.open) {
      el.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={cn(
        "fixed top-1/2 left-1/2 z-50 max-h-[min(85vh,32rem)] w-[min(calc(100vw-2rem),24rem)] max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 overflow-x-hidden overflow-y-auto rounded-2xl border border-border/80 bg-card p-0 text-card-foreground shadow-2xl ring-1 ring-foreground/10 backdrop:bg-black/45 backdrop:backdrop-blur-sm",
        className,
      )}
      onClose={() => onOpenChange(false)}
      onCancel={(e) => {
        e.preventDefault();
        onOpenChange(false);
      }}
    >
      <div className="shrink-0 border-b border-border/70 px-5 py-4">
        <h2 className="font-heading text-lg font-semibold tracking-tight">{title}</h2>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      <div className="max-h-[min(60vh,24rem)] overflow-y-auto px-5 py-4">{children}</div>
    </dialog>
  );
}
