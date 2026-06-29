"use client";

import React from "react";

export default function LogoCloud3() {
  const brands = [
    {
      name: "Amazon",
      color: "#232F3E",
      logo: (
        <svg viewBox="0 0 120 30" className="h-6 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.6 15.6c0 2.2-.8 3.8-2.5 3.8-1.5 0-2.2-1.2-2.2-3.3v-6.7H6v7.3c0 3.7 2.1 5.3 5.1 5.3 2.1 0 3.7-1 4.5-2.5v2.2h2.9v-12.3h-4.9v6.2zm8.7-6.2v1.9c.9-1.5 2.4-2.2 4.3-2.2 3 0 4.9 2 4.9 5.8v6.8H28.6v-6.3c0-2.4-.9-3.4-2.6-3.4-1.6 0-2.4 1.1-2.4 3.3v6.4h-2.9v-12.3h2.9zm16.5 0c3.9 0 6.6 2.8 6.6 6.3 0 3.5-2.7 6.3-6.6 6.3s-6.6-2.8-6.6-6.3c0-3.5 2.7-6.3 6.6-6.3zm0 9.7c2.2 0 3.6-1.7 3.6-3.4 0-1.7-1.4-3.4-3.6-3.4s-3.6 1.7-3.6 3.4c0 1.7 1.4 3.4 3.6 3.4zm18.6-9.7c3.9 0 6.6 2.8 6.6 6.3 0 3.5-2.7 6.3-6.6 6.3s-6.6-2.8-6.6-6.3c0-3.5 2.7-6.3 6.6-6.3zm0 9.7c2.2 0 3.6-1.7 3.6-3.4 0-1.7-1.4-3.4-3.6-3.4s-3.6 1.7-3.6 3.4c0 1.7 1.4 3.4 3.6 3.4zm16.9-9.7v1.9c.9-1.5 2.4-2.2 4.3-2.2 3 0 4.9 2 4.9 5.8v6.8H80v-6.3c0-2.4-.9-3.4-2.6-3.4-1.6 0-2.4 1.1-2.4 3.3v6.4H72.1v-12.3H75v2.2z" fill="#232F3E" />
          <path d="M2.9 23.5C21.7 29.5 44 31 66 27.6c19.1-3 37.4-11.3 50.8-23.7.8-.8-.1-1.9-1-1.3C102.3 11 83.1 16.5 63 17.5 41.9 18.5 21.2 13.8 2.2 4c-1-.5-1.9.7-.9 1.5 1.5 1.2 3.1 2.3 4.8 3.3.4.2.8.5.8.7.1 2-2 3.7-4.1 4.5-.4.2-.8.3-1.2.4-1.4.3-1.6-1-1.6-2.4 0-4.3 2.9-8.4 6.7-10.4.7-.4.5-1.3-.3-1.1C3.1.9.4 4.5.4 8.7c0 5 3.3 9.4 8 10.9 1.1.3 2.2.4 3.3.2 1.6-.3 3-1.3 3.6-2.8.2-.5.1-1-.2-1.3-.4-.4-.9-.6-1.5-.7-2.9-.5-5.8-1.5-8.3-3-.9-.5-2 1-.9 1.5z" fill="#FF9900" />
        </svg>
      )
    },
    {
      name: "Shopify",
      color: "#96BF48",
      logo: (
        <><svg viewBox="0 0 24 24" className="w-7 h-7 text-[#96BF48]" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.8 5.4H16c0-2.2-1.8-4-4-4s-4 1.8-4 4H4.2c-.7 0-1.2.5-1.2 1.2l-1.8 15c-.1.7.4 1.4 1.2 1.4h19.2c.8 0 1.3-.7 1.2-1.4l-1.8-15c-.1-.7-.6-1.2-1.2-1.2zM12 3.4c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zM9 10.5c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5v2c0 .8-.7 1.5-1.5 1.5S9 13.3 9 12.5v-2zm6 0c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5v2c0 .8-.7 1.5-1.5 1.5s-1.5-.7-1.5-1.5v-2z" />
        </svg><span className="font-black tracking-tight text-sm text-gray-800 font-sans">Shopify</span></>
      )

    },
    {
      name: "Pinterest",
      color: "#E60023",
      logo: (
        <><svg viewBox="0 0 24 24" className="w-7 h-7 text-[#E60023]" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.17-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
        </svg><span className="font-black tracking-tight text-sm text-gray-800 font-sans">Pinterest</span></>
      )
    },
    {
      name: "Instagram Reels",
      color: "#D6249F",
      logo: (
        <><svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="reels-grad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fdf497" />
              <stop offset="30%" stopColor="#fd5949" />
              <stop offset="70%" stopColor="#d6249f" />
              <stop offset="100%" stopColor="#285AEB" />
            </linearGradient>
          </defs>
          <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#reels-grad)" strokeWidth="2.2" />
          <path d="M2 8h20M8 2l-2 6M16 2l-2 6" stroke="url(#reels-grad)" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M10 11.5l5 3-5 3v-6z" fill="url(#reels-grad)" />
        </svg><span className="font-black tracking-tight text-sm text-gray-800 font-sans">Instagram</span></>
      )
    },
    {
      name: "YouTube Shorts",
      color: "#FF0000",
      logo: (
        <><svg viewBox="0 0 24 24" className="w-7 h-7 text-[#FF0000]" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 9.33c-.59-.67-1.48-1.07-2.4-1l-1.16.07.78-1.89c.74-1.61.16-3.56-1.39-4.46C13.24.96 11.24 1.52 10.33 3L6.8 9.07c-.3.51-.43 1.12-.34 1.73.08.6.38 1.15.82 1.53.59.67 1.48 1.07 2.4 1l1.16-.07-.78 1.89c-.74 1.61-.16 3.56 1.39 4.46.6.35 1.28.52 1.95.52.94 0 1.86-.48 2.44-1.36l3.53-6.07c.3-.51.43-1.12.34-1.73-.08-.6-.38-1.15-.82-1.53z" />
          <polygon points="10,9.5 15,12 10,14.5" fill="#FFFFFF" />
        </svg><span className="font-black tracking-tight text-sm text-gray-800 font-sans">Youtube</span></>

      )
    },
    {
      name: "TikTok",
      color: "#000000",
      logo: (
        <><svg viewBox="0 0 20 20" className="w-6.5 h-6.5 text-[#000000]" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.09-1.5-1.12-.86-1.97-2.09-2.37-3.48v9.98c.03 2.14-.6 4.32-2.07 5.9C12.37 22.56 10 23.19 7.74 22.8c-2.43-.37-4.73-1.93-5.74-4.16-1.3-2.73-.83-6.28 1.28-8.49 1.94-2.1 5.03-2.76 7.62-1.76v4.18c-1.62-.64-3.55-.37-4.85.83-1.28 1.13-1.65 3.05-.9 4.63.7 1.52 2.39 2.5 4.05 2.4 1.77-.04 3.32-1.28 3.73-2.97.12-.51.18-1.04.18-1.57V.02z" />
        </svg><span className="font-black tracking-tight text-sm text-gray-800 font-sans">TikTok</span></>
      )
    }
  ];

  return (
    <div className="w-full mt-14 sm:mt-18 select-none overflow-hidden">
      {/* Inline styles for standard CSS infinite marquee loop */}
      <style>{`
        @keyframes marquee-slide {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-loop {
          animation: marquee-slide 30s linear infinite;
        }
        .animate-marquee-loop:hover {
          animation-play-state: paused;
        }
      `}</style>

      <p className="text-[10px] sm:text-xs font-bold text-gray-400/80 uppercase tracking-[0.22em] mb-10 select-none font-syncopate">
        Trusted by Creative Teams & Creators globally
      </p>

      {/* Outer marquee viewport container with frosted fade borders */}
      <div className="relative w-full overflow-hidden py-2">
        {/* Left Fade Overlay */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#FAFAFA] via-[#FAFAFA]/70 to-transparent z-10 pointer-events-none" />

        {/* Right Fade Overlay */}
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#FAFAFA] via-[#FAFAFA]/70 to-transparent z-10 pointer-events-none" />

        {/* Scrolling track: Flex layout wrapper */}
        <div className="flex w-max animate-marquee-loop">

          {/* Track 1: Original Brands */}
          <div className="flex gap-4 sm:gap-6 flex-nowrap pr-4 sm:pr-6">
            {brands.map((brand, idx) => (
              <div
                key={`${brand.name}-track1-${idx}`}
                className="flex items-center justify-center py-2.5 px-6 rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 hover:bg-white/80 hover:shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:border-white hover:scale-104 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer h-12 min-w-[100px] sm:min-w-[120px] shrink-0"
              >
                {brand.logo}
              </div>
            ))}
          </div>

          {/* Track 2: Identical Duplicate for seamless looping */}
          <div className="flex gap-4 sm:gap-6 flex-nowrap pr-4 sm:pr-6">
            {brands.map((brand, idx) => (
              <div
                key={`${brand.name}-track2-${idx}`}
                className="flex items-center justify-center py-2.5 px-6 rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 hover:bg-white/80 hover:shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:border-white hover:scale-104 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer h-12 min-w-[100px] sm:min-w-[120px] shrink-0"
              >
                {brand.logo}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
