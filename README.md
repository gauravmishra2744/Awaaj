# Awaaz - AI-Driven Civic Feedback & Engagement Platform

Awaaz is a comprehensive full-stack platform designed to bridge the gap between citizens and authorities. It leverages AI to streamline civic issue reporting, classification, and resolution.

## 🚀 Features

### 🧑‍🤝‍🧑 Citizen
- **Smart Reporting**: AI-powered issue summarization, categorization, and priority detection.
- **Multimedia Support**: Upload images, videos, and audio (with speech-to-text).
- **Real-time Updates**: Track issue status and receive notifications.
- **Gamification**: Earn points and badges for active participation.
- **Community**: Upvote and comment on nearby issues.
- **Multilingual**: Support for English, Hindi, and Odia.

### 👮 Officer/Authority
- **Dashboard**: View assigned issues, filtered by zone and priority.
- **AI Insights**: Hotspot detection and clustering of similar issues.
- **Field Tools**: Update status, add resolution photos, and notes.

### 🛡️ Admin
- **Management**: Manage users, officers, and departments.
- **Analytics**: Global heatmaps, performance reports, and trend analysis.
- **Control**: Block spam and manage system settings.

## 🛠️ Tech Stack

- **Frontend**: React, Tailwind CSS, Framer Motion, Lucide React
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **AI**: Google Gemini API (Generative AI & Embeddings)
- **Auth**: JWT (JSON Web Tokens) & Clerk (Optional)
- **Storage**: Cloudinary (Images/Videos)

## 📂 Project Structure

```
Awaaz/
├── backend/                 # Node.js/Express Backend
│   ├── config/             # DB & Swagger Config
│   ├── controllers/        # Route Controllers
│   ├── middlewares/        # Auth, AI, Upload Middlewares
│   ├── models/             # Mongoose Schemas (User, Issue)
│   ├── routes/             # API Routes
│   └── server.js           # Entry Point
├── src/                    # React Frontend
│   ├── components/         # Reusable Components
│   ├── Pages/              # Application Pages
│   ├── assets/             # Static Assets
│   └── App.jsx             # Main Component
└── public/                 # Public Assets
```

## ⚡ Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Cloudinary Account
- Google Gemini API Key

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/awaaz
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
DOMAIN_NAME=gov.in
```

Run the server:
```bash
npm run dev
```

### 2. Frontend Setup

```bash
# In the root directory (or src parent)
npm install
```

Create a `.env` file in root:
```env
VITE_API_URL=http://localhost:5000/api
```

Run the frontend:
```bash
npm start
# or
npm run dev
```

## 📚 API Documentation

The backend includes Swagger documentation.
Access it at: `http://localhost:5000/api-docs`

### Key Endpoints

- **Auth**: `/api/auth/signup`, `/api/auth/login`
- **Issues**: 
  - `POST /api/issues` (Report issue)
  - `GET /api/issues` (List issues)
  - `PATCH /api/issues/:id/status` (Update status)
- **AI**:
  - `/api/ai/classify`
  - `/api/ai/summarize`

## 🗄️ Database Schema

### User
- `username`, `email`, `password`, `role` (citizen, officer, admin)
- `points`, `badges`

### Issue
- `title`, `description`, `location` (GeoJSON)
- `category`, `priority` (AI assigned)
- `status` (Pending, In Progress, Resolved)
- `media` (Image/Video URLs)
- `aiAnalysis` (Summary, Sentiment)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Open a Pull Request

---
Built for a better tomorrow. 🇮🇳
