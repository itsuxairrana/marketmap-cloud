# MarketMap.Cloud - Project Structure

```
marketmap-cloud/
│
├── README.md                          # Project overview
├── .env.local                         # Local secrets (NOT in git)
├── .gitignore                         # Git ignore rules
│
├── package.json                       # Dependencies
├── tsconfig.json                      # TypeScript config
├── next.config.js                     # Next.js config
│
├── CHANGELOG.md                       # ALL changes logged here ⭐
├── DEBUG_LOG.md                       # ALL bugs + fixes logged here ⭐
├── PHASES.md                          # Phase breakdown + gates ⭐
├── SRS.md                             # System Requirements Spec ⭐
│
├── public/
│   ├── data.json                      # Research data (from MARKETMAP_DATA_STRUCTURE.json)
│   ├── favicon.ico                    # Tab icon
│   └── robots.txt                     # SEO
│
├── src/
│   ├── app/
│   │   ├── page.tsx                   # Home page (form)
│   │   ├── layout.tsx                 # Global layout
│   │   ├── globals.css                # Global styles
│   │   │
│   │   ├── result/
│   │   │   └── page.tsx               # Results page
│   │   │
│   │   ├── api/
│   │   │   ├── budget/
│   │   │   │   └── route.ts           # Backend: Calculate budget allocation
│   │   │   │
│   │   │   ├── analytics/
│   │   │   │   └── route.ts           # Backend: Log user analytics
│   │   │   │
│   │   │   └── email/
│   │   │       └── route.ts           # Backend: Email capture (future)
│   │   │
│   │   └── sitemap.ts                 # SEO: Dynamic sitemap
│   │
│   ├── components/
│   │   ├── Header.tsx                 # Navigation header
│   │   ├── Footer.tsx                 # Footer with links
│   │   ├── Form.tsx                   # Main form component
│   │   ├── Results.tsx                # Results display component
│   │   ├── PDFGenerator.tsx           # PDF download logic
│   │   └── EmailCapture.tsx           # Email form (after PDF)
│   │
│   ├── lib/
│   │   ├── analytics.ts               # Google Analytics tracking
│   │   ├── supabase.ts                # Supabase client (future)
│   │   ├── api-helpers.ts             # API utility functions
│   │   └── constants.ts               # App constants, SEO meta
│   │
│   ├── types/
│   │   └── index.ts                   # TypeScript interfaces
│   │
│   └── utils/
│       ├── pdf-generator.ts           # jsPDF utilities
│       └── validators.ts              # Form validation
│
├── supabase/
│   └── migrations/
│       └── 001_init_schema.sql        # DB schema (Phase 2)
│
├── docs/
│   ├── API_ENDPOINTS.md               # API documentation
│   ├── DEPLOYMENT.md                  # Vercel deployment guide
│   ├── ANALYTICS_GUIDE.md             # How to read analytics
│   └── FEEDBACK_LOOP.md               # User feedback system
│
└── .github/
    └── workflows/
        └── deploy.yml                 # Auto-deploy on push
```

## **File Categories**

### **Meta Files (Project Management) ⭐**
- `CHANGELOG.md` - Tracks ALL code changes
- `DEBUG_LOG.md` - Tracks ALL bugs + fixes
- `PHASES.md` - Phase gates + dependencies
- `SRS.md` - Complete system spec

### **Frontend (User-facing)**
- `src/app/page.tsx` - Landing + form
- `src/app/result/page.tsx` - Results display
- `src/components/*` - UI components

### **Backend (API)**
- `src/app/api/budget/route.ts` - Main calculation endpoint
- `src/app/api/analytics/route.ts` - Tracking endpoint

### **Data & Config**
- `public/data.json` - Research data (static)
- `src/lib/constants.ts` - SEO meta, app config

### **Documentation**
- `docs/API_ENDPOINTS.md` - For debugging
- `docs/DEPLOYMENT.md` - For production

---

## **What Gets Tracked Where**

| What | Where | Why |
|------|-------|-----|
| Code changes | `CHANGELOG.md` | Single source of truth |
| Bugs + fixes | `DEBUG_LOG.md` | Learn from issues |
| Phase progress | `PHASES.md` | Know when to gate |
| Feature spec | `SRS.md` | Know what to build |
| API calls | Logs + GA | Track usage patterns |
| User feedback | Email capture | Iteration list |

---

## **Key Rules**

1. ✅ Every code change → logged in CHANGELOG.md
2. ✅ Every bug encountered → logged in DEBUG_LOG.md with fix
3. ✅ Every phase gate → checkpoint before moving forward
4. ✅ Every API call → analytics.ts tracks it
5. ✅ Every user → Google Analytics + custom tracking
6. ✅ Git push always → confirm success before next step

**This means:** When Claude comes back, we only read CHANGELOG + PHASES, not the whole codebase.
