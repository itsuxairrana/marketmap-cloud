# PHASES - MarketMap.Cloud Build Plan

**Master Timeline:** April 24 - May 8, 2026 (2 weeks)

---

## **PHASE 0: MVP (Core Functionality) - 2 Days**

**Goal:** Get working app deployed to Vercel with form → results → PDF download

**Start:** April 24  
**End:** April 25  
**Status:** ⏳ Not started

### **Phase 0 Breakdown**

#### **0.1 - Project Setup (2 hours)**
```
Tasks:
- [ ] Initialize Next.js project locally
- [ ] Install dependencies (Tailwind, jsPDF, etc.)
- [ ] Create folder structure from PROJECT_STRUCTURE.md
- [ ] Copy public/data.json from MARKETMAP_DATA_STRUCTURE.json
- [ ] Test local dev server runs

Gate: ✅ `npm run dev` works, no errors
Timeline: April 24, 9:00-11:00 AM
```

**Before Next Step:** Ask me to review folder structure  
**Deliverable:** Working local project

---

#### **0.2 - Landing Page + Form (3 hours)**
```
Tasks:
- [ ] Create src/app/page.tsx (landing page)
- [ ] Create src/components/Form.tsx (category dropdown + budget input)
- [ ] Add form validation in src/utils/validators.ts
- [ ] Style with Tailwind (light mode)
- [ ] Test form submission (should navigate to /result?category=X&budget=Y)

Gate: ✅ Form fills, validates, submits
Timeline: April 24, 11:00 AM-2:00 PM
```

**Before Next Step:** Ask me to review form UI  
**Deliverable:** Working form page

---

#### **0.3 - Results Page (4 hours)**
```
Tasks:
- [ ] Create src/app/result/page.tsx
- [ ] Create src/components/Results.tsx
- [ ] Parse URL params (category, budget)
- [ ] Display data from public/data.json based on category
- [ ] Show: Hero channel, Support channels, Hidden goldmines, Audience locations, Budget breakdown
- [ ] Mobile responsive
- [ ] Test all 4 categories

Gate: ✅ All 4 categories display correctly
Timeline: April 24, 2:00 PM-6:00 PM
```

**Before Next Step:** Ask me to review results layout  
**Deliverable:** Results page showing all data

---

#### **0.4 - PDF Download (2 hours)**
```
Tasks:
- [ ] Create src/components/PDFGenerator.tsx
- [ ] Install jsPDF: npm install jspdf
- [ ] Generate PDF with all results
- [ ] Filename format: marketmap_report_{category}_{date}.pdf
- [ ] Test download on desktop and mobile
- [ ] Test file opens correctly

Gate: ✅ PDF downloads and opens correctly
Timeline: April 24, 6:00 PM-8:00 PM
```

**Before Next Step:** Ask me to verify PDF looks good  
**Deliverable:** Working PDF download

---

#### **0.5 - Analytics Setup (2 hours)**
```
Tasks:
- [ ] Create Google Analytics 4 property (analytics.google.com)
- [ ] Create src/lib/analytics.ts
- [ ] Add GA script to src/app/layout.tsx
- [ ] Track events: form_submit, results_viewed, pdf_downloaded
- [ ] Test events fire in GA dashboard

Gate: ✅ Events visible in GA dashboard
Timeline: April 25, 9:00 AM-11:00 AM
```

**Before Next Step:** Ask me to verify GA setup  
**Deliverable:** Working analytics tracking

---

#### **0.6 - Email Capture (1 hour)**
```
Tasks:
- [ ] Create src/components/EmailCapture.tsx (simple form)
- [ ] Show after PDF download
- [ ] Test email form appears and submits
- [ ] Log to browser console for now (Supabase in Phase 1)

Gate: ✅ Email form appears and submits
Timeline: April 25, 11:00 AM-12:00 PM
```

**Before Next Step:** Ask me to verify email form  
**Deliverable:** Email capture form

---

#### **0.7 - SEO Optimization (1 hour)**
```
Tasks:
- [ ] Add SEO meta tags to src/app/page.tsx
- [ ] Create public/robots.txt
- [ ] Create public/sitemap.ts (dynamic)
- [ ] Add keywords, descriptions, H1 tags
- [ ] Test SEO score with PageSpeed Insights

Gate: ✅ SEO score 80+
Timeline: April 25, 12:00 PM-1:00 PM
```

**Before Next Step:** Ask me to verify SEO  
**Deliverable:** SEO optimized

---

