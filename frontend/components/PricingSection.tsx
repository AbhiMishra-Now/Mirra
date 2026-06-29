"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import ClayButton from "./ui/ClayButton";

const plans = [
  {
    name: "Starter",
    price: "$0",
    description: "Perfect for casual shoppers and beginners.",
    features: [
      "3 AI Studio Uploads per day",
      "Live AR Mirror (Standard accessories)",
      "Static Try-On Image Downloads",
      "Standard processing speeds",
    ],
    cta: "Get Started",
    variant: "default" as const,
    shadowClass: "shadow-clay-md",
  },
  {
    name: "Creator Pro",
    price: "$19",
    description: "Built for influencers, affiliate marketers, and brands.",
    features: [
      "Unlimited AI Studio Uploads",
      "Live AR Mirror (All premium accessories)",
      "MIRRA Motion (Image-to-Video generation)",
      "Ultra High-Resolution Downloads",
      "Priority Render Queue (under 5s)",
      "Direct Amazon Affiliate Link Export",
      "Dedicated Creator dashboard & analytics",
    ],
    cta: "Upgrade to Pro",
    variant: "primary" as const,
    shadowClass: "shadow-clay-pink border-2 border-pink-200/50",
    popular: true,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 sm:py-28 max-w-5xl mx-auto w-full px-4 text-center select-none">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mb-16 sm:mb-20"
      >
        <h2 className="text-3xl sm:text-5xl font-bold text-text-heading tracking-tight mb-4 font-syncopate uppercase">
          Simple pricing for creators.
        </h2>
        <p className="text-base sm:text-lg text-text-body font-semibold max-w-xl mx-auto leading-relaxed">
          Start styling for free. Upgrade whenever you need unlimited renders or video exports.
        </p>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto items-stretch text-left">
        {plans.map((plan, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: idx * 0.2 }}
            whileHover={{ y: -6, scale: 1.015 }}
            className={`clay-card p-8 sm:p-10 flex flex-col justify-between relative h-full border border-white/50 bg-gradient-to-br from-white to-[#FDFBF7] ${plan.shadowClass}`}
          >
            {plan.popular && (
              <div className="absolute -top-4.5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-xl border border-pink-200/80 shadow-md text-[10px] font-black tracking-widest text-pink-500 uppercase">
                ✨ Most Popular
              </div>
            )}

            <div>
              <div className="mb-6">
                <h3 className="text-2xl sm:text-3xl font-black text-text-heading mb-2">
                  {plan.name}
                </h3>
                <p className="text-sm font-semibold text-text-body">
                  {plan.description}
                </p>
              </div>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl sm:text-6xl font-black text-text-heading tracking-tight">
                  {plan.price}
                </span>
                <span className="text-sm font-bold text-text-body">/ month</span>
              </div>

              {/* Feature List */}
              <ul className="flex flex-col gap-4 mb-10">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-3 text-sm sm:text-base font-semibold text-text-body">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <a href="/studio" className="w-full">
              <ClayButton variant={plan.variant} className="w-full py-4 text-base font-black">
                {plan.cta}
              </ClayButton>
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
