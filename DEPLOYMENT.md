# 🚀 CalmPrep AI Deployment Guide

Complete guide to deploy CalmPrep AI to production using **Render** (backend) and **Vercel** (frontend).

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:
- ✅ All code tested locally
- ✅ MongoDB Atlas account (free tier)
- ✅ Google Gemini API key
- ✅ Razorpay account with production keys
- ✅ GitHub account
- ✅ Git installed on your system

---

## 🗄️ Part 1: Setup MongoDB Atlas (Database)

### Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for a free account
3. Verify your email

### Step 2: Create a Cluster
1. Click "Build a Database"
2. Choose **FREE** M0 cluster
3. Select a cloud provider (AWS recommended)
4. Choose region closest to you
5. Click "Create Cluster"

### Step 3: Create Database User
1. Go to **Database Access**
2. Click "Add New Database User"
3. Username: `calmprep_admin`
4. Password: Generate a secure password (save it!)
5. Database User Privileges: **Read and write to any database**
6. Click "Add User"

### Step 4: Configure Network Access
1. Go to **Network Access**
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Confirm

### Step 5: Get Connection String
1. Go to **Database**
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Save this for later!

Example: `mongodb+srv://calmprep_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/calmprep?retryWrites=true&w=majority`

---

## 🔧 Part 2: Deploy Backend to Render

### Step 1: Push Code to GitHub
```bash
# Initialize git in your project root
cd "c:\Users\ELCOT\camprep ai"
git init

# Create .gitignore (already exists)
# Add all files
git add .

# Commit
git commit -m "Initial commit - CalmPrep AI"

# Create GitHub repository at https://github.com/new
# Then push:
git remote add origin https://github.com/YOUR_USERNAME/calmprep-ai.git
git branch -M main
git push -u origin main
```

### Step 2: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub
3. Authorize Render to access your repositories

### Step 3: Create Web Service
1. Click "New +" → "Web Service"
2. Connect your `calmprep-ai` repository
3. Configure:
   - **Name**: `calmprep-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free

### Step 4: Add Environment Variables
Click "Advanced" → "Add Environment Variable" and add:

```
PORT=5000
MONGODB_URI=mongodb+srv://calmprep_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/calmprep
JWT_SECRET=your-super-secret-production-key-change-this
GEMINI_API_KEY=your-gemini-api-key
RAZORPAY_KEY_ID=rzp_live_your_production_key_id
RAZORPAY_KEY_SECRET=your_production_key_secret
```

⚠️ **IMPORTANT**: Use **production** Razorpay keys, not test keys!

### Step 5: Deploy
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Your backend URL will be: `https://calmprep-backend.onrender.com`
4. Test it: Visit `https://calmprep-backend.onrender.com/` - you should see the welcome message

---

## 🎨 Part 3: Deploy Frontend to Vercel

### Step 1: Update Frontend Environment
Edit `frontend/.env`:
```env
VITE_API_URL=https://calmprep-backend.onrender.com
VITE_RAZORPAY_KEY_ID=rzp_live_your_production_key_id
```

### Step 2: Commit Changes
```bash
git add .
git commit -m "Update frontend API URL for production"
git push
```

### Step 3: Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub
3. Authorize Vercel

### Step 4: Deploy Frontend
1. Click "Add New..." → "Project"
2. Import your `calmprep-ai` repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 5: Add Environment Variables
1. Click "Environment Variables"
2. Add:
   - `VITE_API_URL` = `https://calmprep-backend.onrender.com`
   - `VITE_RAZORPAY_KEY_ID` = `rzp_live_your_production_key_id`

### Step 6: Deploy
1. Click "Deploy"
2. Wait 2-3 minutes
3. Your app will be live at: `https://calmprep-ai.vercel.app`

---

## 🔒 Part 4: Update Backend CORS

After deploying frontend, update backend to allow requests from your Vercel domain.

Edit `backend/server.js`:
```javascript
// Update CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://calmprep-ai.vercel.app', // Add your Vercel URL
    'https://your-custom-domain.com' // If you have a custom domain
  ],
  credentials: true
}));
```

Commit and push:
```bash
git add .
git commit -m "Update CORS for production"
git push
```

Render will auto-redeploy.

---

