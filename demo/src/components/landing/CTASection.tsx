"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ------------------------------------------------------------------ */
/*  Variants                                                           */
/* ------------------------------------------------------------------ */

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.17, 0.55, 0.55, 1] as const },
  },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function CTASection() {
  return (
    <section className="relative overflow-hidden px-6 py-28" style={{ background: "var(--cta-gradient)" }}>
      {/* Subtle floating shapes */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="hero-orb-2 absolute -left-20 top-1/4 h-[400px] w-[400px] rounded-full bg-teal/[0.04] blur-3xl" />
        <div className="hero-orb-3 absolute -right-32 bottom-1/4 h-[350px] w-[350px] rounded-full bg-indigo/[0.04] blur-3xl" />
      </div>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="relative mx-auto max-w-3xl text-center"
      >
        {/* Heading */}
        <motion.h2
          variants={fadeUp}
          className="font-serif text-4xl leading-tight text-white md:text-5xl"
        >
          Ready to Modernize Your{" "}
          <span className="text-teal-light">Consent Workflow</span>?
        </motion.h2>

        {/* Subtext */}
        <motion.p
          variants={fadeUp}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300"
        >
          Join healthcare organizations already using ConsentHub to streamline
          consent management and stay compliant.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button
            size="lg"
            className="h-12 cursor-pointer rounded-lg bg-teal px-8 text-base font-semibold text-white shadow-lg shadow-teal/20 transition-all duration-200 hover:bg-teal-light hover:shadow-xl hover:shadow-teal/30"
          >
            Schedule a Demo
            <ArrowRight className="ml-1.5 size-4" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="h-12 cursor-pointer rounded-lg border-slate-500 bg-transparent px-8 text-base font-semibold text-white transition-all duration-200 hover:border-slate-400 hover:bg-white/10"
          >
            <BookOpen className="mr-1.5 size-4" />
            View Documentation
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
