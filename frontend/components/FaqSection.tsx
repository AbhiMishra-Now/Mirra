"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import GlassCard from "./ui/GlassCard";

const faqs = [
  {
    question: "How does the AI clothing try-on work?",
    answer:
      "You simply upload a clear, full-body photo of yourself and select any garment from our catalog (or upload a product flat-lay). Our advanced AI drapes the fabric dynamically onto your posture, matching the lighting, texture, folds, and environment instantly.",
  },
  {
    question: "What accessories can I try on in real-time?",
    answer:
      "Our Live AR Mirror uses webcam-based tracking to let you try on accessories like glasses, sunglasses, hats, jewelry, and makeup. The MediaPipe model scales and rotates the 3D assets in real-time as you move your head.",
  },
  {
    question: "Can I use MIRRA to earn affiliate commissions?",
    answer:
      "Yes! Every item tried on is linked with our Amazon Associates Engine. When you create styling cards or generate motion reels, you can export them directly with tracking links. If a viewer buys the look, you earn a commission.",
  },
  {
    question: "What is MIRRA Motion video generation?",
    answer:
      "MIRRA Motion is our premium image-to-video feature. It takes a static, successful virtual try-on image and animates the model walking or turning in a 3-5 second vertical runway loop, perfect for uploading to TikTok or Instagram Reels.",
  },
  {
    question: "Is my personal photo data secure?",
    answer:
      "Absolutely. We prioritize your privacy. Uploaded photos are stored in secure Vercel Blob storage, processed in secure sandboxed API routes, and are never shared or used to train public models. You can wipe your history at any time.",
  },
];

export default function FaqSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (idx: number) => {
    setActiveIndex(activeIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 sm:py-28 max-w-3xl mx-auto w-full px-4 text-center select-none">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mb-12 sm:mb-16"
      >
        <h2 className="text-3xl sm:text-5xl font-bold text-text-heading tracking-tight mb-4 font-syncopate uppercase">
          Frequently asked questions.
        </h2>
        <p className="text-base sm:text-lg text-text-body font-semibold max-w-xl mx-auto leading-relaxed">
          Got questions about virtual try-ons, video rendering, or affiliate links? We have answers.
        </p>
      </motion.div>

      {/* Accordion List */}
      <div className="flex flex-col gap-4 text-left">
        {faqs.map((faq, idx) => {
          const isOpen = activeIndex === idx;
          return (
            <GlassCard
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="overflow-hidden border border-white/60 bg-white/30 backdrop-blur-xl rounded-2xl"
            >
              <button
                onClick={() => toggleAccordion(idx)}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
              >
                <span className="text-base sm:text-lg font-bold text-text-heading pr-4">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-1 rounded-full bg-white/30 text-text-heading shrink-0 border border-white/40"
                >
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 pt-1 text-sm sm:text-base font-semibold text-text-body border-t border-white/10 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          );
        })}
      </div>
    </section>
  );
}
