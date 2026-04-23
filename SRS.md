# MarketMap.Cloud - System Requirements Specification (SRS)

**Version:** 1.0  
**Date:** April 24, 2026  
**Status:** Ready for Phase 1  

---

## **1. PRODUCT OVERVIEW**

### **What is MarketMap.Cloud?**

A **free SaaS tool** that shows founders WHERE to spend their marketing budget based on their business type and budget size.

**Problem:** Founders pick marketing channels blind and burn cash.  
**Solution:** MarketMap tells them the best channels (hero + support + goldmines) with real CAC data.

### **Target Users**

- B2B SaaS founders ($0-1M ARR)
- DTC e-commerce founders ($0-1M ARR)
- Indie hackers / solo founders ($0-100K ARR)
- Agency/service founders ($0-5M ARR)

### **Phase 0 (MVP) Goal**

Get **50-100 organic users** signing up and downloading the PDF.

### **Revenue Model (Phase 1+)**

- Phase 0: 100% free
- Phase 1 (after 50+ users): Add $49/mo premium (real-time APIs)
- Monetization: Email capture + premium tier

---

## **2. FUNCTIONAL REQUIREMENTS**

### **User Journey**

```
User lands on marketmap.cloud
        ↓
Sees one-liner: "Find where your customers actually hang out"
        ↓
Fills form: "What are you building?" [dropdown] + "Monthly budget?" [number]
        ↓
Clicks "Get Platform Map"
        ↓
Sees results: Hero channel + Support channels + Hidden goldmines
        ↓
Clicks "Download PDF"
        ↓
PDF downloads to computer
        ↓
[Optional] Email capture form appears after PDF download
        ↓
Email logged in Supabase
        ↓
User gets email: "Download your full analysis" (confirmation)
```

### **Form Page (/ root)**

**Inputs:**
1. Dropdown: "What are you building?"
   - B2B SaaS
   - DTC E-commerce
   - Indie Hackers
   - Agency/Service Business
   
2. Number input: "Monthly marketing budget?"
   - Min: $0
   - Max: $100,000
   - Default: 10000

**Validation:**
- Category is selected
- Budget is positive number
- Show error if either missing

**Button:** "Get Platform Map" → Navigates to /result?category=X&budget=Y

---

### **Results Page (/result)**

**URL params:** `?category=b2b_saas&budget=15000`

**Display Sections (in order):**

#### **1. Hero Channel**
```
🎯 HERO CHANNEL - LinkedIn Organic
$0 CAC | 0.5-3% conversion rate

What it is:
Founder-led content building direct relationships with decision makers

Why it works:
[from JSON: why_it_works field]

How to start:
- Post 3-4x per week on LinkedIn
- Focus on: GTM, growth, sales insights
- Examples: Clay, Lovable, Attio

Time to first lead: 2-4 weeks
Effort level: High (daily content)

Budget allocation: 50% = $7,500/month

Examples of success:
- Clay: Hit $1M ARR via LinkedIn content
- Default: Founder posts daily, 10K+ subscribers
```

#### **2. Support Channels (2-3 channels)**
```
📊 SUPPORT CHANNELS - 30% of budget = $4,500/month

Option A: Cold Email (Clay + Apollo)
- CAC: $200-$600
- Budget: $2,500/month
- Why: Highest intent, personalized

Option B: Google Ads
- CAC: $200-$600
- Budget: $2,000/month
- Why: High-intent searchers
```

#### **3. Hidden Goldmines (3-5 platforms)**
```
💎 HIDDEN GOLDMINES - 20% of budget = $3,000/month

Platform A: RevGenius Slack
- Cost: $9K/quarter sponsorship
- CAC: $30-$150 per lead
- Why hidden: Most founders don't know paid Slack sponsorships exist
- Why goldmine: Highly qualified, low competition

Platform B: Lenny's Newsletter
- Cost: $15-40K sponsorship
- Why: 800K+ engaged audience
```

