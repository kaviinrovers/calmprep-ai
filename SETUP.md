# ⚠️ IMPORTANT: Setup Instructions

Before running CalmPrep AI, you MUST complete these steps:

## 1️⃣ Install Node.js and npm

**CalmPrep AI requires Node.js to run.**

### For Windows:
1. Download Node.js from: https://nodejs.org/
2. Download the **LTS version** (recommended)
3. Run the installer and follow the prompts
4. Restart your computer after installation

### Verify Installation:
Open Command Prompt and run:
```bash
node --version
npm --version
```

You should see version numbers (e.g., v18.17.0 and 9.6.7)

---

## 2️⃣ Setup Supabase (Database)

CalmPrep AI uses **Supabase** (PostgreSQL) for data storage.

1. Go to https://supabase.com/ and sign in.
2. Create a new project.
3. Go to **Project Settings** -> **API**.
4. Copy the **Project URL** and **anon public key**.
5. Update `backend/.env` file:
   ```
   SUPABASE_URL=your_project_url
   SUPABASE_ANON_KEY=your_anon_key
   ```
6. Use the SQL editor in Supabase to run the database schema (if provided in `database_schema.sql`).

---

## 3️⃣ Get API Keys

### Google Gemini API (Required for AI Features)
1. Visit: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key
4. Add to `backend/.env`:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

### Razorpay (Required for Premium Payments)
1. Sign up at: https://razorpay.com/
2. Go to Settings → API Keys → Generate Test Key
3. Copy both Key ID and Key Secret
4. Add to `backend/.env`:
   ```
   RAZORPAY_KEY_ID=rzp_test_xxxxx
   RAZORPAY_KEY_SECRET=xxxxx
   ```
5. Add Key ID to `frontend/.env`:
   ```
   VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx
   ```

---

## 4️⃣ Install Dependencies

### Backend:
```bash
cd backend
npm install
```

### Frontend:
```bash
cd frontend
npm install
```

---

## 5️⃣ Create Environment Files

### Backend `.env`:
Create `backend/.env` with:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=some-random-secret-string
GEMINI_API_KEY=your_gemini_api_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### Frontend `.env`:
Create `frontend/.env` with:
```env
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

---

## 6️⃣ Run the Application

### Start Backend:
```bash
cd backend
npm run dev
```
✅ Backend running on http://localhost:5000

### Start Frontend (in new terminal):
```bash
cd frontend
npm run dev
```
✅ Frontend running on http://localhost:3000

---

## 🎉 You're Ready!

Open your browser and go to: **http://localhost:3000**

1. Sign up for an account
2. Upload a PDF
3. Start studying with AI!

---

## ❓ Troubleshooting

### "npm is not recognized"
- Node.js is not installed or not in PATH
- Solution: Install Node.js and restart your terminal

### "Failed to connect to MongoDB"
- MongoDB is not running or connection string is wrong
- Solution: Start MongoDB service or check MongoDB Atlas connection

### "AI analysis failed"
- Gemini API key is invalid or missing
- Solution: Double-check your GEMINI_API_KEY in .env

### "Payment not working"
- Razorpay keys are wrong or missing
- Solution: Verify both Key ID and Secret are correct

---

## 📧 Need Help?

If you encounter issues:
1. Check all environment variables are set
2. Ensure MongoDB is running
3. Verify API keys are valid
4. Check backend terminal for error messages
5. Check frontend console (F12) for errors

---

**Happy studying with CalmPrep AI! 🎓**
