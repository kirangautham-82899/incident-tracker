# 🚨 Real-Time Incident Reporting Platform

A production-ready web application for real-time emergency incident reporting and resource coordination. Built to reduce response time and improve coordination between citizens and emergency responders.

## 📸 Current Status - Phase 1 Complete!

✅ Frontend (React + Vite + TailwindCSS) - Running  
✅ Backend (Node.js + Express + Socket.IO) - Running  
✅ Project Structure - Complete  
✅ Development Environment - Ready  

**Frontend**: http://localhost:5173  
**Backend API**: http://localhost:5000  

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool (blazing fast!)
- **TailwindCSS** - Utility-first styling
- **Socket.IO Client** - Real-time updates
- **Axios** - HTTP client
- **Zustand** - State management
- **Lucide React** - Beautiful icons
- **React Router** - Navigation (coming in Phase 3)

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **Socket.IO** - WebSocket server
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File uploads
- **Cloudinary** - Media storage

### Database & Deployment (Coming Soon)
- **MongoDB Atlas** - Cloud database (Free tier)
- **Vercel** - Frontend hosting (Free)
- **Render** - Backend hosting (Free)

---

## 📁 Project Structure

```
incident-tracker/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # React components (coming Phase 3)
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom hooks
│   │   ├── stores/          # Zustand stores
│   │   ├── utils/           # Utilities
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   ├── public/              # Static assets
│   └── package.json
│
├── backend/                  # Express backend
│   ├── src/
│   │   ├── config/          # Configuration files (Phase 2)
│   │   ├── models/          # Database models (Phase 2)
│   │   ├── routes/          # API routes (Phase 2)
│   │   ├── middleware/      # Express middleware (Phase 2)
│   │   ├── controllers/     # Route controllers (Phase 2)
│   │   ├── services/        # Business logic (Phase 2)
│   │   ├── socket/          # Socket.IO handlers (Phase 4)
│   │   └── server.js        # Entry point ✓
│   ├── .env                 # Environment variables ✓
│   └── package.json         # ✓
│
└── README.md                # This file
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation & Running

#### 1. Backend Setup
```bash
cd backend
npm install
npm run dev
```
Server will start at `http://localhost:5000`

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
App will start at `http://localhost:5173`

---

## 📋 Development Phases

### ✅ Phase 1: Project Setup (COMPLETED)
- [x] Initialize React + Vite frontend
- [x] Initialize Express backend
- [x] Install all dependencies
- [x] Configure TailwindCSS
- [x] Setup Socket.IO
- [x] Create basic project structure

### 🔄 Phase 2: Backend Core (NEXT)
- [ ] Connect to MongoDB Atlas
- [ ] Create database models (Incident, User, Comment)
- [ ] Build REST API endpoints
- [ ] Add authentication middleware
- [ ] Implement error handling

### ⏳ Phase 3: Frontend Core
- [ ] Create incident reporting form
- [ ] Build incident feed/list
- [ ] Design beautiful UI components
- [ ] Connect to backend API

### ⏳ Phase 4: Real-Time Features
- [ ] Integrate Socket.IO real-time updates
- [ ] Live incident notifications
- [ ] Real-time feed updates

### ⏳ Phase 5: Map Integration
- [ ] Add Leaflet map component
- [ ] Implement location picker
- [ ] Show incident markers
- [ ] GPS location detection

### ⏳ Phase 6: Admin Dashboard
- [ ] Admin authentication
- [ ] Incident management interface
- [ ] Analytics dashboard
- [ ] Status update controls

### ⏳ Phase 7-10: Advanced Features & Deployment
- [ ] Verification & de-duplication
- [ ] Comments system
- [ ] Analytics & insights
- [ ] Deploy to production

---

## 🎯 Core Features (Planned)

### For Citizens
- 📸 Report incidents with photos/videos
- 📍 GPS location detection
- 🗺️ View incidents on interactive map
- 👍 Verify/upvote incidents
- 💬 Comment on incidents
- 🔔 Real-time notifications

### For Responders/Admins
- 📊 Analytics dashboard
- ⚡ Priority-based incident queue
- ✅ Status management (verified → in-progress → resolved)
- 📝 Internal notes
- 👥 Incident assignment
- 📈 Response time metrics
- 🌡️ Heat map visualization

### System Features
- ⚡ Real-time updates (Socket.IO)
- 🔍 Duplicate detection
- 🎯 Smart prioritization
- 🔐 User authentication
- 📱 Mobile responsive
- 🌙 Dark mode (coming soon)

---

## 🌐 API Endpoints (Phase 1)

### Health Check
```
GET /              → API welcome message
GET /api/health    → Detailed health status
```

**More endpoints coming in Phase 2!**

---

## 🔧 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/incident-tracker
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:5173
```

---

## 📝 Available Scripts

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Backend
```bash
npm run dev      # Start with auto-reload
npm start        # Start production server
```

---

## 🎨 Design Philosophy

- **Beautiful UI**: Modern, gradient-based design with smooth animations
- **User-Friendly**: Intuitive interfaces for both citizens and responders
- **Fast**: Optimized performance with Vite and efficient state management
- **Reliable**: Proper error handling and validation
- **Scalable**: Clean architecture ready for growth

---

## 📚 What's Next?

**Phase 2 will include:**
1. MongoDB Atlas database connection
2. Complete REST API with all CRUD operations
3. User authentication with JWT
4. Database models and validation

---

## 👨‍💻 Development Notes

### Current Servers:
- **Frontend Dev Server**: http://localhost:5173 (Vite with HMR)
- **Backend API Server**: http://localhost:5000 (Express with auto-reload)
- **WebSocket Server**: Ready on backend

### Tech Decisions:
- ✅ **Vite over CRA**: Much faster builds and HMR
- ✅ **Zustand over Redux**: Simpler state management
- ✅ **TailwindCSS**: Rapid UI development
- ✅ **Socket.IO**: Best WebSocket library
- ✅ **MongoDB**: Flexible schema for incident data

---

## 🤝 Contributing

This is a hackathon project. More documentation will be added as development progresses.

---

## 📄 License

MIT License

---

**Built with ❤️ for emergency response and public safety**
