"use client";

import React from "react";
import { motion } from "framer-motion";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";

export default function BigBranding() {
  return (
    <section className="w-full h-[19vw] sm:h-[41vw] flex items-end justify-center space-x-5 overflow-hidden p-0 m-0 select-none bg-transparent relative">
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 6, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2 }}
        className="w-full h-full relative"
      >
        <TextHoverEffect text="MIRRA" />
      </motion.div>
    </section>
  );
}
