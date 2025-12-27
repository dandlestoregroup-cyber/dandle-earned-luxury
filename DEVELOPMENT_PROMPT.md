# DANDLE Site - Phase 3 Development & Optimization

## Project Context
DANDLE is an Egyptian luxury recliner e-commerce site built with React, TypeScript, Tailwind, Shopify integration, and Supabase backend. We've completed Phase 1 (MVP checkout) and Phase 2 (trust pages + hero carousel). Now we need media optimization, AR deployment, platform integrations, and traffic growth features.

**Repository:** dandlestoregroup-cyber/dandle-earned-luxury
**Branch:** claude/fix-hero-sizing-Q35oe
**Tech Stack:** React, TypeScript, Tailwind CSS, shadcn/ui, Shopify, Supabase, Framer Motion

---

## 🎯 CRITICAL REQUIREMENTS

**NON-NEGOTIABLE:**
- Do NOT break existing checkout flow (Cart → create-order edge function → WhatsApp)
- Do NOT modify edge function contracts (create-order, get-order-status)
- Maintain WhatsApp fallback for failed orders
- Keep Shopify draft order system intact
- All changes must be mobile-responsive
- Maintain existing design system (Tailwind + shadcn)

---

## 📋 TASK 1: MEDIA GENERATION & OPTIMIZATION

### A) Hero Lifestyle Images (3-4 more needed)

**Current State:**
- 6 slides in hero carousel (1 video + 5 images)
- Need 3-4 more lifestyle images for 8-9 total

**Requirements:**
```
Style: Egyptian luxury, warm lighting, sophisticated lifestyle settings
Products: DANDLE recliners in real living spaces
Mood: Earned luxury, quiet sophistication, comfort
Colors: Warm beige, bronze, nile blue accents
Aspect Ratio: 16:9 landscape, 2752×1536px minimum
```

**Tasks:**
1. Generate 3-4 lifestyle images using:
   - **Option A:** AI image generation (Midjourney with `--cref` for brand consistency, or Stable Diffusion XL)
   - **Option B:** Source from stock photography (Unsplash, Pexels) and composite recliners
   - **Option C:** Hire photographer for real product shots

2. Image specifications:
   - Egyptian home settings (modern apartments, traditional touches)
   - Natural lighting (golden hour, warm interiors)
   - Show recliners in use (people relaxing, reading, watching TV)
   - Diverse scenarios: family room, reading nook, home theater, balcony

3. Save to `/public/images/` as:
   ```
   hero-lifestyle-1.jpg
   hero-lifestyle-2.jpg
   hero-lifestyle-3.jpg
   hero-lifestyle-4.jpg
   ```

4. Update `src/components/Hero.tsx` line 18-25 to add new slides:
   ```typescript
   { type: 'image', src: '/images/hero-lifestyle-1.jpg', alt: 'Description' },
   ```

### B) Product Gallery Images (8 per product)

**Current State:**
- Most products have 1-3 images
- Gallery component supports 8+ images

**Requirements per product:**
```
1. Front view (main hero shot)
2. Side view (left/right profile)
3. Back view
4. Reclined position
5. Close-up of controls/features
6. Fabric/upholstery detail
7. Lifestyle shot (in room setting)
8. Alternative angle or color variant
```

**Tasks:**
1. For each product (RelaxMax, Diva, ComfortPlus, CozyCompanion, EasyUp, WorkNest, SpaceSaver):
   - Generate/source 8 high-quality images
   - Maintain consistent lighting and background
   - Resolution: 2752×1536px minimum
   - Format: JPG or WebP for web optimization

2. Save to `/public/images/` with naming convention:
   ```
   [product]-[color]-[angle].jpg
   Examples:
   relaxmax-offwhite-front.jpg
   relaxmax-offwhite-side-left.jpg
   relaxmax-offwhite-reclined.jpg
   ```

3. Update `src/catalog/lovableCatalog.ts` for each product:
   ```typescript
   gallery: [
     { src: "/images/product-view1.jpg", width: 2752, height: 1536, alt: "Description" },
     { src: "/images/product-view2.jpg", width: 2752, height: 1536, alt: "Description" },
     // ... 8 images total
   ]
   ```

### C) 3D Models for AR Viewer

**Current State:**
- ARViewer component created and ready
- Infrastructure supports iOS (USDZ) and Android (GLB)
- Commented out in ProductDetail.tsx lines 168-169