#### **4. Where Your Audience Hangs Out**
```
📍 AUDIENCE LOCATIONS

Subreddits:
- r/SaaS (400K members) → Post case studies
- r/startups (1.5M) → Share growth lessons
- r/sales (500K) → Post templates

Slack Communities:
- RevGenius (35K GTM pros)
- Pavilion (10K+ elite)
- Modern Sales Pros (27K)

Podcasts:
- SaaStr (GTM focused)
- Lenny's Podcast (growth)
- 20VC (fundraising)

Newsletters:
- Lenny's Newsletter (800K)
- MKT1 by Emily Kramer (75K)
```

#### **5. Budget Breakdown (Visual)**
```
Your $15,000/month allocation:

Hero Channel (50%)        → $7,500  ████████████████
Support Channels (30%)    → $4,500  █████████
Hidden Goldmines (20%)    → $3,000  ██████
```

#### **6. Industry Average Comparison**
```
📈 HOW YOU COMPARE TO INDUSTRY

Your Hero Channel:        LinkedIn Organic
Industry Avg CAC:         $1,200
Your Estimated CAC:       $0 (organic)
Your Advantage:           Massive (if executed)

Your Support Channel:     Google Ads
Industry Avg CAC:         $500
Your Estimated CAC:       $300 (optimized)
Your Advantage:           20% better than average
```

**CTA Buttons:**
- `[📥 Download Full Report as PDF]` → Triggers PDF download + analytics log
- `[✉️ Send to my email]` → Email capture form

---

### **PDF Download**

**Filename:** `marketmap_report_{category}_{date}.pdf`

**Contents:**
1. Title page: "Your Marketing Platform Map"
2. Executive summary
3. Full results (hero, support, goldmines, audience, budget)
4. Industry benchmark comparison
5. Action items (next steps)
6. Call-to-action for email

**Technology:** jsPDF

---

### **Email Capture (Post-PDF)**

**Trigger:** After user downloads PDF

**Form:**
- Email input field
- "Get weekly platform updates" checkbox
- Submit button

**Data stored in Supabase:**
- email
- category
- budget_amount
- pdf_downloaded: true
- created_at
- user_agent

**Email sent back:** Confirmation + PDF link

---

## **3. NON-FUNCTIONAL REQUIREMENTS**

### **Performance**
- Page load < 2 seconds
- Form response < 500ms
- PDF generation < 3 seconds

### **SEO**
- Title: "MarketMap - Find Where Your Customers Hang Out"
- Meta description: "Discover the best marketing channels for your startup. See real CAC data, hidden platforms, and budget allocation."
- H1: "Where Should You Spend Your Marketing Budget?"
- Keywords: "startup marketing channels", "CAC calculator", "marketing budget allocation"
- Sitemap: Dynamic, includes all archetypes
- robots.txt: Allow all

### **Mobile**
- 100% mobile responsive
- Touch-friendly buttons (48px min)
- Forms work on mobile keyboard
- PDF download works on mobile

### **Analytics Tracking**

**Google Analytics Events:**
1. `form_submit` - User fills form
   - category
   - budget_amount
   
2. `results_viewed` - Results page loads
   - category
   - budget_amount
   
3. `pdf_downloaded` - PDF downloaded
   - category
   - budget_amount
   
4. `email_captured` - Email submitted
   - category
   - budget_amount

**Custom Supabase Tracking (analytics table):**
```
{
  id: uuid,
  category: string (b2b_saas | dtc | indie | agency),
  budget_amount: number,
  pdf_downloaded: boolean,
  email_provided: boolean,
  email: string (if provided),
  user_agent: string,
  timestamp: timestamp,
  referrer: string,
  session_id: string
}
```

**Dashboard metrics we'll track:**
- Total users (weekly)
- Conversion rate (form → PDF)
- Email capture rate (PDF → email)
- Most popular category
- Average budget entered
- Mobile vs desktop ratio
- Traffic sources (organic vs paid)

---

### **Data Security**
- All secrets in .env.local (NOT in git)
- HTTPS only
- No sensitive data stored locally
- Emails encrypted in Supabase

### **Accessibility**
- WCAG 2.1 AA compliance
- Alt text on images
- Keyboard navigation
- Color contrast ≥ 4.5:1

---

