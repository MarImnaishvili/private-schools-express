# Deployment Guide - Private Schools Georgia

This guide covers deploying the Express backend and Next.js frontend separately.

## Architecture

- **Backend**: Express.js API → Render.com or Railway.app
- **Frontend**: Next.js app → Vercel
- **Database**: Supabase PostgreSQL (already configured)
- **Auth**: Supabase Auth (already configured)

---

## 🚀 Backend Deployment (Render.com)

### Prerequisites
1. Create account at [render.com](https://render.com)
2. Push your code to GitHub/GitLab

### Step-by-Step Deployment

#### 1. Connect Repository
- Go to Render Dashboard
- Click "New +" → "Web Service"
- Connect your GitHub/GitLab repository
- Select the `private-schools-express` repository

#### 2. Configure Service
```
Name: private-schools-backend
Region: Frankfurt (or closest to your users)
Branch: main
Root Directory: backend
Runtime: Node
Build Command: npm install && npx prisma generate
Start Command: npm start
Plan: Free (or Starter for production)
```

#### 3. Environment Variables
Add these in Render Dashboard → Environment:

```bash
NODE_ENV=production
PORT=4000

# Database (from Supabase)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT].supabase.co:5432/postgres

# Supabase
SUPABASE_URL=https://[YOUR-PROJECT].supabase.co
SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]

# JWT Secret (generate random string)
JWT_SECRET=[generate-random-string-min-32-chars]
```

**To get Supabase credentials:**
1. Go to Supabase Project Settings → API
2. Copy Project URL → `SUPABASE_URL`
3. Copy `anon` `public` key → `SUPABASE_ANON_KEY`
4. Copy `service_role` `secret` key → `SUPABASE_SERVICE_ROLE_KEY`

**To get DATABASE_URL:**
1. Supabase Project Settings → Database → Connection String
2. Select "URI" mode
3. Copy and replace `[YOUR-PASSWORD]` with your database password

#### 4. Deploy
- Click "Create Web Service"
- Render will automatically build and deploy
- Wait for "Live" status (5-10 minutes first time)

#### 5. Get Backend URL
After deployment, you'll get a URL like:
```
https://private-schools-backend.onrender.com
```

**Test it:**
```bash
curl https://private-schools-backend.onrender.com/health
# Should return: {"status":"healthy","timestamp":"..."}

curl https://private-schools-backend.onrender.com/api/schools
# Should return array of schools
```

---

## 🎨 Frontend Deployment (Vercel)

### Prerequisites
1. Create account at [vercel.com](https://vercel.com)
2. Install Vercel CLI (optional): `npm i -g vercel`

### Step-by-Step Deployment

#### 1. Connect Repository
- Go to Vercel Dashboard
- Click "Add New" → "Project"
- Import your GitHub/GitLab repository
- Select `private-schools-express` repository

#### 2. Configure Project
```
Framework Preset: Next.js
Root Directory: frontend
Build Command: npm run build (auto-detected)
Output Directory: .next (auto-detected)
Install Command: npm install (auto-detected)
Node Version: 20.x
```

#### 3. Environment Variables
Add these in Vercel Project Settings → Environment Variables:

```bash
# API URL (use your Render backend URL)
NEXT_PUBLIC_API_URL=https://private-schools-backend.onrender.com

# Supabase (same as backend)
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
```

**Important:**
- Make sure environment variables start with `NEXT_PUBLIC_` for client-side access
- Use the BACKEND URL from Step 1 (Render deployment)

#### 4. Deploy
- Click "Deploy"
- Vercel will automatically build and deploy (2-5 minutes)
- You'll get a URL like: `https://private-schools-express.vercel.app`

#### 5. Custom Domain (Optional)
- Go to Project Settings → Domains
- Add your custom domain (e.g., `privateschools.ge`)
- Follow DNS configuration instructions

---

## 🔧 Update CORS Settings

After deploying, update backend CORS to allow your frontend domain:

**Edit `backend/src/server.ts`:**

```typescript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://private-schools-express.vercel.app', // Add your Vercel URL
  'https://your-custom-domain.ge', // Add custom domain if you have one
];
```

Commit and push changes - Render will auto-redeploy.

---

## 🔍 Testing Deployment

### 1. Test Backend Health
```bash
curl https://private-schools-backend.onrender.com/health
```
Expected: `{"status":"healthy"}`

### 2. Test Backend API
```bash
curl https://private-schools-backend.onrender.com/api/schools | jq 'length'
```
Expected: `75` (or number of schools you have)

### 3. Test Frontend
Visit: `https://private-schools-express.vercel.app/en`

You should see:
- Home page with schools list
- Search functionality working
- School details loading

### 4. Test Authentication
1. Go to `/en/login`
2. Login with admin/employee credentials
3. Should redirect to dashboard
4. Should see schools in admin panel

---

## 🐛 Troubleshooting

### Backend Issues

**Problem: Build fails on Render**
```bash
# Check build logs in Render dashboard
# Common fix: Ensure all dependencies are in package.json, not devDependencies
```

**Problem: Database connection fails**
```bash
# Verify DATABASE_URL is correct
# Check Supabase connection pooling settings
# Use connection pooler URL if needed
```

**Problem: 502 Bad Gateway**
```bash
# Backend is crashing - check Render logs
# Common causes:
# - Missing environment variables
# - Database connection timeout
# - Port configuration (must use process.env.PORT)
```

### Frontend Issues

**Problem: API calls failing**
```bash
# Check browser console
# Verify NEXT_PUBLIC_API_URL is set correctly
# Check CORS settings in backend
```

**Problem: Environment variables not working**
```bash
# Must start with NEXT_PUBLIC_ for client-side access
# Redeploy after adding env vars
```

**Problem: 500 Internal Server Error**
```bash
# Check Vercel Function logs
# Usually means missing environment variables
```

---

## 📊 Monitoring

### Backend (Render)
- Dashboard → Logs → Live logs
- Dashboard → Metrics (CPU, Memory, Response time)

### Frontend (Vercel)
- Project → Analytics (visits, errors)
- Project → Logs (function logs)

### Supabase
- Database → Logs
- Auth → Users (authentication logs)

---

## 💰 Pricing

### Free Tier Limits

**Render (Backend):**
- ✅ Free tier available
- ⚠️ Spins down after 15 minutes of inactivity
- ⚠️ Cold start: 30-60 seconds on first request
- 💡 Upgrade to Starter ($7/mo) for always-on

**Vercel (Frontend):**
- ✅ 100GB bandwidth/month free
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ Global CDN
- 💡 Pro plan ($20/mo) for commercial use

**Supabase (Database):**
- ✅ 500MB database free
- ✅ 2GB bandwidth/month
- ✅ 50,000 monthly active users
- 💡 Pro plan ($25/mo) for production

**Total Free Tier:** $0/month
**Production Ready:** ~$32/month (Render Starter + Vercel Pro + Supabase Pro)

---

## 🔄 CI/CD (Automatic Deployments)

Both Render and Vercel support automatic deployments:

1. **Push to GitHub** → Automatic deployment
2. **Render**: Deploys `main` branch automatically
3. **Vercel**: Deploys `main` for production, creates preview for PRs

### Disable Auto-Deploy (if needed)
- **Render**: Dashboard → Service Settings → Auto-Deploy (toggle off)
- **Vercel**: Project Settings → Git → Ignored Build Step

---

## 🔐 Security Checklist

Before going to production:

- [ ] Environment variables set correctly (no hardcoded secrets)
- [ ] CORS configured with specific domains (not `*`)
- [ ] HTTPS enabled (automatic on Vercel/Render)
- [ ] Rate limiting configured (consider adding to backend)
- [ ] Supabase Row Level Security (RLS) enabled
- [ ] Database backups enabled (Supabase auto-backups)
- [ ] Error monitoring setup (Sentry, LogRocket, etc.)
- [ ] Custom domain with SSL certificate

---

## 📚 Alternative Deployment Options

### Backend Alternatives:
1. **Railway.app** - Similar to Render, better DX
2. **Fly.io** - Global edge deployment
3. **DigitalOcean App Platform** - More control
4. **AWS Elastic Beanstalk** - Enterprise option

### Frontend Alternatives:
1. **Netlify** - Similar to Vercel
2. **Cloudflare Pages** - Fast global CDN
3. **Railway.app** - Can host both frontend & backend

### Database Alternatives:
1. **Neon** - Serverless PostgreSQL
2. **PlanetScale** - MySQL with branching
3. **Railway.app PostgreSQL** - Integrated with hosting

---

## 🆘 Need Help?

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs

---

## ✅ Quick Deploy Checklist

### Backend (Render)
- [ ] Repository connected
- [ ] Root directory set to `backend`
- [ ] Build command: `npm install && npx prisma generate`
- [ ] Start command: `npm start`
- [ ] All environment variables added
- [ ] Health check returns 200
- [ ] `/api/schools` returns data

### Frontend (Vercel)
- [ ] Repository connected
- [ ] Root directory set to `frontend`
- [ ] `NEXT_PUBLIC_API_URL` points to Render backend
- [ ] Supabase env vars added
- [ ] Home page loads
- [ ] Schools display correctly
- [ ] Login works

### Backend CORS Update
- [ ] Vercel URL added to CORS allowedOrigins
- [ ] Changes pushed and auto-deployed

**You're live! 🎉**
