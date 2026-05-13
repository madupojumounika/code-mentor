## 🚀💻 CodeMentor – AI-Powered Code Interview Coach & Skill Development Platform

A production-grade MERN + AI system that simulates real coding interviews with automated feedback and performance analytics.

A modern **full-stack coding practice and skill tracking platform** built with the MERN stack.  
It helps users solve problems, track topic-wise progress, identify weak areas, and receive intelligent AI-based feedback.

This project focuses on real-world backend architecture, analytics dashboards, and AI integration.

---

## ✨ Features

- 🔐 Secure JWT Authentication (Login / Register)
- 🧠 AI-powered code feedback system
- 📊 Skill accuracy distribution dashboard
- 📈 Topic-wise progress tracking (Array, String, HashMap, etc.)
- 🎯 Weak area detection
- 🧩 Coding problem simulator
- 🎨 Modern responsive UI with Dark Mode
- ⚡ Real-time performance updates
- 🚀 Built to simulate real-world coding interviews with AI-driven evaluation

---

## 🛠 Tech Stack

### Frontend
- React.js
- Context API
- Axios
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Groq SDK

### Tools & Platforms
- Git & GitHub
- MongoDB Atlas
- Postman

### Deployment (Planned)
- Vercel (Frontend)
- Render (Backend)

---

## 🏗 System Architecture

### High-Level Flow

```
Client (React)
     ↓
Axios API Calls
     ↓
Express Server (Node.js)
     ↓
Controllers (Business Logic)
     ↓
MongoDB Database
     ↓
Groq (LLaMA 3.1)
```

This layered architecture ensures scalability, maintainability, and separation of concerns.

---

## 📌 Use Case

This project is intended for:

- 💻 Practicing full-stack MERN development  
- 🧠 Learning AI API integration  
- 📊 Building analytics dashboards  
- 🏗️ Understanding backend architecture  
- 📈 Strengthening GitHub portfolio  

---

## 🧠 AI Feedback Workflow

1. User submits coding solution  
2. Backend validates solution  
3. Rule-based analyzer evaluates structure  
4. AI (Groq LLaMA 3.1) analyzes code submissions and returns structured evaluation in JSON format including:
- Efficiency score
- Code readability analysis
- Edge case detection
- Complexity analysis
- Learning suggestions
5. Feedback displayed in dashboard  

---

## 📊 Skill Dashboard System

- Automatically updates topic accuracy  
- Tracks date-wise activity  
- Calculates weak areas  
- Displays skill distribution charts  
- Shows progress bars per topic  

---

## ⚙️ Installation & Setup

### Clone the repository:

```bash
git clone https://github.com/madupojumounika/code-mentor.git
cd code-mentor
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside backend:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GROQ_API_KEY=your_groq_api_key
```

Run backend:

```bash
node server.js
```

---

### Frontend Setup

Open new terminal:

```bash
cd frontend
npm install
npm start
```

---

## 🚧 Project Status

This project is actively being developed.  
New features and improvements are continuously being added.

---

## 🚀 Future Enhancements

- 🏆 Leaderboard system
- 📈 Weekly performance analytics
- 🎖️ Achievement badges
- 🌐 Deployment with CI/CD
- 🧑‍🤝‍🧑 Peer comparison analytics
- 📊 Advanced performance charts
 
---

## 📫 Connect With Me

- 💼 LinkedIn: https://www.linkedin.com/in/mounikamadupoju/
- 🐦 Twitter (X): https://x.com/Mouni_Madupoju
- 📧 Email: madupojumounika0@gmail.com
 
---

## ⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub.
