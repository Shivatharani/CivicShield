# CivicShield 🛡️

**CivicShield** is a secure, transparent, and high-integrity system for managing citizen scheme applications. It features multi-gate validation, real-time budget tracking, and a blockchain-inspired transaction ledger to ensure fairness and prevent fraud.

---

## 🚀 Project Overview

The project is divided into two main components:
- **`backend/`**: A Node.js and Express-based server that handles application logic, security gates, and the transaction ledger.
- **`frontend/`**: A modern Next.js application providing a fast and intuitive interface for both citizens and administrators.

---

## ✨ Key Features

1.  **Multi-Gate Validation System**:
    - **Gate 1**: Eligibility check based on citizen profile (Income Tier, Region Code).
    - **Gate 2**: Real-time budget availability check.
    - **Gate 3**: Frequency monitoring (limitations on how often a citizen can claim a scheme).
2.  **Anti-Fraud Mechanisms**:
    - **Replay Protection**: Prevents duplicate submissions within short durations.
    - **Hash-Based Privacy**: Citizen IDs are hashed (SHA-256) before storage in the ledger for privacy.
3.  **High-Integrity Ledger**:
    - A blockchain-inspired ledger where each transaction is linked to the previous one using a cryptographic hash.
    - Automatic system freeze if tampering is detected.
4.  **Admin Dashboard**:
    - Real-time monitoring of system status (Active, Paused, Frozen).
    - Live budget tracking and transaction history.
    - Remote system control (Pause/Resume capability).

---

## 🛠️ Tech Stack

- **Backend**: Node.js, [Express.js](https://expressjs.com/), `csv-parser`, `cors`.
- **Frontend**: [Next.js](https://nextjs.org/), React 19, [Tailwind CSS](https://tailwindcss.com/), TypeScript, Axios.

---

## ⚙️ Setup and Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### 1. Backend Setup
```bash
cd backend
npm install
npm start
```
*The server will start on `http://localhost:5000`.*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*The application will be available at `http://localhost:3000`.*

---

## 🔌 API Endpoints

### Citizen APIs

#### `POST /apply`
Submits a new scheme application.
- **Request Body**:
  ```json
  {
    "id": "CITIZEN_ID",
    "scheme": "SCHEME_NAME",
    "amount": 5000,
    "incomeTier": "Tier 1",
    "regionCode": "REG_001"
  }
  ```
- **Responses**:
  - `SUCCESS`: Transaction added and ledger updated.
  - `SYSTEM_FROZEN`: System is inactive due to tampering or policy.
  - `REPLAY_DETECTED`: Prevented duplicate submission.
  - `LOCKED`: Validation gate failed.

### Admin APIs

#### `GET /dashboard`
Returns the current system state.
- **Response**:
  ```json
  {
    "status": "ACTIVE",
    "budget": 950000,
    "transactions": [...]
  }
  ```

#### `POST /pause`
Freezes the system to prevent new applications.

#### `POST /resume`
Resumes the system if it was manually paused.

---

## 🛡️ Security and Integrity

CivicShield maintains transaction integrity by:
1.  **Hashing**: Using `crypto` for SHA-256 hashing of citizen data and transaction blocks.
2.  **Verification**: Every new transaction triggers a full ledger verification. If any block's hash doesn't match its contents or its link to the previous block, the system automatically enters a `FROZEN` state.

---

## 📄 License
This project is licensed under the ISC License.
