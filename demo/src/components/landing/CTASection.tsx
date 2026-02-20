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
      {/* Layered background effects */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {/* Radial center highlight */}
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at center, rgba(13,148,136,0.1) 0%, transparent 70%)' }} />
        {/* Animated floating orbs */}
        <div className="hero-orb-2 absolute -left-20 top-1/4 h-[400px] w-[400px] rounded-full bg-teal/10 blur-[120px]" />
        <div className="hero-orb-3 absolute -right-32 bottom-1/4 h-[350px] w-[350px] rounded-full bg-indigo/10 blur-[120px]" />
        {/* Small decorative circles */}
        <div className="hero-orb-1 absolute left-1/4 top-1/3 h-3 w-3 rounded-full bg-teal/20 blur-sm" />
        <div className="hero-orb-3 absolute right-1/3 bottom-1/3 h-4 w-4 rounded-full bg-indigo/15 blur-sm" />
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
          className="font-serif text-4xl font-bold leading-tight text-white md:text-5xl"
        >
          Ready to Modernize Your{" "}
          <span className="text-teal-400">Consent Workflow</span>?
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
            className="h-14 cursor-pointer rounded-xl bg-gradient-to-r from-teal-dark to-teal px-10 text-lg font-semibold text-white shadow-lg shadow-teal/30 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-teal/40"
          >
            Schedule a Demo
            <ArrowRight className="ml-2 size-5" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="h-14 cursor-pointer rounded-xl border-2 border-white/30 bg-transparent px-10 text-lg font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/10"
          >
            <BookOpen className="mr-2 size-5" />
            View Documentation
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
