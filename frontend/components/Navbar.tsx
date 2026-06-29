"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
import ClayButton from "./ui/ClayButton";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Showcase", href: "#showcase" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ];

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (pathname !== "/") return; // Allow default navigation if not on landing page
    
    e.preventDefault();
    const targetId = href.replace("#", "");
    const elem = document.getElementById(targetId);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, x: "-50%", opacity: 0 }}
        animate={{ y: 0, x: "-50%", opacity: 1 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 80 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-5xl bg-white/40 backdrop-blur-2xl border border-white/60 shadow-lg rounded-full px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between"
      >
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-lg sm:text-xl font-bold tracking-normal text-text-heading flex items-center gap-1.5 select-none font-syncopate">
            MIRRA
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </span>
        </Link>

        {/* Center: Links (Desktop) */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={pathname === "/" ? link.href : `/${link.href}`}
              onClick={(e) => handleScroll(e, link.href)}
              className="text-sm font-semibold text-text-body hover:text-text-heading transition-colors relative group py-1"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-400 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Right: Studio CTA (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          {pathname !== "/studio" ? (
            <Link href="/studio">
              <ClayButton 
                variant="primary" 
                className="py-2.5 px-5 text-sm font-bold flex items-center gap-1.5 group cursor-pointer"
              >
                Open Studio
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </ClayButton>
            </Link>
          ) : (
            <Link href="/">
              <ClayButton variant="default" className="py-2.5 px-5 text-sm font-bold">
                Exit Studio
              </ClayButton>
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          {pathname !== "/studio" && (
            <Link href="/studio">
              <ClayButton 
                variant="primary" 
                className="py-1.5 px-4 text-xs font-bold cursor-pointer"
              >
                Studio
              </ClayButton>
            </Link>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-full hover:bg-white/20 text-text-heading transition-colors"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[92%] glass-panel rounded-3xl p-6 shadow-2xl md:hidden flex flex-col gap-5 border border-white/60"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={pathname === "/" ? link.href : `/${link.href}`}
                  onClick={(e) => handleScroll(e, link.href)}
                  className="text-base font-semibold text-text-body hover:text-text-heading transition-colors py-2 border-b border-white/20 last:border-0"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            {pathname !== "/studio" && (
              <Link href="/studio" className="w-full">
                <ClayButton 
                  variant="primary" 
                  className="w-full py-3 text-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Open Creator Studio
                  <ArrowUpRight className="w-4 h-4" />
                </ClayButton>
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