**Requirements:**
```
Format: USDZ (iOS) and GLB (Android)
Poly Count: <100k triangles for mobile performance
Textures: 2K resolution max, optimized for mobile
File Size: <10MB per model
```

**Tasks:**
1. Create 3D models for each recliner:
   - **Option A:** Use Blender (free) to model from product photos
   - **Option B:** Hire 3D artist on Fiverr/Upwork ($50-200 per model)
   - **Option C:** Use AI 3D generation (Meshy.ai, Luma AI, CSM)

2. Export requirements:
   - USDZ with AR anchoring enabled
   - GLB with draco compression
   - Include realistic materials (leather/fabric textures)
   - Proper scale (real-world dimensions)

3. Save to `/public/models/`:
   ```
   relaxmax.usdz
   relaxmax.glb
   diva.usdz
   diva.glb
   comfortplus.usdz
   comfortplus.glb
   (etc.)
   ```

4. Uncomment in `src/pages/ProductDetail.tsx` lines 168-169:
   ```typescript
   usdzUrl={`/models/${product.productHandle}.usdz`}
   glbUrl={`/models/${product.productHandle}.glb`}
   ```

5. Test AR on:
   - iPhone (Safari, AR Quick Look)
   - Android phone (Chrome, Scene Viewer)

---

## 📋 TASK 2: NOUR CHAT TESTING & ENHANCEMENT

### A) Test Photo Upload Feature

**Current Implementation:**
- Photo upload button in chat
- 5MB file size limit
- Base64 encoding
- Preview before send

**Testing Tasks:**
1. **Functional Testing:**
   - Upload various image formats (JPG, PNG, WebP, HEIC)
   - Test file size limits (under 5MB, over 5MB)
   - Test image preview and removal
   - Verify base64 encoding doesn't break chat
   - Test on mobile devices (camera upload)

2. **Edge Cases:**
   - Upload without message text
   - Upload multiple images in sequence
   - Upload + send, then upload again
   - Network interruption during upload
   - Very large images (auto-resize?)

3. **Improvements Needed:**
   - Add image compression before upload (use `browser-image-compression` library)
   - Add loading indicator during file processing
   - Support multiple image uploads (carousel in chat)
   - Add image editing (crop, rotate) before send

### B) Enhance Nour AI Responses

**Current Limitation:**
- Nour chat doesn't process uploaded images (vision not enabled)

**Tasks:**
1. **Enable Vision API:**
   - Update `supabase/functions/nour-chat/index.ts`
   - Switch to vision-capable model (e.g., `google/gemini-2.0-flash-exp` or `openai/gpt-4-vision`)
   - Pass `imageData` from message to API

2. **Update System Prompt:**
   Add to system prompt in `nour-chat/index.ts` line 212:
   ```
   When user uploads a room photo:
   - Analyze room size, lighting, style, and existing furniture
   - Suggest which DANDLE recliner fits best (size, color, style)
   - Recommend placement location in the room
   - Visualize how it would look (describe in detail or generate image)
   - Consider Egyptian home design preferences
   ```

3. **Add Image Generation:**
   - Integrate with image generation API (Fal.ai, Replicate, or similar)
   - Generate composite image showing recliner in user's room
   - Use ControlNet or inpainting for realistic placement

4. **Product Recommendations:**
   - Analyze room dimensions from photo
   - Suggest appropriate recliner size (compact vs standard)
   - Recommend color based on room palette
   - Link directly to product pages

### C) Add Voice Input (Bonus)

**Tasks:**
1. Add microphone button to chat input
2. Use Web Speech API for voice-to-text
3. Support Arabic and English languages
4. Voice feedback (text-to-speech for responses)

---

## 📋 TASK 3: AR DEPLOYMENT & OPTIMIZATION

### A) Deploy AR Models

**Pre-deployment Checklist:**
1. All 3D models created and optimized ✓
2. Files uploaded to `/public/models/` ✓
3. ARViewer component tested on devices ✓
4. Product catalog updated with AR URLs ✓

**Deployment Tasks:**
1. **Test on Real Devices:**
   - iPhone (iOS 12+): Safari → AR Quick Look
   - Android (8.0+): Chrome → Scene Viewer
   - iPad: AR Quick Look with Apple Pencil annotation

2. **Optimize Performance:**
   - Compress GLB files with Draco
   - Reduce texture resolution if needed (2K → 1K)
   - Test loading times (<3 seconds)
   - Add loading indicator while model loads

