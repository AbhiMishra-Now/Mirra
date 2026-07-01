"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  ImagePlus,
  Video,
  History,
  Settings,
  Shirt,
  Glasses,
  Gem,
  ArrowLeft,
  Sparkles,
  Upload,
  Crown,
  Layers,
  Footprints,
  Maximize2,
  Minimize2,
  RefreshCw,
  ExternalLink,
  Check,
  X,
  LogOut
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser, UserButton, SignOutButton, useClerk, useAuth } from "@clerk/nextjs";
import LiveMirrorMediaPipe from "../../components/LiveMirrorMediaPipe";
import AIFashionRater from "../../components/AIFashionRater";

// Product Definition Interface
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  sub_category: string;
  affiliateLink: string;
  description: string | null;
}

interface RatingData {
  overall_score: number;
  color_match: number;
  style_fit: number;
  occasion: number;
  feedback: string;
}

// Custom SVG Icons for exact, photorealistic wardrobe control
const DressIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M19 22 17 9H7L5 22h14Z" />
    <path d="M10 2h4" />
    <path d="M12 2v7" />
    <path d="M8 5c1 1.5 2 2.5 4 2.5s3-1 4-2.5" />
  </svg>
);

const PantsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M6 2h12v4H6V2Z" />
    <path d="M6 6v15h4.5v-7h3v7H18V6H6Z" />
  </svg>
);

const LipstickIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="7" y="11" width="10" height="11" rx="2" />
    <path d="M9 11V6.5L13.5 3.5V11H9Z" />
    <line x1="7" y1="15" x2="17" y2="15" />
  </svg>
);