## **4. TECHNICAL STACK**

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | Next.js 14 + React 18 | Modern, fast, SSR |
| Styling | Tailwind CSS | Professional look, fast |
| Language | TypeScript | Type safety |
| API Routes | Next.js API routes | Built-in backend |
| Database | Supabase (future) | PostgreSQL, free tier |
| Analytics | Google Analytics 4 | Industry standard |
| PDF | jsPDF | Lightweight, no backend needed |
| Hosting | Vercel | Free, auto-deploy from GitHub |
| Domain | marketmap.cloud | Professional TLD |
| Version Control | GitHub | Standard |

---

## **5. API ENDPOINTS**

### **POST /api/budget**

**Request:**
```json
{
  "category": "b2b_saas",
  "budget": 15000
}
```

**Response:**
```json
{
  "category": "b2b_saas",
  "budget": 15000,
  "hero_channel": {
    "platform": "LinkedIn Organic",
    "cac": "$0",
    "allocation": 7500
  },
  "support_channels": [...],
  "hidden_goldmines": [...],
  "audience_locations": {...},
  "budget_breakdown": {}
}
```

**Purpose:** Return platform data from JSON based on category

---

### **POST /api/analytics**

**Request:**
```json
{
  "event": "pdf_downloaded",
  "category": "b2b_saas",
  "budget": 15000,
  "session_id": "abc123"
}
```

**Response:**
```json
{
  "success": true,
  "logged": true
}
```

**Purpose:** Log user events to Supabase

---

### **POST /api/email**

**Request:**
```json
{
  "email": "founder@example.com",
  "category": "b2b_saas",
  "budget": 15000
}
```

**Response:**
```json
{
  "success": true,
  "message": "Check your email"
}
```

**Purpose:** Capture email, store in Supabase

---

## **6. DATABASE SCHEMA (Phase 2)**

### **analytics table**
```sql
CREATE TABLE analytics (
  id UUID PRIMARY KEY,
  category VARCHAR(50),
  budget_amount INTEGER,
  pdf_downloaded BOOLEAN DEFAULT false,
  email_provided BOOLEAN DEFAULT false,
  email VARCHAR(255),
  user_agent TEXT,
  session_id VARCHAR(255),
  referrer TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## **7. DEPLOYMENT CHECKLIST**

- [ ] Code in GitHub repository
- [ ] .env.local with secrets
- [ ] Vercel project created
- [ ] GitHub connected to Vercel
- [ ] Auto-deploy on push enabled
- [ ] Domain (marketmap.cloud) purchased
- [ ] Domain DNS pointing to Vercel
- [ ] Google Analytics code added
- [ ] Supabase project created (Phase 2)
- [ ] Test form → PDF → email flow
- [ ] Test on mobile
- [ ] SEO audit (title, meta, H1)

---

## **8. SUCCESS METRICS**

| Metric | Target | Phase |
|--------|--------|-------|
| Users | 50-100 | Phase 0 |
| Conversion (form → PDF) | 30%+ | Phase 0 |
| Email capture | 20%+ of PDF | Phase 0 |
| Organic traffic | 80%+ | Phase 0 |
| Page speed | < 2s | Phase 0 |
| Mobile users | Track | Phase 0 |

---

## **9. FUTURE FEATURES (Phase 1+)**

- [ ] Real-time CAC data (SimilarWeb API)
- [ ] User accounts + saved reports
- [ ] Premium tier ($49/mo)
- [ ] Competitor analysis
- [ ] Chat support
- [ ] API access for integrations

---

## **10. ASSUMPTIONS & CONSTRAINTS**

**Assumptions:**
- Data in MARKETMAP_DATA_STRUCTURE.json is accurate
- Users have valid email addresses
- Most traffic will be organic (not paid)
- 50+ users in first month is realistic goal

**Constraints:**
- No real-time APIs in Phase 0 (cost)
- No user accounts in Phase 0 (complexity)
- Static data only (from JSON file)
- Free Vercel tier limitations

---

**SRS Owner:** Product Team  
**Last Updated:** April 24, 2026  
**Next Review:** After Phase 1 launch
