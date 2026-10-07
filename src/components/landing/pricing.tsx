"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Typewriter } from "./typewriter";

interface PricingProps {
  isAuthed: boolean;
}

export function Pricing({ isAuthed }: PricingProps) {
  return (
    <section
      id="pricing"
      className="relative isolate overflow-hidden border-t border-border bg-background"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grid-sm opacity-30"
      />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:px-8"
      >
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-primary">
          Plans and pricing
        </p>
        <h2 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          <Typewriter text="Pricing will be shared before launch" speed={35} />
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
          JuanProperty is still in development. We have not set plan limits,
          trial terms, or subscription prices yet.
        </p>
        <a
          href={isAuthed ? "/dashboard" : "/login"}
          className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Open the current workspace
          <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
        </a>
      </motion.div>
    </section>
  );
}
