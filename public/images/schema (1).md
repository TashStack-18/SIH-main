# Data Schema Document
## Shree Ganesh Textile — Wholesale Catalogue Website

Written as CMS content types + a lead-capture data model. Adapt field names to whichever CMS (Sanity/Strapi) is chosen.

### 1. `Category`
| Field | Type | Notes |
|---|---|---|
| id | string (slug) | e.g. `bedsheet-fabric` |
| name | string | e.g. "Bedsheet Fabric" |
| description | text | short paragraph for category page header |
| heroImage | image | used on homepage tile and category header |
| sortOrder | number | controls display order on homepage |

Initial categories: `bedsheet-fabric`, `finished-bedsheets`, `polar-fleece-blankets`, `mink-blankets`, `government-supply`

### 2. `Product`
| Field | Type | Notes |
|---|---|---|
| id | string (slug) | unique per product |
| name | string | e.g. "Mink Blanket — Single Bed" |
| category | reference → Category | one product belongs to one primary category |
| images | array of image | multiple angles/colors |
| description | text | short marketing copy |
| specs | array of `{label, value}` | e.g. `{Weight: "1.6kg"}`, `{Material: "Polar Fleece"}`, `{Size: "Single Bed"}`, `{GSM: "..."}` — flexible key-value list so fabric vs. blanket specs differ freely |
| variants | array of `{variantName, specs}` | for weight/size variants of the same product (e.g. 1kg/1.3kg/1.6kg/2kg) so they display as one product with variant chips, not separate listings |
| minOrderNote | string (optional) | free text if the client wants to state a bulk minimum, e.g. "Bulk orders only — min. enquiry quantity applies" |
| isGovtSupply | boolean | flags items also offered under government/institutional supply |
| featured | boolean | controls homepage highlight inclusion |
| sortOrder | number | display order within category |
| createdAt / updatedAt | datetime | auto-managed by CMS |

Explicitly **no `price` field** — this is a lead-gen catalogue, not a store.

### 3. `Video`
| Field | Type | Notes |
|---|---|---|
| id | string | |
| title | string | e.g. "Yarn to Blanket — Factory Process" |
| videoUrl | string/embed | Cloudinary/Mux/YouTube (unlisted) link |
| thumbnail | image | |
| category | reference → Category (optional) | to show relevant process video on a category page |
| placement | enum | `homepage`, `about`, `gallery` |

### 4. `CredibilityStat`
| Field | Type | Notes |
|---|---|---|
| label | string | e.g. "GST No.", "Annual Turnover", "Employees", "Years Active", "Legal Status" |
| value | string | e.g. "06ADQFS1197R1Z1", "25–100 Cr", "51–100", "15+", "Partnership" |
| icon | string (optional) | icon key for display |
| sortOrder | number | controls order in the credibility strip |

### 5. `Enquiry` (lead capture — the important one)
| Field | Type | Notes |
|---|---|---|
| id | string/UUID | auto-generated |
| name | string | required |
| companyName | string | required |
| phone | string | required |
| email | string | optional |
| productInterest | reference → Product (or free text) | which product/category triggered the enquiry |
| approxQuantity | string | free text, e.g. "50,000 meters" or "1 lakh pieces" |
| message | text | optional |
| sourcePage | string | URL/page the enquiry came from — useful for knowing which product/category drove interest |
| submittedAt | datetime | auto-set on submission |
| status | enum | `new`, `contacted`, `converted`, `not interested` — for the sales follow-up workflow |

Storage recommendation: write directly to a Google Sheet (one row per enquiry) via the Sheets API for simplicity, or to a `enquiries` table in Postgres/Supabase if a proper database is set up — see `techstack.md`.

### 6. `CompanyInfo` (singleton, for About/footer/credibility strip)
| Field | Type | Notes |
|---|---|---|
| companyName | string | |
| gstNumber | string | |
| iecCode | string | |
| turnoverBand | string | |
| employeeCount | string | |
| legalStatus | string | e.g. "Partnership" |
| yearsInBusiness | number | |
| natureOfBusiness | string | e.g. "Manufacturer / Wholesaler" |
| address | text | |
| phone | string | |
| whatsapp | string | |
| googleBusinessProfileUrl | string | |
| mapEmbedUrl | string | |

### 7. Relationships summary
```
Category (1) ──< Product (many)
Category (1) ──< Video (many, optional)
Product (1) ──< Enquiry (many, via productInterest)
CompanyInfo (singleton) — referenced globally by header/footer/credibility strip
```

### 8. Pending inputs before finalizing
- Real GST/IEC/turnover/employee numbers for `CompanyInfo`
- Final product list with real spec fields (confirm which spec labels apply to fabric vs. bedsheets vs. blankets)
- Decision on Google Sheets vs. proper database for `Enquiry` storage (see `techstack.md`)
