# ✅ Git Repository Ready!

Your code is now committed locally. Here are the next steps:

## Step 1: Create GitHub Repository

1. Go to: https://github.com/new
2. Repository name: `calmprep-ai`
3. Description: "AI-powered exam preparation platform"
4. Choose **Public** or **Private**
5. **DO NOT** check "Initialize with README" (we already have files)
6. Click **Create repository**

## Step 2: Push to GitHub

After creating the repository, GitHub will show you commands. Use these:

```powershell
# Run these commands in PowerShell:
cd "c:\Users\ELCOT\camprep ai"

# Add GitHub as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/calmprep-ai.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

**When prompted**, enter your GitHub credentials:
- Username: your GitHub username
- Password: use a **Personal Access Token** (not your password)

### How to get Personal Access Token:
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token → Select `repo` scope
3. Copy the token (save it somewhere!)
4. Use this as password when pushing

## Step 3: Verify on GitHub

- Go to `https://github.com/YOUR_USERNAME/calmprep-ai`
- You should see all 42 files!

## Step 4: Deploy Backend (Render)

1. Go to https://render.com
2. Sign up with GitHub
3. New + → Web Service
4. Connect `calmprep-ai` repository

**Configuration:**
- Name: `calmprep-backend`
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `node server.js`

**Environment Variables:**
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=super-secret-key-12345
GEMINI_API_KEY=your_gemini_api_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

5. Deploy! → Copy your backend URL

## Step 5: Deploy Frontend (Vercel)

1. Go to https://vercel.com
2. Sign up with GitHub
3. Import `calmprep-ai` repository

**Configuration:**
- Framework: Vite
- Root Directory: `frontend`

**Environment Variables:**
```
VITE_API_URL=https://your-backend-url.onrender.com
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

6. Deploy! → Your app is live!

---

## 🎉 Done!

Your app will be live at:
- Frontend: `https://calmprep-ai.vercel.app`
- Backend: `https://calmprep-backend.onrender.com`

See `DEPLOYMENT.md` for detailed instructions!
