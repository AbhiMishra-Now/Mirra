"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Star } from "lucide-react";
import GlassCard from "./ui/GlassCard";

const reviews = [
  {
    name: "Sophia Martinez",
    handle: "@sophia.styles",
    role: "Fashion & Lifestyle Creator (1.2M)",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    quote:
      "MIRRA has completely changed my production workflow. I can generate 10 virtual outfits in under a minute, style them for my feed, and drop Amazon affiliate links that convert like crazy. I saved thousands on buying physical samples!",
  },
  {
    name: "Marcus Chen",
    handle: "@marcus.fit",
    role: "Menswear Curator (450k)",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    quote:
      "The photorealism of the AI Studio drape is absolutely insane. Shadows, folds, lighting—everything looks 100% real. My affiliate link conversion rates have gone up by 42% since I started posting styled virtual try-ons.",
  },
  {
    name: "Elena Rostova",
    handle: "@elena.lookbook",
    role: "Pinterest Stylist & Blogger (800k)",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
    quote:
      "I use MIRRA Motion to convert static try-on styles into vertical video loops. The video reels look so premium and feel like high-end designer clips. It is by far the best tool for modern affiliate marketers.",
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 sm:py-28 max-w-6xl mx-auto w-full px-4 text-center select-none">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mb-16 sm:mb-20"
      >
        <h2 className="text-3xl sm:text-5xl font-bold text-text-heading tracking-tight mb-4 font-syncopate uppercase">
          Loved by top creators.
        </h2>
        <p className="text-base sm:text-lg text-text-body font-semibold max-w-xl mx-auto leading-relaxed">
          See how stylists, influencers, and affiliate marketers are using virtual try-ons to scale their audience.
        </p>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 text-left items-stretch">
        {reviews.map((review, idx) => (
          <GlassCard
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: idx * 0.15 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="p-8 sm:p-10 flex flex-col justify-between border border-white/60 bg-white/30 backdrop-blur-xl h-full"
          >
            <div>
              {/* Stars */}
              <div className="flex items-center gap-1 mb-6">
                {[...Array(5)].map((_, sIdx) => (
                  <Star key={sIdx} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              
              {/* Quote */}
              <p className="text-sm sm:text-base font-semibold text-text-body leading-relaxed mb-8 italic">
                &ldquo;{review.quote}&rdquo;
              </p>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-4 border-t border-white/20 pt-6 mt-auto">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/80 shadow-md">
                <Image
                  src={review.image}
                  alt={review.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-base font-extrabold text-text-heading leading-tight">{review.name}</span>
                <span className="text-xs font-bold text-pink-500">{review.handle}</span>
                <span className="text-[10px] font-semibold text-text-body mt-0.5">{review.role}</span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