## ✅ Part 5: Test Production Deployment

### Backend Tests
```bash
# Test welcome route
curl https://calmprep-backend.onrender.com/

# Test signup
curl -X POST https://calmprep-backend.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123","language":"english"}'
```

### Frontend Tests
1. Visit `https://calmprep-ai.vercel.app`
2. Sign up for a new account
3. Login
4. Upload a PDF
5. Test AI analysis
6. Try answer generation
7. Test premium features (if subscribed)

---

## 🎯 Part 6: Razorpay Production Setup

### Switch to Production Mode
1. Login to https://dashboard.razorpay.com
2. Toggle from "Test Mode" to "Live Mode"
3. Complete KYC verification (required for live payments)
4. Get production API keys:
   - Settings → API Keys → Generate Live Key
5. Update environment variables on Render with live keys

### Test Payment Flow
1. Go to your deployed app
2. Click "Upgrade to Premium"
3. Use **real payment details** (you can pay yourself)
4. Verify payment success
5. Check premium features unlock

---

## 🌐 Part 7: Custom Domain (Optional)

### For Vercel (Frontend)
1. Go to Vercel dashboard
2. Select your project
3. Settings → Domains
4. Add your domain (e.g., `calmprep.ai`)
5. Follow DNS configuration instructions

### For Render (Backend)
1. Render dashboard → your service
2. Settings → Custom Domain
3. Add domain (e.g., `api.calmprep.ai`)
4. Update DNS records

### Update Environment Variables
After adding custom domain:
- Frontend: Update backend URL in Vercel env vars
- Backend: Update CORS with new frontend domain

---

## 🔍 Troubleshooting

### Backend Issues

**"Cannot connect to MongoDB"**
- Check MongoDB Atlas whitelist (0.0.0.0/0)
- Verify connection string has correct password
- Check MongoDB Atlas cluster is running

**"Gemini API error"**
- Verify API key is correct
- Check Gemini API billing is enabled
- Ensure API key has proper permissions

**"Razorpay error"**
- Confirm using production keys in production
- Verify KYC is completed for live mode
- Check webhook configuration

### Frontend Issues

**"Failed to fetch from API"**
- Verify VITE_API_URL is correct
- Check backend CORS allows frontend domain
- Ensure backend is deployed and running

**"Blank page after deployment"**
- Check browser console for errors
- Verify environment variables are set
- Check build logs in Vercel

### Database Issues

**"MongoDB timeout"**
- Check Network Access in MongoDB Atlas
- Verify connection string format
- Try reconnecting from Render

---

## 📊 Monitoring & Maintenance

### Render Monitoring
- Check logs: Render Dashboard → Logs
- Monitor performance: Events tab
- Set up alerts for downtime

### Vercel Monitoring
- View deployment logs
- Analytics for traffic
- Error tracking in console

### Database Monitoring
- MongoDB Atlas → Metrics
- Check storage usage (free tier: 512MB)
- Monitor connection count

---

## 💰 Cost Implications

### Free Tier Limits
- **Render**: 750 hours/month (enough for 1 service)
- **Vercel**: Unlimited deployments, 100GB bandwidth
- **MongoDB Atlas**: 512MB storage
- **Gemini API**: Pay per request (~₹0.50/1000 tokens)

### When You'll Need to Pay
- High traffic (>100GB/month on Vercel)
- Database grows >512MB
- Heavy AI usage (track costs in Google Cloud Console)
- Need faster backend (Render paid plans start at $7/month)

---

## 🎉 You're Live!

Your CalmPrep AI is now deployed at:
- **Frontend**: https://calmprep-ai.vercel.app
- **Backend**: https://calmprep-backend.onrender.com

Share with students and start helping them prepare for exams! 🎓

---

## 📝 Quick Commands Reference

### Update Backend
```bash
cd backend
# Make changes
git add .
git commit -m "Update backend"
git push
# Render auto-deploys
```

### Update Frontend
```bash
cd frontend
# Make changes
git add .
git commit -m "Update frontend"
git push
# Vercel auto-deploys
```

### View Logs
- Render: https://dashboard.render.com → your service → Logs
- Vercel: https://vercel.com → your project → Deployments → View Logs

---

**Need help? Check the troubleshooting section above!** 🚀
