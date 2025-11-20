# 🚀 Vercel Deployment Guide - GambitAI

## 📁 Project Structure Analysis

**Current Clean Structure:**
```
/workspace/
├── README.md (essential only)
├── vercel.json (deployment config)  
├── IMPLEMENTATION_SUMMARY.md (technical docs)
├── gambitai-frontend/ ← FRONTEND SOURCE CODE
└── supabase/ ← BACKEND CONFIGS
```

**PENTING**: `gambitai-frontend/` adalah folder yang akan di-deploy sebagai Vite project!

## 🔧 Vercel Deployment Steps

### Step 1: Prepare Repository
```bash
# Pastikan di workspace directory
cd /workspace

# Check current git status
git status

# Add all changes
git add .

# Commit dengan conventional message
git commit -m "feat: restructure project for Vercel deployment and implement teal color theme

- Clean project structure (remove documentation, test reports)
- Implement teal color palette (#000D1D background, #26FFF6 accent)
- Update all components with teal-based theme
- Configure Vercel deployment settings
- Maintain existing functionality and data"

# Push ke GitHub
git push origin main
```

### Step 2: Vercel Dashboard Deploy

#### Option A: Connect GitHub Repository (Recommended)

1. **Login ke Vercel**
   - Buka [vercel.com](https://vercel.com)
   - Login dengan GitHub account

2. **New Project**
   - Klik "Add New" → "Project"
   - Pilih repository: `gambitai-arbitrage-platform`

3. **Configure Project**
   ```
   Project Name: gambitai-arbitrage-platform
   Framework Preset: Vite
   Root Directory: gambitai-frontend/
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Environment Variables**
   ```env
   VITE_SUPABASE_URL=https://bpbtgkunrdzcoyfdhskh.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwYnRna3VucmR6Y295ZmRoc2toIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5MjAzNzUsImV4cCI6MjA3ODQ5NjM3NX0.ZAtjUoDnIWUOs6Os1NUGKIRUQVOuXDlaCJ4HwQqZu50
   ```

5. **Deploy**
   - Klik "Deploy"
   - Tunggu ~2-3 menit untuk build

#### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login ke Vercel
vercel login

# Deploy (dari workspace directory)
vercel --prod

# Follow prompts:
# ? Set up and deploy? Y
# ? Which scope? [your-team-name]
# ? Link to existing project? N
# ? Project name: gambitai-arbitrage-platform
# ? Directory: /workspace/gambitai-frontend
# ? Override settings? Y
# ? Build command: npm run build
# ? Output directory: dist
```

### Step 3: Post-Deployment Configuration

#### Custom Domain (Optional)
1. Di Vercel Dashboard → Project Settings → Domains
2. Add custom domain (jika ada)
3. Update DNS records sesuai instruksi

#### Environment Variables (Production)
```bash
# Set production environment variables
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production
```

### Step 4: Verify Deployment

**Checkpoints:**
- [ ] Build successful tanpa errors
- [ ] Environment variables loaded correctly
- [ ] Website loads dengan teal theme
- [ ] Dashboard authentication works
- [ ] Database connections functional
- [ ] All pages accessible (Landing, Dashboard, Markets, Analytics)

## 🎯 Important Notes

### Vercel Configuration

**vercel.json sudah dibuat dengan:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install"
}
```

### Build Optimization

**Vite Build Configuration:**
```json
{
  "scripts": {
    "build": "npm run build",
    "dev": "npm run dev"
  }
}
```

### Environment Variables Pattern

**Vercel Pattern**: Semua variabel harus prefixed dengan `VITE_`
- `VITE_SUPABASE_URL` → Available di browser
- `VITE_SUPABASE_ANON_KEY` → Available di browser

### Build Issues Troubleshooting

**Common Issues:**
1. **Build fails**: Check build command di Vercel settings
2. **Environment variables not loading**: Pastikan prefix `VITE_`
3. **Blank page**: Check output directory settings
4. **Routing issues**: Single Page App routing configured

## 🌟 Deployment URLs

**After successful deployment:**
- **Vercel URL**: `https://gambitai-arbitrage-platform.vercel.app`
- **Custom Domain**: `https://your-domain.com` (jika configured)

**Backup URL (current deployment):**
- **Current**: https://4s7efo357hhn.space.minimax.io

## 📋 Pre-Deployment Checklist

- [ ] Git changes committed dan pushed
- [ ] Environment variables prepared
- [ ] Build tested locally: `npm run build`
- [ ] Supabase configs verified
- [ ] Teal theme implemented correctly
- [ ] All pages functional

## 🔄 Deployment Commands Summary

```bash
# 1. Git Push
git add .
git commit -m "feat: restructure project for Vercel deployment and implement teal color theme"
git push origin main

# 2. Vercel Deploy (CLI)
vercel --prod

# 3. Verify
# Visit: https://gambitai-arbitrage-platform.vercel.app
```

---

**Estimated Deployment Time**: 3-5 menit
**Total Build Size**: ~805 KB
**Hosting**: Vercel (Free tier available)
