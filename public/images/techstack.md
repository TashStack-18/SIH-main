# Tech Stack Document
## Shree Ganesh Textile — Wholesale Catalogue Website

### 1. Constraints driving the choice
- Client staff are non-technical — content updates (new product designs, photos) must be possible without touching code
- No e-commerce/payment complexity needed — this simplifies the stack considerably
- Needs to be fast on mobile (shown live at trade fairs)
- Lead capture (enquiry data) must reliably reach the owner/sales team
- Low/no ongoing maintenance burden preferred, since there's no dedicated in-house developer

### 2. Recommended stack

**Frontend framework**
- **Next.js (React)** — static generation for product/category pages (fast, SEO-friendly), server functions only where needed (enquiry form submission)
- **Tailwind CSS** — utility-first styling, fast to build and keep consistent with the design system

**Content management (for non-technical product updates)**
- **Headless CMS: Sanity or Strapi** (recommended: Sanity for ease of image handling and a friendly editor UI)
  - Content types: Product, Category, Video, Credibility Stat, Testimonial/Trust note
  - Client staff log into a simple dashboard to add a product: upload image(s), enter name/spec, assign category — no code required
  - Alternative lightweight option if budget/hosting is a concern: a Markdown/JSON-driven product list in the repo with a documented folder convention (less ideal for non-technical staff, but zero ongoing cost)

**Lead capture / enquiry data**
- Form submissions handled via a serverless function (Next.js API route) that:
  1. Writes the enquiry to a database (e.g. a lightweight Postgres via Supabase, or simpler: a Google Sheet via the Sheets API) — timestamp, name, company, phone, email, product interest, quantity, message
  2. Sends an instant email/WhatsApp notification to the owner/sales team (e.g. via Resend/SendGrid for email, or a WhatsApp Business API integration if budget allows)
- **Recommended simplest path:** Google Sheets API integration — zero extra database to maintain, owner already understands spreadsheets, easy to hand off

**Media hosting**
- Images: optimized via Next.js Image component, stored in the CMS's asset pipeline (Sanity CDN) or a service like Cloudinary
- Videos: hosted on Cloudinary, Mux, or simply embedded via a private/unlisted YouTube upload to avoid heavy self-hosting costs and bandwidth

**Hosting/deployment**
- **Vercel** — pairs naturally with Next.js, handles CDN/edge delivery for speed, simple deploy pipeline, generous free/low tier for a catalogue site of this size

**Analytics**
- Basic visitor analytics (e.g. Plausible or Google Analytics) to track which categories/products get the most attention — useful for the "who's interested in what" follow-up goal

### 3. Why not e-commerce platforms (Shopify/WooCommerce)
Those platforms are built around cart/checkout/pricing flows the client explicitly doesn't want, and add unnecessary complexity/cost for a lead-gen catalogue. A custom Next.js + headless CMS build gives full control over the "wholesale enquiry" flow instead of fighting a storefront platform's assumptions.

### 4. Summary stack list
| Layer | Choice |
|---|---|
| Frontend | Next.js + Tailwind CSS |
| CMS | Sanity (or Strapi) |
| Lead storage | Google Sheets API (simple) or Supabase/Postgres (more robust) |
| Notifications | Email (Resend/SendGrid) and/or WhatsApp |
| Media | Sanity CDN / Cloudinary for images, Cloudinary/Mux/YouTube (unlisted) for video |
| Hosting | Vercel |
| Analytics | Plausible or Google Analytics |

### 5. Pending decisions
- Confirm CMS choice based on client's comfort level (a short demo of Sanity Studio vs. Strapi admin may help decide)
- Confirm whether Google Sheets is sufficient for lead volume or a proper database is worth the extra setup
- Confirm hosting/domain details once Google Business Profile and branding assets are available
