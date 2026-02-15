# 🔧 Render Environment Variables - Copy and Paste

Add these **6 environment variables** on the Render page:

---

## 1. PORT
```
NAME_OF_VARIABLE: PORT
value: 5000
```

---

## 2. MONGODB_URI
```
NAME_OF_VARIABLE: MONGODB_URI
value: mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/calmprep
```
⚠️ **IMPORTANT**: You need to create MongoDB Atlas database first!
- If you haven't: https://www.mongodb.com/cloud/atlas → Create FREE cluster
- Get connection string and replace above

---

## 3. JWT_SECRET
```
NAME_OF_VARIABLE: JWT_SECRET
value: calmprep-super-secret-jwt-key-production-2026
```

---

## 4. GEMINI_API_KEY
```
NAME_OF_VARIABLE: GEMINI_API_KEY
value: YOUR_GEMINI_API_KEY
```
⚠️ Get from: https://makersuite.google.com/app/apikey

---

## 5. RAZORPAY_KEY_ID
```
NAME_OF_VARIABLE: RAZORPAY_KEY_ID
value: rzp_test_YOUR_KEY_ID
```
⚠️ Get from: https://dashboard.razorpay.com (Settings → API Keys)
💡 Use **test** keys for now, switch to **live** keys after testing

---

## 6. RAZORPAY_KEY_SECRET
```
NAME_OF_VARIABLE: RAZORPAY_KEY_SECRET
value: YOUR_RAZORPAY_SECRET
```

---

## ✅ After Adding All Variables

Click **"Deploy Web Service"** button at the bottom!

⏳ Deployment will take 5-10 minutes
🎉 You'll get a URL like: `https://calmprep-backend.onrender.com`

---

## 🚨 Don't Have API Keys Yet?

### Quick Setup:

**MongoDB Atlas (Required - 2 minutes):**
1. Go to https://mongodb.com/cloud/atlas
2. Sign up → Create FREE M0 cluster
3. Database Access → Add user with password
4. Network Access → Allow 0.0.0.0/0
5. Get connection string

**Gemini API (Required - 1 minute):**
1. https://makersuite.google.com/app/apikey
2. Create API Key → Copy it

**Razorpay (Required - 3 minutes):**
1. https://razorpay.com → Sign up
2. Dashboard → Settings → API Keys
3. Generate Test Key → Copy both Key ID and Secret

---

## 📋 Deployment Checklist

- [ ] All 6 environment variables added
- [ ] MongoDB Atlas cluster created
- [ ] Gemini API key obtained
- [ ] Razorpay test keys obtained
- [ ] Clicked "Deploy Web Service"
- [ ] Waited for deployment (green checkmark)
- [ ] Copied backend URL for frontend setup

---

**Need help getting API keys? Let me know which one!**
