# MarketMap.Cloud

Find where your startup customers actually hang out. See real CAC data, hidden platforms, and budget allocation.

**Live:** https://marketmap.cloud

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- GitHub account
- Vercel account (free tier)

### Local Setup

1. **Clone the repo** (or copy this folder)
```bash
cd marketmap-cloud
npm install
```

2. **Set up environment variables**
```bash
cp .env.example .env.local
# Add your Google Analytics ID
```

3. **Run dev server**
```bash
npm run dev
```

4. **Open browser**
```
http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
marketmap-cloud/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── page.tsx      # Landing page
│   │   ├── result/       # Results page
│   │   ├── api/          # API endpoints
│   │   └── layout.tsx    # Root layout
│   ├── components/       # React components
│   ├── lib/              # Utilities
│   ├── types/            # TypeScript types
│   └── utils/            # Helper functions
├── public/               # Static files
│   └── data.json         # Research data
├── CHANGELOG.md          # Track all code changes
├── DEBUG_LOG.md          # Track all bugs
├── PHASES.md             # Build phases & gates
└── SRS.md               # System requirements
```

## Key Files

- **SRS.md** - Complete specification of what we're building
- **PHASES.md** - 4 phases with clear gates
- **CHANGELOG.md** - Every code change logged here
- **DEBUG_LOG.md** - Every bug & fix logged here

## Deployment

### To Vercel

1. Push code to GitHub
2. Connect repo to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### Configure Domain

1. Buy domain (marketmap.cloud)
2. Get Vercel nameservers
3. Update domain DNS to point to Vercel
4. Wait for SSL certificate (automatic)

## API Endpoints

### POST /api/budget
Calculate budget allocation for category

```bash
curl -X POST http://localhost:3000/api/budget \
  -H "Content-Type: application/json" \
  -d '{"category": "b2b_saas", "budget": 15000}'
```

### POST /api/analytics
Log user events

```bash
curl -X POST http://localhost:3000/api/analytics \
  -H "Content-Type: application/json" \
  -d '{"event": "pdf_downloaded", "category": "b2b_saas"}'
```

### POST /api/email
Capture user email

```bash
curl -X POST http://localhost:3000/api/email \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "category": "b2b_saas"}'
```

## Database

Phase 0: No database (static data only)

Phase 1+: Supabase (PostgreSQL)
- Table: `analytics` - User events
- Table: `emails` - Email captures

## Analytics

Google Analytics 4 tracking:
- `form_submit` - User fills form
- `results_viewed` - Results page viewed
- `pdf_downloaded` - PDF downloaded
- `email_captured` - Email captured

Set `NEXT_PUBLIC_GA_ID` in .env.local to enable.

## Testing

```bash
# Run dev server
npm run dev

# Test form submission
- Fill form with category + budget
- Verify navigation to /result page
- Test PDF download
- Check GA events fire
```

## Troubleshooting

### Port already in use
```bash
# Use different port
npm run dev -- -p 3001
```

### Module not found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Build fails
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

## Documentation

- **API_ENDPOINTS.md** - API documentation
- **DEPLOYMENT.md** - Deployment guide
- **ANALYTICS_GUIDE.md** - How to read analytics

## Contributing

1. Create a branch
2. Make changes
3. Update CHANGELOG.md
4. Commit and push
5. Test on Vercel before production

## Support

For issues and questions:
- Check DEBUG_LOG.md for known issues
- Check PHASES.md for build progress
- Open an issue on GitHub

## License

MIT License - 2026

---

**Questions?** See SRS.md for complete specification.
# Force rebuild on Fri Apr 24 04:41:49 PST 2026
