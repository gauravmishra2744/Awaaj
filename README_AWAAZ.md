# Awaaz - AI-Driven Civic Engagement Platform

## Overview
Awaaz is a comprehensive civic engagement platform designed to bridge the gap between citizens and government authorities. It features role-based access for Citizens, Officers, and Admins, powered by AI for issue classification, prioritization, and sentiment analysis.

## Key Features
- **Role-Based Access Control (RBAC)**:
  - **Citizen**: Report issues, track status, view dashboard.
  - **Officer**: View assigned issues, update status, view analytics.
  - **Admin**: Full system oversight, user management, high-level analytics.
- **AI Integration (Google Gemini)**:
  - Automatic issue classification (Roads, Water, etc.).
  - Priority scoring and SLA calculation.
  - Duplicate detection using embeddings.
- **Secure API**:
  - JWT Authentication.
  - CSRF Protection.
  - Secure File Uploads (Cloudinary).
- **Modern UI**:
  - React + Tailwind CSS.
  - Interactive Dashboards.
  - Responsive Design.

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas)
- Cloudinary Account (for file uploads)
- Google Gemini API Key (for AI features)

### 1. Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment Variables:
   - The `.env` file has been created. Ensure the following keys are set:
     - `PORT=5000`
     - `MONGODB_URI=mongodb://localhost:27017/awaaz_db` (or your Atlas URI)
     - `JWT_SECRET`
     - `GEMINI_API_KEY`
     - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

4. Start the Server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Navigate to the root directory (Civix-main):
   ```bash
   cd ..
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Development Server:
   ```bash
   npm run dev
   ```

## Usage Guide

### Reporting an Issue (Citizen)
1. Log in as a Citizen.
2. Navigate to "Report Issue".
3. Fill in the details (Title, Description, Location).
4. Upload an image (optional).
5. Submit. The AI will automatically classify and prioritize the issue.

### Managing Issues (Officer)
1. Log in as an Officer.
2. Go to the "Officer Dashboard".
3. View the list of issues.
4. Click "Resolve" to update the status of an issue.

### System Overview (Admin)
1. Log in as an Admin.
2. Go to the "Admin Dashboard".
3. View global statistics and manage all issues.

## Technical Details
- **Backend**: Node.js, Express, Mongoose.
- **Frontend**: React, Vite, Tailwind CSS.
- **AI**: Google Gemini Pro & Embedding-001.
- **Database**: MongoDB.

## Troubleshooting
- **Server Error**: Check if MongoDB is running.
- **AI Not Working**: Verify `GEMINI_API_KEY` in `backend/.env`.
- **Image Upload Failed**: Verify Cloudinary credentials.
