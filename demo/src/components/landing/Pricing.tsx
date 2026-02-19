"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
}

const tiers: PricingTier[] = [
  {
    name: "Starter",
    price: "$600",
    description: "For small practices getting started",
    features: [
      "Up to 500 patients",
      "3 consent templates",
      "Basic Dynamics sync",
      "Email support",
      "Standard audit logs",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Professional",
    price: "$1,200",
    description: "For growing healthcare organizations",
    features: [
      "Up to 5,000 patients",
      "Unlimited templates",
      "Real-time Dynamics sync",
      "Priority support",
      "Advanced analytics",
      "Patient portal",
      "Custom branding",
    ],
    cta: "Get Started",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$2,000",
    description: "For large organizations with complex needs",
    features: [
      "Unlimited patients",
      "Everything in Professional",
      "Dedicated account manager",
      "Custom integrations",
      "SLA guarantee",
      "On-premise available",
      "HIPAA BAA included",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

/* ------------------------------------------------------------------ */
/*  Variants                                                           */
/* ------------------------------------------------------------------ */

const headerFade = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.17, 0.55, 0.55, 1] as const },
  },
};

const gridStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardSlideUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.17, 0.55, 0.55, 1] as const },
  },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Pricing() {
  return (
    <section id="pricing" className="bg-slate-50 py-24 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          variants={headerFade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-teal">
            Pricing Plans
          </p>
          <h2 className="mt-3 font-serif text-3xl text-navy sm:text-4xl lg:text-5xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
            No per-user fees. No hidden costs. Scale your consent management
            with confidence.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={gridStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="mx-auto grid items-stretch gap-8 sm:max-w-none sm:grid-cols-2 md:grid-cols-3 lg:gap-6"
        >
          {tiers.map((tier) => (
            <motion.div
              key={tier.name}
              variants={cardSlideUp}
              className={cn(
                "relative flex flex-col overflow-hidden rounded-2xl border bg-white transition-all duration-300 hover:-translate-y-1 dark:bg-slate-900",
                tier.popular
                  ? "z-10 border-teal shadow-xl shadow-teal/10 md:scale-[1.04] dark:shadow-teal-950/20"
                  : "border-slate-200 shadow-sm hover:shadow-md dark:border-slate-700 dark:shadow-none dark:hover:shadow-lg dark:hover:shadow-slate-950/30"
              )}
            >
              {/* Teal accent bar on popular */}
              {tier.popular && (
                <div className="h-1 w-full bg-gradient-to-r from-teal via-teal-light to-teal" />
              )}

              <div className="flex flex-1 flex-col p-8">
                {/* Popular badge */}
                {tier.popular && (
                  <div className="mb-4">
                    <span className="inline-flex items-center rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold text-teal dark:bg-teal/15">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Tier name & description */}
                <h3 className="font-serif text-xl text-navy">{tier.name}</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {tier.description}
                </p>

                {/* Price */}
                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-bold tracking-tight text-navy">
                    {tier.price}
                  </span>
                  <span className="ml-1.5 text-sm font-medium text-slate-400 dark:text-slate-500">
                    /month
                  </span>
                </div>

                {/* Divider */}
                <div className="my-6 h-px w-full bg-slate-100 dark:bg-slate-800" />

                {/* Feature list */}
                <ul className="mb-8 flex flex-1 flex-col gap-3.5">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div
                        className={cn(
                          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                          tier.popular
                            ? "bg-teal/10"
                            : "bg-slate-100 dark:bg-slate-800"
                        )}
                      >
                        <Check
                          className={cn(
                            "h-3 w-3",
                            tier.popular
                              ? "text-teal"
                              : "text-slate-500 dark:text-slate-400"
                          )}
                          strokeWidth={3}
                        />
                      </div>
                      <span className="text-sm leading-snug text-slate-600 dark:text-slate-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {tier.popular ? (
                  <Button className="h-11 w-full cursor-pointer rounded-lg bg-teal text-sm font-semibold text-white shadow-md shadow-teal/20 transition-all duration-200 hover:bg-teal-dark hover:shadow-lg hover:shadow-teal/25">
                    {tier.cta}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="h-11 w-full cursor-pointer rounded-lg border-slate-300 text-sm font-semibold text-navy transition-all duration-200 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-800"
                  >
                    {tier.cta}
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
