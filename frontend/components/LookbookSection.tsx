"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import FloatingTag from "./ui/FloatingTag";

const lookbookItems = [
  {
    title: "Pearl Mauve Style",
    tagline: "Soft, elevated coordinates.",
    color: "#D4A5C4",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&auto=format&fit=crop&q=80",
    themeBg: "bg-[#FDF3F8]",
    shadow: "shadow-[8px_8px_20px_rgba(212,165,196,0.25),-8px_-8px_20px_rgba(255,255,255,1)]",
    tags: [
      { label: "Mauve Silk Blouse", price: "$65", x: "12%", y: "22%", delay: 0.1, direction: "up" as const },
      { label: "Pleated Trousers", price: "$85", x: "32%", y: "65%", delay: 0.7, direction: "down" as const },
    ],
  },
  {
    title: "Champagne Luxe",
    tagline: "Warm tones and flowing fabrics.",
    color: "#F7E7CE",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
    themeBg: "bg-[#FDFBF7]",
    shadow: "shadow-[8px_8px_20px_rgba(247,231,206,0.3),-8px_-8px_20px_rgba(255,255,255,1)]",
    tags: [
      { label: "Champagne Blazer", price: "$120", x: "15%", y: "28%", delay: 0.4, direction: "down" as const },
      { label: "Lagoon Knit Midi", price: "$55", x: "42%", y: "55%", delay: 1.1, direction: "up" as const },
    ],
  },
  {
    title: "Dream Periwinkle",
    tagline: "Ethereal, cool-toned outerwear.",
    color: "#CCCCFF",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80",
    themeBg: "bg-[#F5F5FF]",
    shadow: "shadow-[8px_8px_20px_rgba(204,204,255,0.25),-8px_-8px_20px_rgba(255,255,255,1)]",
    tags: [
      { label: "Periwinkle Coat", price: "$150", x: "8%", y: "32%", delay: 0.3, direction: "up" as const },
      { label: "Cream Clutch Bag", price: "$40", x: "50%", y: "70%", delay: 0.9, direction: "left" as const },
    ],
  },
];

export default function LookbookSection() {
  return (
    <section id="lookbook" className="py-20 sm:py-28 max-w-6xl mx-auto w-full px-4 text-center select-none">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mb-16 sm:mb-20"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/40 border border-white/60 text-[10px] font-bold text-text-body mb-4 tracking-widest uppercase font-syncopate">
          ✨ Seasonal Showcase
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold text-text-heading tracking-tighter mb-4 font-syncopate uppercase">
          The MIRRA Lookbook
        </h2>
        <p className="text-sm sm:text-base font-semibold text-text-body max-w-lg mx-auto leading-relaxed">
          Hover over the designs to reveal specific try-on catalog tags. Click to drag or test on your model.
        </p>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left items-stretch">
        {lookbookItems.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: idx * 0.15 }}
            whileHover={{ y: -6, scale: 1.015 }}
            className={`clay-card p-6 sm:p-8 flex flex-col justify-between h-full border border-white/50 relative overflow-hidden transition-all ${item.themeBg} ${item.shadow}`}
          >
            <div>
              {/* Card Header */}
              <div className="mb-6">
                <span
                  className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-text-heading border border-white/40 shadow-sm"
                  style={{ backgroundColor: `${item.color}35` }}
                >
                  {item.title.split(" ")[1] || "Fit"}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-text-heading tracking-tight mt-3 mb-1 font-syncopate uppercase">
                  {item.title}
                </h3>
                <p className="text-xs font-semibold text-text-body">{item.tagline}</p>
              </div>

              {/* Product Visual Container with tags */}
              <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border border-white/60 shadow-inner bg-white/20 mb-2">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover object-center"
                />
                
                {/* Floating Tags */}
                {item.tags.map((tag, tIdx) => (
                  <FloatingTag
                    key={tIdx}
                    label={tag.label}
                    price={tag.price}
                    direction={tag.direction}
                    delay={tag.delay}
                    className="scale-[0.85] origin-center"
                    style={{ left: tag.x, top: tag.y }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
