"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
}

export default function GlassCard({ children, className, ...props }: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        "glass-panel rounded-[2rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.04)]",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
