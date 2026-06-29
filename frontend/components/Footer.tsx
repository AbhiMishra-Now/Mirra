"use client";

import React from "react";
import Link from "next/link";
import { Heart } from "lucide-react";

const socialLinks = [
  {
    icon: (
      <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    href: "https://twitter.com",
    label: "Twitter",
  },
  {
    icon: (
      <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
    href: "https://instagram.com",
    label: "Instagram",
  },
  {
    icon: (
      <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
    href: "https://linkedin.com",
    label: "LinkedIn",
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-transparent border-t border-white/40 pt-16 pb-12 mt-12 select-none">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pb-12">
        {/* Column 1: Info */}
        <div className="md:col-span-5 flex flex-col items-start gap-4">
          <span className="text-2xl font-black tracking-tighter text-text-heading flex items-center gap-1.5">
            MIRRA
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </span>
          <p className="text-sm font-semibold text-text-body max-w-sm leading-relaxed text-left">
            The next-generation AI try-on and creator studio platform. Empowering modern creators to style, generate fashion reels, and convert affiliate links.
          </p>
          
          {/* Socials */}
          <div className="flex items-center gap-3 mt-2">
            {socialLinks.map((social, sIdx) => {
              return (
                <a
                  key={sIdx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-white/40 border border-white/60 text-text-heading hover:bg-white/60 hover:scale-105 active:scale-95 transition-all shadow-sm"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              );
            })}
          </div>
        </div>

        {/* Column 2: Product */}
        <div className="md:col-span-2 flex flex-col items-start gap-3">
          <h4 className="text-xs font-black tracking-widest text-text-heading uppercase">Product</h4>
          <ul className="flex flex-col gap-2.5 text-left">
            <li>
              <Link href="#features" className="text-sm font-semibold text-text-body hover:text-text-heading transition-colors">
                Features
              </Link>
            </li>
            <li>
              <Link href="/studio" className="text-sm font-semibold text-text-body hover:text-text-heading transition-colors">
                Creator Studio
              </Link>
            </li>
            <li>
              <Link href="#pricing" className="text-sm font-semibold text-text-body hover:text-text-heading transition-colors">
                Pricing
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Company */}
        <div className="md:col-span-2 flex flex-col items-start gap-3">
          <h4 className="text-xs font-black tracking-widest text-text-heading uppercase">Company</h4>
          <ul className="flex flex-col gap-2.5 text-left">
            <li>
              <Link href="#" className="text-sm font-semibold text-text-body hover:text-text-heading transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link href="#" className="text-sm font-semibold text-text-body hover:text-text-heading transition-colors">
                Blog
              </Link>
            </li>
            <li>
              <Link href="#" className="text-sm font-semibold text-text-body hover:text-text-heading transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Legal */}
        <div className="md:col-span-3 flex flex-col items-start gap-3">
          <h4 className="text-xs font-black tracking-widest text-text-heading uppercase">Legal</h4>
          <ul className="flex flex-col gap-2.5 text-left">
            <li>
              <Link href="#" className="text-sm font-semibold text-text-body hover:text-text-heading transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="#" className="text-sm font-semibold text-text-body hover:text-text-heading transition-colors">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="max-w-6xl mx-auto px-4 border-t border-white/20 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-text-body">
        <span>&copy; {currentYear} MIRRA. All rights reserved.</span>
        <span className="flex items-center gap-1">
          Made with <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500 animate-pulse" /> by MIRRA Team
        </span>
      </div>
    </footer>
  );
}
