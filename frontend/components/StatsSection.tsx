"use client";

import React from "react";
import { TrendingUp, Users, DollarSign } from "lucide-react";
import GlassCard from "./ui/GlassCard";

const stats = [
  {
    icon: TrendingUp,
    value: "10M+",
    label: "Items Virtual Tried",
    bg: "bg-pink-100 text-pink-500",
  },
  {
    icon: Users,
    value: "50k+",
    label: "Active Creators",
    bg: "bg-emerald-100 text-emerald-600",
  },
  {
    icon: DollarSign,
    value: "$2.4M+",
    label: "Affiliate Revenue Generated",
    bg: "bg-purple-100 text-purple-600",
  },
];

export default function StatsSection() {
  return (
    <section id="stats" className="py-12 sm:py-16 max-w-6xl mx-auto w-full px-4 select-none">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {stats.map((stat, idx) => {
          const IconComponent = stat.icon;
          return (
            <GlassCard
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              whileHover={{ scale: 1.03, y: -4 }}
              className="p-6 sm:p-8 flex items-center gap-5 border border-white/60 bg-white/35 backdrop-blur-xl"
            >
              <div className={`p-4 rounded-2xl flex items-center justify-center ${stat.bg}`}>
                <IconComponent className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-3xl sm:text-4xl font-extrabold text-text-heading tracking-tight leading-none mb-1">
                  {stat.value}
                </span>
                <span className="text-sm font-semibold text-text-body">
                  {stat.label}
                </span>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </section>
  );
}