3. **Add AR Instructions:**
   Create modal/tooltip on AR button:
   ```
   "Point your phone at the floor where you'd like to place the recliner.
   Tap to place, pinch to resize, drag to move."
   ```

### B) AR Analytics Tracking

**Tasks:**
1. Add analytics events:
   ```typescript
   // When AR button clicked
   analytics.track('ar_viewer_opened', {
     product: productHandle,
     device: isIOS ? 'ios' : 'android'
   });

   // When AR model loads
   analytics.track('ar_model_loaded', {
     product: productHandle,
     loadTime: duration
   });
   ```

2. Track AR → Purchase conversion:
   - Add flag in cart: `viewedInAR: true`
   - Include in order creation
   - Analyze AR's impact on conversion rate

### C) AR Sharing Feature

**Tasks:**
1. Add "Share AR View" button
2. Capture screenshot of AR placement
3. Share to WhatsApp/Facebook with product link
4. Pre-fill message: "Check out how the [Product] looks in my space! 🛋️"

---

## 📋 TASK 4: AMAZON-SHOPIFY SYNC

### A) Setup Amazon Integration

**Goal:** Sync DANDLE products to Amazon Egypt marketplace

**Tasks:**
1. **Install Shopify Amazon Channel:**
   - In Shopify Admin → Sales Channels → Add Amazon
   - Connect Amazon Seller Central account
   - Set region to Middle East/Egypt

2. **Product Mapping:**
   - Map DANDLE SKUs to Amazon ASIN/UPC codes
   - Set Amazon-specific pricing (include fees)
   - Configure FBM (Fulfilled by Merchant) for custom furniture

3. **Inventory Sync:**
   - Enable real-time inventory sync
   - Set buffer stock (prevent overselling)
   - Automate stock updates Shopify ↔ Amazon

4. **Order Management:**
   - Route Amazon orders through Shopify
   - Maintain unified order dashboard
   - Sync tracking numbers back to Amazon

### B) Amazon Listing Optimization

**Tasks:**
1. **Product Titles (SEO):**
   ```
   DANDLE [Model] Luxury Recliner | Egyptian Craftsmanship | [Color] Leather/Fabric | [Size] | [Key Feature]
   Example: "DANDLE RelaxMax Luxury Recliner | Egyptian Craftsmanship | Tan Leather | Power Lift | 5-Year Warranty"
   ```

2. **Bullet Points (A+ Content):**
   - Premium Egyptian craftsmanship since 2010
   - [Specific features: motor, massage, USB ports]
   - Comprehensive warranty (2y motor, 5y frame)
   - Delivery across Egypt (up to 14 days)
   - Professional installation included

3. **Backend Keywords:**
   Add hidden keywords: luxury recliner, Egyptian furniture, power lift chair, massage chair, leather recliner, home theater seating, etc.

4. **Enhanced Brand Content:**
   - Lifestyle images in use
   - Comparison charts (models, features)
   - Warranty and delivery information
   - Brand story (earned luxury)

### C) Pricing Strategy

**Tasks:**
1. **Calculate Amazon Fees:**
   - Referral fee (15% for furniture in Egypt)
   - FBA fee (if using) or shipping cost
   - Set competitive but profitable pricing

2. **Dynamic Pricing Rules:**
   - Shopify base price: Normal retail
   - Amazon price: +10-15% (to cover fees)
   - Auto-adjust based on competition

3. **Promotions:**
   - Amazon Prime Day deals
   - Lightning Deals for new product launches
   - Coupons for first-time buyers

---

## 📋 TASK 5: SOCIAL MEDIA INTEGRATION & GROWTH

### A) Facebook & Instagram Shop Setup

**Tasks:**
1. **Create/Optimize Business Pages:**
   - Facebook Business Page: DANDLE Egypt
   - Instagram Business Account: @dandle.egypt
   - Link accounts to Meta Business Suite

2. **Install Facebook Channel in Shopify:**
   - Shopify Admin → Sales Channels → Add Facebook
   - Connect Facebook Business Manager
   - Enable Instagram Shopping
   - Sync product catalog

3. **Product Tagging:**
   - Tag products in Instagram posts/stories
   - Enable product stickers in Reels
   - Create shoppable Instagram posts
   - Set up Facebook Shop with collections

### B) Content Strategy for Growth

**Goal:** Organic reach + paid ads targeting Egyptian luxury market

**Content Pillars:**

