"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface Step {
  id: number;
  number: string;
  numberColor: string;
  title: string;
  text: string;
  overlayText: string;
}

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps: Step[] = [
    {
      id: 1,
      number: "01",
      numberColor: "text-[#D4A5C4]",
      title: "Upload or Capture",
      text: "Drop a full-body photo or use our live AR mirror.",
      overlayText: "Step 1: Upload your photo or capture live AR",
    },
    {
      id: 2,
      number: "02",
      numberColor: "text-[#A8E6CF]",
      title: "AI Styles Your Look",
      text: "Our AI instantly drapes real clothing and accessories onto you.",
      overlayText: "Step 2: AI drapes apparel instantly",
    },
    {
      id: 3,
      number: "03",
      numberColor: "text-[#CCCCFF]",
      title: "Generate & Monetize",
      text: "Turn static looks into viral videos with embedded affiliate links.",
      overlayText: "Step 3: Export viral videos & monetize",
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#FAFAFA] w-full select-none overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Header Info */}
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="font-syncopate font-bold text-gray-900 text-4xl sm:text-5xl mb-6">
            How It Works
          </h2>
          <p className="font-sans font-medium text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Style, try, and earn. Create high-converting try-on content and shoppable videos without buying a single physical item.
          </p>
        </div>

        {/* Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Mobile View Video Canvas (placed above steps on mobile viewport) */}
          <div className="block lg:hidden w-full mb-6">
            <div className="relative w-full aspect-video rounded-3xl bg-white/40 backdrop-blur-2xl border border-white/60 shadow-2xl overflow-hidden">
              {/* Video 1 (Steps 1 & 2) */}
              <motion.video
                src="/videos/hiw-video-1.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                animate={{ opacity: activeStep === 3 ? 0 : 1 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Video 2 (Step 3) */}
              <motion.video
                src="/videos/hiw-video-1-continue.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                animate={{ opacity: activeStep === 3 ? 1 : 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Dynamic Glassmorphic overlay badge */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 px-4 py-1.5 rounded-full bg-white/75 backdrop-blur-md border border-white/80 shadow-md whitespace-nowrap">
                <span className="text-[10px] font-bold text-gray-800 tracking-tight font-sans">
                  {steps.find((s) => s.id === activeStep)?.overlayText}
                </span>
              </div>
            </div>
          </div>

          {/* Left Column: Interactive Steps (Claymorphic Cards) */}
          <div className="flex flex-col gap-6 w-full">
            {steps.map((step) => {
              const isActive = activeStep === step.id;
              return (
                <motion.div
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`relative bg-white rounded-3xl p-6 border cursor-pointer transition-all duration-300 flex items-start gap-5 overflow-hidden ${
                    isActive
                      ? "border-[#FFD1DC] shadow-[0_10px_30px_rgba(255,209,220,0.35),8px_8px_20px_rgba(209,225,255,0.2)]"
                      : "border-white/50 shadow-[8px_8px_20px_rgba(209,225,255,0.15),-8px_-8px_20px_rgba(255,255,255,0.8)] hover:border-gray-200"
                  }`}
                >
                  {/* Framer Motion Active Border Layout Slide */}
                  {isActive && (
                    <motion.div
                      layoutId="active-step-border"
                      className="absolute inset-0 rounded-3xl border-2 border-[#FFD1DC] pointer-events-none"
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  )}

                  {/* Step Number */}
                  <span className={`font-serif italic font-normal text-4xl leading-none shrink-0 ${step.numberColor}`}>
                    {step.number}
                  </span>

                  {/* Step Info */}
                  <div className="text-left">
                    <h3 className="font-sans font-extrabold text-gray-900 text-lg sm:text-xl mb-1.5">
                      {step.title}
                    </h3>
                    <p className="font-sans font-medium text-gray-500 text-sm leading-relaxed">
                      {step.text}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right Column: Desktop View Video Canvas (Glassmorphic) */}
          <div className="hidden lg:block w-full">
            <div className="relative w-full aspect-[4/5] rounded-[2.5rem] bg-white/40 backdrop-blur-2xl border border-white/60 shadow-2xl overflow-hidden">
              {/* Video 1 (Steps 1 & 2) */}
              <motion.video
                src="/videos/hiw-video-1.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                animate={{ opacity: activeStep === 3 ? 0 : 1 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Video 2 (Step 3) */}
              <motion.video
                src="/videos/hiw-video-1-continue.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                animate={{ opacity: activeStep === 3 ? 1 : 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Dynamic Glassmorphic pill badge */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 px-5 py-2.5 rounded-full bg-white/75 backdrop-blur-md border border-white/80 shadow-lg min-w-[280px] text-center">
                <span className="text-xs sm:text-sm font-bold text-gray-800 tracking-tight font-sans">
                  {steps.find((s) => s.id === activeStep)?.overlayText}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
