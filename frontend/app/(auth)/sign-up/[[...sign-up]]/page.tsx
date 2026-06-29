"use client";
import React, { useEffect } from "react";
import { SignUp, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  console.log("MIRRA SignUp State:", { isLoaded, isSignedIn });

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      console.log("User is already signed in. Redirecting to /studio...");
      router.replace("/studio");
    }
  }, [isLoaded, isSignedIn, router]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FAFAFA] p-4 select-none relative">
      {/* Background blobs to match landing design */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#FFD1DC]/30 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[55vw] h-[55vw] rounded-full bg-[#CCCCFF]/30 blur-[100px]" />
      </div>
      
      <div className="w-full max-w-md bg-white/85 backdrop-blur-md rounded-[2.5rem] p-6 border border-white shadow-2xl flex flex-col items-center">
        <div className="mb-6 text-center">
          <span className="text-2xl font-black tracking-tighter text-[#1A1A1A] font-syncopate">
            MIRRA
          </span>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">
            Create Your Creator Account
          </p>
        </div>

        {!isLoaded ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-8 h-8 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin" />
            <span className="text-xs font-bold text-gray-550 animate-pulse uppercase tracking-wider">
              Connecting Securely...
            </span>
          </div>
        ) : (
          <SignUp
            path="/sign-up"
            routing="path"
            signInUrl="/sign-in"
            forceRedirectUrl="/studio"
            fallbackRedirectUrl="/studio"
            appearance={{
              variables: {
                colorPrimary: "#1A1A1A",
                colorText: "#1A1A1A",
              },
              elements: {
                card: "shadow-none border-none bg-transparent w-full",
                headerTitle: "text-[#1A1A1A] font-extrabold text-lg",
                headerSubtitle: "text-gray-500 text-xs",
                formButtonPrimary: 
                  "bg-[#FFD1DC] hover:opacity-90 text-gray-900 border border-white shadow-md font-bold text-xs uppercase tracking-wider rounded-full py-3 transition-all cursor-pointer",
                socialButtonsBlockButton: "rounded-full border border-gray-200 bg-white/50 text-[#1A1A1A] hover:bg-white/80 cursor-pointer",
                socialButtonsBlockButtonText: "font-bold text-xs",
                footerActionLink: "text-pink-500 hover:text-pink-600 font-bold",
                formFieldInput: 
                  "bg-white/60 border border-gray-200 rounded-full focus:border-pink-300 focus:ring-pink-300 text-xs py-3 px-4",
                formFieldLabel: "text-gray-700 font-bold text-xs",
              },
            }}
          />
        )}
      </div>
    </div>
  );
}
