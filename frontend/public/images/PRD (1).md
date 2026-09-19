# Product Requirements Document (PRD)
## Shree Ganesh Textile — Wholesale Catalogue Website

### 1. Overview
A B2B lead-generation catalogue website for Shree Ganesh Textile, a manufacturer/wholesaler of bedsheet fabric, finished bedsheets, and blankets (polar fleece & mink). The site exists to attract new wholesale buyers, showcase manufacturing credibility, and capture enquiries — not to sell online.

### 2. Goals
- Grow wholesale customer base from ~500 to ~5,000
- Give the owner a professional link/asset to hand to buyers at trade fairs (e.g. Delhi textile fairs)
- Replace the previous B2C-oriented site, which failed because it targeted the wrong audience
- Capture visitor/enquiry data so the sales team can follow up by phone
- Let non-technical staff (Aman / trained team member) add new product designs regularly without developer help

### 3. Non-goals
- No e-commerce: no cart, checkout, online payment, or per-unit pricing
- No retail/B2C positioning anywhere in copy, design, or flow
- No commitment to daily uploads being built as an automated feature — this is a manual content-ops task for client staff, enabled by an easy-to-use admin flow

### 4. Target users
| User | Need |
|---|---|
| Wholesale buyer (fabric/bedsheet/blanket trader, distributor) | Quickly see product range, specs (GSM/weight), manufacturing scale, and credibility, then submit a bulk enquiry |
| Government/institutional procurement contact | Confirm the company supplies relief/institutional orders at scale |
| Trade fair visitor (in person, being shown the site on a phone/laptop) | See a polished, fast, mobile-friendly catalogue live |
| Client's internal staff (non-developer) | Add/update products, designs, and photos regularly |
| Client owner | Receive a list of who enquired, with contact info, for follow-up |

### 5. Functional requirements
1. **Homepage** — hero, credibility strip, category highlights, video showcase, trust signals (govt. supply, scale, in-house manufacturing)
2. **Category & product browsing**
   - Categories: Bedsheet Fabric, Finished Bedsheets, Polar Fleece Blankets, Mink Blankets, Government/Institutional Supply
   - Each product: image(s), name, spec (material/GSM/weight/size variants), no price
3. **Enquiry system**
   - "Enquire Now" on every product card and a general contact form
   - Captured fields: name, company name, phone, email (optional), product interest, approx. quantity, message
   - Every submission stored (DB or sheet/email) with timestamp, visible to the owner/sales team
4. **Gallery/video section** — factory tour, yarn-to-blanket process, photoshoot images
5. **About/company page** — history, capacity (~100,000m/day fabric throughput), certifications, government supply record
6. **Admin/content update flow** — simple way for non-technical staff to add a new product (image + name + spec) without code changes
7. **Contact page** — phone, WhatsApp link, address, map

### 6. Content & assets needed from client
- Logo, product photography (fabric rolls, bedsheets, both blanket types by weight)
- Factory/machine process videos
- GST number, IEC code, annual turnover band, employee count, legal status, incorporation year
- Google Business Profile details
- Additional reference site links (client to provide)

### 7. Success metrics
- Number of wholesale enquiries captured per month
- Conversion of trade-fair site visits into new client relationships
- Ease/frequency of client staff updating product listings without developer involvement

### 8. Open items
- Final tech stack decision (see `techstack.md`)
- Final design direction (see `design.md`)
- Data model (see `schema.md`)
- Awaiting: Google Business Profile, additional reference links, final product list/specs, GST/company numbers, media assets