#### **0.8 - Testing & QA (2 hours)**
```
Tasks:
- [ ] Test form → results → PDF flow end-to-end
- [ ] Test all 4 categories
- [ ] Test mobile responsive
- [ ] Test analytics events fire
- [ ] Test email capture works
- [ ] Check for console errors

Gate: ✅ All QA tests pass, no errors
Timeline: April 25, 1:00 PM-3:00 PM
```

**Before Next Step:** Ask me for final QA sign-off  
**Deliverable:** QA test report

---

#### **0.9 - GitHub + Vercel Setup (1 hour)**
```
Tasks:
- [ ] Create GitHub repository
- [ ] Push code to GitHub
- [ ] Create Vercel account (if needed)
- [ ] Connect GitHub to Vercel
- [ ] Enable auto-deploy on push
- [ ] Test deployment works

Gate: ✅ Vercel shows green deploy checkmark
Timeline: April 25, 3:00 PM-4:00 PM
```

**Before Next Step:** Confirm Vercel deployment successful  
**Deliverable:** App live on Vercel

---

#### **0.10 - Domain + Launch (30 min)**
```
Tasks:
- [ ] Buy marketmap.cloud domain ($1.99 from Hostinger)
- [ ] Get Vercel nameservers
- [ ] Point Hostinger DNS to Vercel
- [ ] Test marketmap.cloud loads the app
- [ ] Check SSL certificate active

Gate: ✅ marketmap.cloud works, HTTPS active
Timeline: April 25, 4:00 PM-4:30 PM
```

**Before Next Step:** Confirm domain works  
**Deliverable:** App live at marketmap.cloud

---

### **Phase 0 Gate ✅ BEFORE PHASE 1**

```
GATE CHECKLIST:
- [ ] Form submits with validation ✅
- [ ] Results display all 4 categories ✅
- [ ] PDF downloads correctly ✅
- [ ] Analytics events fire ✅
- [ ] Email capture works ✅
- [ ] Mobile responsive (tested) ✅
- [ ] No console errors ✅
- [ ] Deployed to Vercel ✅
- [ ] Domain works (marketmap.cloud) ✅
- [ ] SEO score 80+ ✅

IF ANY GATE FAILS → Fix it, don't proceed
IF ALL GATES PASS → LAUNCH PHASE 0 & POST EVERYWHERE
```

---

## **PHASE 0 LAUNCH - 1 Day**

**Goal:** Get organic traffic, test platform

**Timeline:** April 26, 2026

### **Launch Tasks**

```
- [ ] Post on Indie Hackers with title: "MarketMap - Find where your startup should spend on marketing"
- [ ] Post on Product Hunt
- [ ] Post on Twitter: 3 tweets
- [ ] Post on r/startups, r/SaaS, r/Entrepreneur (Reddit)
- [ ] Share with coworking members
- [ ] Monitor analytics for day 1 signups
- [ ] Collect feedback in Discord/Slack if possible
```

**Success Metric:** 10+ users on day 1

---

## **PHASE 1: Analytics & Email (3 Days)**

**Goal:** Store analytics in Supabase, collect emails, see first data

**Start:** April 27  
**End:** April 29  
**Dependencies:** Phase 0 must be complete and live

### **Phase 1 Tasks**

```
1.1 - Supabase Setup (2 hours)
- [ ] Create Supabase project
- [ ] Create analytics table
- [ ] Create emails table
- [ ] Get connection string

1.2 - API Updates (2 hours)
- [ ] Update /api/analytics/route.ts to use Supabase
- [ ] Update /api/email/route.ts to store emails
- [ ] Test data saves correctly

1.3 - Simple Dashboard (2 hours)
- [ ] Create /dashboard page (protected with password for now)
- [ ] Show: Total users, PDF downloads, Email signups
- [ ] Show: Top categories, Average budget
- [ ] Add CSV export button

1.4 - Deployment (1 hour)
- [ ] Deploy Phase 1 to Vercel
- [ ] Test analytics logging in production
- [ ] Verify Supabase connection works

Gate: ✅ Data saves to Supabase, dashboard shows data
```

**Before Phase 2:** Review analytics dashboard

---

## **PHASE 2: Premium Tier (5 Days)**

**Goal:** Add $49/mo premium, prepare for monetization

**Start:** April 30  
**End:** May 5  
**Dependencies:** Phase 1 must be complete

### **Phase 2 Tasks**

