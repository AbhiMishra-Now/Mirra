"use client";

import React from "react";
import { motion } from "framer-motion";
import SocialCards from "./ui/card-fan-carousel";

const CAROUSEL_CARDS = [
  { imgUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80", alt: "Zara Coordinates Fit" },
  { imgUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80", alt: "Classic Silk Dress Look" },
  { imgUrl: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&auto=format&fit=crop&q=80", alt: "Mango Knit Outfits" },
  { imgUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80", alt: "H&M Urban Streetwear" },
  { imgUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80", alt: "Floral Summer Collection" },
  { imgUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=80", alt: "Zara Winter Outerwear" },
  { imgUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=80", alt: "Creator Styled Knitwear" },
  { imgUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80", alt: "Menswear Linen Blends" },
  { imgUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80", alt: "Classic Trench Coordinates" },
  { imgUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&auto=format&fit=crop&q=80", alt: "Premium Designer Silk Fits" },
];

export default function StyleCarouselSection() {
  return (
    <section id="styles-carousel" className="py-20 sm:py-24 max-w-6xl mx-auto w-full px-4 text-center select-none overflow-hidden">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mb-8 sm:mb-10"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/40 border border-white/60 text-[10px] font-bold text-text-body mb-4 tracking-widest uppercase font-syncopate">
          🔥 Trending Fits
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold text-text-heading tracking-tight mb-4 font-syncopate uppercase">
          Studio Fan Showcase
        </h2>
        <p className="text-sm sm:text-base font-semibold text-text-body max-w-md mx-auto leading-relaxed">
          Hover over the fan cards to separate them. Use navigation controls to browse all AI VTON models.
        </p>
      </motion.div>

      {/* Fan Carousel */}
      <div className="w-full relative mt-4">
        <SocialCards cards={CAROUSEL_CARDS} />
      </div>
    </section>
  );
}
