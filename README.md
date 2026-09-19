# 🇮🇳 Bharat Safe Yatra

> India's Intelligent Union Territory Tourism & Safety Platform (SIH 2026)

🌐 **[Visit Live Website →](https://dishaara.vercel.app/)**

---

## 📁 Project Architecture

The codebase is split into dedicated, decoupled **`frontend/`** and **`backend/`** projects:

```
SIH-main/
├── frontend/                     # Next.js / React UI Client
│   ├── public/                   # Static assets & icons
│   ├── src/
│   │   ├── app/                  # App Router pages & views
│   │   ├── components/           # Reusable UI components
│   │   ├── services/             # Client API service callers
│   │   ├── css/                  # Styling & design system tokens
│   │   ├── js/                   # Vanilla / modular scripts
│   │   ├── lib/                  # Utilities & providers
│   │   └── types/                # Frontend TypeScript types
│   ├── next.config.ts            # Next.js config with API proxy rewrites
│   ├── tailwind.config.ts        # Tailwind CSS config
│   ├── tsconfig.json             # TypeScript configuration
│   └── package.json              # Frontend dependencies & scripts
│
├── backend/                      # Node.js & Express API Server
│   ├── src/
│   │   ├── server.ts             # Express server entry point (Port 5000)
│   │   ├── routes/               # Express route registrations
│   │   ├── api/v1/               # 18 domain API endpoints
│   │   ├── adapter.ts            # Web-standard request/response adapter
│   │   ├── shims/                # Lightweight Next.js server shims
│   │   ├── lib/                  # AI orchestrator, RAG, GIS & fixtures
│   │   └── types/                # Backend TypeScript types
│   ├── tsconfig.json             # TypeScript configuration
│   └── package.json              # Backend dependencies & scripts
│
├── package.json                  # Root orchestrator scripts
└── README.md                     # Documentation
```

---

## 🚀 Getting Started

### 1. Install Dependencies

You can install dependencies for each service individually or using the root convenience script:

```bash
# Install root, frontend, and backend packages
npm run install:all

# OR individually:
cd backend && npm install
cd ../frontend && npm install
```

### 2. Environment Configuration

Copy `.env.example` in both folders:

```bash
# Backend configuration
cp backend/.env.example backend/.env

# Frontend configuration
cp frontend/.env.example frontend/.env.local
```

### 3. Run Development Servers

Run both servers concurrently or in separate terminals:

#### Running from the Root Directory:
```bash
# Run Backend API Server (http://localhost:5000)
npm run dev:backend

# Run Frontend Web App (http://localhost:3000)
npm run dev:frontend
```

#### Or Run Directly in Each Directory:
```bash
# Backend (Terminal 1)
cd backend
npm run dev

# Frontend (Terminal 2)
cd frontend
npm run dev
```

---

## 🔌 API Endpoints (Backend)

The backend server runs on `http://localhost:5000/api/v1` and exposes all 18 tourism & safety domains:

- **Health Status**: `GET /api/v1/health`
- **Destinations**: `GET /api/v1/destinations`, `GET /api/v1/destinations/:slug`
- **Territories**: `GET /api/v1/territories`, `GET /api/v1/territories/:slug`
- **Safety & SOS**: `POST /api/v1/safety/sos`, `GET /api/v1/safety/advisories`, `GET /api/v1/safety/contacts`
- **AI Companion**: `POST /api/v1/ai/chat`, `POST /api/v1/ai/itinerary`
- **Itineraries**: `GET /api/v1/itineraries`, `POST /api/v1/itineraries`
- **Weather & Live**: `GET /api/v1/weather`, `GET /api/v1/safety/live`
- **Travel & Bookings**: `GET /api/v1/flights`, `GET /api/v1/hotels`, `GET /api/v1/festivals`
- **Maps & Geocoding**: `GET /api/v1/maps/geocoding`, `GET /api/v1/maps/markers`
- **Authentication**: `POST /api/v1/auth/login`, `POST /api/v1/auth/register`
