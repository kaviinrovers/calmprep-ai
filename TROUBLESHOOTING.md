# 🔧 Troubleshooting: Signup Failed Error

## Problem
Getting "Signup failed. Please try again." error when trying to create an account.

## Most Likely Cause
**Backend environment variables are not configured on Render.**

---

## ✅ Quick Fix Steps

### Step 1: Check Render Backend Logs
1. Go to https://dashboard.render.com
2. Click on your `calmprep-ai` service
3. Click "**Logs**" tab (left sidebar)
4. Look for errors - you'll likely see:
   - `MongoDB connection error`
   - `MongooseError: URI must be a string`
   - Or other database/environment errors

### Step 2: Add Environment Variables to Render

**CRITICAL**: You need to add these 6 environment variables:

1. Go to Render Dashboard → `calmprep-ai` service
2. Click "**Environment**" tab (left sidebar)
3. Add these variables:

```
PORT = 5000

MONGODB_URI = mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/calmprep
(⚠️ You need MongoDB Atlas - see below)

JWT_SECRET = calmprep-super-secret-jwt-production-2026

GEMINI_API_KEY = your_gemini_api_key_here
(⚠️ Get from https://makersuite.google.com/app/apikey)

RAZORPAY_KEY_ID = rzp_test_your_key_id
(⚠️ Get from https://dashboard.razorpay.com)

RAZORPAY_KEY_SECRET = your_razorpay_secret
```

4. After adding all variables, click "**Save Changes**"
5. Render will **auto-redeploy** (takes 5 minutes)

---

## 🗄️ Step 3: Setup MongoDB Atlas (REQUIRED)

**If you don't have MongoDB yet:**

1. **Create Free Account**: https://www.mongodb.com/cloud/atlas
2. **Create Cluster**: 
   - Choose FREE M0 tier
   - Any cloud provider/region
3. **Create Database User**:
   - Database Access → Add New User
   - Username: `calmprep_admin`
   - Password: (generate and save it!)
4. **Allow Network Access**:
   - Network Access → Add IP Address
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
5. **Get Connection String**:
   - Clusters → Connect → Connect your application
   - Copy the string: `mongodb+srv://calmprep_admin:PASSWORD@cluster0.xxxxx.mongodb.net/calmprep`
   - Replace `<password>` with your database password
   - Add this to Render as `MONGODB_URI`

---

## 🔑 Step 4: Get Other API Keys

### Gemini API (Required for AI)
1. Visit: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy and add to Render as `GEMINI_API_KEY`

### Razorpay (Required for Payments)
1. Visit: https://dashboard.razorpay.com
2. Sign up / Login
3. Settings → API Keys → Generate Test Key
4. Copy **Key ID** and **Key Secret**
5. Add both to Render

---

## ✅ After Configuration

1. **Wait 5 minutes** for Render to redeploy
2. **Check logs** - should see:
   ```
   ✨ CalmPrep AI Backend Running
   📡 Server: http://localhost:5000
   ✅ MongoDB Connected
   ```
3. **Try signup again** - should work!

---

## 🚨 Still Not Working?

### Check Backend Status
Visit: https://calmprep-ai.onrender.com

**If you see the welcome message**, backend is running but needs env vars.

**If you see error**, check Render logs for specific error.

### Common Errors in Logs

**"MongooseError"**: MongoDB URI not set → Add MONGODB_URI

**"Cannot find module"**: Dependencies issue → Render should auto-fix on deploy

**"Port already in use"**: Ignore - Render assigns port automatically

**"CORS error in browser console"**: Frontend can't reach backend → Check URL in frontend/.env

---

## 📝 Quick Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with password
- [ ] Network access allows 0.0.0.0/0
- [ ] Connection string copied
- [ ] All 6 env vars added to Render
- [ ] Render redeployed (wait 5 min)
- [ ] Backend logs show "MongoDB Connected"
- [ ] Try signup again

---

**Need help with any of these steps? Let me know which part you're stuck on!**
