# ⚖️ MERN Online Judge

An end-to-end **Online Judge Platform** built with the MERN stack. This platform allows users to solve coding problems, compile and run code in real-time using **Judge0**, and get **AI-powered code reviews** using OpenAI Gemini. Admins can manage problems, and users can track their submissions and performance.

## 🚀 Features

- 🔐 Authentication via **Clerk**
- 🧠 **AI Code Review** using **Google Gemini**
- 💻 Code execution via **Judge0 API**
- 📦 Problem CRUD (Admin only)
- 📜 Submission verdicts with input/output comparison
- 🎨 Fully responsive **dark-themed UI** with **TailwindCSS**
- 🧪 Monaco Editor integration for rich coding experience
- ⚙️ Role-based access for users and admins
- 📊 View problem difficulty and filters
- 📈 Performance tracking (optional leaderboard)

---

## 🛠️ Tech Stack

### Frontend

- React.js
- TailwindCSS
- Clerk (for Auth)
- Axios
- Monaco Editor

### Backend

- Node.js
- Express.js
- MongoDB + Mongoose
- Judge0 API (code execution)
- OpenAI Gemini API (code review)

---

## 📁 Project Structure

```bash
├── backend
│   ├── controllers
│   ├── models
│   ├── routes
│   └── index.js
├── frontend
│   ├── components
│   ├── pages
│   └── App.jsx
├── .env
└── README.md

```

### 📦 Setup Instructions

1. Clone the Repository : git clone https://github.com/KartikLakra1/mern-online-judge.git

2. Setup Backend
   cd backend
   npm install
   Create a .env file in /backend:

PORT=5000
MONGODB_URI=your_mongo_uri
JUDGE0_URL=https://judge0-api-url
JUDGE0_KEY=your_judge0_api_key
OPENAI_API_KEY=your_gemini_key
Run the backend: npm run dev

3. Setup Frontend
   cd frontend
   npm install
   Create .env in /frontend:

VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
VITE_BACKEND_URL=http://localhost:5000
Run the frontend: pm run dev

### Sample Use Cases

✅ Users can attempt problems and get verdicts

✨ AI gives code feedback and improvements

👨‍🏫 Admins can add/edit/delete problems

🔐 Protected routes for submissions and dashboard

### 🧠 Future Enhancements

⏱️ Timed contests and scoreboards

🧾 PDF resume download with AI suggestions

📬 Email notifications for verdicts

🏆 Global leaderboard & ranks

### Contributing

Contributions are welcome! Please create a pull request or open an issue.
