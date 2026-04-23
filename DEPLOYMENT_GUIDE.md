# Phase 0.9 - GitHub + Vercel Deployment Guide

**Status:** Local git setup complete ✅  
**Next:** Manual steps required for GitHub repo creation and Vercel deployment

---

## ✅ Completed: Local Git Setup

- [x] Initialized git repository: `.git/`
- [x] Configured git user: `itsuxairrana`
- [x] Created initial commit with all 34 project files
- [x] Installed GitHub CLI (v2.91.0)
- [x] Configured git remote: `git@github.com:itsuxairrana/marketmap-cloud.git`
- [x] Renamed branch to `main`

**Git Status:**
```
On branch main
Remote origin set to: git@github.com:itsuxairrana/marketmap-cloud.git
```

---

## ⏳ Next Steps: GitHub & Vercel Deployment

### Step 1: Create GitHub Repository

**Option A: Web Interface (Recommended)**
1. Go to https://github.com/new
2. Fill in repository details:
   - **Repository name:** `marketmap-cloud`
   - **Description:** `MarketMap - Find where your startup should spend on marketing`
   - **Visibility:** Public
3. Click "Create repository"
4. (Skip adding README, .gitignore, license - we already have them)

**Option B: GitHub CLI**
First, authenticate with GitHub:
```bash
gh auth login --web
# When prompted:
# ? What is your preferred protocol for Git operations? HTTPS
# Follow browser instructions to authenticate
```

Once authenticated, create repo:
```bash
cd D:\MarketMap\marketmap-cloud
gh repo create marketmap-cloud --public --source=. --description "MarketMap - Find where your startup should spend on marketing" --remote origin
```

---

### Step 2: Push Code to GitHub

After repository is created on GitHub, push the code:

```bash
cd D:\MarketMap\marketmap-cloud
git push -u origin main
```

**Expected output:**
```
Enumerating objects: 35, done.
Counting objects: 100% (35/35), done.
Delta compression using up to 8 threads
Compressing objects: 100% (32/32), done.
Writing objects: 100% (35/35), X KB, done.
...
* [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

---

### Step 3: Connect to Vercel

1. Go to https://vercel.com
2. Click "Sign up" (or "Continue with GitHub" if you have account)
3. Authorize Vercel to access your GitHub account
4. Click "Import project"
5. Find and select `marketmap-cloud` repository
6. Click "Import"

**Configure Vercel Settings:**
- Framework: Next.js
- Build command: `npm run build` (auto-detected)
- Output directory: `.next` (auto-detected)
- Install command: `npm install` (auto-detected)

**Environment Variables** (add these in Vercel dashboard):
```
NEXT_PUBLIC_GA_ID=G_XXXXXXXXXX
```

7. Click "Deploy"

---

### Step 4: Verify Deployment

After deployment completes (usually 2-3 minutes):

1. Check Vercel dashboard for green "✓ Ready" status
2. Visit the generated preview URL (e.g., `https://marketmap-cloud-itsuxairrana.vercel.app`)
3. Test the form → results → PDF flow
4. Verify no console errors

---

### Step 5: Enable Auto-Deploy (Optional)

Vercel auto-deploys on push by default. To verify:
1. Go to Vercel dashboard
2. Project → Settings → Git
3. Verify "Auto-deploy on push" is enabled

---

### Step 6: Set Up Custom Domain (Phase 0.10)

After Vercel deployment is confirmed:
1. Buy domain at https://www.hostinger.com (search `marketmap.cloud` - ~$1.99)
2. In Vercel dashboard: Project → Settings → Domains
3. Add custom domain: `marketmap.cloud`
4. Vercel will show nameservers to configure
5. Go to Hostinger → Domain settings
6. Change nameservers to Vercel's nameservers
7. Wait 5-10 minutes for DNS propagation
8. Visit https://marketmap.cloud to confirm

---

## 📊 Deployment Checklist

- [ ] GitHub repository created
- [ ] Code pushed to `main` branch
- [ ] Vercel deployment successful (green checkmark)
- [ ] Preview URL accessible and working
- [ ] Form → Results → PDF flow tested
- [ ] Analytics events firing (check GA dashboard)
- [ ] No console errors on Vercel
- [ ] Environment variables configured
- [ ] Custom domain purchased (optional)
- [ ] Domain DNS configured (optional)

---

## 🔍 Troubleshooting

### Git push fails with "Permission denied (publickey)"
- SSH key not registered with GitHub
- **Solution:** Use HTTPS instead:
  ```bash
  git remote set-url origin https://github.com/itsuxairrana/marketmap-cloud.git
  git push -u origin main
  # Will prompt for GitHub credentials/token
  ```

### Vercel deployment fails
- Check build logs in Vercel dashboard
- Verify environment variables are set
- Ensure `next.config.js` and `package.json` are correct

### Domain not resolving after DNS change
- DNS changes can take 5-30 minutes to propagate
- Check DNS propagation: https://dnschecker.org
- Clear browser cache and try again

---

## 📋 Files Ready for Deployment

All project files are committed and ready:
- ✅ `src/` - React components and pages
- ✅ `public/` - Static files and data.json
- ✅ `package.json` - Dependencies
- ✅ `tsconfig.json` - TypeScript config
- ✅ `next.config.js` - Next.js config
- ✅ `tailwind.config.js` - Tailwind config
- ✅ `.env.local` - Environment variables template

---

**Last Updated:** April 24, 2026  
**Phase Status:** 0.9 (Local setup complete, awaiting manual GitHub/Vercel steps)
