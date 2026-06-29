# MIRRA - Complete 6-Document Specification

---

## 📌 DOCUMENT 1: PRD (Product Requirements Document)

### App Name
**MIRRA** 

### One-Line App Idea
A mobile-first PWA that lets users try on accessories in real-time AR and upload photos for AI-powered full-body clothing try-ons, generating shoppable creator videos and Amazon affiliate links.

### Target Users
- **Primary:** Online shoppers (18-35) who want to visualize products before buying.
- **Secondary:** Influencers/Creators who want to generate try-on haul videos without buying physical products.
- **Tertiary:** Affiliate marketers earning commissions by sharing styled outfits.

### Problem You Are Solving
- E-commerce clothing returns cost $743B globally due to poor fit/visualization.
- Shoppers cannot visualize how accessories or clothes look on their specific body.
- Influencers spend thousands buying clothes for haul videos that may not convert.

### Main Features
1. **Dock 1 – Live Mirror (Real-Time AR):** Webcam-based real-time try-on for accessories (glasses, hats, makeup) using MediaPipe.
2. **Dock 2 – Studio Upload (AI VTON):** Upload a full-body photo to generate a photorealistic image of the user wearing selected clothing (via Fal.ai IDM-VTON).
3. **MIRRA Motion (Image-to-Video):** Convert static try-on images into 3-5 second vertical fashion videos for TikTok/Reels (via Fal.ai SVD).
4. **Amazon Affiliate Engine:** Every product tried on has a direct Amazon Associates link.
5. **Creator Dashboard:** View try-on history, manage affiliate links, track earnings.

### MVP Scope (Version 1)
- Live Mirror with 5 accessory types.
- Studio Upload with AI clothing try-on.
- MIRRA Motion video generation.
- Amazon product catalog with affiliate links.
- Stripe subscription (Free/Pro).

---

## 📌 DOCUMENT 2: TRD (Technical Requirements Document)

### Frontend Stack
- **Framework:** Next.js 14 (App Router, TypeScript)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui (via `npx impeccable install`)
- **Animation:** Framer Motion (Strictly enforced for all UI)
- **AR/Tracking:** MediaPipe Face Mesh + Pose (browser-based)
- **PWA:** next-pwa

### Backend Stack
- **Runtime:** Node.js (Next.js API Routes / Server Actions)
- **ORM:** Prisma
- **Storage:** Vercel Blob (for hackathon speed)

### Database
- **Engine:** Amazon Aurora PostgreSQL
- **Vector Extension:** pgvector (for style-embedding similarity)

### Authentication
- **Provider:** Clerk

### APIs Needed
| API | Purpose | Access Location |
|-----|---------|-----------------|
| Fal.ai (IDM-VTON) | AI clothing try-on | Server API Route ONLY |
| Fal.ai (SVD) | Image-to-video generation | Server API Route ONLY |
| Amazon PA-API | Product data + affiliate links | Server API Route ONLY |
| Stripe API | Subscriptions + webhooks | Server API Route ONLY |

---

## 📌 DOCUMENT 3: App Flow Document

### Complete Landing Page Flow (Header to Footer)
1. **Header:** Floating Glass Pill Navbar (Logo, Links, "Open Studio" CTA).
2. **Hero Section:** Massive headline ("Try anything. Make it *yours*."), looping fashion video in a glass card, floating animated product tags.
3. **Social Proof:** 3 Glassmorphic stat cards (10M+ Items Tried, etc.).
4. **Features:** 3 Claymorphic cards (Live AR, AI Studio, MIRRA Motion).
5. **Live Showcase:** Masonry grid of "Live Session" glass cards with hover overlays.
6. **Pricing:** 2 Claymorphic tiers (Free vs Pro).
7. **Testimonials:** Glassmorphic creator review cards.
8. **FAQ:** Glassmorphic accordion with Framer motion expand/collapse.
9. **Final CTA:** Full-width glass card with mesh gradient.
10. **Footer:** Minimalist columns, social links, copyright.

### Mirra Studio Flow (`/studio`)
- **Layout:** Split screen (Left: Controls, Right: Canvas).
- **Left Panel:** Tabs (Live Mirror / Studio Upload). Dropzone. Horizontal product scroller. "Generate" button.
- **Right Panel:** 
  - Empty: Floating 3D abstract shapes.
  - Generated: Interactive Before/After slider. Floating glass product tags. Bottom action bar (Download / Generate Video).

