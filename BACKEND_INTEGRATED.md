# ✅ Backend URL Integrated!

## What I Did:

1. ✅ **Updated Frontend** (`frontend/.env`):
   ```
   VITE_API_URL=https://calmprep-ai.onrender.com
   ```

2. ✅ **Updated Backend CORS** (`backend/server.js`):
   - Added Vercel domain to allowed origins
   - Your backend will now accept requests from Vercel frontend

3. ✅ **Pushed to GitHub**:
   - Changes committed and pushed
   - Render will auto-redeploy backend with new CORS settings

---

## 🎯 Next Step: Deploy Frontend to Vercel

Now that your backend URL is configured, let's deploy the frontend:

1. **Go to Vercel**: https://vercel.com
2. **Sign in with GitHub**
3. **Import Project**: Find `calmprep-ai` repository
4. **Configure**:
   - Framework Preset: **Vite**
   - Root Directory: **frontend**
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. **Environment Variables** (Add these in Vercel):
   ```
   VITE_API_URL = https://calmprep-ai.onrender.com
   VITE_RAZORPAY_KEY_ID = your_razorpay_key_id
   ```

6. **Deploy!**

---

## 🔗 Your URLs:

- **Backend (Render)**: https://calmprep-ai.onrender.com
- **Frontend (Vercel)**: Will be like `https://calmprep-ai.vercel.app`

---

**Ready to deploy to Vercel?** Let me know when you're on the Vercel page!
