"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, History, Sparkles, Calendar, Maximize2, X, Download } from "lucide-react";
import Link from "next/link";
import { useAuth, useUser } from "@clerk/nextjs";

interface TryOnSession {
  id: string;
  user_id: string;
  product_id: string;
  result_image_url: string;
  created_at: string;
}

export default function CreatorHistory() {
  const { getToken, userId } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const [history, setHistory] = useState<TryOnSession[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function fetchHistory() {
      if (!userId) {
        setIsLoading(false);
        return;
      }
      try {
        const token = await getToken();
        const response = await fetch("http://localhost:8000/api/user/history", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setHistory(data);
        } else {
          setError("Failed to retrieve try-on history from DSQL");
        }
      } catch (err) {
        console.error("Error fetching try-on history:", err);
        setError("Connection to history API failed");
      } finally {
        setIsLoading(false);
      }
    }
    if (userLoaded) {
      fetchHistory();
    }
  }, [userLoaded, userId]);

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (e) {
      return dateStr;
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-white/5 border-t-pink-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-pink-500 selection:text-white pb-16">
      {/* Background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-pink-900/10 blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/10 blur-[150px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-8">
        {/* Header Navigation */}
        <div className="flex items-center justify-between border-b border-white/5 pb-6 mb-10">
          <div className="flex items-center gap-4">
            <Link
              href="/studio"
              className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 group flex items-center justify-center cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
            </Link>
            <div>
              <div className="flex items-center gap-2 text-pink-400 font-black tracking-widest text-xs uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Mirra Studio</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-0.5">
                Creator History
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 font-medium">
            <History className="w-4 h-4 text-pink-400" />
            <span>Aurora DSQL Enabled</span>
          </div>
        </div>

        {/* User Card Info */}
        {user && (
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <img
                src={user.imageUrl}
                alt="Avatar"
                className="w-12 h-12 rounded-full border border-pink-500/20 object-cover"
              />
              <div>
                <h3 className="font-extrabold text-white leading-none">
                  {user.fullName || "Creator"}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {user.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-[10px] uppercase tracking-widest font-black text-gray-400">
                Total Generations
              </div>
              <div className="text-xl font-black text-pink-400 mt-0.5">
                {history.length} Try-On{history.length === 1 ? "" : "s"}
              </div>
            </div>
          </div>
        )}

        {/* Content Display */}
        {isLoading ? (
          /* Grid Skeletons */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-[3/4] rounded-2xl bg-white/[0.03] border border-white/5 animate-pulse flex items-center justify-center"
              >
                <div className="w-10 h-10 rounded-full border-2 border-white/5 border-t-pink-500/50 animate-spin" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-full bg-red-950/20 border border-red-500/30 flex items-center justify-center text-red-400 text-xl font-bold mb-4">
              ⚠
            </div>
            <h3 className="font-bold text-white text-lg">Failed to load history</h3>
            <p className="text-sm text-gray-400 max-w-sm mt-1">{error}</p>
          </div>
        ) : history.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 bg-white/[0.01] border border-white/5 rounded-3xl text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-pink-950/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-6">
              <History className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-extrabold text-white">No history yet</h2>
            <p className="text-gray-400 text-sm max-w-md mt-2">
              Generate a precision virtual try-on in the studio, and your looks will automatically save to AWS Aurora DSQL database!
            </p>
            <Link
              href="/studio"
              className="mt-8 px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-indigo-500 hover:from-pink-600 hover:to-indigo-600 font-bold text-sm tracking-wide shadow-lg shadow-pink-500/10 hover:shadow-pink-500/20 transition-all duration-300 scale-100 hover:scale-[1.02]"
            >
              Enter Studio
            </Link>
          </div>
        ) : (
          /* History Grid */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {history.map((session) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                className="group relative bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-2xl overflow-hidden shadow-xl transition-all duration-300"
              >
                {/* Result Image */}
                <div className="aspect-[3/4] w-full overflow-hidden bg-slate-900 relative">
                  <img
                    src={session.result_image_url}
                    alt="Generated Look"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Floating Action Bar */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setActiveImage(session.result_image_url)}
                      className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white transition-all cursor-pointer hover:scale-110 flex items-center justify-center"
                      title="Zoom Image"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                    <a
                      href={session.result_image_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white transition-all cursor-pointer hover:scale-110 flex items-center justify-center"
                      title="Download Image"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Card Footer Info */}
                <div className="p-3 bg-slate-950/60 border-t border-white/5">
                  <div className="flex items-center gap-1.5 text-pink-400">
                    <Calendar className="w-3 h-3" />
                    <span className="text-[9px] uppercase tracking-widest font-black leading-none mt-0.5">
                      Generated On
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-300 font-medium mt-1 truncate">
                    {formatDate(session.created_at)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox / Zoom View Modal */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-lg w-full aspect-[3/4] rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={activeImage}
                alt="Enlarged Virtual Look"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setActiveImage(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
