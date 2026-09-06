# 🩺 Rural Healthcare Connect

A full-stack MERN web application that helps patients in rural and underserved areas check symptoms, find doctors, and book appointments online — with an AI-powered, multilingual voice assistant to make healthcare accessible to everyone, regardless of technical literacy.

![Tech Stack](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)
![Tech Stack](https://img.shields.io/badge/Express.js-000000?style=flat&logo=express&logoColor=white)
![Tech Stack](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Tech Stack](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Tech Stack](https://img.shields.io/badge/TailwindCSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

---

## 📖 About The Project

In many rural and semi-urban areas, access to specialist doctors is limited, and patients often don't know how urgent their symptoms are or which doctor to consult. **Rural Healthcare Connect** solves this by providing a single platform where patients can:

- Check the urgency of their symptoms instantly
- Search for doctors by specialization, state, and city
- Book appointments and track their status
- Receive permanent, tamper-proof digital prescriptions
- Get guided through the entire process by a voice-enabled AI assistant that speaks Hindi, English, Hinglish, and more — no typing required

---

## ✨ Features

### For Patients
- 🔐 Secure registration with photo (camera capture or upload), mobile number, and location (country/state/city/village)
- 🩺 Rule-based symptom checker with urgency levels (Low / Medium / Emergency)
- 🔍 Search doctors with searchable specialization and location filters
- 📅 Book appointments with optional photo attachment (injury, report, rash, etc.)
- 📋 View permanent, locked prescription records once an appointment is completed
- 🎙️ Voice-enabled AI chatbot for guidance in multiple languages

### For Doctors
- 🔐 Secure registration with specialization, experience, and photo
- 📥 View and manage incoming appointment requests
- ✅ Accept / Reject appointment requests
- 💊 Add prescription notes and attach a photo (report, prescription scan)
- 🔒 Once marked "Completed," records become permanently locked (cannot be edited) — ensuring prescription integrity

### Platform-wide
- 🌗 Full dark/light theme toggle
- 🤖 AI voice assistant (powered by Google Gemini) that understands Hindi, English, Hinglish, and Marathi
- 📱 Responsive, modern UI with smooth scroll animations

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), React Router, Tailwind CSS, react-select |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Authentication | JWT + bcrypt |
| File Uploads | Multer |
| AI Assistant | Google Gemini API |
| Voice | Web Speech API (SpeechRecognition + SpeechSynthesis) |
| Location Data | country-state-city |

---

## 📂 Project Structure

```
rural-healthcare-connect/
├── backend/
│   ├── config/          # Database connection
│   ├── middleware/      # Auth & file upload middleware
│   ├── models/          # Mongoose schemas (User, Appointment)
│   ├── routes/          # API routes (auth, doctors, appointments, symptoms, chatbot)
│   ├── uploads/         # Uploaded photos (gitignored)
│   └── server.js
└── frontend/
    ├── src/
    │   ├── api/          # Axios instance & config
    │   ├── components/   # Navbar, ChatBot, CameraCapture, etc.
    │   ├── context/       # Auth & Theme context
    │   └── pages/         # Home, Login, Register, Dashboards, etc.
    └── vite.config.js
```

---

## 🚀 Getting Started (Local Setup)

### Prerequisites
- Node.js installed
- A MongoDB Atlas account (free tier)
- A Google Gemini API key (free tier)

### Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in `backend/`:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_api_key
```
```bash
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
```
Create a `.env` file in `frontend/`:
```
VITE_API_URL=http://localhost:5000/api
```
```bash
npm run dev
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a patient or doctor |
| POST | `/api/auth/login` | Login |
| GET | `/api/doctors` | List/search doctors |
| POST | `/api/appointments` | Book an appointment |
| GET | `/api/appointments/my` | Get logged-in user's appointments |
| PUT | `/api/appointments/:id/status` | Accept/reject/complete an appointment |
| POST | `/api/symptoms/check` | Check symptom urgency |
| POST | `/api/chatbot/message` | Talk to the AI assistant |

---

## 🔮 Future Scope

- 🗺️ Map-based doctor search using Leaflet/OpenStreetMap for visual, location-aware discovery
- 📹 Real-time video consultation integration (e.g., Jitsi Meet)
- 🧠 Replace the rule-based symptom checker with a trained ML model for more accurate triage
- 📩 SMS/email reminders for upcoming appointments and medicine schedules
- 🏥 Admin panel for verifying doctor credentials and monitoring platform activity
- ☁️ Move file storage to a persistent cloud service (e.g., Cloudinary) instead of local disk
- 🌐 Expand voice assistant language support to more regional Indian languages
- 📊 Analytics dashboard for doctors to track patient history trends

---

## 👤 Author

Built as a final year B.Tech (IT) project.

---

## 📄 License

This project is for academic purposes.