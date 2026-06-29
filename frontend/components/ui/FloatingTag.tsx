"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FloatingTagProps {
  label: string;
  price: string;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
  style?: React.CSSProperties;
}

export default function FloatingTag({
  label,
  price,
  delay = 0,
  duration = 4,
  direction = "up",
  className,
  style,
}: FloatingTagProps) {
  const getFloatOffset = () => {
    switch (direction) {
      case "down":
        return [0, 12, 0];
      case "left":
        return [0, -10, 0];
      case "right":
        return [0, 10, 0];
      case "up":
      default:
        return [0, -12, 0];
    }
  };

  return (
    <motion.div
      style={style}
      animate={{
        y: direction === "up" || direction === "down" ? getFloatOffset() : 0,
        x: direction === "left" || direction === "right" ? getFloatOffset() : 0,
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        delay: delay,
      }}
      className={cn(
        "absolute flex items-center gap-2 px-3.5 py-2 rounded-full glass-pill text-xs font-semibold text-text-heading z-20 pointer-events-auto cursor-pointer select-none",
        className
      )}
      whileHover={{ scale: 1.08, backgroundColor: "rgba(255, 255, 255, 0.6)" }}
    >
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      <span className="opacity-90">{label}</span>
      <span className="font-extrabold text-pink-500 font-sans">{price}</span>
    </motion.div>
  );
}
