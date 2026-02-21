# 🚀 CalmPrep AI - Full Deployment Guide

This guide ensures a smooth deployment of the full CalmPrep AI stack using **Supabase** (Database), **Render** (Backend), and **Vercel** (Frontend).

## 📋 Prerequisites
- [ ] [Supabase Account](https://supabase.com/)
- [ ] [Render Account](https://render.com/)
- [ ] [Vercel Account](https://vercel.com/)
- [ ] OpenAI API Key
- [ ] Razorpay API Keys (Live Mode)

---

## 🗄️ Step 1: Database (Supabase)
1. Create a new project in Supabase.
2. Go to **SQL Editor** in the Supabase Dashboard.
3. Open `database_schema.sql` from your project root.
4. Copy-paste the entire content into the SQL Editor and click **Run**.
5. Go to **Project Settings** -> **API** to find your `URL` and `anon public` key.

---

## 🔧 Step 2: Backend (Render)
1. In Render, click **New +** -> **Web Service**.
2. Connect your `calmprep-ai` GitHub repository.
3. Configure:
   - **Name**: `calmprep-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. **Environment Variables**:
   Add these under **Advanced**:
   - `PORT`: `5000`
   - `SUPABASE_URL`: (Your Supabase URL)
   - `SUPABASE_ANON_KEY`: (Your Supabase Anon Key)
   - `OPENAI_API_KEY`: (Your OpenAI Key)
   - `RAZORPAY_KEY_ID`: (Your Razorpay Key)
   - `RAZORPAY_KEY_SECRET`: (Your Razorpay Secret)
   - `JWT_SECRET`: (A secure random string)
5. **Deploy**: Render will build and deploy. Once finished, copy the **onrender.com** URL.

---

## 🎨 Step 3: Frontend (Vercel)
1. In Vercel, click **Add New...** -> **Project**.
2. Import your `calmprep-ai` GitHub repository.
3. Configure:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
4. **Environment Variables**:
   - `VITE_API_URL`: (Your Render Backend URL)
   - `VITE_RAZORPAY_KEY_ID`: (Your Razorpay Key)
5. **Deploy**: Vercel will build and host your frontend.

---

## ✅ Step 4: Verification
1. Visit your Vercel URL.
2. Sign up for a new account.
3. Upload a PDF for analysis.
4. Verify AI generation and premium features work correctly.

---

## 🔍 Troubleshooting
- **CORS Error**: Ensure your Vercel domain ends in `.vercel.app`, as the backend is configured to allow these automatically.
- **Database Error**: Check if SQL schema was executed correctly in Supabase.
- **API Error**: Verify all environment variables on Render are typed correctly without spaces.
