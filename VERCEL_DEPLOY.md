# 🚀 Vercel Frontend Deployment Guide

## Step-by-Step Instructions:

### 1. Import Project
- Click "**Add New...**" (top right) → Select "**Project**"
- Look for `**calmprep-ai**` in your repository list
- Click "**Import**"

### 2. Configure Project Settings

**Framework Preset:**
```
Vite
```
(Should auto-detect)

**Root Directory:**
```
frontend
```
⚠️ **IMPORTANT**: Click "Edit" next to Root Directory and type `frontend`

**Build Command:**
```
npm run build
```
(Auto-filled)

**Output Directory:**
```
dist
```
(Auto-filled)

**Install Command:**
```
npm install
```
(Auto-filled)

### 3. Environment Variables

Click "**Environment Variables**" section and add:

**Variable 1:**
```
Name: VITE_API_URL
Value: https://calmprep-ai.onrender.com
```

**Variable 2:**
```
Name: VITE_RAZORPAY_KEY_ID
Value: rzp_test_your_razorpay_key_id
```
(Replace with your actual Razorpay test key)

### 4. Deploy!

- Click "**Deploy**" button
- Wait 2-3 minutes ⏳
- Your app will be live! 🎉

---

## 🎯 Your App URLs After Deployment:

- **Frontend**: `https://calmprep-ai.vercel.app` (or similar)
- **Backend**: `https://calmprep-ai.onrender.com`

---

## ✅ After Deployment - Test Your App!

1. Visit your Vercel URL
2. Sign up for a new account
3. Login
4. Upload a PDF
5. Check AI analysis
6. Generate answers

---

**Any issues? Let me know!** 🚀
