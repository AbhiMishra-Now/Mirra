"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import GlassCard from "./ui/GlassCard";

const showcaseItems = [
  {
    creator: "@sophia.styles",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
    item: "Summer Knit Dress",
    brand: "Zara",
    price: "$45",
    height: "h-[460px]",
  },
  {
    creator: "@marcus.fit",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80",
    item: "Casual Linen Blazer",
    brand: "H&M",
    price: "$70",
    height: "h-[350px]",
  },
  {
    creator: "@lisa.trends",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&auto=format&fit=crop&q=80",
    item: "Premium Wool Trench",
    brand: "Mango",
    price: "$110",
    height: "h-[500px]",
  },
  {
    creator: "@david.look",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=80",
    item: "Retro Satin Bomber",
    brand: "Zara",
    price: "$85",
    height: "h-[390px]",
  },
  {
    creator: "@chloe.chic",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80",
    item: "Floral Silk Skirt",
    brand: "H&M",
    price: "$35",
    height: "h-[340px]",
  },
  {
    creator: "@elena.lookbook",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80",
    item: "Silk Pleated Trousers",
    brand: "Zara",
    price: "$60",
    height: "h-[440px]",
  },
];

export default function ShowcaseSection() {
  return (
    <section id="showcase" className="py-20 sm:py-28 max-w-6xl mx-auto w-full px-4 text-center select-none">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mb-16 sm:mb-20"
      >
        <h2 className="text-3xl sm:text-5xl font-bold text-text-heading tracking-tight mb-4 font-syncopate uppercase">
          See who&apos;s styling right now.
        </h2>
        <p className="text-base sm:text-lg text-text-body font-semibold max-w-xl mx-auto leading-relaxed">
          Explore virtual outfits designed by real creators. Click to preview or purchase directly.
        </p>
      </motion.div>

      {/* Masonry Columns */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 sm:gap-8 space-y-6 sm:space-y-8 text-left">
        {showcaseItems.map((item, idx) => (
          <GlassCard
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: idx * 0.1 }}
            className="break-inside-avoid relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/30 backdrop-blur-xl group cursor-pointer"
          >
            {/* Image Container */}
            <div className={`relative w-full ${item.height} overflow-hidden`}>
              <Image
                src={item.image}
                alt={`${item.creator} styling ${item.item}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
              
              {/* Creator Handle Badge */}
              <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold tracking-wide">
                {item.creator}
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 z-10">
                <div className="flex flex-col gap-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <div>
                    <span className="text-xs font-bold text-pink-500 uppercase tracking-widest">{item.brand}</span>
                    <h4 className="text-lg font-extrabold text-text-heading leading-tight">{item.item}</h4>
                    <span className="text-base font-black text-text-heading">{item.price}</span>
                  </div>
                  
                  <div className="w-full flex items-center justify-between px-4.5 py-3 rounded-full bg-gradient-to-br from-[#FFE3EC] to-[#FFD1DC] shadow-clay-pink text-xs font-bold text-text-heading">
                    <span className="flex items-center gap-1.5">
                      <ShoppingBag className="w-4 h-4 text-pink-500" />
                      Shop the Look
                    </span>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
