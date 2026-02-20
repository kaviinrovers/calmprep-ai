# CalmPrep - Smart Exam Preparation

CalmPrep is an AI-powered exam preparation assistant that helps students study smarter, not harder.

## 🚀 Recent Updates

-   **Frontend Redesign**: "CalmPrep AI" is now simply "**CalmPrep**", with a cleaner, more human-centric 3D design.
-   **AI Migration**: Switched from Google Gemini to **OpenAI GPT-4** for better analysis and reasoning.
-   **Database Migration**: Switched from MongoDB to **Supabase (PostgreSQL)** for robust, scalable data management.

## ✨ Features

-   **Smart PDF Analysis**: Upload syllabus or textbooks for unit-wise breakdown.
-   **Exam Prediction**: Get predicted 2-mark, 5-mark, and 10-mark questions.
-   **Voice Tutor**: Practice viva and get explanations via voice.
-   **Progress Tracking**: Monitor your study sessions and exam readiness.
-   **Premium Access**: Unlock advanced features with Razorpay integration.

## 🛠️ Tech Stack

-   **Frontend**: React + Vite + Tailwind CSS
-   **Backend**: Node.js + Express
-   **Database**: Supabase (PostgreSQL)
-   **AI**: OpenAI GPT-4 & GPT-3.5 Turbo
-   **Deployment**: Vercel (Frontend) + Render (Backend)

## 📦 Deployment Instructions

### Backend (Render)

1.  Connect repository to Render.
2.  Set Build Command: `npm install`
3.  Set Start Command: `node server.js`
4.  **Environment Variables**:
    -   `OPENAI_API_KEY`: Your OpenAI Key
    -   `SUPABASE_URL`: Your Supabase Project URL
    -   `SUPABASE_ANON_KEY`: Your Supabase Anon Key
    -   `JWT_SECRET`: A secure secret key
    -   `RAZORPAY_KEY_ID`: Your Key ID
    -   `RAZORPAY_KEY_SECRET`: Your Key Secret

### Frontend (Vercel)

1.  Connect repository to Vercel.
2.  Set Root Directory: `frontend`
3.  **Environment Variables**:
    -   `VITE_API_URL`: URL of your deployed Render backend (e.g., `https://calmprep-backend.onrender.com`)

## 🏃‍♂️ Local Development

1.  **Backend**:
    ```bash
    cd backend
    npm install
    npm start
    ```

2.  **Frontend**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