```
2.1 - Stripe Integration (2 hours)
- [ ] Create Stripe account
- [ ] Create $49/mo product
- [ ] Create checkout page

2.2 - User Authentication (2 hours)
- [ ] Add user accounts with email/password
- [ ] Add login/signup flow
- [ ] Protect premium features

2.3 - Premium Features (2 hours)
- [ ] Real-time CAC data (via API)
- [ ] Saved reports (user can re-download)
- [ ] Competitor analysis (if time)

2.4 - Pricing Page (1 hour)
- [ ] Create /pricing page
- [ ] Show free vs $49/mo comparison
- [ ] CTA to upgrade

2.5 - Deployment (1 hour)
- [ ] Deploy Phase 2
- [ ] Test Stripe checkout
- [ ] Verify premium features work

Gate: ✅ Can purchase subscription, premium features work
```

**Before Phase 3:** Test full purchase flow

---

## **PHASE 3: Optimization & Growth (2+ Days)**

**Goal:** Improve metrics, scale organically

**Start:** May 6  
**Ongoing:** Continuous

### **Phase 3 Tasks (Ongoing)**

```
3.1 - SEO Optimization
- [ ] Improve keyword rankings
- [ ] Add more content (blog posts)
- [ ] Backlink building

3.2 - Analytics Deep Dive
- [ ] Understand user flow
- [ ] Identify drop-off points
- [ ] A/B test form copy

3.3 - User Feedback Loop
- [ ] Email surveys to early users
- [ ] Discord community for feedback
- [ ] Monthly improvement sprints

3.4 - Feature Prioritization
- [ ] Based on user feedback
- [ ] Build what users ask for most

Gate: ✅ Continuously improving based on data
```

---

## **Timeline Summary**

```
April 24-25  │ Phase 0: MVP Build (2 days)
April 26     │ Phase 0: Launch (1 day)
April 27-29  │ Phase 1: Analytics (3 days)
April 30-05  │ Phase 2: Premium (5 days)
May 6+       │ Phase 3: Growth (ongoing)
```

---

## **Success Criteria by Phase**

### **Phase 0 = SUCCESS**
- ✅ 50-100 users in first week
- ✅ 30%+ form → PDF conversion
- ✅ No critical errors
- ✅ Mobile works
- ✅ SEO score 80+

### **Phase 1 = SUCCESS**
- ✅ 20%+ users provide email
- ✅ Analytics accurate
- ✅ Dashboard shows real data
- ✅ User feedback coming in

### **Phase 2 = SUCCESS**
- ✅ 5-10 paid subscribers
- ✅ $245-490/mo MRR
- ✅ Premium features used
- ✅ Customer feedback positive

### **Phase 3 = SUCCESS**
- ✅ 500+ total users
- ✅ 50+ paid subscribers
- ✅ $2,450+/mo MRR
- ✅ Organic growth continuing

---

## **Important Rules**

1. ✅ **ONE PHASE AT A TIME** - Don't skip ahead
2. ✅ **ASK BEFORE EACH STEP** - Get permission before coding
3. ✅ **TEST EVERYTHING** - QA before moving forward
4. ✅ **GIT COMMITS** - Push to GitHub after each step
5. ✅ **DEPLOY TO VERCEL** - Verify production works
6. ✅ **LOG CHANGES** - Update CHANGELOG.md every time
7. ✅ **LOG BUGS** - Update DEBUG_LOG.md if issues

---

**Current Phase:** ✅ Phases 0.1-0.5 COMPLETE → Ready for Phase 0.6 (Email Capture)  
**Last Updated:** April 24, 2026  
**Owner:** Product Team

## Phase 0 Progress Summary (April 24)

| Phase | Task | Status | Gate |
|-------|------|--------|------|
| 0.1 | Project Setup | ✅ COMPLETE | npm run dev works |
| 0.2 | Form & Results | ✅ COMPLETE | Form validates & submits |
| 0.3 | All 4 Categories | ✅ COMPLETE | All categories display |
| 0.4 | PDF Download | ✅ COMPLETE | PDF downloads correctly |
| 0.5 | Analytics | ✅ COMPLETE | GA events configured |
| 0.6 | Email Capture | ⏳ PENDING | Email form appears |
| 0.7 | SEO Optimization | ⏳ PENDING | SEO score 80+ |
| 0.8 | Testing & QA | ⏳ PENDING | All tests pass |
| 0.9 | GitHub + Vercel | ⏳ PENDING | Deploy successful |
| 0.10 | Domain + Launch | ⏳ PENDING | Domain works |
