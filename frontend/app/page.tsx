"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ClayButton from "@/components/ui/ClayButton";
import FloatingTag from "@/components/ui/FloatingTag";
import AnimatedAvatarGroup from "@/components/smoothui/components/animated-avatar-group";

// Section Components
import StatsSection from "@/components/StatsSection";
import FeaturesSection from "@/components/FeaturesSection";
import StyleCarouselSection from "@/components/StyleCarouselSection";
import LookbookSection from "@/components/LookbookSection";
import PricingSection from "@/components/PricingSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FaqSection from "@/components/FaqSection";
import ShowcaseSection from "@/components/ShowcaseSection";
import FinalCtaSection from "@/components/FinalCtaSection";
import Footer from "@/components/Footer";
import BigBranding from "@/components/BigBranding";
import LogoCloud3 from "@/components/smoothui/blocks/logos/logo-cloud-3";
import HowItWorks from "@/components/sections/HowItWorks";

const avatars = [
  { src: "https://i.pravatar.cc/150?img=11", alt: "Creator Alex" },
  { src: "https://i.pravatar.cc/150?img=32", alt: "Influencer Chloe" },
  { src: "https://i.pravatar.cc/150?img=59", alt: "Stylist Jordan" },
  { src: "https://i.pravatar.cc/150?img=47", alt: "Creator Taylor" },
  { src: "https://i.pravatar.cc/150?img=28", alt: "Influencer Morgan" },
  { src: "https://i.pravatar.cc/150?img=12", alt: "Stylist Casey" },
  { src: "https://i.pravatar.cc/150?img=53", alt: "Creator Jamie" },
  { src: "https://i.pravatar.cc/150?img=60", alt: "Influencer Riley" },
];

export default function Home() {


  const videoSources = ["/miraa hero 1.mp4", "/mirra video 2.mp4"];
  const [currentVideoIdx, setCurrentVideoIdx] = React.useState(0);

  const handleVideoEnded = () => {
    setCurrentVideoIdx((prevIdx) => (prevIdx + 1) % videoSources.length);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between pt-24 px-4 sm:px-6 lg:px-8">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center max-w-6xl mx-auto w-full text-center mt-12 sm:mt-16 mb-20 sm:mb-28">
        {/* Live Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2.5 px-4.5 py-2 rounded-full bg-white/40 backdrop-blur-xl border border-white/60 shadow-lg text-xs sm:text-sm font-semibold text-text-body mb-3 select-none"
        >
          <Sparkles className="w-6 h-4 text-pink-400 animate-pulse" />
          <span>Live Try-Ons happening now</span>
          <span className="relative flex h-2 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </motion.div>

        {/* Loved by Creators & Influencers */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-3 px-4.5 py-1.5 rounded-full bg-white/40 backdrop-blur-xl border border-white/60 shadow-lg mb-6 sm:mb-8 select-none"
        >
          <AnimatedAvatarGroup avatars={avatars} maxVisible={5} size={32} />
          <span className="text-xs sm:text-sm font-bold text-gray-500 tracking-tight font-sans">
            loved by <span className="text-gray-800 font-extrabold">Creators</span> & <span className="text-gray-800 font-extrabold">influencers</span>
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tight text-text-heading leading-[1.05] max-w-4xl mb-6 sm:mb-8 select-none"
        >
          Try anything.
          <br />
          Make it <span className="font-serif italic font-normal text-pink-400">yours</span>.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-base sm:text-xl md:text-2xl text-text-body font-medium max-w-3xl leading-relaxed mb-10 sm:mb-12"
        >
          MIRRA is the ultimate AI virtual try-on and creator studio.
          Instantly style outfits, accessories, and vertical videos with photorealistic AI.
        </motion.p>

        {/* Interactive Showcase Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="w-full max-w-4xl aspect-[16/9] rounded-[2.5rem] relative mb-12 overflow-hidden shadow-2xl border border-white/60 bg-white/20 backdrop-blur-md"
        >
          {/* Showcase Video with Image Fallback Poster (Sequential 2-Video Loop) */}
          <div className="absolute inset-0 z-0">
            <video
              key={currentVideoIdx}
              src={videoSources[currentVideoIdx]}
              poster="/hero_fashion_model.png"
              autoPlay
              muted
              playsInline
              onEnded={handleVideoEnded}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Frosted Glass Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent z-10 pointer-events-none" />

          {/* Floating Product Tags */}
          <FloatingTag
            label="Zara Summer Dress"
            price="$45"
            direction="up"
            delay={0.2}
            duration={4.5}
            className="top-[18%] left-[10%] sm:top-[25%] sm:left-[15%]"
          />
          <FloatingTag
            label="Ray-Ban Wayfarer"
            price="$120"
            direction="down"
            delay={0.8}
            duration={5}
            className="top-[45%] right-[8%] sm:top-[35%] sm:right-[18%]"
          />
          <FloatingTag
            label="Adidas Stan Smith"
            price="$95"
            direction="up"
            delay={1.5}
            duration={4.8}
            className="bottom-[18%] left-[25%] sm:bottom-[22%] sm:left-[35%]"
          />
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full px-4"
        >
          <Link href="/studio" className="w-full sm:w-auto">
            <ClayButton 
              variant="primary" 
              className="w-full sm:w-auto px-8 py-4 text-base font-bold shadow-lg flex items-center justify-center gap-1.5 group cursor-pointer"
            >
              Start Styling for Free
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </ClayButton>
          </Link>
          <ClayButton variant="glass" className="w-full sm:w-auto px-8 py-4 text-base font-bold flex items-center justify-center gap-2">
            <Play className="w-4 h-4 fill-text-heading text-text-heading" />
            Watch Demo
          </ClayButton>
        </motion.div>

        {/* Logo Cloud Section */}
        <LogoCloud3 />
      </main>

      {/* Social Proof / Stats Bar */}
      <StatsSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Style Fan Carousel Section */}
      <StyleCarouselSection />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Showcase Masonry Grid */}
      <ShowcaseSection />

      {/* Seasonal Lookbook Section */}
      <LookbookSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* FAQ Accordion Section */}
      <FaqSection />

      {/* Final CTA Section */}
      <FinalCtaSection />

      {/* Footer */}
      <Footer />

      {/* Big MIRRA Branding (After Footer - NEW) */}
      <BigBranding />
    </div>
  );
}