1. **Educational Content (40%):**
   - "How to choose the perfect recliner"
   - "Leather vs Fabric: Which is right for you?"
   - "5 signs you've earned a luxury recliner"
   - Ergonomics and health benefits
   - Care and maintenance tips

2. **Lifestyle & Aspiration (30%):**
   - Customer homes featuring DANDLE (with permission)
   - Egyptian interior design trends
   - "Sunday morning in your DANDLE" lifestyle shots
   - Behind-the-scenes craftsmanship videos
   - Designer collaboration content

3. **Product Showcases (20%):**
   - New arrivals and launches
   - 360° product videos
   - Feature deep-dives (massage, power lift)
   - Color and fabric options
   - AR demos (screen recordings)

4. **User-Generated Content (10%):**
   - Customer testimonials (video)
   - Unboxing and setup videos
   - "Show us your DANDLE" hashtag campaign
   - Reviews and ratings

**Posting Schedule:**
```
Instagram:
- Feed: 4-5 posts/week
- Reels: 3-4 Reels/week (high reach algorithm priority)
- Stories: Daily (2-3 per day)

Facebook:
- Posts: 3-4/week
- Videos: 2/week
- Live sessions: 1/month (product launches, Q&A)
```

### C) Paid Advertising Strategy

**Budget Allocation:**
- Facebook Ads: 60% (broader reach)
- Instagram Ads: 30% (visual products)
- Google Ads: 10% (search intent)

**Campaign Structure:**

1. **Awareness (Top of Funnel):**
   - Target: Egyptian adults 30-55, income >15k EGP/month
   - Content: Lifestyle videos, brand story
   - Objective: Brand awareness, video views
   - Budget: 40% of ad spend

2. **Consideration (Middle Funnel):**
   - Target: Website visitors, engaged users
   - Content: Product showcases, AR demos, testimonials
   - Objective: Traffic, engagement
   - Budget: 30% of ad spend

3. **Conversion (Bottom Funnel):**
   - Target: Add-to-cart abandoners, product viewers
   - Content: Limited offers, free delivery, warranty highlights
   - Objective: Conversions, catalog sales
   - Budget: 30% of ad spend

**Creative Specs:**
```
Facebook/Instagram Feed:
- 1080×1080px (square)
- Video: 15-30 seconds
- Text overlay: <20% of image
- CTA: "Shop Now" / "Learn More"

Instagram Reels:
- 1080×1920px (9:16 vertical)
- 7-15 seconds (short-form performs best)
- Trending audio + product integration
- Hook in first 2 seconds

Stories:
- 1080×1920px
- Poll stickers, question stickers for engagement
- Swipe-up links to products (if 10k+ followers)
```

### D) Instagram Growth Tactics

**Tasks:**
1. **Hashtag Strategy:**
   ```
   Brand: #DandleEgypt #BecauseYouveEarnedIt
   Product: #LuxuryRecliner #EgyptianFurniture #HomeLuxury
   Lifestyle: #EgyptianHomes #LuxuryLiving #HomeDecorEgypt
   Local: #CairoHomes #AlexandriaLiving #EgyptianDesign
   ```

2. **Influencer Partnerships:**
   - Micro-influencers (10k-100k followers): Egyptian home decor, lifestyle
   - Offer product for review + affiliate commission
   - Track with UTM codes: `dandle.eg?ref=influencer_name`

3. **Engagement Tactics:**
   - Respond to all comments within 1 hour
   - Like and comment on customer posts
   - Repost UGC to Stories (with permission)
   - Run monthly giveaways (follow + tag friends)
   - Instagram Live sessions (product demos, Q&A)

4. **Collaborations:**
   - Interior designers (before/after features)
   - Real estate developers (stage show homes)
   - Home improvement shows/podcasts

---

## 📋 TASK 6: TRAFFIC MAGNET FEATURES

### A) SEO Optimization

**Current State:**
- Basic meta tags on trust pages
- Need comprehensive SEO strategy

**Tasks:**

1. **Technical SEO:**
   ```typescript
   // Add to public/index.html or use React Helmet
   - Structured data (Product schema)
   - Open Graph tags (Facebook/LinkedIn previews)
   - Twitter Cards
   - Canonical URLs
   - XML sitemap (already exists, verify)
   - Robots.txt optimization
   ```

