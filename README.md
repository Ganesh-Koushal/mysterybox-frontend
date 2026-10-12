# MysteryBox — Frontend (React.js)

> **Interactive Mystery Investigation and Case Resolution Platform**  
> A full-stack web application developed by **K. V. GANESH KOUSHAL** (Roll No: **24EG104A13**, ECE Department, Anurag University).

---

## 🔍 Overview

**MysteryBox** is a web-based investigation platform where users examine criminal evidence, analyze forensic clues, and submit deductive solutions to solve cases. 

This repository contains the standalone **React.js Single Page Application (SPA)** that communicates with the **MysteryBox Spring Boot REST API**.

---

## 🚀 Key Features

- **Atmospheric Detective Noir Aesthetic:** Custom dark-mode detective interface built with responsive CSS variables, custom badges, and glassmorphism styling.
- **Dossier Case Examination:**
  - **Incident Briefing:** Detailed narrative of crime scene circumstances.
  - **Chronological Clues:** Ordered investigation findings and timeline logs.
  - **Evidence Locker:** Forensic items, fingerprint casts, and digital logs.
- **Server-Side Deduction Terminal:**
  - Submit proposed culprits and solutions.
  - Real-time feedback with score awarding (+100 PTS) and duplicate submission protection.
- **Investigator Dashboard:**
  - Real-time statistics: Total score, solved cases, resolution rate, and rank progression (*Rookie Sleuth* to *Consulting Detective*).
  - Resolved case archives.
- **Chief Administrator Console:**
  - Create, edit, and delete mystery cases.
  - Add and manage dynamic clues and evidence items.
  - Toggle-reveal configured solutions.
- **Quick-Fill Demo Access:** 1-click test buttons on the login page for rapid evaluator review.

---

## 🛠️ Technology Stack

- **Framework:** React.js (JavaScript / JSX)
- **Bundler & Build Tool:** Vite
- **Routing:** React Router DOM (v6/v7)
- **State Management:** React Context API (`AuthContext`)
- **API Client:** Fetch API with JWT Bearer token interceptor
- **Styling:** Custom CSS with responsive grid and flexbox
- **Deployment Platform:** Render (Static Site)

---

## 📁 Project Structure

```
frontend/
├── public/
│   ├── _redirects         # SPA routing rewrite rule for Render
│   └── favicon.svg        # Detective magnifying glass icon
├── src/
│   ├── api/
│   │   └── client.js      # Centralized HTTP client with JWT handling
│   ├── context/
│   │   └── AuthContext.jsx# Authentication state & role authorization
│   ├── components/
│   │   ├── Navbar.jsx     # Navigation bar with role badges & logout
│   │   ├── Footer.jsx     # Project credits and student meta
│   │   ├── ProtectedRoute.jsx # Guard for logged-in investigators
│   │   ├── AdminRoute.jsx # Guard for chief administrators
│   │   ├── AlertBanner.jsx# Feedback notification component
│   │   └── LoadingSpinner.jsx # Themed animated spinner
│   ├── pages/
│   │   ├── LandingPage.jsx       # Hero banner & feature overview
│   │   ├── LoginPage.jsx         # Sign in with demo account quick-fill
│   │   ├── RegisterPage.jsx      # Investigator enlistment with role toggle
│   │   ├── DashboardPage.jsx     # Detective rank & solved case dossier
│   │   ├── CaseListPage.jsx      # Filterable & searchable case catalogue
│   │   ├── CaseDetailPage.jsx    # Clues, evidence locker & deduction terminal
│   │   ├── AdminDashboardPage.jsx# Admin case table with solution reveal
│   │   └── AdminCaseFormPage.jsx # Case, clue, and evidence authoring form
│   ├── App.css            # Platform theme styling
│   ├── App.jsx            # Router and application routes
│   └── main.jsx           # React DOM entry point
├── .env.example           # Environment template
├── .env.development      # Local development config
├── .env.production       # Production Render API config
├── package.json
└── vite.config.js
```

---

## ⚙️ Environment Configuration

| Variable | Description | Default Local Value |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL of the Spring Boot REST API | `http://localhost:8080/api` |

Create a `.env` file in the `frontend` root or set the variable directly in Render:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## 💻 Local Setup & Execution

### Prerequisites
- Node.js (v18+ recommended)
- npm (v9+)

### Installation
```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install
```

### Running in Development Mode
```bash
npm run dev
```
Open **`http://localhost:5173`** in your browser.

### Building for Production
```bash
npm run build
```
Build output is generated inside the `dist/` directory.

---

## 🌐 Render Deployment Guide

1. Create a **New Static Site** on [Render](https://dashboard.render.com).
2. Connect your `mysterybox-frontend` GitHub repository.
3. Configure the build parameters:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
4. Add the Environment Variable:
   - `VITE_API_BASE_URL` = `https://mysterybox-backend.onrender.com/api` *(replace with your actual backend URL)*
5. Click **Create Static Site**.

> **Note on Client-Side Routing:** The included `public/_redirects` file automatically redirects `/* -> /index.html 200` to prevent 404 errors on page refresh on Render.

---

## 👤 Author & Academic Details

- **Student Name:** K. V. GANESH KOUSHAL
- **Roll Number:** 24EG104A13
- **College Email:** 24EG104A13@ANURAG.EDU.IN
- **Branch / Section:** ECE — Section A
- **Project Title:** MysteryBox — Interactive Mystery Investigation and Case Resolution Platform
