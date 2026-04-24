# Hospital Clinic Registration System (Sistem Registrasi Poli)

A modern full-stack web application for hospital clinic management. 
This system was built with a **Node.js/Express** backend and a **Vite/React** frontend, using **PostgreSQL** as the database.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:
- **Node.js** (v18 or higher recommended)
- **PostgreSQL** (Running locally or hosted)

---

## 1. Backend Setup

The backend handles the RESTful API, database interactions via Sequelize, and JWT Authentication.

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Copy the example environment file and configure it with your PostgreSQL credentials.
   ```bash
   cp .env.example .env
   ```
   *(Make sure to update `DB_PASSWORD` and `DB_USER` in `.env` to match your local Postgres setup).*

4. **Database Migration & Seeding:**
   Run the following commands to create the database, run the schema migrations, and inject the initial dummy data.
   ```bash
   npx sequelize-cli db:create
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
   ```

5. **Start the server:**
   ```bash
   npm run start
   ```
   *The backend API will run on `http://localhost:3000`.*

---

## 2. Frontend Setup

The frontend is a Single Page Application (SPA) utilizing React Router for navigation and Axios for API requests.

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   *The web app will open at `http://localhost:5173`.*

---

## 3. Demo Accounts (from Seeder)

Once you have successfully run the database seeder (`npx sequelize-cli db:seed:all`), you can log in to the frontend using the following default accounts to explore the different dashboards:

### Admin Account
Has full access to manage Polyclinics, Doctors, Patients, and Medications.
- **Email:** `admin@gmail.com`
- **Password:** `admin123`

### Doctor Account
Can manage their schedules, view registered patients, and perform examinations.
*(These accounts are dynamically seeded. Log in with Admin first to see the exact generated email, or use the default generated one below)*:
- **Email:** `budi@dokter.com`
- **Password:** `password123`

### Patient Account
Can register for a visit to a polyclinic and view their examination history.
*(These accounts are dynamically seeded. Log in with Admin first to see the exact generated email, or use the default generated one below)*:
- **Email:** `agus@pasien.com`
- **Password:** `password123`

---

## Tech Stack
- **Backend:** Express.js, Sequelize ORM, PostgreSQL, Joi Validation, JSON Web Tokens (Cookies)
- **Frontend:** React 18, Vite, React Router DOM, Axios, Vanilla CSS (Glassmorphism UI)