2. **Content SEO:**
   Create blog at `/blog` with articles:
   - "Ultimate Guide to Luxury Recliners in Egypt [2025]"
   - "How to Choose a Recliner for Your Cairo Apartment"
   - "Power vs Manual Recliners: Which is Right for You?"
   - "Leather Care in Egypt's Climate"
   - "Top 10 Home Theater Seating Ideas"

3. **Local SEO:**
   - Google Business Profile (Cairo, Alexandria locations)
   - Egyptian business directories
   - Arabic language support (`<html lang="ar">` for Arabic version)
   - Schema.org LocalBusiness markup

### B) Interactive Features

**Goal:** Increase engagement and session duration

**Tasks:**

1. **Virtual Room Designer:**
   - Canvas-based room designer
   - User uploads room photo or uses template
   - Drag-and-drop DANDLE products
   - Save and share designs
   - Integration: Fabricjs or Konva.js

2. **Product Comparison Tool:**
   ```
   /compare?products=relaxmax,diva,comfortplus
   - Side-by-side feature comparison
   - Price comparison
   - Recommendation quiz ("Find Your Perfect Recliner")
   ```

3. **Size Calculator:**
   - User inputs room dimensions
   - Shows which models fit
   - Clearance recommendations
   - Reclining space calculator

4. **Color Visualizer:**
   - Upload room photo
   - See different color options in your space
   - AI-powered color matching

### C) Referral & Loyalty Program

**Tasks:**

1. **Referral Program:**
   ```
   - Give 500 EGP credit
   - Get 500 EGP credit when friend purchases
   - Unique referral links
   - Track in Shopify customer metafields
   ```

2. **VIP Rewards:**
   - Points for purchases (1 point = 1 EGP spent)
   - Points for reviews, social shares, referrals
   - Tiers: Bronze (0-5k), Silver (5k-15k), Gold (15k+)
   - Perks: Early access, exclusive colors, priority delivery

3. **Email Marketing:**
   - Abandoned cart recovery (already implemented?)
   - Post-purchase care guides
   - Birthday/anniversary discounts
   - Seasonal campaigns (Ramadan, Eid)

### D) Social Proof & Trust Signals

**Tasks:**

1. **Customer Reviews:**
   - Integrate Shopify Product Reviews app
   - Display reviews on product pages
   - Photo/video reviews featured
   - Incentivize reviews (50 EGP credit)

2. **Live Visitors Counter:**
   ```typescript
   // Add to product pages
   "🔥 12 people viewing this product right now"
   "✅ 3 purchased in the last 24 hours"
   ```

3. **Trust Badges:**
   - "Handcrafted in Egypt Since 2010"
   - "2,000+ Happy Customers"
   - "5-Year Frame Warranty"
   - "Professional Installation Included"
   - Payment security badges

4. **Media Mentions:**
   - Press coverage section on homepage
   - "As Seen On" logos (Cairo360, etc.)
   - Award badges (if applicable)

### E) Performance Optimization

**Goal:** <2 second page load, 95+ Lighthouse score

**Tasks:**

1. **Image Optimization:**
   - Convert all images to WebP format
   - Lazy loading for images below fold
   - Responsive images (srcset)
   - CDN for image hosting (Cloudflare R2)

2. **Code Optimization:**
   - Code splitting (React.lazy)
   - Tree shaking (remove unused code)
   - Minify CSS/JS
   - Remove console.logs in production

3. **Caching:**
   - Service worker for offline support
   - Cache API responses (SWR or React Query)
   - Browser caching headers

4. **Analytics:**
   - Google Analytics 4
   - Facebook Pixel (already integrated?)
   - Hotjar for heatmaps
   - Track key metrics: CTR, bounce rate, conversion rate

---

## 📋 TASK 7: WHATSAPP BUSINESS INTEGRATION

### A) WhatsApp Business API

**Goal:** Automated customer support + order confirmations via WhatsApp

**Tasks:**

1. **Setup WhatsApp Business API:**
   - Register on Meta for Developers
   - Get WhatsApp Business API access
   - Use Twilio/MessageBird as BSP (Business Solution Provider)

2. **Message Templates:**
   ```
   Order Confirmation:
   "Hi {{name}}! ✅ Order {{reference}} confirmed. Total: {{amount}} EGP. We'll contact you within 1-2 days to schedule delivery (up to 14 days). Track: dandle.eg/order/{{reference}}"

   Delivery Scheduled:
   "Hi {{name}}! 🚚 Your {{product}} delivery is scheduled for {{date}} between {{time}}. Our team will call 30 mins before arrival. Questions? Reply here!"

   Delivery Complete:
   "Hi {{name}}! 🎉 Thank you for choosing DANDLE! Your {{product}} is now installed. Please rate your experience: [link]. Enjoy your earned luxury! 🛋️"
   ```

