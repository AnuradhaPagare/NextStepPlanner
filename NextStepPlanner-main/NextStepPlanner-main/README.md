# NextStep Planner

A comprehensive productivity application with task management, pomodoro timer, mood tracking, and resume ATS scoring.

## 🛠️ Local Setup Guide

Follow these steps to clone and run the project locally:

### 1. Prerequisites

- **Node.js** (v16 or higher)
- **npm** (comes with Node.js)
- **MongoDB Atlas** account (or local MongoDB for advanced users)
- **Git** (to clone the repository)

### 2. Clone the Repository

```bash
git clone https://github.com/Akshay-Vinod-Jha/NextStepPlanner.git
cd NextStepPlanner/nestedproject1
```

### 3. Backend Setup

#### a. Go to the backend folder

```bash
cd backend
```

#### b. Install dependencies

```bash
npm install
```

#### c. Create a `.env` file

Create a file named `.env` in the `backend` folder with the following content:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

- **MONGODB_URI**: Get this from your MongoDB Atlas dashboard (example: `mongodb+srv://username:password@cluster.mongodb.net/nextstep-planner?retryWrites=true&w=majority`)
- **JWT_SECRET**: Any random string (used for authentication)
- **PORT**: Usually `5000` (default)

#### d. Start the backend server

```bash
npm start
```

The backend API will run at: [http://localhost:5000](http://localhost:5000)

### 4. Frontend Setup

#### a. Go to the frontend folder

```bash
cd ../frontend
```

#### b. Install dependencies

```bash
npm install
```

#### c. Create a `.env` file

Create a file named `.env` in the `frontend` folder with the following content:

```env
VITE_API_URL=http://localhost:5000/api
```

This tells the frontend where to find the backend API.

#### d. Start the frontend development server

```bash
npm run dev
```

The frontend will run at: [http://localhost:5173](http://localhost:5173)

### 5. Project Structure

```
nestedproject1/
├── backend/           # Express.js API server
│   ├── src/
│   │   ├── models/    # MongoDB models
│   │   ├── routes/    # API routes
│   │   └── server.js  # Main server file
│   ├── package.json
│   └── .env          # Create this file
├── frontend/          # React + Vite application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── api/
│   ├── package.json
│   └── .env          # Create this file
└── README.md
```

### 6. Environment Variables Examples

#### Backend `.env` example

```env
MONGODB_URI=mongodb+srv://yourusername:yourpassword@yourcluster.mongodb.net/nextstep-planner?retryWrites=true&w=majority
JWT_SECRET=supersecretkey123
PORT=5000
```

#### Frontend `.env` example

```env
VITE_API_URL=http://localhost:5000/api
```

### 7. How to Use

1. Open [http://localhost:5173](http://localhost:5173) in your browser
2. Register a new user or log in
3. Use all features: tasks, pomodoro timer, mood tracking, and resume ATS scoring

### 8. Troubleshooting

#### 🚨 **CORS Error - "Access to XMLHttpRequest has been blocked by CORS policy"**

**Problem:** Frontend can't connect to backend API

```
Access to XMLHttpRequest at 'http://localhost:5000/api/auth/signup' from origin 'http://localhost:5175' has been blocked by CORS policy
```

**Solution:** The backend is already configured to accept **any localhost port**. Just restart both servers:

```bash
# Terminal 1: Restart Backend
cd backend
npm start

# Terminal 2: Restart Frontend
cd frontend
npm run dev
```

**Note:** Vite may use different ports (5173, 5174, 5175, etc.) - this is normal and supported.

#### 🔍 **Common Issues & Solutions**

**1. Backend won't start - "ENOENT: no such file or directory, open package.json"**

```bash
# Make sure you're in the right directory
cd backend  # Not the root folder!
npm install
npm start
```

**2. Frontend shows "Network Error" or "ERR_CONNECTION_REFUSED"**

- ✅ Check backend is running at `http://localhost:5000`
- ✅ Verify `.env` file exists in frontend folder with `VITE_API_URL=http://localhost:5000/api`
- ✅ Restart both servers

**3. MongoDB connection error**

```bash
# Check your backend .env file has correct MongoDB URI
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nextstep-planner?retryWrites=true&w=majority
```

- ✅ Verify MongoDB Atlas cluster is running
- ✅ Check username/password are correct
- ✅ Whitelist your IP in MongoDB Atlas Network Access

**4. "JWT must be provided" or authentication errors**

```bash
# Check your backend .env file has JWT_SECRET
JWT_SECRET=your-secret-key-here
```

**5. Frontend build/dev server issues**

```bash
# Clear node_modules and reinstall
cd frontend
rm -rf node_modules package-lock.json  # or del /s node_modules on Windows
npm install
npm run dev
```

#### 💡 **Development Tips**

- **Both servers must be running simultaneously** for the app to work
- **Frontend auto-refreshes** when you make changes
- **Backend needs restart** when you change server.js or .env files
- **Check browser console** for detailed error messages
- **Use `http://localhost:5000/api/health`** to test if backend is responding

#### 🌐 **Port Information**

- **Backend API:** Always runs on `http://localhost:5000`
- **Frontend:** Usually `http://localhost:5173` but Vite may choose different ports (5174, 5175, etc.)
- **MongoDB:** Cloud-hosted on MongoDB Atlas (no local port needed)

#### 📞 **Still Having Issues?**

1. **Check both terminals** are showing servers running without errors
2. **Verify .env files** exist in both backend/ and frontend/ folders
3. **Test API directly** by visiting `http://localhost:5000` in browser
4. **Clear browser cache** and try again
5. **Check MongoDB Atlas** dashboard shows cluster is active

### 9. Quick Start Summary

1. **Clone the repo**
2. **Install dependencies** in both `backend/` and `frontend/` folders
3. **Add `.env` files** with correct values in both folders
4. **Start backend server**: `cd backend && npm start`
5. **Start frontend server**: `cd frontend && npm run dev`
6. **Access the app** at [http://localhost:5173](http://localhost:5173)

## 🌟 Features

- ✅ **Task Management** - Create, edit, delete tasks with priorities
- ⏲️ **Pomodoro Timer** - Focus sessions with break intervals
- 😊 **Mood Tracking** - Daily mood logging with analytics
- 📄 **Resume ATS Scoring** - AI-powered resume analysis

## 🛠️ Tech Stack

**Frontend:**

- React 18
- Vite
- Tailwind CSS
- Axios

**Backend:**

- Node.js
- Express.js
- MongoDB
- JWT Authentication

## 📊 API Endpoints

- `GET /` - Server info
- `GET /api/health` - Health check
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/tasks` - Get user tasks
- `GET /api/pomodoro` - Pomodoro sessions
- `GET /api/mood` - Mood entries
- `POST /api/resume` - Resume analysis

---

Built with ❤️ using React, Node.js, and MongoDB
