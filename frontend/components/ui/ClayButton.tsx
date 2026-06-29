"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface ClayButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "default" | "glass";
}

export default function ClayButton({
  children,
  className,
  variant = "default",
  ...props
}: ClayButtonProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-gradient-to-br from-[#FFE3EC] via-[#FFD1DC] to-[#E8C4FF] text-text-heading shadow-clay-pink border border-white/40 hover:brightness-105 active:brightness-95";
      case "secondary":
        return "bg-gradient-to-br from-[#E8F8F2] via-[#A8E6CF] to-[#C8F2E2] text-text-heading shadow-clay-mint border border-white/40 hover:brightness-105 active:brightness-95";
      case "glass":
        return "bg-white/30 backdrop-blur-xl border border-white/50 text-text-heading shadow-lg hover:bg-white/40 active:bg-white/20";
      case "default":
      default:
        return "bg-gradient-to-br from-white to-[#FDFBF7] text-text-heading shadow-clay-md border border-white/60 hover:shadow-clay-sm";
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97, y: 1 }}
      className={cn(
        "px-6 py-3 rounded-full font-sans font-semibold tracking-wide transition-colors flex items-center justify-center gap-2",
        getVariantClasses(),
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
