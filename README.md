🎓 TechLearn --- Frontend

A modern, interactive learning platform designed to make technical
learning structured, visual, and engaging.

TechLearn is a full-stack learning platform that provides students with
a centralized space to explore courses, read lessons, track progress,
take quizzes, and interact with an AI learning assistant.

This repository contains the React frontend of TechLearn.

✨ Highlights

🔐 User registration and login

🛡️ Protected routes and authentication state

📚 Course and lesson browsing

📖 Interactive lesson experience

📊 Visual learning-progress tracking

🧠 Interactive quizzes

🤖 AI-powered learning assistant

🧭 Responsive navigation

⚡ Fast Vite development workflow

🎨 Modern dark-themed learning interface

🔄 Axios-based communication with the backend API

⏳ Reusable loading states and UI components

❌ Dedicated 404 / Not Found page

🏗️ Frontend Architecture

techlearn-frontend/
│
├── public/
│
├── src/
│   ├── api/
│   │   └── axios.js
│   │
│   ├── components/
│   │   ├── AIAssistant.jsx
│   │   ├── CourseCard.jsx
│   │   ├── LessonBook.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProgressBar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── Quiz.jsx
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── pages/
│   │   ├── CourseDetail.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   ├── NotFound.jsx
│   │   └── Register.jsx
│   │
│   ├── styles/
│   │   └── index.css
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── index.html
├── package.json
└── README.md

🧩 Main Components

Component          Responsibility

Navbar           Application navigation and user actions
CourseCard       Displays course information
ProgressBar      Visualizes learning progress
LessonBook       Presents lesson content
Quiz             Handles interactive quiz experiences
AIAssistant      Provides AI-powered learning assistance
ProtectedRoute   Restricts authenticated pages
LoadingSpinner   Displays loading states

📄 Pages

🔑 Login

Authenticates an existing learner and establishes the application
session.

📝 Register

Allows new learners to create an account.

🏠 Dashboard

Provides the learner's central overview of available learning content
and progress.

📚 Course Detail

Displays course-specific lessons and learning information.

🚫 Not Found

Handles invalid or unavailable routes gracefully.

🔐 Authentication Flow

User
 │
 ▼
Login / Register
 │
 ▼
React Frontend
 │
 ▼
Axios API Client
 │
 ▼
TechLearn Backend
 │
 ▼
JWT Authentication
 │
 ▼
Protected Application Routes

Authentication state is maintained through the application's
AuthContext, while ProtectedRoute prevents unauthenticated users
from accessing protected pages.

🔌 Backend Integration

The frontend communicates with the TechLearn backend through Axios.

The API client is centralized in:

src/api/axios.js

This keeps API communication organized and makes it easier to switch
between local development and production backend URLs.

Local backend

http://127.0.0.1:8000

Update the frontend API base URL according to your local or deployed
backend environment.

🛠️ Tech Stack

Technology          Purpose

React               User interface
Vite                Frontend tooling and development server
JavaScript / JSX    Application logic
Axios               REST API communication
React Context API   Authentication/application state
CSS                 Styling and responsive UI
JWT                 Authentication mechanism
Vercel              Frontend deployment

🚀 Getting Started

1. Clone the repository

git clone <your-repository-url>
cd techlearn-frontend

2. Install dependencies

npm install

3. Configure the backend URL

Set the API base URL used by src/api/axios.js to your running
TechLearn backend.

For production, use your deployed backend URL.

4. Start the development server

npm run dev

The Vite development server will provide a local URL, normally:

http://localhost:5173

5. Build for production

npm run build

6. Preview the production build

npm run preview

🌍 Deployment

The frontend is designed to be deployable on platforms such as Vercel.

Typical deployment flow:

GitHub
   │
   ▼
Vercel
   │
   ▼
React + Vite Build
   │
   ▼
Production Frontend
   │
   ▼
TechLearn Backend API

Remember to configure the production API URL/environment variables in
the deployment platform.

🎯 Design Goals

TechLearn's frontend focuses on:

Clarity --- learners should immediately understand where they
are.

Consistency --- reusable components keep the experience uniform.

Accessibility --- important actions and feedback should remain
visible and understandable.

Responsiveness --- the learning experience should work across
different screen sizes.

Maintainability --- API logic, authentication, components,
pages, and styles are separated into focused modules.

🔮 Future Enhancements

Potential future improvements include:

🔔 Real-time notifications

🏆 Learning achievements and badges

📈 Advanced learner analytics

🔖 Bookmarked lessons

🌙 Theme customization

🔎 Course and lesson search

📱 Improved mobile-first interactions

🎯 Personalized learning recommendations

👩‍💻 Project

TechLearn is built as a full-stack educational platform with a
React-based frontend and a FastAPI backend.

The goal is simple:

Turn learning from a collection of pages into an interactive
learning experience.
