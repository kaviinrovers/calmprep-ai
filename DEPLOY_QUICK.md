# 🚀 Quick Deploy Commands

## Step 1: Initialize Git Repository
```bash
cd "c:\Users\ELCOT\camprep ai"
git init
git add .
git commit -m "Initial commit - CalmPrep AI ready for deployment"
```

## Step 2: Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `calmprep-ai`
3. Set to Public or Private
4. Don't initialize with README (we already have files)
5. Click "Create repository"

## Step 3: Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/calmprep-ai.git
git branch -M main
git push -u origin main
```

## Step 4: Deploy Backend to Render
1. Go to https://render.com
2. Sign up/Login with GitHub
3. Click "New +" → "Web Service"
4. Connect `calmprep-ai` repository
5. Configure:
   - Name: `calmprep-backend`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `node server.js`
6. Add environment variables (see DEPLOYMENT.md)
7. Click "Create Web Service"
8. Copy your backend URL: `https://calmprep-backend.onrender.com`

## Step 5: Update Frontend Config
Edit `frontend/.env`:
```env
VITE_API_URL=https://calmprep-backend.onrender.com
VITE_RAZORPAY_KEY_ID=your_razorpay_key
```

Commit changes:
```bash
git add .
git commit -m "Update API URL for production"
git push
```

## Step 6: Deploy Frontend to Vercel
1. Go to https://vercel.com
2. Sign up/Login with GitHub
3. Click "Add New..." → "Project"
4. Import `calmprep-ai`
5. Configure:
   - Framework: Vite
   - Root Directory: `frontend`
6. Add environment variables
7. Deploy!

## Step 7: Test Your App
Visit your Vercel URL and test:
- Sign up
- Login
- Upload PDF
- Generate answers
- Check payments

## 🎉 Done!
Your app is live!

---

**For detailed instructions, see DEPLOYMENT.md**