export default function StudioDashboard() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const { getToken } = useAuth();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Navigation & Control States
  const [activeCategory, setActiveCategory] = useState("dresses"); 
  const [selectedTag, setSelectedTag] = useState<string>("All"); // All, Shirts, Pants, Dresses, Makeup, Jewelry, Hats, Goggles
  const [selectedProductId, setSelectedProductId] = useState<string>("B08XWP27W2");
  const [studioMode, setStudioMode] = useState<"mirror" | "upload">("upload");

  // Dynamic Product Catalog State
  const [productsCatalog, setProductsCatalog] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);

  // Viewport & Drawer States
  const [isViewportExpanded, setIsViewportExpanded] = useState(false);
  const [isTrayExpanded, setIsTrayExpanded] = useState(true);

  // VTON Upload Try-On State
  const [personImage, setPersonImage] = useState<string>(
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800"
  );
  const [isPhotoUploaded, setIsPhotoUploaded] = useState<boolean>(false);
  const [tryonResult, setTryonResult] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationMeta, setGenerationMeta] = useState<{
    model: string;
    latency: number;
    success: boolean;
  } | null>(null);

  // AI Fashion Rating State
  const [rating, setRating] = useState<RatingData | null>(null);
  const [isRating, setIsRating] = useState<boolean>(false);
  const [showFashionScore, setShowFashionScore] = useState<boolean>(false);

  // Modal & Toast UI States
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [prefSize, setPrefSize] = useState("M");
  const [prefStyle, setPrefStyle] = useState("Casual");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Trigger custom toast notifier
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Fetch all products once on mount (to support offline seed queries & instant client-side categories toggle)
  useEffect(() => {
    const fetchCatalog = async () => {
      setIsLoadingProducts(true);
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:8000";
        const response = await fetch(`${backendUrl}/api/products?keyword=fashion&limit=40`);
        if (response.ok) {
          const data = await response.json();
          setProductsCatalog(data);
          const initialFiltered = data.filter((p: Product) => p.category === activeCategory);
          if (initialFiltered.length > 0) {
            setSelectedProductId(initialFiltered[0].id);
          }
        } else {
          setProductsCatalog(offlineFallbackProducts);
          const initialFiltered = offlineFallbackProducts.filter((p: Product) => p.category === activeCategory);
          if (initialFiltered.length > 0) {
            setSelectedProductId(initialFiltered[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to fetch product catalog:", err);
        showToast("Backend connection offline. Running fallback mode.");
        setProductsCatalog(offlineFallbackProducts);
        const initialFiltered = offlineFallbackProducts.filter((p: Product) => p.category === activeCategory);
        if (initialFiltered.length > 0) {
          setSelectedProductId(initialFiltered[0].id);
        }
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchCatalog();
  }, []);

  const getFilteredProducts = () => {
    return productsCatalog.filter((prod) => {
      const tag = selectedTag.toLowerCase();
      if (tag === "all") return true;
      if (tag === "shirts") {
        return prod.category === "clothing" || prod.sub_category === "shirt" || prod.sub_category === "tops";
      }
      if (tag === "pants") {
        return prod.category === "pants" || prod.sub_category === "pants" || prod.sub_category === "jeans";
      }
      if (tag === "dresses") {
        return prod.category === "dresses" || prod.sub_category === "dress";
      }
      if (tag === "makeup") {
        return prod.category === "makeup" || prod.sub_category === "makeup";
      }
      if (tag === "jewelry") {
        return prod.category === "jewelry" || prod.sub_category === "earrings" || prod.sub_category === "necklace";
      }
      if (tag === "hats") {
        return prod.category === "accessories" || prod.sub_category === "hat";
      }
      if (tag === "goggles") {
        return prod.category === "eyewear" || prod.sub_category === "glasses";
      }
      return prod.category === tag || prod.sub_category === tag;
    });
  };

  const filteredProducts = getFilteredProducts();

  // Retrieve current active product details
  const currentProduct = productsCatalog.find((p) => p.id === selectedProductId) || filteredProducts[0] || {
    id: "B08XWP27W2",
    name: "Zara Floral Summer Dress",
    price: 1899,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600",
    category: "dresses",
    sub_category: "dress",
    affiliateLink: "https://www.amazon.in/dp/B08XWP27W2?tag=mirra0a-21",
    description: "Flowy, lightweight summer dress with vibrant floral prints."
  };

  // Handles custom photo uploads for Virtual Try-On
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPersonImage(reader.result as string);
        setIsPhotoUploaded(true);
        setTryonResult(null); // Clear previous results
        setRating(null);
        setShowFashionScore(false);
        setGenerationMeta(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Triggers visual try-on generation using our backend route
  const handleGenerateTryon = async (productId?: string) => {
    const targetProduct = productId 
      ? productsCatalog.find(p => p.id === productId) 
      : currentProduct;
      
    if (!targetProduct) return;

    // Check if the target product is an accessory
    const isAccessory = ["eyewear", "jewelry", "accessories", "makeup"].includes(targetProduct.category) || 
                        ["glasses", "earrings", "necklace", "hat", "makeup"].includes(targetProduct.sub_category);

    if (isAccessory) {
      alert(`AI Precision Try-On is only available for clothing (Shirts, Pants, Dresses). For "${targetProduct.name}", please use the Live Mirror AR tab to see it overlaid live!`);
      setStudioMode("mirror");
      return;
    }

    if (!isPhotoUploaded) {
      alert("Please upload a photo first");
      setStudioMode("upload");
      return;
    }
    
    setIsGenerating(true);
    setRating(null);
    setShowFashionScore(false);
    setGenerationMeta(null);

    try {
      const token = await getToken();
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:8000";
      const response = await fetch(`${backendUrl}/api/generate-tryon`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          person_image_url: personImage,
          garment_image_url: targetProduct.image,
          garment_type: targetProduct.category,
          product_id: targetProduct.id
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setTryonResult(data.image_url);
        setGenerationMeta({
          model: data.model_used,
          latency: data.latency_ms,
          success: data.success,
        });

        // Trigger AI Fashion Rating right after VTON generation completes
        await handleGenerateRating(personImage, targetProduct.image, data.image_url);
      } else {
        showToast("VTON styling service returned an error.");
      }
    } catch (err) {
      console.error("Connection to VTON server failed:", err);
      showToast("VTON styling service is offline.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Triggers outfit compatibility scoring
  const handleGenerateRating = async (person: string, garment: string, result: string) => {
    setIsRating(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:8000";
      const response = await fetch(`${backendUrl}/api/rate-outfit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          person_image_url: person,
          garment_image_url: garment,
          result_image_url: result,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setRating(data);
      }
    } catch (err) {
      console.error("Failed to fetch rating:", err);
    } finally {
      setIsRating(false);
    }
  };

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    if (category === "clothing") setSelectedTag("Shirts");
    else if (category === "pants") setSelectedTag("Pants");
    else if (category === "dresses") setSelectedTag("Dresses");
    else if (category === "makeup") setSelectedTag("Makeup");
    else if (category === "jewelry") setSelectedTag("Jewelry");
    else if (category === "accessories") setSelectedTag("Hats");
    else if (category === "eyewear") setSelectedTag("Goggles");
    else setSelectedTag("All");
    
    router.push(`/studio#${category}`);
  };

  const handleProductCardTryon = (prod: Product) => {
    setSelectedProductId(prod.id);
    const isAccessory = ["eyewear", "jewelry", "accessories", "makeup"].includes(prod.category) || 
                        ["glasses", "earrings", "necklace", "hat", "makeup"].includes(prod.sub_category);
    
    if (isAccessory) {
      // Swaps to Live Mirror AR and alerts to change overlay
      setStudioMode("mirror");
      showToast(`Select accessory icon inside Live Mirror to test ${prod.name}`);
    } else {
      // Swaps to AI Try-On Studio and triggers VTON run automatically
      setStudioMode("upload");
      handleGenerateTryon(prod.id);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Left Sidebar items
  const leftSidebarItems = [
    { id: "mirror", label: "Live Mirror AR", icon: Camera, action: () => setStudioMode("mirror") },
    { id: "upload", label: "AI Try-On", icon: ImagePlus, action: () => setStudioMode("upload") },
    { id: "video", label: "Generate Video", icon: Video, action: () => showToast("MIRRA Motion - Coming Soon! Generate try-on videos.") },
    { id: "history", label: "Creator History", icon: History, action: () => router.push("/creator") },
    { id: "settings", label: "Settings & Profile", icon: Settings, action: () => setIsSettingsOpen(true) },
  ];

  // Right Sidebar wardrobe filters
  const rightSidebarItems = [
    { id: "clothing", label: "Shirts", icon: Shirt },
    { id: "pants", label: "Pants", icon: PantsIcon },
    { id: "dresses", label: "Dresses", icon: DressIcon },
    { id: "makeup", label: "Makeup", icon: LipstickIcon },
    { id: "jewelry", label: "Jewelry", icon: Gem },
    { id: "accessories", label: "Hats", icon: Crown },
    { id: "eyewear", label: "Goggles", icon: Glasses },
  ];

  if (!mounted) {
    return (
      <div className="h-screen w-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-pink-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-[#FAFAFA] flex flex-col relative font-sans text-[#1A1A1A] overflow-hidden select-none">
      
      {/* Header */}
      {!isViewportExpanded && (
        <header className="w-full max-w-7xl mx-auto bg-white/60 backdrop-blur-2xl rounded-full px-6 py-2.5 flex items-center justify-between border border-white/80 shadow-sm shrink-0 z-50 mt-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tighter text-[#1A1A1A] font-syncopate">
              MIRRA
            </span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-400"></span>
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 font-semibold tracking-wide uppercase">
            <span>Studio</span>
            <span className="text-gray-300">/</span>
            <span className="text-pink-400 font-black">
              {studioMode === "mirror" ? "Live Mirror AR" : "AI Precision Try-On"}
            </span>
          </div>

          <div className="flex items-center gap-3.5">
            {isLoaded && user && (
              <div className="flex items-center gap-2 bg-white/50 backdrop-blur-md border border-white px-3 py-1 rounded-full shadow-sm">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-605">
                  {user.firstName || 'User'}
                </span>
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-7 h-7 rounded-full border border-pink-200 shadow-sm"
                    }
                  }}
                />
              </div>
            )}
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-gradient-to-r from-[#FFD1DC] to-[#E8C4FF] rounded-full px-5 py-1.5 text-xs font-black tracking-wider uppercase text-gray-900 border border-white shadow-sm flex items-center gap-1.5 transition-all"
              >
                Exit Studio
              </motion.button>
            </Link>
          </div>
        </header>
      )}

      {/* Main Row Container */}
      <div className="flex-grow w-full max-w-7xl mx-auto flex flex-row items-center justify-between gap-6 p-4 md:p-6 min-h-0 relative z-0">

        {/* 2. LEFT SIDEBAR */}
        {!isViewportExpanded && (
          <nav className="relative z-10 hidden md:flex flex-col gap-4 p-4 bg-white/85 backdrop-blur-xl rounded-[2rem] border border-white/90 shadow-lg shrink-0 w-20 items-center justify-between h-[65vh]">
            <div className="flex flex-col gap-4.5 w-full items-center">
              {leftSidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = (item.id === "mirror" && studioMode === "mirror") ||
                                 (item.id === "upload" && studioMode === "upload");
                return (
                  <motion.button
                    key={item.id}
                    onClick={item.action}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${
                      isActive
                        ? "bg-[#FFD1DC] border-white shadow-[0_0_12px_rgba(255,209,220,0.6)] text-gray-900"
                        : "bg-white/40 border-transparent hover:bg-white/70 text-gray-500 hover:text-gray-800"
                    }`}
                    title={item.label}
                  >
                    <Icon className="w-5.5 h-5.5" />
                  </motion.button>
                );
              })}
            </div>
            
            {/* Profile Avatar */}
            {isLoaded && user && (
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="w-10 h-10 rounded-full overflow-hidden border border-white shadow-sm hover:scale-105 transition-transform"
                title="Profile Settings"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={user.imageUrl} alt="Profile" className="w-full h-full object-cover" />
              </button>
            )}
          </nav>
        )}

        {/* 3. CENTER VIEWPORT STAGE */}
        <main className={`bg-gray-950 overflow-hidden shadow-2xl relative transition-all duration-500 ease-in-out flex-1 flex flex-col items-center justify-center ${
          isViewportExpanded
            ? "w-screen h-screen fixed inset-0 rounded-none border-none z-50"
            : "h-[65vh] rounded-[2.5rem] border border-white/40"
        }`}>
          {/* Maximize / Minimize Button */}
          <div className="absolute top-6 right-6 z-30 flex items-center gap-2">
            <button
              onClick={() => setIsViewportExpanded(!isViewportExpanded)}
              className="w-9 h-9 rounded-full bg-white/60 hover:bg-white/80 border border-white/80 flex items-center justify-center shadow-sm backdrop-blur-md transition-all pointer-events-auto cursor-pointer"
            >
              {isViewportExpanded ? (
                <Minimize2 className="w-4 h-4 text-gray-800" />
              ) : (
                <Maximize2 className="w-4 h-4 text-gray-800" />
              )}
            </button>
          </div>

          {/* Mode 1: Live Mirror AR */}
          {studioMode === "mirror" ? (
            <div className="w-full h-full">
              <LiveMirrorMediaPipe selectedProduct={currentProduct} />
            </div>
          ) : (
            // Mode 2: AI Precision Try-On
            <div className="relative w-full h-full flex flex-col items-center justify-start p-4 md:p-6 overflow-y-auto scrollbar-none">
              
              {/* Photo Input (Hidden) */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                accept="image/*"
                className="hidden"
              />

              {/* Before/After split */}
              <div className="w-full flex-grow flex flex-col md:flex-row items-center justify-center gap-4 min-h-0">
                
                {/* Left: Original */}
                <div className={`flex-1 h-full flex flex-col items-center justify-center relative bg-black/20 rounded-3xl border border-white/5 overflow-hidden transition-all duration-300 ${
                  isViewportExpanded ? "max-h-[72vh] md:max-h-[78vh]" : "max-h-[42vh] md:max-h-[48vh]"
                }`}>
                  <span className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[9px] font-black text-gray-300 uppercase tracking-widest">
                    Before
                  </span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={personImage}
                    alt="Original"
                    className="h-full w-full object-contain select-none rounded-2xl"
                  />
                  <button
                    onClick={triggerFileInput}
                    className="absolute bottom-4 bg-white/80 hover:bg-white border border-white/60 shadow-lg rounded-full py-1.5 px-3.5 text-[9px] font-black uppercase tracking-wider text-gray-850 transition-all flex items-center gap-1"
                  >
                    <Upload className="w-3 h-3" /> Change Photo
                  </button>
                </div>

                {/* Right: Try-on result */}
                <div className={`flex-1 h-full flex flex-col items-center justify-center relative bg-black/20 rounded-3xl border border-white/5 overflow-hidden transition-all duration-300 ${
                  isViewportExpanded ? "max-h-[72vh] md:max-h-[78vh]" : "max-h-[42vh] md:max-h-[48vh]"
                }`}>
                  <span className="absolute top-4 left-4 z-10 bg-pink-500/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[9px] font-black text-white uppercase tracking-widest">
                    After
                  </span>
                  
                  {tryonResult ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={tryonResult}
                      alt="VTON Tryon Result"
                      className="h-full w-full object-contain select-none rounded-2xl animate-fade-in"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center p-6 gap-2">
                      <Sparkles className="w-8 h-8 text-pink-400/60 animate-pulse" />
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Choose garment & click Try On
                      </span>
                    </div>
                  )}

                  {/* Buy button */}
                  {tryonResult && currentProduct && (
                    <div className="absolute top-4 right-4 z-10">
                      <a
                        href={currentProduct.affiliateLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white/90 backdrop-blur-md hover:bg-white border border-white shadow-md rounded-full py-1.5 px-3.5 text-[9px] font-black text-gray-800 uppercase flex items-center gap-1 transition-all"
                      >
                        Buy on Amazon.in <ExternalLink className="w-3 h-3 text-pink-500" />
                      </a>
                    </div>
                  )}

                  {/* Reveal AI Rating button */}
                  {tryonResult && rating && (
                    <button
                      onClick={() => setShowFashionScore(true)}
                      className="absolute bottom-4 bg-[#FFD1DC] hover:opacity-90 border border-white shadow-lg rounded-full py-1.5 px-3.5 text-[9px] font-black uppercase tracking-wider text-gray-900 transition-all flex items-center gap-1.5 cursor-pointer z-10"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-pink-500 animate-pulse" /> Reveal AI Rating
                    </button>
                  )}
                </div>

              </div>

              {/* Try-on loading status */}
              <AnimatePresence>
                {isGenerating && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-30 bg-gray-950/80 backdrop-blur-md flex flex-col items-center justify-center"
                  >
                    <RefreshCw className="w-10 h-10 text-pink-400 animate-spin" />
                    <span className="mt-4 text-xs font-black text-white tracking-widest uppercase font-syncopate">
                      AI is styling your look...
                    </span>
                    <span className="mt-1.5 text-[10px] text-gray-400 font-semibold tracking-wider animate-pulse">
                      Processing try-on fit (5-8 seconds)
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* AI Fashion Rater Widget */}
              {/* AI Fashion Rater Widget (Modal Overlay) */}
              <AnimatePresence>
                {rating && showFashionScore && !isGenerating && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-40 bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="relative w-full max-w-lg bg-gray-900 border border-white/10 rounded-[2rem] p-5 shadow-2xl flex flex-col gap-4 text-white"
                    >
                      {/* Close button */}
                      <button
                        onClick={() => setShowFashionScore(false)}
                        className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white font-bold text-xs cursor-pointer border-none"
                      >
                        ✕
                      </button>
                      <AIFashionRater rating={rating} />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Engine Meta */}
              {generationMeta && !isGenerating && (
                <div className="absolute top-16 left-6 z-20 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/10 flex flex-col items-start gap-0.5 text-[9px] font-bold text-gray-300 tracking-wider">
                  <div className="flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${generationMeta.success ? "bg-emerald-400" : "bg-yellow-400"}`} />
                    <span>Model: <span className="text-white font-black">{generationMeta.model}</span></span>
                  </div>
                  <span>Latency: <span className="text-white font-black">{generationMeta.latency}ms</span></span>
                </div>
              )}

            </div>
          )}

          {/* Viewport Title */}
          <div className="absolute top-6 left-6 z-20 flex items-center gap-3 text-left pointer-events-none">
            <div className="w-9 h-9 rounded-full bg-white/60 border border-white/80 flex items-center justify-center shadow-sm backdrop-blur-md">
              <ArrowLeft className="w-4 h-4 text-gray-800" />
            </div>
            <div>
              <h2 className="text-sm font-black text-gray-900 tracking-tight leading-none uppercase font-syncopate">
                MIRRA STUDIO
              </h2>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                AI Try-On Center
              </span>
            </div>
          </div>

        </main>

      {/* 4. RIGHT SIDEBAR */}
      {!isViewportExpanded && (
        <nav className="relative z-10 hidden lg:flex flex-col gap-4 p-4 bg-white/85 backdrop-blur-xl rounded-[2rem] border border-white/95 shadow-lg shrink-0 w-20 items-center justify-center h-[55vh]">
          {rightSidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeCategory === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => handleCategoryClick(item.id)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 flex items-center justify-center border-none bg-transparent cursor-pointer"
                title={item.label}
              >
                <Icon className={
                  isActive
                    ? "w-6 h-6 text-pink-500 bg-pink-100 rounded-xl p-1"
                    : "w-6 h-6 text-gray-400 hover:text-pink-500 transition-colors"
                } />
              </motion.button>
            );
          })}
        </nav>
      )}

    </div>

      {/* 5. BOTTOM TRAY */}
      {!isViewportExpanded && (
        <motion.footer
          layout
          className="relative z-20 mt-auto w-full max-w-5xl mx-auto bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-4 border border-white/85 shadow-2xl flex flex-col gap-3.5 shrink-0 mb-4"
        >
          {/* Top Row: Product List */}
          <motion.div
            initial={false}
            animate={{
              height: isTrayExpanded ? "auto" : 0,
              opacity: isTrayExpanded ? 1 : 0,
              marginBottom: isTrayExpanded ? 6 : 0
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="text-left w-full overflow-y-auto max-h-[185px] scrollbar-none"
          >
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5 select-none">
              Try On Catalog ({filteredProducts.length})
            </h3>

            {/* Category Tags Filter Row */}
            <div className="flex gap-2 overflow-x-auto pb-3.5 scrollbar-none select-none">
              {["All", "Shirts", "Pants", "Dresses", "Makeup", "Jewelry", "Hats", "Goggles"].map((tag) => {
                const isSelected = selectedTag === tag;
                return (
                  <button
                    key={tag}
                    onClick={() => {
                      setSelectedTag(tag);
                      const tagLower = tag.toLowerCase();
                      if (tagLower === "all") setActiveCategory("all");
                      else if (tagLower === "shirts") setActiveCategory("clothing");
                      else if (tagLower === "pants") setActiveCategory("pants");
                      else if (tagLower === "dresses") setActiveCategory("dresses");
                      else if (tagLower === "makeup") setActiveCategory("makeup");
                      else if (tagLower === "jewelry") setActiveCategory("jewelry");
                      else if (tagLower === "hats") setActiveCategory("accessories");
                      else if (tagLower === "goggles") setActiveCategory("eyewear");
                    }}
                    className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider border transition-all ${
                      isSelected
                        ? "bg-[#E8C4FF] text-gray-900 border-white shadow-sm"
                        : "bg-white/45 text-gray-500 border-gray-150 hover:bg-white/70"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>

            {isLoadingProducts ? (
              <div className="w-full h-28 flex items-center justify-center text-xs text-gray-400 font-semibold gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-pink-400" /> Querying Amazon India database...
              </div>
            ) : (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x w-full">
                {filteredProducts.length === 0 ? (
                  <div className="w-full py-8 text-center text-xs font-bold text-gray-400 uppercase tracking-wider bg-white/30 border border-dashed border-gray-200 rounded-3xl">
                    No products found in this category. We are adding items soon!
                  </div>
                ) : (
                  filteredProducts.map((prod) => (
                    <motion.div
                      key={prod.id}
                      onClick={() => setSelectedProductId(prod.id)}
                      whileHover={{ y: -2 }}
                      className={`min-w-[110px] w-[110px] h-[155px] rounded-2xl bg-white shadow-sm overflow-hidden flex flex-col snap-center cursor-pointer border-2 transition-all shrink-0 ${
                        selectedProductId === prod.id
                          ? "border-[#FFD1DC] shadow-[0_0_12px_rgba(255,209,220,0.5)]"
                          : "border-transparent hover:border-gray-200"
                      }`}
                    >
                      {/* Product Image */}
                      <div className="w-full h-[60%] relative overflow-hidden bg-gray-50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Product details */}
                      <div className="p-1.5 flex flex-col justify-between flex-grow text-left gap-0.5">
                        <span className="text-[8.5px] font-black text-gray-800 truncate block leading-tight">
                          {prod.name.length > 16 ? `${prod.name.substring(0, 14)}...` : prod.name}
                        </span>
                        <div className="flex items-center justify-between w-full mt-auto">
                          <span className="text-[8.5px] font-black text-pink-500">
                            ₹{prod.price.toLocaleString("en-IN")}
                          </span>
                          
                          {/* Try On trigger */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProductCardTryon(prod);
                            }}
                            className="bg-gradient-to-r from-[#FFD1DC] to-[#E8C4FF] text-gray-900 border border-white/60 rounded-full px-1.5 py-0.5 text-[7px] font-black uppercase tracking-wider shadow-sm transition-opacity hover:opacity-90 active:scale-95"
                          >
                            Try On
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}
          </motion.div>

          {/* Bottom Row: Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2.5 border-t border-gray-100/50">
            {/* Mode selection */}
            <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/40 border border-white/60">
              <button
                onClick={() => setStudioMode("mirror")}
                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                  studioMode === "mirror"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-850"
                }`}
              >
                <Camera className="w-3.5 h-3.5 text-pink-400" />
                Live Mirror AR
              </button>
              <button
                onClick={() => setStudioMode("upload")}
                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                  studioMode === "upload"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-850"
                }`}
              >
                <Upload className="w-3.5 h-3.5 text-pink-400" />
                AI Try-On
              </button>
            </div>

            {/* Visibility options */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => setIsTrayExpanded(!isTrayExpanded)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border ${
                  isTrayExpanded
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white/80 hover:bg-white text-gray-850 border-white/80"
                }`}
              >
                {isTrayExpanded ? (
                  <>
                    <span>Hide Wardrobe</span>
                    <span className="text-[10px]">▼</span>
                  </>
                ) : (
                  <>
                    <span>Try On Catalog ({filteredProducts.length})</span>
                    <span className="text-[10px]">▲</span>
                  </>
                )}
              </button>

              {studioMode === "upload" && (
                <motion.button
                  onClick={() => handleGenerateTryon()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gradient-to-r from-[#FFD1DC] to-[#E8C4FF] rounded-full px-5 py-2 text-[10px] font-black uppercase tracking-wider text-gray-900 border border-white shadow-md flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                  Re-Generate Fit
                </motion.button>
              )}
            </div>
          </div>
        </motion.footer>
      )}

      {/* Responsive mobile sidebar bottom nav */}
      {!isViewportExpanded && (
        <div className="md:hidden absolute bottom-28 left-1/2 -translate-x-1/2 z-40 bg-white/70 backdrop-blur-xl rounded-full px-4 py-2 border border-white/80 shadow-lg flex items-center gap-4">
          <button 
            onClick={() => setStudioMode("mirror")}
            className={studioMode === "mirror" ? "text-pink-500" : "text-gray-400"}
          >
            <Camera className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setStudioMode("upload")}
            className={studioMode === "upload" ? "text-pink-500" : "text-gray-400"}
          >
            <ImagePlus className="w-5 h-5" />
          </button>
          <button 
            onClick={() => showToast("MIRRA Motion - Coming Soon! Generate try-on videos.")}
            className="text-gray-400"
          >
            <Video className="w-5 h-5" />
          </button>
          <button 
            onClick={() => router.push("/creator")}
            className="text-gray-400"
          >
            <History className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="text-gray-400"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-[2rem] border border-white/80 shadow-2xl p-6 w-full max-w-md relative text-left"
            >
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-full hover:bg-gray-150"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-sm font-black text-gray-900 tracking-tight leading-none uppercase font-syncopate mb-5">
                Profile & Settings
              </h3>

              {isLoaded && user && (
                <div className="flex flex-col gap-3 border-b border-gray-100 pb-5 mb-5">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={user.imageUrl}
                      alt={user.fullName || "User Avatar"}
                      className="w-14 h-14 rounded-full border-2 border-pink-200 shadow-sm animate-fade-in"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-gray-800">{user.fullName}</span>
                      <span className="text-[10px] font-bold text-gray-500 leading-tight">
                        {user.primaryEmailAddress?.emailAddress}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest bg-gradient-to-r from-[#FFD1DC] to-[#E8C4FF] text-gray-900 border border-white shadow-sm w-fit mt-1.5">
                        PRO Member
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      setIsSettingsOpen(false);
                      openUserProfile();
                    }}
                    className="w-full mt-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl py-2 px-4 text-[10px] font-black uppercase tracking-wider text-gray-650 transition-all flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer"
                  >
                    Edit Profile
                  </button>
                </div>
              )}

              {/* Outfit Sizing preferences */}
              <div className="flex flex-col gap-4 mb-6">
                <div>
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">
                    Try-On Body Size
                  </label>
                  <select
                    value={prefSize}
                    onChange={(e) => setPrefSize(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs font-bold focus:outline-none focus:border-pink-300"
                  >
                    <option value="XS">XS - Extra Small</option>
                    <option value="S">S - Small</option>
                    <option value="M">M - Medium</option>
                    <option value="L">L - Large</option>
                    <option value="XL">XL - Extra Large</option>
                  </select>
                </div>

                <div>
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">
                    Fashion Vibe
                  </label>
                  <select
                    value={prefStyle}
                    onChange={(e) => setPrefStyle(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs font-bold focus:outline-none focus:border-pink-300"
                  >
                    <option value="Casual">Casual Streetwear</option>
                    <option value="Formal">Formal & Classic</option>
                    <option value="Traditional">Traditional Ethnic</option>
                    <option value="Sporty">Sporty & Athletic</option>
                  </select>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsSettingsOpen(false);
                  signOut(() => router.push("/"));
                }}
                className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:opacity-90 text-white rounded-xl py-3 px-4 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-98 border border-white/20 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sign Out Account
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spring Toasts */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -50, x: "-50%" }}
            className="fixed top-8 left-1/2 z-[200] bg-gray-900/90 backdrop-blur-md border border-white/10 px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-[10px] font-bold text-white uppercase tracking-wider"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

const offlineFallbackProducts: Product[] = [
  {
    id: "B08XWP27W2",
    name: "Zara Floral Summer Dress",
    category: "dresses",
    sub_category: "dress",
    price: 1899,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600",
    affiliateLink: "https://www.amazon.in/dp/B08XWP27W2?tag=mirra0a-21",
    description: "Flowy, lightweight summer dress with vibrant floral prints."
  },
  {
    id: "B08XWP28X3",
    name: "H&M Black Evening Gown",
    category: "dresses",
    sub_category: "dress",
    price: 2999,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600",
    affiliateLink: "https://www.amazon.in/dp/B08XWP28X3?tag=mirra0a-21",
    description: "Elegant off-shoulder black gown with draped silhouette."
  },
  {
    id: "B08XWP29Y4",
    name: "Mango Floral Printed Dress",
    category: "dresses",
    sub_category: "dress",
    price: 2499,
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600",
    affiliateLink: "https://www.amazon.in/dp/B08XWP29Y4?tag=mirra0a-21",
    description: "Soft yellow slip midi dress printed with wild garden blooms."
  },
  {
    id: "B08XWP30Z5",
    name: "FabIndia Cotton Anarkali Dress",
    category: "dresses",
    sub_category: "dress",
    price: 3499,
    image: "https://images.unsplash.com/photo-1618932260643-eee4a2f6c916?w=600",
    affiliateLink: "https://www.amazon.in/dp/B08XWP30Z5?tag=mirra0a-21",
    description: "Traditional cotton flared Anarkali kurta in rich hand-blocked print."
  },
  {
    id: "B08XWP31A6",
    name: "Biba Traditional A-Line Dress",
    category: "dresses",
    sub_category: "dress",
    price: 2199,
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600",
    affiliateLink: "https://www.amazon.in/dp/B08XWP31A6?tag=mirra0a-21",
    description: "Casual flared ethnic summer dress in pastel lilac fabric."
  },
  {
    id: "B08XWP32B7",
    name: "Mango White Blouse",
    category: "clothing",
    sub_category: "shirt",
    price: 1299,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600",
    affiliateLink: "https://www.amazon.in/dp/B08XWP32B7?tag=mirra0a-21",
    description: "Elegant formal white button-down linen blouse."
  },
  {
    id: "B08XWP33C8",
    name: "Forever21 Crop Top",
    category: "clothing",
    sub_category: "shirt",
    price: 899,
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600",
    affiliateLink: "https://www.amazon.in/dp/B08XWP33C8?tag=mirra0a-21",
    description: "Trendy ribbed knit cotton crop top in lilac."
  },
  {
    id: "B08XWP34D9",
    name: "Zara Casual Denim Shirt",
    category: "clothing",
    sub_category: "shirt",
    price: 1999,
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600",
    affiliateLink: "https://www.amazon.in/dp/B08XWP34D9?tag=mirra0a-21",
    description: "Classic wash indigo denim shirt, perfect for casual layering."
  },
  {
    id: "B08XWP35E0",
    name: "H&M Oversized Fleece Hoodie",
    category: "clothing",
    sub_category: "shirt",
    price: 1799,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600",
    affiliateLink: "https://www.amazon.in/dp/B08XWP35E0?tag=mirra0a-21",
    description: "Oversized cotton fleece hoodie in deep charcoal gray."
  },
  {
    id: "B08XWP35E1",
    name: "Levi's Graphic Tee",
    category: "clothing",
    sub_category: "shirt",
    price: 999,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600",
    affiliateLink: "https://www.amazon.in/dp/B08XWP35E1?tag=mirra0a-21",
    description: "Soft cotton graphic print tee with signature logo."
  },
  {
    id: "B08XWP35P1",
    name: "Levi's 501 Original Jeans",
    category: "pants",
    sub_category: "pants",
    price: 3299,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600",
    affiliateLink: "https://www.amazon.in/dp/B08XWP35P1?tag=mirra0a-21",
    description: "Iconic straight-fit blue denim jeans with button fly."
  },
  {
    id: "B08XWP35P2",
    name: "Zara High-Waist Trousers",
    category: "pants",
    sub_category: "pants",
    price: 2799,
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600",
    affiliateLink: "https://www.amazon.in/dp/B08XWP35P2?tag=mirra0a-21",
    description: "Elegant wide-leg high-waist trousers in black."
  },
  {
    id: "B08XWP35P3",
    name: "H&M Cotton Jogger Pants",
    category: "pants",
    sub_category: "pants",
    price: 1499,
    image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600",
    affiliateLink: "https://www.amazon.in/dp/B08XWP35P3?tag=mirra0a-21",
    description: "Comfortable elastic-waist joggers in heather gray."
  },
  {
    id: "B08XWP35P4",
    name: "Mango Cargo Utility Pants",
    category: "pants",
    sub_category: "pants",
    price: 2499,
    image: "https://images.unsplash.com/photo-1517423568366-8b83523034fd?w=600",
    affiliateLink: "https://www.amazon.in/dp/B08XWP35P4?tag=mirra0a-21",
    description: "Relaxed utility cargo trousers with side pocket detail."
  },
  {
    id: "B08XWP35P5",
    name: "Only Slim Fit Black Chinos",
    category: "pants",
    sub_category: "pants",
    price: 1899,
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600",
    affiliateLink: "https://www.amazon.in/dp/B08XWP35P5?tag=mirra0a-21",
    description: "Casual slim stretch chinos, ideal for work and weekends."
  },
  {
    id: "B08XWP36F1",
    name: "Ray-Ban Aviator Sunglasses",
    category: "eyewear",
    sub_category: "glasses",
    price: 8999,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600",
    affiliateLink: "https://www.amazon.in/dp/B08XWP36F1?tag=mirra0a-21",
    description: "Gold-rimmed premium aviator sunglasses with polaroid lenses."
  },
  {
    id: "B08XWP36F2",
    name: "Oakley Frogskins Sunglasses",
    category: "eyewear",
    sub_category: "glasses",
    price: 6499,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600",
    affiliateLink: "https://www.amazon.in/dp/B08XWP36F2?tag=mirra0a-21",
    description: "Retro keyhole-bridge sports sunglasses in classic black."
  },
  {
    id: "B08XWP36F3",
    name: "Prada Cat-Eye Sunglasses",
    category: "eyewear",
    sub_category: "glasses",
    price: 14999,
    image: "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600",
    affiliateLink: "https://www.amazon.in/dp/B08XWP36F3?tag=mirra0a-21",
    description: "Designer tortoise-shell cat-eye glasses with gold logo details."
  },
  {
    id: "B08XWP36F4",
    name: "Fastrack Active Wayfarer",
    category: "eyewear",
    sub_category: "glasses",
    price: 1599,
    image: "https://images.unsplash.com/photo-1625591339768-450f7572718f?w=600",
    affiliateLink: "https://www.amazon.in/dp/B08XWP36F4?tag=mirra0a-21",
    description: "Sporty lightweight active wear wayfarer sunglasses."
  },
  {
    id: "B08XWP36F5",
    name: "Vogue Square Metal Goggles",
    category: "eyewear",
    sub_category: "glasses",
    price: 4299,
    image: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=600",
    affiliateLink: "https://www.amazon.in/dp/B08XWP36F5?tag=mirra0a-21",
    description: "Trendy oversized metal wire square frame sunglasses."
  },
  {
    id: "B08XWP37G2",
    name: "Straw Panama Beach Hat",
    category: "accessories",
    sub_category: "hat",
    price: 1499,
    image: "https://images.unsplash.com/photo-1533827432537-70133748f5c8?w=600",
    affiliateLink: "https://www.amazon.in/dp/B08XWP37G2?tag=mirra0a-21",
    description: "Lightweight straw sun hat decorated with a black ribbon band."
  },
  {
    id: "B08XWP37G3",
    name: "Adidas Classic Baseball Cap",
    category: "accessories",
    sub_category: "hat",
    price: 999,
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600",
    affiliateLink: "https://www.amazon.in/dp/B08XWP37G3?tag=mirra0a-21",
    description: "Adjustable cotton twill sports cap with embroidered logo."
  },
  {
    id: "B08XWP37G4",
    name: "Carhartt Knit Winter Beanie",
    category: "accessories",
    sub_category: "hat",
    price: 1299,
    image: "https://images.unsplash.com/photo-1576871337622-98d48d4aa53e?w=600",
    affiliateLink: "https://www.amazon.in/dp/B08XWP37G4?tag=mirra0a-21",
    description: "Warm ribbed knit winter beanie with fold-up cuff."
  },
  {
    id: "B08XWP37G5",
    name: "Zara Wool Fedora Hat",
    category: "accessories",
    sub_category: "hat",
    price: 2499,
    image: "https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=600",
    affiliateLink: "https://www.amazon.in/dp/B08XWP37G5?tag=mirra0a-21",
    description: "Structured wool felt fedora hat with wide brim."
  },
  {
    id: "B08XWP37G6",
    name: "H&M French Wool Beret",
    category: "accessories",
    sub_category: "hat",
    price: 1199,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600",
    affiliateLink: "https://www.amazon.in/dp/B08XWP37G6?tag=mirra0a-21",
    description: "Classic Parisian style wool beret hat in crimson."
  },
  {
    id: "B08XWP38H3",
    name: "Elegant Gold Hoop Earrings",
    category: "jewelry",
    sub_category: "earrings",
    price: 2499,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600",
    affiliateLink: "https://www.amazon.in/dp/B08XWP38H3?tag=mirra0a-21",
    description: "18k gold-plated hoop earrings with smooth polish finish."
  },
  {
    id: "B08XWP39I4",
    name: "Classic Silver Chain Necklace",
    category: "jewelry",
    sub_category: "necklace",
    price: 3299,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600",
    affiliateLink: "https://www.amazon.in/dp/B08XWP39I4?tag=mirra0a-21",
    description: "Delicate sterling silver chain with a sparkling diamond pendant."
  },
  {
    id: "B08XWP39I5",
    name: "Giva Pearl Stud Earrings",
    category: "jewelry",
    sub_category: "earrings",
    price: 1799,
    image: "https://images.unsplash.com/photo-1590548784585-645d2b09e377?w=600",
    affiliateLink: "https://www.amazon.in/dp/B08XWP39I5?tag=mirra0a-21",
    description: "Freshwater round pearl studs with sterling silver posts."
  },
  {
    id: "B08XWP39I6",
    name: "Mango Layered Gold Choker",
    category: "jewelry",
    sub_category: "necklace",
    price: 1499,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600",
    affiliateLink: "https://www.amazon.in/dp/B08XWP39I6?tag=mirra0a-21",
    description: "Layered gold link chain choker with coin pendant."
  },
  {
    id: "B08XWP39I7",
    name: "Zara Emerald Drops Earrings",
    category: "jewelry",
    sub_category: "earrings",
    price: 2999,
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600",
    affiliateLink: "https://www.amazon.in/dp/B08XWP39I7?tag=mirra0a-21",
    description: "Statement drop earrings featuring rich green emerald crystals."
  },
  {
    id: "B08XWP40M1",
    name: "Ruby Glow Liquid Lipstick",
    category: "makeup",
    sub_category: "makeup",
    price: 799,
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600",
    affiliateLink: "https://www.amazon.in/dp/B08XWP40M1?tag=mirra0a-21",
    description: "Vibrant Classic Red matte liquid lipstick, smudge-proof."
  },
  {
    id: "B08XWP40M2",
    name: "Soft Rose Satin Lipstick",
    category: "makeup",
    sub_category: "makeup",
    price: 699,
    image: "https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?w=600",
    affiliateLink: "https://www.amazon.in/dp/B08XWP40M2?tag=mirra0a-21",
    description: "Hydrating Soft Rose pink lipstick with satin smooth finish."
  },
  {
    id: "B08XWP40M3",
    name: "Coral Sunset Powder Blush",
    category: "makeup",
    sub_category: "makeup",
    price: 999,
    image: "https://images.unsplash.com/photo-1631730359575-38e4755d772b?w=600",
    affiliateLink: "https://www.amazon.in/dp/B08XWP40M3?tag=mirra0a-21",
    description: "Warm Coral Pink blush powder, blendable and pigmented."
  },
  {
    id: "B08XWP40M4",
    name: "Beige Glow Satin Foundation",
    category: "makeup",
    sub_category: "makeup",
    price: 1499,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600",
    affiliateLink: "https://www.amazon.in/dp/B08XWP40M4?tag=mirra0a-21",
    description: "Medium Sand Beige foundation with skin-smoothing tint."
  },
  {
    id: "B08XWP40M5",
    name: "Golden Tan Warm Foundation",
    category: "makeup",
    sub_category: "makeup",
    price: 1499,
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600",
    affiliateLink: "https://www.amazon.in/dp/B08XWP40M5?tag=mirra0a-21",
    description: "Deep Golden Tan foundation shade for warm skin undertones."
  },
  {
    id: "B08XWP_LINEN",
    name: "Premium White Linen Shirt",
    category: "clothing",
    sub_category: "shirt",
    price: 1499,
    image: "/assets/shirts/white-linen-shirt.png",
    affiliateLink: "https://www.amazon.in/dp/B08XWP_LINEN?tag=mirra0a-21",
    description: "Breathable, premium short-sleeve white linen shirt with single chest pocket."
  },
  {
    id: "B08XWP_POLO",
    name: "Classic Navy Blue Polo Shirt",
    category: "clothing",
    sub_category: "shirt",
    price: 1199,
    image: "/assets/shirts/navy-polo-shirt.png",
    affiliateLink: "https://www.amazon.in/dp/B08XWP_POLO?tag=mirra0a-21",
    description: "Structured navy blue pique cotton polo shirt with two-button placket."
  },
  {
    id: "B08XWP_FLANNEL",
    name: "Red & Black Checked Flannel Shirt",
    category: "clothing",
    sub_category: "shirt",
    price: 1699,
    image: "/assets/shirts/red-flannel-shirt.png",
    affiliateLink: "https://www.amazon.in/dp/B08XWP_FLANNEL?tag=mirra0a-21",
    description: "Cozy, mid-weight brushed cotton flannel shirt in classic buffalo check pattern."
  },
  {
    id: "B08XWP_OXFORD",
    name: "Light Blue Long-Sleeve Oxford Shirt",
    category: "clothing",
    sub_category: "shirt",
    price: 1899,
    image: "/assets/shirts/blue-oxford-shirt.png",
    affiliateLink: "https://www.amazon.in/dp/B08XWP_OXFORD?tag=mirra0a-21",
    description: "Tailored light blue button-down Oxford cotton shirt with buttoned cuffs."
  }
];