---

## 📌 DOCUMENT 4: UI/UX Design Brief

### Design Style
- **Aesthetic:** Premium, airy, light-mode. Blend of Glassmorphism and Claymorphism.
- **Vibe:** Sophisticated, modern, highly interactive, "alive" with constant subtle motion.

### Color Palette
- **Background:** `#FAFAFA` (with animated pink/green/lavender mesh blobs).
- **Glass Surface:** `bg-white/40 backdrop-blur-2xl border border-white/60`
- **Clay Surface:** `bg-gradient-to-br from-white to-[#FDFBF7]` with multi-layered soft shadows.
- **Accents:** Pink `#FFD1DC`, Mint `#A8E6CF`, Lavender `#E8C4FF`.

### Typography
- **Primary:** 'Plus Jakarta Sans' (Weights 400-800).
- **Accent:** 'Instrument Serif' (Italic, for words like "*yours*" or "*products*").

### Component Rules
- **Buttons:** Claymorphic (soft gradients, extruded shadows) or Glass (blurred, bordered). Pill-shaped (`rounded-full`).
- **Cards:** Highly rounded (`rounded-[2rem]` or `rounded-3xl`).
- **Motion:** All cards must have `whileHover={{ scale: 1.02, y: -5 }}`. All sections must fade up on scroll.

---

## 📌 DOCUMENT 5: Backend Schema Document

### Table: `users`
- `id` (String, PK), `clerkId` (String, Unique), `email` (String), `subscriptionTier` (Enum: FREE, PRO), `stripeCustomerId` (String), `dailyUploadsUsed` (Int), `createdAt` (DateTime).

### Table: `products`
- `id` (String, PK), `name` (String), `category` (Enum: ACCESSORY, CLOTHING), `imageUrl` (String), `affiliateLink` (String), `price` (Decimal), `vtonCompatible` (Boolean), `styleEmbedding` (Vector 1536).

### Table: `try_on_sessions`
- `id` (String, PK), `userId` (FK), `productId` (FK), `dockType` (Enum: LIVE_MIRROR, STUDIO_UPLOAD), `originalImageUrl` (String), `resultImageUrl` (String), `resultVideoUrl` (String), `affiliateClicked` (Boolean), `createdAt` (DateTime).

---

## 📌 DOCUMENT 6: Implementation Plan

### Phase 1: Setup & UI Kit
- Run CLI commands (`uipro init`, `npx impeccable install`, `npm i framer-motion`).
- Set up global layout, animated mesh gradient background, Tailwind config.
- Create reusable UI components: `GlassCard`, `ClayButton`, `FloatingTag`.

### Phase 2: Landing Page (Top Half)
- Build Header (Floating Glass Pill).
- Build Hero Section (Video player, floating animated tags).
- Build Social Proof & Features sections (Claymorphic cards).

### Phase 3: Landing Page (Bottom Half)
- Build Live Showcase (Masonry grid with hover overlays).
- Build Pricing, Testimonials, FAQ (Glassmorphic accordion).
- Build Final CTA and Footer.

### Phase 4: Auth & Database
- Set up Clerk Auth and middleware.
- Connect Prisma to Aurora PostgreSQL.
- Implement user sync on login.

### Phase 5: Dock 1 - Live AR Mirror
- Build `LiveMirror` client component with `getUserMedia`.
- Integrate MediaPipe Face Mesh.
- Implement accessory overlay logic (glasses, hats) with dynamic scaling.

### Phase 6: Dock 2 - Studio Upload & VTON
- Build Studio split-screen layout.
- Create secure `/api/generate-tryon` route (Fal.ai IDM-VTON).
- Build interactive Before/After slider in the canvas.

### Phase 7: MIRRA Motion (Video)
- Create secure `/api/generate-motion` route (Fal.ai SVD).
- Add "Generate Video" button (gated behind Pro tier).
- Implement vertical 9:16 video player.

### Phase 8: Stripe & Monetization
- Implement Stripe Checkout and Webhooks.
- Gate video generation and limit free uploads to 3/day.

### Phase 9: Creator Dashboard
- Build `/creator` page to view try-on history.
- Implement "Copy Affiliate Link" functionality.

### Phase 10: PWA & Polish
- Configure `next-pwa` for mobile installation.
- Final mobile responsiveness check.
- Record demo video and submit.