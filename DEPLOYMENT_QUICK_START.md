# 🚀 Quick Deployment Guide

## Step 1: Deploy Backend to Render.com (5 minutes)

### 1.1 Sign Up & Connect Repository
1. Go to [render.com](https://render.com) and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub account
4. Select your repository

### 1.2 Configure Service
```
Name: private-schools-backend
Region: Frankfurt
Branch: main
Root Directory: backend
Runtime: Node
Build Command: npm install && npx prisma generate
Start Command: npm start
Instance Type: Free
```

### 1.3 Add Environment Variables
Click "Advanced" → "Add Environment Variable":

| Key | Value | Where to get it |
|-----|-------|-----------------|
| `NODE_ENV` | `production` | - |
| `PORT` | `4000` | - |
| `DATABASE_URL` | `postgresql://postgres:...` | Supabase → Settings → Database → Connection String (URI) |
| `SUPABASE_URL` | `https://xxx.supabase.co` | Supabase → Settings → API → Project URL |
| `SUPABASE_ANON_KEY` | `eyJhbGci...` | Supabase → Settings → API → anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGci...` | Supabase → Settings → API → service_role secret |
| `JWT_SECRET` | Generate random | Click "Generate" in Render |

### 1.4 Deploy
1. Click "Create Web Service"
2. Wait 5-10 minutes for first deployment
3. Copy your backend URL: `https://private-schools-backend.onrender.com`

### 1.5 Test Backend
```bash
curl https://private-schools-backend.onrender.com/health
# Should return: {"status":"healthy"...}
```

---

## Step 2: Deploy Frontend to Vercel (3 minutes)

### 2.1 Sign Up & Connect Repository
1. Go to [vercel.com](https://vercel.com) and sign up
2. Click "Add New" → "Project"
3. Import your repository

### 2.2 Configure Project
```
Framework Preset: Next.js (auto-detected)
Root Directory: frontend
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

### 2.3 Add Environment Variables
Click "Environment Variables":

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `https://private-schools-backend.onrender.com` (from Step 1.4) |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` (same as backend) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGci...` (same as backend) |

### 2.4 Deploy
1. Click "Deploy"
2. Wait 2-3 minutes
3. Copy your frontend URL: `https://private-schools-express.vercel.app`

### 2.5 Test Frontend
Visit: `https://private-schools-express.vercel.app/en`

You should see the home page with schools!

---

## Step 3: Update Backend CORS (2 minutes)

### 3.1 Add Frontend URL to CORS
In your local code, edit `backend/src/server.ts`:

```typescript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://private-schools-express.vercel.app', // ← Add your Vercel URL
  process.env.FRONTEND_URL,
].filter(Boolean);
```

### 3.2 Commit and Push
```bash
git add .
git commit -m "Add production frontend URL to CORS"
git push
```

Render will automatically redeploy! ✨

---

## Step 4: Verify Everything Works

### ✅ Backend Checklist
- [ ] Health endpoint: `https://your-backend.onrender.com/health` returns `{"status":"healthy"}`
- [ ] Schools API: `https://your-backend.onrender.com/api/schools` returns array of schools
- [ ] No CORS errors in browser console

### ✅ Frontend Checklist
- [ ] Home page loads: `https://your-frontend.vercel.app/en`
- [ ] Schools display correctly
- [ ] Search and filters work
- [ ] Login works: `https://your-frontend.vercel.app/en/login`
- [ ] Admin dashboard accessible after login

---

## 🎉 You're Live!

**Frontend**: `https://private-schools-express.vercel.app`
**Backend API**: `https://private-schools-backend.onrender.com`

---

## ⚠️ Important Notes

### Free Tier Limitations

**Render Free Tier:**
- ⏰ Spins down after 15 minutes of inactivity
- 🐌 First request after sleep takes 30-60 seconds (cold start)
- 💡 **Solution**: Upgrade to Starter plan ($7/mo) for always-on

**How to handle cold starts:**
1. Add a cron job to ping your backend every 14 minutes: [cron-job.org](https://cron-job.org)
2. Or upgrade to paid plan

**Vercel Free Tier:**
- ✅ No cold starts
- ✅ Fast global CDN
- ✅ 100GB bandwidth/month
- ✅ Perfect for this use case

---

## 🔧 Common Issues

### "CORS Error" in browser
**Fix**: Make sure you added your Vercel URL to backend CORS (Step 3)

### Backend returns 503
**Fix**:
1. Check Render logs
2. Verify DATABASE_URL is correct
3. Check Supabase connection pooling

### Frontend shows "Failed to fetch"
**Fix**:
1. Verify NEXT_PUBLIC_API_URL is set in Vercel
2. Make sure it points to your Render backend URL
3. Redeploy frontend after changing env vars

### Cold start takes too long
**Options**:
1. Set up cron job to ping `/health` every 14 minutes
2. Upgrade to Render Starter plan ($7/mo)

---

## 🔄 Future Deployments

All future deployments are **automatic**:

1. Make changes locally
2. Commit: `git add . && git commit -m "your message"`
3. Push: `git push`
4. Both Render and Vercel auto-deploy! 🚀

**Deployment times:**
- Render (backend): 3-5 minutes
- Vercel (frontend): 1-2 minutes

---

## 📊 Monitoring

### View Logs

**Backend (Render):**
- Dashboard → Your Service → Logs

**Frontend (Vercel):**
- Project → Deployments → Click deployment → "View Function Logs"

### Metrics

**Backend:**
- Render Dashboard → Metrics (CPU, Memory, Response Time)

**Frontend:**
- Vercel → Analytics (Visits, Errors, Performance)

---

## 💰 Cost Summary

### Free Forever:
- Render Free (with cold starts)
- Vercel Free (100GB bandwidth)
- Supabase Free (500MB DB)
- **Total: $0/month**

### Production Ready:
- Render Starter: $7/month (no cold starts)
- Vercel Pro: $20/month (analytics, team features)
- Supabase Pro: $25/month (more resources)
- **Total: $52/month** (only upgrade what you need!)

### Start Free, Scale Later:
Begin with free tier, upgrade when you get users! 🚀
