"use client";

import React from "react";
import { motion } from "framer-motion";

interface Avatar {
  src: string;
  alt: string;
}

interface AnimatedAvatarGroupProps {
  avatars: Avatar[];
  maxVisible?: number;
  size?: number;
}

export default function AnimatedAvatarGroup({
  avatars,
  maxVisible = 5,
  size = 40,
}: AnimatedAvatarGroupProps) {
  const visibleAvatars = avatars.slice(0, maxVisible);
  const remainingCount = avatars.length - maxVisible;

  return (
    <div className="flex items-center -space-x-3 hover:space-x-1.5 transition-all duration-500 ease-out py-1">
      {visibleAvatars.map((avatar, idx) => (
        <motion.div
          key={idx}
          className="relative rounded-full border-2 border-[#FAFAFA] bg-[#FAFAFA] shadow-md cursor-pointer shrink-0"
          style={{
            width: size,
            height: size,
            zIndex: visibleAvatars.length - idx,
          }}
          whileHover={{
            scale: 1.18,
            zIndex: 50,
            y: -5,
            transition: { type: "spring", stiffness: 450, damping: 14 },
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={avatar.src}
            alt={avatar.alt}
            className="w-full h-full rounded-full object-cover select-none pointer-events-none"
          />
        </motion.div>
      ))}

      {remainingCount > 0 && (
        <motion.div
          className="flex items-center justify-center rounded-full border-2 border-[#FAFAFA] bg-gradient-to-tr from-[#FFD1DC] to-[#CCCCFF] text-gray-900 font-extrabold shadow-md select-none cursor-pointer shrink-0"
          style={{
            width: size,
            height: size,
            zIndex: 0,
            fontSize: size * 0.35,
          }}
          whileHover={{
            scale: 1.12,
            y: -2,
          }}
        >
          +{remainingCount}
        </motion.div>
      )}
    </div>
  );
}
