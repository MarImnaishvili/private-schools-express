# Private Schools Georgia 🏫

A bilingual (English/Georgian) platform for exploring private schools in Georgia.

## 🏗️ Architecture

- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **Backend**: Express.js REST API with TypeScript
- **Database**: PostgreSQL (Supabase)
- **Auth**: Supabase Authentication with JWT
- **ORM**: Prisma

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL database (or Supabase account)
- npm or yarn

### Development Setup

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd private-schools-express
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. **Configure environment variables**

**Backend** (`backend/.env`):
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your credentials
```

**Frontend** (`frontend/.env.local`):
```bash
cp frontend/.env.example frontend/.env.local
# Edit frontend/.env.local with your credentials
```

4. **Set up database**
```bash
cd backend
npx prisma generate
npx prisma db push
```

5. **Run development servers**
```bash
# From root directory
npm run dev
```

This starts:
- Backend: http://localhost:4000
- Frontend: http://localhost:3001

## 📁 Project Structure

```
private-schools-express/
├── backend/                 # Express.js API
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth, validation
│   │   ├── lib/            # Prisma client
│   │   ├── schemas/        # Zod validation schemas
│   │   └── server.ts       # Express app entry
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   └── package.json
│
├── frontend/               # Next.js app
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts (Auth)
│   │   ├── lib/           # API client, utilities
│   │   ├── schemas/       # Form validation
│   │   └── messages/      # i18n translations
│   └── package.json
│
└── package.json           # Root scripts
```

## 🌐 Deployment

### Quick Deploy (Recommended)

**Backend → Render.com** (Free tier available)
**Frontend → Vercel** (Free tier available)

📖 **See detailed instructions**: [DEPLOYMENT_QUICK_START.md](./DEPLOYMENT_QUICK_START.md)

### Step-by-Step

1. **Deploy Backend to Render**
   - Sign up at [render.com](https://render.com)
   - Create new Web Service
   - Connect repository
   - Set environment variables
   - Deploy!

2. **Deploy Frontend to Vercel**
   - Sign up at [vercel.com](https://vercel.com)
   - Import repository
   - Set environment variables
   - Deploy!

3. **Update CORS**
   - Add your Vercel URL to backend CORS settings
   - Push changes

📖 **Full deployment guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🔑 Environment Variables

### Backend (.env)
- `DATABASE_URL` - PostgreSQL connection string
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `JWT_SECRET` - Secret for JWT tokens
- `FRONTEND_URL` - Frontend URL for CORS (production)

### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

## 🧪 Testing

### Test Backend
```bash
cd backend
npm run dev

# In another terminal
curl http://localhost:4000/health
curl http://localhost:4000/api/schools
```

### Test Frontend
```bash
cd frontend
npm run dev

# Visit: http://localhost:3001/en
```

## 📚 API Documentation

### Public Endpoints (No Auth Required)
- `GET /health` - Health check
- `GET /api/schools` - List all schools
- `GET /api/schools/:id` - Get school details

### Protected Endpoints (Auth Required)
- `POST /api/schools` - Create school
- `PUT /api/schools/:id` - Update school
- `DELETE /api/schools/:id` - Delete school
- `POST /api/auth/create-employee` - Create employee (admin only)

## 🔐 Authentication

### User Roles
- **Admin**: Full access (create, read, update, delete all schools)
- **Employee**: Limited access (create schools, manage own schools only)
- **Public**: Read-only access (view schools, search, filter)

### Login
- Navigate to `/en/login`
- Use Supabase credentials
- JWT token stored in HTTP-only cookies

## 🌍 Internationalization

Supports English (en) and Georgian (ka):
- Routes: `/en/*` or `/ka/*`
- Translations: `frontend/src/messages/{en,ka}.json`
- Language switcher in header

## 🗃️ Database Schema

Main entities:
- **SchoolData** - School information
- **Address** - School address (one-to-one)
- **Infrastructure** - Facilities (one-to-one)
- **Primary/Basic/Secondary** - Education levels (one-to-one each)
- **Media** - Photos/videos (one-to-many)
- **User** - Supabase auth users
- **UserRole** - Role assignments (admin/employee)

## 📊 Features

### Public Features
✅ Browse all schools
✅ Search by name, city, district, phone
✅ Filter by education level, price range
✅ View detailed school information
✅ Bilingual interface (EN/KA)

### Admin/Employee Features
✅ Create new schools
✅ Edit school information
✅ Delete schools
✅ Upload media
✅ Manage education levels
✅ Create employee accounts (admin only)

## 🛠️ Development

### Run Backend Only
```bash
cd backend
npm run dev
# Runs on http://localhost:4000
```

### Run Frontend Only
```bash
cd frontend
npm run dev
# Runs on http://localhost:3001
```

### Build for Production
```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm start
```

### Database Commands
```bash
cd backend

# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name migration_name

# Push schema changes (no migration)
npx prisma db push

# Open Prisma Studio
npx prisma studio

# Reset database
npx prisma migrate reset
```

## 🐛 Troubleshooting

### "Module not found" errors
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Database connection issues
- Check DATABASE_URL is correct
- Verify Supabase project is active
- Check network/firewall settings

### CORS errors
- Verify FRONTEND_URL in backend .env
- Check allowedOrigins in `backend/src/server.ts`

### Frontend build errors
- Check NEXT_PUBLIC_API_URL is set
- Verify all environment variables are set
- Clear Next.js cache: `rm -rf .next`

## 📝 License

MIT

## 👥 Contributors

Built with ❤️ for Private Schools Georgia

---

**Need help?**
- 📖 [Deployment Guide](./DEPLOYMENT.md)
- 🚀 [Quick Start Guide](./DEPLOYMENT_QUICK_START.md)
- 💬 Open an issue on GitHub
