# Antigravity IDE Prompt — Shree Ganesh Textile Wholesale Website

Paste the block below into Antigravity as your project prompt. Swap in real content (logo, photos, videos, GST/company numbers) where marked `[FILL IN]`.

---

## PROJECT PROMPT

Build a **B2B wholesale catalogue website** for **Shree Ganesh Textile**, a manufacturer and wholesaler of bedsheet fabric, finished bedsheets, and blankets (polar fleece & mink). This is a **lead-generation catalogue site for wholesale buyers only** — not an e-commerce store. No cart, no checkout, no online payments, no per-piece retail pricing.

### Reference site to model structure on
Use `https://www.shivacarpets.in/` as the structural reference (it's an IndiaMART-style wholesaler storefront). Replicate its information architecture and B2B credibility approach, but build it as a clean, fast, custom site — not an IndiaMART template. Key patterns to borrow:
- Hero banner with company name + core value proposition
- A prominent "Company Credibility" block (see below)
- Category → subcategory → product grid navigation
- Contact/inquiry section
- No prices, no "add to cart," no quantity selectors — replace all commerce UI with "Enquire Now" / "Request Quote" actions

### Business context (for tone and copy)
- Shree Ganesh Textile sells bedsheet fabric wholesale (~90% of daily output goes out as raw fabric by the meter) and also manufactures finished bedsheets in-house for customers who need cutting/stitching done for them (~10% of output).
- They manufacture blankets in-house: polar fleece (soft polar) and mink blankets, in multiple weights (1kg, 1.3kg, 1.6kg, 2kg for single bed — heavier = thicker).
- They supply government relief orders (e.g. flood relief supplies to Assam, Bihar).
- Customers order in bulk: lakhs of pieces, tens of thousands of meters per order — never retail quantities.
- The business has ~500 long-term wholesale customers and wants to scale to ~5,000 by attracting new wholesale buyers, especially at trade fairs (e.g. Delhi textile fairs) where the site will be shown directly to prospective big buyers.
- Do NOT design or write copy that appeals to individual/retail/end-consumer buyers. Every page should signal "we deal in bulk, wholesale only."

### Site structure / pages
1. **Home**
   - Hero: company name, tagline emphasizing wholesale scale ("bulk fabric, bedsheets & blankets — manufactured in-house"), CTA "Get a Wholesale Quote"
   - Company credibility strip: Nature of Business (Manufacturer/Wholesaler), Years in business, Employee count, GST no., Annual turnover band, Government supplier badge — `[FILL IN actual numbers from Google Business profile / GST docs]`
   - Featured categories: Bedsheet Fabric / Finished Bedsheets / Polar Fleece Blankets / Mink Blankets / Government Supply
   - Embedded video section: factory + machine process videos (yarn → blanket) — `[FILL IN video files/links]`
   - Trust section: govt. relief supply mentions, bulk order capability, in-house manufacturing
2. **Products** (category → subcategory → grid, image-forward, no prices)
   - Bedsheet Fabric (by material/design/GSM)
   - Finished Bedsheets
   - Polar Fleece Blankets (by weight variant)
   - Mink Blankets (by weight variant)
   - Government/Institutional Supply
   - Each product card: image, name, short spec (weight/GSM/size), "Enquire" button — no price
3. **Gallery / Videos**
   - Factory tour, machine operation, yarn-to-blanket process, photoshoot images
4. **About / Company**
   - Company history, manufacturing capacity (e.g. ~100,000m/day fabric throughput), credibility stats, government supply track record
5. **Contact / Enquiry**
   - Wholesale enquiry form (Name, Company Name, Phone, Email, Product Interest, Approx. Order Quantity, Message)
   - Direct WhatsApp/call links
   - Address, map embed

### Lead capture requirement (important)
Every enquiry form submission and every "Enquire Now" click must be captured into a simple backend/database (or at minimum sent to an email/Google Sheet via API/webhook) recording: name, phone, company, product interest, quantity, and timestamp. This is a stated priority — the business wants to know who visited and follow up by phone. Include a lightweight admin view or export capability if feasible; otherwise route to email + spreadsheet.

### Content management
The client's own staff (non-technical) will handle ongoing updates — adding new fabric/blanket designs regularly. Build with:
- A simple, well-documented way to add new products/images (ideally a lightweight CMS or an admin panel — e.g. a headless CMS like Sanity/Strapi, or a simple JSON/Markdown-driven product list with clear folder conventions if no CMS budget)
- Clear instructions/README for a non-developer to add a product (image + name + spec) without touching code

### Design direction
- Clean, professional, B2B/industrial tone — not consumer-retail cute. Think trade catalogue, not Instagram shop.
- Strong use of real factory/product photography and video (they have quality photoshoot assets)
- Mobile-friendly (buyers will view on phone at trade fairs)
- Fast-loading — this will be shown live to buyers on-site at fairs, so no heavy unoptimized assets
- No cart icons, no price tags, no "buy now" — all CTAs are "Enquire Now" / "Get Wholesale Quote" / "Request Catalogue"

### Tech stack (adjust to your preference)
`[FILL IN — e.g. Next.js + Tailwind CSS, headless CMS (Sanity/Strapi) for products, form backend via a serverless function or Formspree/Google Sheets API for lead capture, hosted on Vercel]`

### Assets to integrate
- `[FILL IN: logo]`
- `[FILL IN: product photos — bedsheet fabric, finished bedsheets, polar/mink blankets by weight]`
- `[FILL IN: factory/machine process videos]`
- `[FILL IN: GST number, IEC code, turnover band, employee count, incorporation/partnership details for the credibility block]`
- `[FILL IN: Google Business Profile link/details]`

---

*Notes: fill in the bracketed placeholders with the client's actual company numbers, photos, and video files before running this in Antigravity. Once you have the Google Business profile and additional reference links, this prompt can be updated with more specific design/category references.*
