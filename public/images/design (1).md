# Design Document
## Shree Ganesh Textile — Wholesale Catalogue Website

### 1. Design principles
- **B2B industrial, not consumer-retail.** Think trade catalogue / manufacturer credibility page, not an Instagram shop. No "cute," no discount badges, no cart icons.
- **Photography-led.** The client has quality photoshoot images and factory videos — let large, high-quality imagery of fabric rolls, blankets, and machinery carry the visual weight.
- **Scale and trust communicated fast.** A buyer should understand "this is a serious bulk manufacturer" within 3 seconds of landing.
- **Fast and mobile-first.** Site will often be shown live on a phone at trade fairs — no heavy unoptimized assets, no slow carousels.

### 2. Reference
Structural reference: `https://www.shivacarpets.in/` (IndiaMART-style storefront). Borrow its information hierarchy — credibility strip, category grid, contact block — but execute with a cleaner, custom, non-templated visual design.

### 3. Visual direction
- **Color palette:** Neutral, warm-industrial base (off-white/cream backgrounds referencing fabric/textile tones) with one strong accent color drawn from the client's branding/logo `[FILL IN once logo received]`. Avoid bright consumer-retail palettes (no candy colors).
- **Typography:** A clean, confident sans-serif for headings (e.g. Inter, Sora, or similar) paired with a highly legible body font. Avoid decorative/script fonts — this should read as industrial/professional, not boutique.
- **Imagery treatment:** Full-bleed or large-format product photography; consistent aspect ratios across product grids; video thumbnails with a clear play affordance for the factory/process videos.
- **Iconography:** Minimal, line-style icons only for credibility stats (GST, turnover, employees, years in business) — not decorative.

### 4. Key page layouts

**Homepage**
1. Hero — full-width photo/video background, company name, one-line value prop ("Bulk fabric, bedsheets & blankets — manufactured in-house, supplied nationwide"), primary CTA button ("Get a Wholesale Quote")
2. Credibility strip — horizontal row of stat cards (Nature of Business, Years Active, Employees, GST, Turnover Band, Govt. Supplier)
3. Category tiles — 5 large image tiles (Bedsheet Fabric / Finished Bedsheets / Polar Fleece / Mink Blankets / Govt. Supply), each linking to its category page
4. Video showcase — embedded factory/process video with a short caption
5. Trust/proof section — short copy blocks on scale (~100,000m/day), govt. relief supply history, in-house manufacturing
6. Enquiry CTA band — repeated "Enquire Now" before footer
7. Footer — contact, address, map, quick links

**Category page**
- Category header with short description
- Filter/sort (by weight/GSM if applicable) — simple, not e-commerce-style faceted search
- Product grid: image, name, key spec line, "Enquire" button (no price)

**Product detail (optional, or modal)**
- Larger images, full spec list, weight/size variants listed as text (not selectable "options" like a store), enquiry form pre-filled with product name

**Enquiry / Contact page**
- Form: Name, Company Name, Phone, Email (optional), Product Interest (dropdown), Approx. Quantity, Message
- Direct WhatsApp/call buttons alongside the form
- Map embed, address, business hours

**About page**
- Company story, manufacturing capacity, certifications, government supply record, team/facility photos

### 5. UI states to design
- Empty states (no products yet in a category, for early launch)
- Enquiry form success/confirmation state
- Mobile nav (hamburger, category list, sticky "Enquire" button)
- Video loading/thumbnail state

### 6. Explicitly avoid
- Price tags, "Add to Cart," quantity steppers, checkout flows
- Consumer marketplace patterns (star ratings, "bestseller" badges, countdown timers)
- Stock photography that doesn't match the client's real factory/product imagery

### 7. Accessibility & performance
- Compress/optimize all video and image assets (WebP/AVIF where possible, lazy-loaded video)
- Sufficient color contrast for credibility-stat text
- All enquiry form fields properly labeled for screen readers

### 8. Pending inputs
- Logo and brand colors
- Final photography/video assets
- Google Business Profile and additional reference links for further design calibration
