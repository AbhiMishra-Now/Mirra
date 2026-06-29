"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import GlassCard from "./ui/GlassCard";
import ClayButton from "./ui/ClayButton";

export default function FinalCtaSection() {

  return (
    <section className="py-20 sm:py-28 max-w-5xl mx-auto w-full px-4 select-none">
      <GlassCard
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="p-10 sm:p-20 relative overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/20 backdrop-blur-2xl text-center flex flex-col items-center justify-center shadow-2xl"
      >
        {/* Inner gradient glowing blobs */}
        <div className="absolute top-[-50%] left-[-50%] w-[100%] h-[100%] rounded-full bg-pink-200/40 blur-3xl pointer-events-none -z-10 animate-pulse" />
        <div className="absolute bottom-[-50%] right-[-50%] w-[100%] h-[100%] rounded-full bg-emerald-200/30 blur-3xl pointer-events-none -z-10 animate-pulse" />

        <h2 className="text-3xl sm:text-5xl font-bold text-text-heading tracking-tight leading-tight max-w-2xl mb-6 font-syncopate uppercase">
          Ready to transform your content?
        </h2>
        
        <p className="text-base sm:text-xl text-text-body font-semibold max-w-md mb-10 leading-relaxed">
          Join thousands of modern creators styling, trying, and earning affiliate revenue with MIRRA.
        </p>

        <Link href="/studio">
          <ClayButton 
            variant="primary" 
            className="px-10 py-5 text-lg font-black flex items-center gap-2 group shadow-xl cursor-pointer"
          >
            Open Creator Studio
            <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </ClayButton>
        </Link>
      </GlassCard>
    </section>
  );
}
