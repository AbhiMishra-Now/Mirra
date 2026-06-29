"use client";

import React from "react";
import { motion } from "framer-motion";
import { Camera, Upload, Video } from "lucide-react";

const features = [
  {
    icon: Camera,
    title: "Live AR Mirror",
    description:
      "Real-time face and body tracking. Try on glasses, sunglasses, hats, jewelry, and makeup instantly using your device camera.",
    iconBg: "bg-[#FFE3EC] text-pink-500",
    shadowClass: "shadow-clay-pink",
  },
  {
    icon: Upload,
    title: "AI Studio Upload",
    description:
      "Upload a full-body photo. Our advanced AI drapes outfit choices onto your posture with photorealistic lighting, wrinkles, and shadows.",
    iconBg: "bg-[#E8F8F2] text-emerald-600",
    shadowClass: "shadow-clay-mint",
  },
  {
    icon: Video,
    title: "MIRRA Motion",
    description:
      "Turn static try-ons into vertical, shoppable video reels in one click, ready to publish on TikTok, Instagram, or Reels.",
    iconBg: "bg-[#F3E8FF] text-purple-600",
    shadowClass: "shadow-[10px_10px_30px_rgba(232,196,255,0.25),-10px_-10px_30px_rgba(255,255,255,1)]",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 sm:py-28 max-w-6xl mx-auto w-full px-4 text-center select-none">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mb-16 sm:mb-20"
      >
        <h2 className="text-3xl sm:text-5xl font-bold text-text-heading tracking-tight mb-4 font-syncopate uppercase">
          Your complete creator studio.
        </h2>
        <p className="text-base sm:text-lg text-text-body font-semibold max-w-xl mx-auto leading-relaxed">
          Create high-converting try-on content and interactive reviews in seconds without buying physical samples.
        </p>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 text-left">
        {features.map((feature, idx) => {
          const IconComponent = feature.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: idx * 0.15 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className={`clay-card p-8 sm:p-10 flex flex-col justify-between h-full border border-white/50 transition-all ${feature.shadowClass}`}
            >
              <div>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${feature.iconBg}`}>
                  <IconComponent className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-text-heading mb-4">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base font-medium text-text-body leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