3. **Chatbot (Basic):**
   - Order status lookup (by reference)
   - FAQ responses (delivery time, payment, warranty)
   - Human handoff for complex queries
   - Business hours auto-reply

### B) WhatsApp Commerce

**Tasks:**
1. Enable WhatsApp catalog (product listings)
2. Direct product sharing from website
3. "Message us on WhatsApp" CTAs throughout site
4. WhatsApp Business button on all product pages

---

## 🎯 SUCCESS METRICS & KPIs

Track and optimize for:

**Traffic:**
- Organic search: 40% of traffic
- Social media: 30%
- Direct: 20%
- Paid ads: 10%

**Engagement:**
- Avg session duration: >3 minutes
- Pages per session: >4
- Bounce rate: <50%

**Conversion:**
- Add-to-cart rate: >15%
- Cart-to-purchase rate: >30%
- Overall conversion: >5%

**Social Media:**
- Instagram followers: +500/month organic
- Engagement rate: >5%
- Reach: 50k+ accounts/month

**Revenue:**
- AOV (Average Order Value): 30k+ EGP
- Repeat customer rate: >25%
- AR users → purchase conversion: Track and optimize

---

## 🚀 IMPLEMENTATION PRIORITY

### Week 1-2: Media & AR
- [ ] Generate/source all images
- [ ] Create 3D models
- [ ] Deploy AR functionality
- [ ] Test on devices

### Week 3-4: Integrations
- [ ] Amazon-Shopify sync
- [ ] Facebook/Instagram Shop
- [ ] WhatsApp Business API
- [ ] Nour vision enhancement

### Week 5-6: Growth Features
- [ ] Blog setup + 5 SEO articles
- [ ] Room designer tool
- [ ] Referral program
- [ ] Email marketing automation

### Week 7-8: Optimization & Launch
- [ ] Performance optimization
- [ ] Social media campaigns
- [ ] Paid ads setup
- [ ] Analytics tracking
- [ ] Launch + monitor

---

## 📝 TESTING CHECKLIST

Before final deployment:

**Functionality:**
- [ ] Checkout flow end-to-end (test order)
- [ ] WhatsApp fallback working
- [ ] AR viewer on iOS and Android
- [ ] Photo upload in Nour chat
- [ ] Image compression working
- [ ] All trust pages loading
- [ ] Footer links functional

**Performance:**
- [ ] Page load <2s on 3G
- [ ] Lighthouse score >90
- [ ] Images optimized (WebP)
- [ ] No console errors

**Mobile:**
- [ ] All features work on iOS Safari
- [ ] All features work on Android Chrome
- [ ] Touch targets >44px
- [ ] Forms easy to fill

**SEO:**
- [ ] All pages have meta titles/descriptions
- [ ] Structured data validates
- [ ] Sitemap updated
- [ ] Google Search Console setup

**Integrations:**
- [ ] Shopify orders syncing
- [ ] Amazon orders routing through Shopify
- [ ] Facebook pixel tracking
- [ ] Analytics events firing

---

## 🔗 RESOURCES & ACCESS NEEDED

Provide access to:
- Shopify Admin credentials
- Supabase project dashboard
- GitHub repository (write access)
- Facebook Business Manager
- Amazon Seller Central
- WhatsApp Business API account
- Domain DNS settings (for verification)
- Google Analytics/Search Console

---

## ✅ DELIVERABLES

When complete, provide:

1. **Documentation:**
   - Updated README with all new features
   - API documentation for integrations
   - Social media content calendar
   - Brand guidelines for influencers

2. **Assets:**
   - All generated images (organized folder)
   - 3D models (.usdz, .glb)
   - Video content for social media
   - Ad creative templates

3. **Training:**
   - Admin guide for managing Amazon sync
   - Social media playbook
   - WhatsApp Business setup guide
   - Analytics dashboard walkthrough

4. **Handoff:**
   - Production deployment
   - Monitoring setup (uptime, errors)
   - Backup strategy
   - Maintenance schedule

---

**Questions? Contact details in repository README.**

**Timeline: 8 weeks recommended for full implementation**

**Budget considerations: Allocate for 3D modeling ($500-1500), paid ads ($1000-2000/month), and tools/subscriptions ($200/month)**
