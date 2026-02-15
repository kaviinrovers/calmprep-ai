# 🎓 CalmPrep AI - Stress-Free Exam Preparation Platform

A complete AI-powered exam preparation platform designed for college students, featuring PDF analysis, question prediction, voice assistant, and honest study monitoring.

## 🌐 Live Application

- **🚀 Frontend**: https://calmprep-ai.vercel.app
- **⚙️ API Backend**: https://calmprep-ai.onrender.com
- **📦 GitHub**: https://github.com/kaviinrovers/calmprep-ai

**Try it now!** Visit the live app and start preparing for your exams stress-free!

---

## ✨ Features

### 📚 **Core Features (Free)**
- **PDF Upload & Analysis**: Upload syllabus/notes and get unit-wise AI analysis
- **Important Topics Highlighting**: AI identifies high/medium/low priority topics
- **Question Prediction**: Predicts 2-mark, 5-mark, and 10-mark exam questions
- **Marks-Wise Study Guidance**: Detailed instructions for each question type
- **Answer Generation**: AI generates exam-ready answers in your preferred language
- **Multi-Language Support**: English, Tamil, and Mixed (Tanglish)
- **Study Progress Tracking**: Track sessions, time spent, and completion percentage

### ⭐ **Premium Features (₹99/month)**
- **Voice Assistant**: Talk to AI tutor for explanations and guidance  
- **Viva Practice Mode**: AI conducts oral exams to test understanding
- **Study Monitoring**: Gentle focus reminders via camera (non-punitive)
- **Advanced Analytics**: Detailed exam-readiness predictions

---

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js**
- **MongoDB** for data storage
- **JWT Authentication**
- **Google Gemini AI** for content analysis
- **PDF-Parse** for PDF text extraction
- **Razorpay** for payment integration

### Frontend
- **React.js** with **Vite**
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **Web Speech API** for voice features

---

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/calmprep
JWT_SECRET=your-super-secret-jwt-key
GEMINI_API_KEY=your-gemini-api-key
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

4. Start MongoDB (if local):
```bash
mongod
```

5. Run the backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id
```

4. Run the frontend:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

---

## 🔑 API Keys Setup

### Google Gemini API
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add to `.env` as `GEMINI_API_KEY`

### Razorpay
1. Sign up at [Razorpay](https://razorpay.com/)
2. Get test API keys from Dashboard
3. Add to `.env`:
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`

---

## 📖 Usage Guide

### 1. **Sign Up**
- Create an account with name, email, and password
- Select your preferred language (English/Tamil/Mixed)

### 2. **Upload PDF**
- Login and go to Study tab
- Drag and drop your PDF or click to upload
- Wait for AI analysis (1-2 minutes)

### 3. **Study with AI**
- Browse units and important topics
- View predicted exam questions
- Generate answers for any question
- Study with marks-wise guidance

### 4. **Track Progress**
- Go to Progress tab
- See overall statistics
- Check exam-readiness status
- Review past study sessions

### 5. **Premium Voice Assistant**
- Upgrade to Premium (₹99/month)
- Grant microphone permissions
- Talk to AI tutor verbally
- Practice viva mode for oral exams

---

## 🎨 Design Philosophy

CalmPrep AI follows a **calm, student-friendly** design:
- 🎨 Soft gradient backgrounds (blue → indigo → purple)
- 💙 Primary color: Calm Blue (`#3B82F6`)
- ✨ Smooth animations and transitions
- 🌈 Color-coded importance levels
- 📱 Fully responsive design

---

## 🔒 Security

- **JWT Authentication** for secure sessions
- **Password hashing** with bcrypt
- **Environment variables** for sensitive data
- **Razorpay signature verification** for payments
- **CORS protection** on API

---

## 🚀 Deployment

### Backend (Render/Railway)
```bash
# Build command
npm install

# Start command
npm start
```

### Frontend (Vercel/Netlify)
```bash
# Build command
npm run build

# Output directory
dist
```

### Environment Variables
Remember to set all environment variables in your deployment platform.

---

## 📄 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### PDF Management
- `POST /api/pdf/upload` - Upload PDF
- `POST /api/pdf/analyze/:id` - Analyze PDF with AI
- `GET /api/pdf/list` - Get all user PDFs
- `GET /api/pdf/:id/units` - Get unit-wise analysis

### Questions
- `POST /api/questions/answer` - Generate answer
- `POST /api/questions/explain` - Explain answer

### Voice (Premium)
- `POST /api/voice/respond` - Get voice response
- `POST /api/voice/viva` - Start viva session

### Progress
- `POST /api/progress/session` - Save study session
- `GET /api/progress/history` - Get session history
- `GET /api/progress/summary` - Get overall summary

### Payment
- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify` - Verify payment
- `GET /api/payment/status` - Check premium status

---

## 🤝 Contributing

This is a complete production-ready application. Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

---

## 📞 Support

For issues or questions:
- Check the documentation above
- Review API error messages
- Ensure all environment variables are set correctly

---

## 📜 License

MIT License - feel free to use for your projects!

---

## 🎯 Roadmap

Future enhancements:
- [ ] Mobile app (React Native)
- [ ] Offline mode for notes
- [ ] Collaborative study groups
- [ ] Flashcard generation
- [ ] Mock test creation
- [ ] Performance analytics dashboard

---

**Built with ❤️ for honest, stress-free exam preparation**
