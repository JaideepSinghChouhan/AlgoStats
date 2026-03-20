# 🚀 AlgoStats

### *Compete. Climb. Conquer your campus.*

AlgoStats is a full-stack web application that aggregates competitive programming statistics from multiple platforms and ranks users on a unified college leaderboard. It enables students to track their performance, compare with peers, and stay motivated in their coding journey.

---

## 📌 Problem Statement

Competitive programmers often use multiple platforms like Codeforces, LeetCode, and CodeChef. However, there is no unified system to:

* View all stats in one place
* Compare performance across peers
* Track overall standing within a college

AlgoStats solves this by bringing everything into a **single, data-driven leaderboard**.

---

## ✨ Features

### 🔐 Authentication

* Secure user registration and login (JWT-based)
* Password hashing for safety

### 👤 User Profiles

* Add and manage CP handles:

  * Codeforces
  * LeetCode
  * CodeChef
  * AtCoder
* View individual stats

### 📊 Stats Aggregation

* Fetch real-time data from:

  * Codeforces API
  * LeetCode GraphQL
  * CodeChef Api
* Store and update user statistics

### 🏆 Leaderboard

* Unified ranking system across platforms
* Displays:

  * Rank
  * Name
  * Ratings
  * Total Score

### 🔄 Automated Updates

* Daily cron job to refresh user stats
* Dynamic leaderboard recalculation

---

## 🧠 Scoring System

AlgoStats uses a weighted scoring formula to rank users:

```bash
Score = CF × 1.5 + LC Contest × 1.0 + LC Solved × 2 + CC × 1.0 + AC × 1.0
```

> This ensures fair comparison across different platforms.

---

## 🏗️ Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* Axios
* Chart.js

### Backend

* Node.js
* Express.js

### Database

* MongoDB (Mongoose)

### Other Tools

* JWT Authentication
* node-cron (scheduled jobs)

---

## 📁 Project Structure

```bash
AlgoStats/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── services/
│   ├── jobs/
│   ├── middleware/
│   └── server.js
│
├── frontend/
│ ├──src/
│   ├── components/
│   ├── pages/
│   ├── api/
│   ├── context/
│   └── main.jsx
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/algostats.git
cd algostats
```

### 2️⃣ Setup Backend

```bash
cd server
npm install
```

Create a `.env` file:

```bash
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
```

Run backend:

```bash
npm run dev
```

---

### 3️⃣ Setup Frontend

```bash
cd client
npm install
npm run dev
```

---

## 🌐 API Endpoints

### Auth

* `POST /api/auth/register`
* `POST /api/auth/login`

### User

* `GET /api/user/profiles`
* `PUT /api/user/handles`
* `POST /api/user/refresh`


### Leaderboard

* `GET /api/leaderboard`

---

## 🔄 Future Enhancements

* 📈 Rating history graphs
* 🧠 AI-based problem recommendations
* 🏅 Shoutout system (Top Performer, Rising Star)
* 📅 Streak Calender
* 📊 Advanced analytics dashboard

---

## 🤝 Contributing

Contributions are welcome!
Feel free to fork the repo and submit a pull request.

---

## 📜 License

This project is licensed under the MIT License.

---

## 🙌 Acknowledgements

* Codeforces API
* LeetCode GraphQL
* Open-source community

---

## 💡 Author

**Jaideep (JD)**
Frontend Developer| Backend Engineer | Aspiring Full-Stack Engineer

---

> ⭐ If you like this project, don’t forget to star the repo!
