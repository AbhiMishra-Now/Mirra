"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Share2, Info, Check, Copy } from "lucide-react";

interface RatingData {
  overall_score: number;
  color_match: number;
  style_fit: number;
  occasion: number;
  feedback: string;
}

interface AIFashionRaterProps {
  rating: RatingData;
  onShare?: () => void;
}

export default function AIFashionRater({ rating, onShare }: AIFashionRaterProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShareClick = () => {
    setCopied(true);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `I just styled a new outfit on MIRRA and scored an AI Fashion Score of ⭐ ${rating.overall_score}/10!\nFeedback: "${rating.feedback}"`
      );
    }
    if (onShare) onShare();
    setTimeout(() => setCopied(false), 2000);
  };

  // Convert score out of 10 to standard stars (max 5 stars)
  const renderStars = () => {
    const starCount = Math.round(rating.overall_score / 2);
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < starCount
                ? "fill-[#FFD1DC] text-[#FFD1DC] drop-shadow-[0_0_6px_rgba(255,209,220,0.8)]"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const criteria = [
    { label: "Color Match", value: rating.color_match, color: "from-[#FFD1DC] to-[#FFB6C1]" },
    { label: "Style Fit", value: rating.style_fit, color: "from-[#E8C4FF] to-[#D4A5C4]" },
    { label: "Occasion Match", value: rating.occasion, color: "from-[#A8E6CF] to-[#88D4B4]" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white/70 backdrop-blur-xl border border-white/90 rounded-[2rem] p-5 shadow-xl flex flex-col gap-4.5 mt-6 text-left"
    >
      {/* Header with Tooltip info */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest font-syncopate">
            AI Fashion Score
          </h3>
          <div className="relative">
            <button
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={() => setShowTooltip(!showTooltip)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-0.5 rounded-full hover:bg-gray-100"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 5 }}
                  className="absolute left-0 top-6 z-50 w-52 p-3 bg-gray-900/95 backdrop-blur-md text-white text-[10px] font-medium leading-relaxed rounded-2xl shadow-xl border border-white/10"
                >
                  Our AI analyzes color theory, skin tone contrast, body proportions, and current global fashion trends.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-base font-black text-gray-900 tracking-tight">
            ⭐ {rating.overall_score}/10
          </span>
          {renderStars()}
        </div>
      </div>

      {/* Progress Bars */}
      <div className="flex flex-col gap-3">
        {criteria.map((item) => (
          <div key={item.label} className="flex flex-col gap-1">
            <div className="flex justify-between text-[10px] font-bold text-gray-600 uppercase tracking-wider">
              <span>{item.label}</span>
              <span>{item.value}/10</span>
            </div>
            <div className="w-full h-2.5 bg-gray-150 rounded-full overflow-hidden border border-white">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.value * 10}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Feedback text */}
      <div className="bg-white/40 border border-white/60 rounded-2xl p-3.5 text-xs text-gray-700 font-semibold leading-relaxed">
        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">
          AI Styling Feedback
        </span>
        &ldquo;{rating.feedback}&rdquo;
      </div>

      {/* Share score trigger */}
      <button
        onClick={handleShareClick}
        className="w-full bg-gradient-to-r from-[#FFD1DC] to-[#E8C4FF] hover:opacity-90 border border-white rounded-full py-2.5 px-4 text-[10px] font-black uppercase tracking-wider text-gray-900 flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-98"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Copied to Clipboard!</span>
          </>
        ) : (
          <>
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Your Score</span>
          </>
        )}
      </button>
    </motion.div>
  );
}
