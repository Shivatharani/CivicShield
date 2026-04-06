# CivicShield 🛡️

**CivicShield** is a secure, transparent, and high-integrity platform for managing citizen scheme applications. Featuring a blockchain-backed transaction ledger, multi-gate validation, and a modern "Pastry" themed UI, it ensures fairness, prevents fraud, and provides a premium experience for both citizens and administrators.

---

## 🚀 Project Overview

The project is architected with a robust separation of concerns:
- **`backend/`**: A Node.js/Express server implementing security gates, JWT authentication, RBAC, and a cryptographic linked-list ledger.
- **`frontend/`**: A Next.js application with a soft, premium aesthetic, real-time toast notifications, and role-based route protection.

---

## ✨ Key Features

1.  **Role-Based Access Control (RBAC)**:
    - **VIEWER**: Read-only access to the dashboard and registries.
    - **OPERATOR**: Full administrative control, including pausing/resuming the system, downloading tamper reports, and processing applications.
2.  **Premium UI & Aesthetics**:
    - **Pastry Palette**: A custom-designed desktop experience featuring soft pastel colors (Cream, Mint, Blush).
    - **Toast Notifications**: Real-time interactive feedback for all user actions (Login, Signup, Admin Controls).
3.  **Cross-Gate Validation**:
    - **Gate 1**: Eligibility cross-referencing with citizen datasets.
    - **Gate 2**: Automated budget exhaustion checks.
    - **Gate 3**: Frequency monitoring to prevent over-claiming.
4.  **Security & Integrity**:
    - **Blockchain Ledger**: Immutable linked-list storage for all transactions.
    - **Anti-Fraud**: Replay protection and identity hashing (SHA-256).
    - **Google OAuth**: Integrated secure login via Google.

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT, BcryptJS.
- **Frontend**: Next.js 16 (Turbopack), React 19, Tailwind CSS, Google OAuth, Axios.

---

## ⚙️ Setup and Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)

### 1. Environment Configuration
Create a `.env` file in both `backend/` and `frontend/` directories:
```env
MONGO_URI=mongodb://localhost:27017/civicshield
JWT_SECRET=YOUR_SECRET
NEXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR_GOOGLE_ID
```

### 2. Backend Installation
```bash
cd backend
npm install
npm start
```
*Server running on `http://localhost:5000`.*

### 3. Frontend Installation
```bash
cd frontend
npm install
npm run dev
```
*Application available at `http://localhost:3000`.*

---

## 🔌 API Endpoints

### 🔐 Authentication
- `POST /signup`: Register as a VIEWER or OPERATOR.
- `POST /login`: Standard JWT authentication.
- `POST /google-login`: One-click secure login with Google.

### 📜 Citizen Features (Authorized Users)
- `POST /apply`: Submit a scheme application (Role: OPERATOR).

### 📊 Admin Intelligence
- `GET /dashboard`: Real-time system monitoring.
- `POST /admin/pause`: Emergency system freeze (Role: OPERATOR).
- `POST /admin/unpause`: System restoration (Role: OPERATOR).
- `GET /tamper-report`: Detailed audit log (Role: OPERATOR).

---

## 🛡️ System Integrity

CivicShield monitors itself constantly. If the cryptographic chain in the `ledger.json` is broken or if data is modified externally, the system enters a **FROZEN** state, immediately alerting all administrators and halting further transactions.

---

## 📄 License
Licensed under the ISC License.
