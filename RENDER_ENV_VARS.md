# 🔑 Render Environment Variables - Complete Configuration

**Add these to your Render backend service:**

Go to: https://dashboard.render.com → `calmprep-ai` → Environment tab

---

## Environment Variables to Add:

### 1. PORT
```
Name: PORT
Value: 5000
```

### 2. MONGODB_URI
```
Name: MONGODB_URI
Value: mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/calmprep
```
⚠️ **You need to create MongoDB Atlas first!** See instructions below.

### 3. JWT_SECRET
```
Name: JWT_SECRET
Value: calmprep-super-secret-jwt-production-2026
```

### 4. GEMINI_API_KEY ✅
```
Name: GEMINI_API_KEY
Value: AIzaSyAo5e9JZ5NJ9D-jlVwF7Ql1A4XGt7jwo2I
```
✅ **This is your API key - ready to use!**

### 5. RAZORPAY_KEY_ID
```
Name: RAZORPAY_KEY_ID
Value: rzp_test_your_key_id
```
⚠️ Get from: https://dashboard.razorpay.com → Settings → API Keys

### 6. RAZORPAY_KEY_SECRET
```
Name: RAZORPAY_KEY_SECRET
Value: your_razorpay_secret
```

---

## 🗄️ MongoDB Atlas Setup (Required!)

**You MUST set up MongoDB for signup to work:**

1. **Create Account**: https://www.mongodb.com/cloud/atlas
2. **Create FREE Cluster** (M0 tier)
3. **Database Access** → Add User:
   - Username: `calmprep`
   - Password: (create a strong one, e.g., `CalmPrep2026!`)
4. **Network Access** → Add IP:
   - Click "Allow Access from Anywhere"
   - IP: `0.0.0.0/0`
5. **Get Connection String**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy string, replace `<password>` with your password
   - Example: `mongodb+srv://calmprep:CalmPrep2026!@cluster0.xxxxx.mongodb.net/calmprep`

---

## 💳 Razorpay Setup (For Payments)

1. Visit: https://razorpay.com
2. Sign up / Login
3. Go to Settings → API Keys
4. Generate **Test Key**
5. Copy both Key ID and Secret

---

## ✅ After Adding All Variables

1. Click "**Save Changes**" in Render
2. Render will automatically redeploy (5 minutes)
3. Check logs: Should see "✅ MongoDB Connected"
4. Try signup again - **it will work!**

---

## Current Status:

- ✅ **PORT**: Ready
- ✅ **JWT_SECRET**: Ready
- ✅ **GEMINI_API_KEY**: Ready ✨
- ⚠️ **MONGODB_URI**: Need to create
- ⚠️ **RAZORPAY_KEY_ID**: Need to get
- ⚠️ **RAZORPAY_KEY_SECRET**: Need to get

**Priority**: Set up **MongoDB Atlas** first - this is blocking signup!
