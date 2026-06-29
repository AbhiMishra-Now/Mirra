"use client";

import React, { useEffect, useRef, useState } from "react";
import { Camera as CameraIcon, RefreshCw, AlertTriangle, Check, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

declare global {
  interface Window {
    FaceMesh: any;
    Pose: any;
    Camera: any;
  }
}

// Product interface to support binding
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

interface LiveMirrorMediaPipeProps {
  onClose?: () => void;
  selectedProduct?: Product;
}

// Helper to blend opacity on colors cleanly
function getTransparentColor(rgbaStr: string, factor: number = 0): string {
  const match = rgbaStr.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d\.]+)\)/);
  if (match) {
    const r = match[1];
    const g = match[2];
    const b = match[3];
    return `rgba(${r}, ${g}, ${b}, ${factor.toFixed(3)})`;
  }
  return rgbaStr;
}

export default function LiveMirrorMediaPipe({ onClose, selectedProduct }: LiveMirrorMediaPipeProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // MediaPipe state refs to prevent re-renders
  const latestFaceLandmarks = useRef<any>(null);
  const latestPoseLandmarks = useRef<any>(null);
  const requestRef = useRef<number | null>(null);
  const activeAccessoryRef = useRef<string>("glasses");
  const isMountedRef = useRef<boolean>(true);
  const cameraInstanceRef = useRef<any>(null);
  
  // UI States
  const [activeAccessory, setActiveAccessory] = useState<string>("glasses");
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [loadingStep, setLoadingStep] = useState<string>("Loading AI scripts...");
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [fps, setFps] = useState<number>(0);
  
  // Makeup Options State
  const [lipstickColor, setLipstickColor] = useState<string>("rgba(225, 29, 72, 0.45)"); // Classic Red default
  const [blushColor, setBlushColor] = useState<string>("rgba(253, 164, 181, 0.35)"); // Coral Pink default
  const [foundationColor, setFoundationColor] = useState<string>(""); // None default
  const [makeupIntensity, setMakeupIntensity] = useState<number>(0.4); // Intensity slider: 0.2 to 0.6

  // Makeup Color Refs for 30fps animation loop
  const lipstickColorRef = useRef<string>("rgba(225, 29, 72, 0.45)");
  const blushColorRef = useRef<string>("rgba(253, 164, 181, 0.35)");
  const foundationColorRef = useRef<string>("");
  const makeupIntensityRef = useRef<number>(0.4);

  // Accessory images refs
  const glassesImg = useRef<HTMLImageElement | null>(null);
  const hatImg = useRef<HTMLImageElement | null>(null);
  const earringsImg = useRef<HTMLImageElement | null>(null);
  const necklaceImg = useRef<HTMLImageElement | null>(null);

  // Accessories Catalog (Includes Makeup category)
  const accessories = [
    { id: "glasses", label: "Aviators", icon: "🕶️", path: "/assets/accessories/aviators.png" },
    { id: "hat", label: "Straw Hat", icon: "👒", path: "/assets/accessories/straw-hat.png" },
    { id: "earrings", label: "Gold Hoops", icon: "✨", path: "/assets/accessories/gold-hoops.png" },
    { id: "necklace", label: "Silver Chain", icon: "📿", path: "/assets/accessories/silver-chain.png" },
    { id: "makeup", label: "Makeup", icon: "💄", path: "" },
  ];

  // Helper to load external scripts dynamically
  const loadScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.crossOrigin = "anonymous";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script ${src}`));
      document.head.appendChild(script);
    });
  };

  useEffect(() => {
    activeAccessoryRef.current = activeAccessory;
  }, [activeAccessory]);

  useEffect(() => {
    lipstickColorRef.current = lipstickColor;
  }, [lipstickColor]);

  useEffect(() => {
    blushColorRef.current = blushColor;
  }, [blushColor]);

  useEffect(() => {
    foundationColorRef.current = foundationColor;
  }, [foundationColor]);

  useEffect(() => {
    makeupIntensityRef.current = makeupIntensity;
  }, [makeupIntensity]);

  // Sync selected catalog product to active AR overlay
  useEffect(() => {
    if (selectedProduct) {
      const subCat = selectedProduct.sub_category?.toLowerCase();
      const cat = selectedProduct.category?.toLowerCase();
      
      if (subCat === "glasses" || cat === "eyewear") {
        setActiveAccessory("glasses");
      } else if (subCat === "hat" || cat === "accessories") {
        setActiveAccessory("hat");
      } else if (subCat === "earrings" || cat === "jewelry" && subCat === "earrings") {
        setActiveAccessory("earrings");
      } else if (subCat === "necklace" || cat === "jewelry" && subCat === "necklace") {
        setActiveAccessory("necklace");
      } else if (subCat === "makeup" || cat === "makeup") {
        setActiveAccessory("makeup");
        const name = selectedProduct.name.toLowerCase();
        if (name.includes("red") || name.includes("ruby")) {
          setLipstickColor("rgba(225, 29, 72, 0.45)");
        } else if (name.includes("rose")) {
          setLipstickColor("rgba(244, 63, 94, 0.45)");
        } else if (name.includes("blush") || name.includes("coral")) {
          setBlushColor("rgba(253, 164, 181, 0.35)");
        } else if (name.includes("beige") || name.includes("sand")) {
          setFoundationColor("rgba(253, 230, 138, 0.08)");
        } else if (name.includes("tan") || name.includes("golden")) {
          setFoundationColor("rgba(245, 158, 11, 0.08)");
        }
      }
    }
  }, [selectedProduct]);

  const startMediaPipe = async () => {
    setIsInitializing(true);
    setHasError(false);
    
    // Preload photorealistic accessory images
    glassesImg.current = new Image();
    glassesImg.current.crossOrigin = "anonymous";
    glassesImg.current.src = "/assets/accessories/aviators.png";
    glassesImg.current.onload = () => console.log("[INFO] Loaded aviators.png");
    glassesImg.current.onerror = (e) => console.error("[ERROR] Failed to load aviators.png", e);

    hatImg.current = new Image();
    hatImg.current.crossOrigin = "anonymous";
    hatImg.current.src = "/assets/accessories/straw-hat.png";
    hatImg.current.onload = () => console.log("[INFO] Loaded straw-hat.png");
    hatImg.current.onerror = (e) => console.error("[ERROR] Failed to load straw-hat.png", e);

    earringsImg.current = new Image();
    earringsImg.current.crossOrigin = "anonymous";
    earringsImg.current.src = "/assets/accessories/gold-hoops.png";
    earringsImg.current.onload = () => console.log("[INFO] Loaded gold-hoops.png");
    earringsImg.current.onerror = (e) => console.error("[ERROR] Failed to load gold-hoops.png", e);

    necklaceImg.current = new Image();
    necklaceImg.current.crossOrigin = "anonymous";
    necklaceImg.current.src = "/assets/accessories/silver-chain.png";
    necklaceImg.current.onload = () => console.log("[INFO] Loaded silver-chain.png");
    necklaceImg.current.onerror = (e) => console.error("[ERROR] Failed to load silver-chain.png", e);

    if (!isMountedRef.current) return;
    try {
      setLoadingStep("Loading AI modules...");
      await Promise.all([
        loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js"),
        loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js"),
        loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js"),
      ]);

      if (!isMountedRef.current) return;

      if (!window.FaceMesh || !window.Pose || !window.Camera) {
        throw new Error("MediaPipe libraries failed to initialize on window object.");
      }

      setLoadingStep("Requesting camera access...");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
        stream.getTracks().forEach(track => track.stop());
      } catch (err) {
        throw new Error("Camera permission denied. Please allow access in browser settings.");
      }

      if (!isMountedRef.current) return;

      setLoadingStep("Starting face tracking...");
      const faceMesh = new window.FaceMesh({
        locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
      });
      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });
      faceMesh.onResults((results: any) => {
        if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
          latestFaceLandmarks.current = results.multiFaceLandmarks[0];
        } else {
          latestFaceLandmarks.current = null;
        }
      });

      if (!isMountedRef.current) return;

      setLoadingStep("Starting body tracking...");
      const pose = new window.Pose({
        locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
      });
      pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });
      pose.onResults((results: any) => {
        if (results.poseLandmarks) {
          latestPoseLandmarks.current = results.poseLandmarks;
        } else {
          latestPoseLandmarks.current = null;
        }
      });

      if (!isMountedRef.current) return;
      if (!videoRef.current) return;

      const camera = new window.Camera(videoRef.current, {
        onFrame: async () => {
          if (!isMountedRef.current) return;
          if (!videoRef.current) return;
          try {
            await faceMesh.send({ image: videoRef.current });
            await pose.send({ image: videoRef.current });
          } catch (e) {
            console.error("Frame processing error:", e);
          }
        },
        width: 640,
        height: 480,
      });

      cameraInstanceRef.current = camera;

      if (!isMountedRef.current) {
        try {
          camera.stop();
        } catch (e) {}
        if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
        }
        return;
      }

      setLoadingStep("Starting video stream...");
      await camera.start();

      if (!isMountedRef.current) {
        try {
          camera.stop();
        } catch (e) {}
        if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
        }
        return;
      }

      setIsInitializing(false);

      // FPS tracking variables
      let frameCount = 0;
      let lastTime = performance.now();

      // Start custom 30+ FPS Canvas Drawing Loop
      const renderLoop = () => {
        frameCount++;
        const now = performance.now();
        if (now - lastTime >= 1000) {
          setFps(Math.round((frameCount * 1000) / (now - lastTime)));
          frameCount = 0;
          lastTime = now;
        }

        const canvas = canvasRef.current;
        const video = videoRef.current;
        if (!canvas || !video) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Clear canvas with transparent clear rect
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw camera frame mirroring the image
        ctx.save();
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        ctx.restore();

        const activeAcc = activeAccessoryRef.current;

        // Draw face accessory / makeup
        if (latestFaceLandmarks.current) {
          const landmarks = latestFaceLandmarks.current;
          
          // Reference key landmarks (eyes/forehead)
          const p33 = landmarks[33]; // right eye outer corner
          const p263 = landmarks[263]; // left eye outer corner
          const p10 = landmarks[10]; // top of forehead

          const x33 = (1 - p33.x) * canvas.width;
          const y33 = p33.y * canvas.height;
          const x263 = (1 - p263.x) * canvas.width;
          const y263 = p263.y * canvas.height;

          const centerX = (x33 + x263) / 2;
          const centerY = (y33 + y263) / 2;

          const dist = Math.sqrt(Math.pow(x263 - x33, 2) + Math.pow(y263 - y33, 2));
          const angle = Math.atan2(y263 - y33, x263 - x33);

          if (activeAcc === "glasses" && glassesImg.current && glassesImg.current.complete) {
            const width = dist * 2.3;
            const height = width * (glassesImg.current.height / glassesImg.current.width);
            ctx.save();
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 0.95;
            ctx.shadowColor = 'rgba(0,0,0,0.3)';
            ctx.shadowBlur = 8;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 3;
            ctx.translate(centerX, centerY);
            ctx.rotate(angle);
            ctx.drawImage(glassesImg.current, -width / 2, -height / 2, width, height);
            ctx.restore();
          }

          if (activeAcc === "hat" && hatImg.current && hatImg.current.complete) {
            const p234 = landmarks[234];
            const p454 = landmarks[454];
            const x234 = (1 - p234.x) * canvas.width;
            const x454 = (1 - p454.x) * canvas.width;
            const faceWidth = Math.abs(x454 - x234);

            const width = faceWidth * 1.8;
            const height = width * (hatImg.current.height / hatImg.current.width);
            const x10 = (1 - p10.x) * canvas.width;
            const y10 = p10.y * canvas.height;

            ctx.save();
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 0.95;
            ctx.shadowColor = 'rgba(0,0,0,0.3)';
            ctx.shadowBlur = 8;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 3;
            ctx.translate(x10, y10 - height * 0.4);
            ctx.rotate(angle);
            ctx.drawImage(hatImg.current, -width / 2, -height / 2, width, height);
            ctx.restore();
          }

          if (activeAcc === "earrings" && earringsImg.current && earringsImg.current.complete) {
            const p234 = landmarks[234]; // Left ear attachment
            const p454 = landmarks[454]; // Right ear attachment

            const x234 = (1 - p234.x) * canvas.width;
            const y234 = p234.y * canvas.height;
            const x454 = (1 - p454.x) * canvas.width;
            const y454 = p454.y * canvas.height;

            const size = dist * 0.35;
            const height = size * (earringsImg.current.height / earringsImg.current.width);

            // Left Earring
            ctx.save();
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 0.95;
            ctx.shadowColor = 'rgba(0,0,0,0.3)';
            ctx.shadowBlur = 8;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 3;
            ctx.translate(x234, y234);
            ctx.rotate(angle);
            ctx.drawImage(earringsImg.current, -size / 2, 0, size, height);
            ctx.restore();

            // Right Earring
            ctx.save();
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 0.95;
            ctx.shadowColor = 'rgba(0,0,0,0.3)';
            ctx.shadowBlur = 8;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 3;
            ctx.translate(x454, y454);
            ctx.rotate(angle);
            ctx.drawImage(earringsImg.current, -size / 2, 0, size, height);
            ctx.restore();
          }

          // Real-time canvas-drawn Makeup (Lipstick, Blush, Foundation)
          if (activeAcc === "makeup") {
            const intensity = makeupIntensityRef.current;

            // 1. Draw Foundation (Skin Tint overlay on face silhouette)
            const fColor = foundationColorRef.current;
            if (fColor) {
              const faceSilhouette = [
                10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109, 10
              ];
              ctx.save();
              ctx.beginPath();
              const startPt = landmarks[faceSilhouette[0]];
              ctx.moveTo((1 - startPt.x) * canvas.width, startPt.y * canvas.height);
              for (let i = 1; i < faceSilhouette.length; i++) {
                const pt = landmarks[faceSilhouette[i]];
                ctx.lineTo((1 - pt.x) * canvas.width, pt.y * canvas.height);
              }
              ctx.closePath();
              ctx.fillStyle = getTransparentColor(fColor, intensity * 0.2);
              ctx.fill();
              ctx.restore();
            }

            // 2. Draw Blush (Radial soft pink gradients on cheeks)
            const bColor = blushColorRef.current;
            if (bColor) {
              const leftCheek = landmarks[280];
              const rightCheek = landmarks[50];
              const cheekRadius = dist * 0.3;

              // Draw left cheek blush
              const lx = (1 - leftCheek.x) * canvas.width;
              const ly = leftCheek.y * canvas.height;
              const leftGrad = ctx.createRadialGradient(lx, ly, 0, lx, ly, cheekRadius);
              leftGrad.addColorStop(0, getTransparentColor(bColor, intensity));
              leftGrad.addColorStop(0.5, getTransparentColor(bColor, intensity * 0.45));
              leftGrad.addColorStop(1, getTransparentColor(bColor, 0));

              ctx.save();
              ctx.beginPath();
              ctx.arc(lx, ly, cheekRadius, 0, Math.PI * 2);
              ctx.fillStyle = leftGrad;
              ctx.fill();
              ctx.restore();

              // Draw right cheek blush
              const rx = (1 - rightCheek.x) * canvas.width;
              const ry = rightCheek.y * canvas.height;
              const rightGrad = ctx.createRadialGradient(rx, ry, 0, rx, ry, cheekRadius);
              rightGrad.addColorStop(0, getTransparentColor(bColor, intensity));
              rightGrad.addColorStop(0.5, getTransparentColor(bColor, intensity * 0.45));
              rightGrad.addColorStop(1, getTransparentColor(bColor, 0));

              ctx.save();
              ctx.beginPath();
              ctx.arc(rx, ry, cheekRadius, 0, Math.PI * 2);
              ctx.fillStyle = rightGrad;
              ctx.fill();
              ctx.restore();
            }

            // 3. Draw Lipstick (Polygon fill on lips outer border)
            const lColor = lipstickColorRef.current;
            if (lColor) {
              const lipIndices = [
                61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 375, 321, 405, 314, 17, 84, 181, 91, 146
              ];
              ctx.save();
              ctx.beginPath();
              const startPt = landmarks[lipIndices[0]];
              ctx.moveTo((1 - startPt.x) * canvas.width, startPt.y * canvas.height);
              for (let i = 1; i < lipIndices.length; i++) {
                const pt = landmarks[lipIndices[i]];
                ctx.lineTo((1 - pt.x) * canvas.width, pt.y * canvas.height);
              }
              ctx.closePath();
              ctx.fillStyle = getTransparentColor(lColor, intensity);
              ctx.fill();
              ctx.restore();
            }
          }
        }

        // Draw body/neck accessory
        if (latestPoseLandmarks.current && activeAcc === "necklace") {
          const poseLandmarks = latestPoseLandmarks.current;
          const leftShoulder = poseLandmarks[11];
          const rightShoulder = poseLandmarks[12];

          if (leftShoulder.visibility > 0.5 && rightShoulder.visibility > 0.5) {
            const xLeft = (1 - leftShoulder.x) * canvas.width;
            const yLeft = leftShoulder.y * canvas.height;
            const xRight = (1 - rightShoulder.x) * canvas.width;
            const yRight = rightShoulder.y * canvas.height;

            const centerX = (xLeft + xRight) / 2;
            const centerY = (yLeft + yRight) / 2;

            const shoulderDist = Math.sqrt(Math.pow(xRight - xLeft, 2) + Math.pow(yRight - yLeft, 2));
            const angle = Math.atan2(yRight - yLeft, xRight - xLeft);

            if (necklaceImg.current && necklaceImg.current.complete) {
              const width = shoulderDist * 0.7;
              const height = width * (necklaceImg.current.height / necklaceImg.current.width);
              ctx.save();
              ctx.globalCompositeOperation = 'source-over';
              ctx.globalAlpha = 0.95;
              ctx.shadowColor = 'rgba(0,0,0,0.3)';
              ctx.shadowBlur = 8;
              ctx.shadowOffsetX = 0;
              ctx.shadowOffsetY = 3;
              ctx.translate(centerX, centerY - height * 0.2);
              ctx.rotate(angle);
              ctx.drawImage(necklaceImg.current, -width / 2, -height / 2, width, height);
              ctx.restore();
            }
          }
        }

        requestRef.current = requestAnimationFrame(renderLoop);
      };

      requestRef.current = requestAnimationFrame(renderLoop);

    } catch (err: any) {
      console.error(err);
      setHasError(true);
      setErrorMessage(err.message || "Failed to start MediaPipe camera tracking.");
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    startMediaPipe();

    return () => {
      isMountedRef.current = false;
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      if (cameraInstanceRef.current) {
        try {
          cameraInstanceRef.current.stop();
        } catch (e) {
          console.error("[ERROR] Failed to stop cameraInstanceRef:", e);
        }
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  const handleRetry = () => {
    startMediaPipe();
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-gray-900 rounded-[2rem] overflow-hidden select-none shadow-inner border border-white/10">
      
      {/* Hidden Source Video Tag */}
      <video
        ref={videoRef}
        playsInline
        muted
        style={{ display: "none" }}
        width="640"
        height="480"
      />

      {/* Render Canvas */}
      {!hasError && (
        <canvas
          ref={canvasRef}
          width="640"
          height="480"
          className="w-full h-full max-h-[75vh] object-cover scale-x-1"
        />
      )}

      {/* Sleek Loading/Initialization State */}
      {isInitializing && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-gray-950/85 backdrop-blur-md">
          <Loader2 className="w-10 h-10 text-pink-400 animate-spin" />
          <span className="mt-4 text-sm font-bold text-white tracking-wide uppercase font-syncopate">
            Initializing AI Mirror...
          </span>
          <span className="mt-1.5 text-xs text-gray-400 font-semibold tracking-wider">
            {loadingStep}
          </span>
        </div>
      )}

      {/* Glassmorphic Error/Permission State */}
      {hasError && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-gray-950/80 p-6 backdrop-blur-lg">
          <div className="max-w-sm bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] p-6 shadow-2xl flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-base font-black text-white tracking-wide uppercase font-syncopate">
              Camera Access Required
            </h3>
            <p className="text-xs text-gray-300 mt-3 font-semibold leading-relaxed">
              Camera access is required for the Live Mirror. Please refresh and allow camera permissions in your browser settings.
            </p>
            <button
              onClick={handleRetry}
              className="mt-6 w-full py-3 bg-gradient-to-r from-[#FFD1DC] to-[#CCCCFF] text-gray-900 border border-white shadow-md font-bold text-xs uppercase tracking-wider rounded-full transition-all hover:opacity-90 active:scale-95"
            >
              Retry Connection
            </button>
          </div>
        </div>
      )}

      {/* Floating FPS Tracker */}
      {!isInitializing && !hasError && (
        <div className="absolute top-4 left-4 z-20 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5 text-[10px] font-black text-emerald-400 tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          FPS: {fps}
        </div>
      )}

      {/* Interactive Makeup Selector Panel */}
      {!isInitializing && !hasError && activeAccessory === "makeup" && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 w-[92%] max-w-[340px] bg-black/75 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-3.5 flex flex-col gap-2.5 text-left text-white select-none">
          {/* Lipstick Selection */}
          <div className="flex flex-col gap-1">
            <span className="text-[8px] font-black text-pink-300 uppercase tracking-widest">1. Lipstick Shades</span>
            <div className="flex gap-2">
              {[
                { name: "Classic Red", value: "rgba(225, 29, 72, 0.45)", color: "#e11d48" },
                { name: "Soft Rose", value: "rgba(244, 63, 94, 0.45)", color: "#f43f5e" },
                { name: "Magenta", value: "rgba(217, 70, 239, 0.45)", color: "#d946ef" },
                { name: "Nude Peach", value: "rgba(251, 146, 60, 0.45)", color: "#fb923c" },
                { name: "Deep Berry", value: "rgba(112, 26, 117, 0.45)", color: "#701a75" }
              ].map((item) => (
                <button
                  key={item.color}
                  onClick={() => setLipstickColor(item.value)}
                  className={`w-4.5 h-4.5 rounded-full border transition-all ${
                    lipstickColor === item.value ? "border-white scale-110 shadow-md" : "border-transparent opacity-80 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: item.color }}
                  title={item.name}
                />
              ))}
            </div>
          </div>

          {/* Blush Selection */}
          <div className="flex flex-col gap-1">
            <span className="text-[8px] font-black text-purple-300 uppercase tracking-widest">2. Blush Color</span>
            <div className="flex gap-2">
              {[
                { name: "Coral Pink", value: "rgba(253, 164, 181, 0.35)", color: "#fda4af" },
                { name: "Peach Glow", value: "rgba(254, 215, 170, 0.35)", color: "#fed7aa" },
                { name: "Rose Petal", value: "rgba(251, 207, 232, 0.35)", color: "#fbcfe8" },
                { name: "Plum Silk", value: "rgba(233, 213, 255, 0.35)", color: "#e9d5ff" },
                { name: "Sunset Bronze", value: "rgba(245, 158, 11, 0.35)", color: "#f59e0b" }
              ].map((item) => (
                <button
                  key={item.color}
                  onClick={() => setBlushColor(item.value)}
                  className={`w-4.5 h-4.5 rounded-full border transition-all ${
                    blushColor === item.value ? "border-white scale-110 shadow-md" : "border-transparent opacity-80 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: item.color }}
                  title={item.name}
                />
              ))}
            </div>
          </div>

          {/* Foundation Selection */}
          <div className="flex flex-col gap-1">
            <span className="text-[8px] font-black text-amber-300 uppercase tracking-widest">3. Skin Foundation tint</span>
            <div className="flex gap-2">
              {[
                { name: "None", value: "", color: "transparent" },
                { name: "Fair Light", value: "rgba(255, 247, 237, 0.08)", color: "#fff7ed" },
                { name: "Medium Warm", value: "rgba(254, 215, 170, 0.08)", color: "#fed7aa" },
                { name: "Sand Beige", value: "rgba(253, 230, 138, 0.08)", color: "#fde68a" },
                { name: "Golden Tan", value: "rgba(245, 158, 11, 0.08)", color: "#f59e0b" },
                { name: "Deep Espresso", value: "rgba(120, 53, 15, 0.08)", color: "#78350f" }
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => setFoundationColor(item.value)}
                  className={`w-4.5 h-4.5 rounded-full border transition-all relative flex items-center justify-center ${
                    foundationColor === item.value ? "border-white scale-110 shadow-md" : "border-transparent opacity-80 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: item.color === "transparent" ? "#374151" : item.color }}
                  title={item.name}
                >
                  {item.color === "transparent" && <span className="text-[7px] font-bold text-gray-400">✖</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Makeup Intensity Slider */}
          <div className="flex flex-col gap-1.5 mt-1 border-t border-white/10 pt-2">
            <div className="flex justify-between text-[8px] font-black text-pink-300 uppercase tracking-widest">
              <span>Makeup Intensity</span>
              <span>{(makeupIntensity * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="0.6"
              step="0.05"
              value={makeupIntensity}
              onChange={(e) => setMakeupIntensity(parseFloat(e.target.value))}
              className="w-full h-1 bg-gray-705 rounded-lg appearance-none cursor-pointer accent-pink-400"
            />
          </div>
        </div>
      )}

      {/* Floating Accessory Selection Dock */}
      {!isInitializing && !hasError && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[92%] max-w-[340px] flex flex-col items-center gap-2 select-none">
          <div className="w-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-full p-1.5 flex items-center justify-between">
            {accessories.map((acc) => {
              const isActive = activeAccessory === acc.id;
              return (
                <button
                  key={acc.id}
                  onClick={() => setActiveAccessory(acc.id)}
                  className={`flex-1 py-1.5 px-2.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1 cursor-pointer select-none ${
                    isActive
                      ? "bg-gradient-to-r from-[#FFD1DC] to-[#CCCCFF] text-gray-900 shadow-md font-black scale-105"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="text-sm leading-none">{acc.icon}</span>
                  <span className="hidden md:inline text-[8px] uppercase tracking-wider">{acc.label}</span>
                </button>
              );
            })}
          </div>
          {/* Elegant usage note pill */}
          <div className="text-[7.5px] font-black text-white/50 tracking-wider bg-black/40 border border-white/5 backdrop-blur-md px-3 py-1 rounded-full uppercase leading-none text-center whitespace-nowrap select-none">
            Live Mirror is optimized for Jewelry & Goggles. For full clothing, use the AI Try-On tab.
          </div>
        </div>
      )}

    </div>
  );
}
