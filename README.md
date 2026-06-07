# Finzo - Smart Expense Tracker

Finzo is a modern full-stack Smart Expense Tracker web application designed to help users manage their personal finances efficiently. The platform provides expense tracking, financial analytics, insurance management, and insightful visual reports through an interactive and responsive user interface.

The application is built using a modern tech stack including React, FastAPI, MySQL, Tailwind CSS, and JWT Authentication to deliver high performance, scalability, and secure user management.

---

# Live Demo

🚀 Live Application:  
https://finzo-smart-expense-tracker.vercel.app/

---

# Features

- Secure User Authentication using JWT
- Expense Tracking & Management
- Interactive Financial Dashboard
- Expense Analytics & Visualization
- Insurance Management Module
- Responsive Modern User Interface
- Protected Routes & Secure API Access
- Real-time Data Visualization
- RESTful API Architecture
- Fast and Scalable Backend System

---

# Tech Stack

## Frontend

### React
React is a component-based JavaScript library used to build dynamic and interactive user interfaces. It enables reusable components and efficient rendering through the Virtual DOM.

### Vite
Vite is a modern frontend build tool that provides extremely fast development startup and optimized production builds with Hot Module Replacement (HMR).

### Tailwind CSS
Tailwind CSS is a utility-first CSS framework used to create responsive and modern user interfaces quickly and efficiently.

### React Router
React Router enables seamless client-side navigation between pages without full page reloads.

### Axios
Axios is used for handling API communication between frontend and backend services with JWT token support.

### Lucide React
Lucide React provides lightweight and customizable SVG icons to enhance the application UI.

### Recharts
Recharts is used for visualizing financial data through:
- Bar Charts
- Line Charts
- Pie Charts
- Expense Analytics Graphs

### Utility Libraries
- clsx
- tailwind-merge

These libraries help manage and merge Tailwind CSS classes efficiently.

---

# Backend

## Python
Python is used for implementing backend business logic and API handling.

## FastAPI
FastAPI is a high-performance backend framework used to build scalable RESTful APIs with automatic documentation support.

## Uvicorn
Uvicorn is an ASGI server used to run the FastAPI application efficiently with asynchronous request handling.

## SQLAlchemy
SQLAlchemy is used as the ORM (Object Relational Mapper) to interact with the MySQL database using Python objects instead of raw SQL queries.

---

# Authentication & Security

## JWT Authentication
JWT (JSON Web Tokens) are used for secure user authentication and authorization.

Library Used:
- python-jose

## Password Hashing
Passwords are securely hashed using bcrypt before storing them in the database.

Library Used:
- Passlib

---

# Data Validation

## Pydantic
Pydantic is used for request and response validation in FastAPI to ensure proper data consistency and reliability.

---

# Database

## MySQL
MySQL is used as the relational database management system for storing:
- User Information
- Transactions
- Insurance Policies
- Financial Records

## PyMySQL
PyMySQL is used for communication between the FastAPI backend and MySQL database.

## SQLAlchemy ORM
SQLAlchemy manages:
- Database Relationships
- CRUD Operations
- Transactions
- Constraints
- Table Mapping

---

# Project Structure

```bash
Finzo/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│   │
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── screenshots/
│
└── README.md
```

---

# Installation & Setup

## Prerequisites

Make sure you have the following installed:

- Python 3.10+
- Node.js
- npm
- MySQL Server

---

# Backend Setup

## Navigate to backend directory

```bash
cd backend
```

## Create virtual environment

```bash
python -m venv venv
```

## Activate virtual environment

### Windows

```bash
venv\Scripts\activate
```

### Linux/Mac

```bash
source venv/bin/activate
```

## Install dependencies

```bash
pip install -r requirements.txt
```

## Configure Environment Variables

Create a `.env` file inside backend directory:

```env
DATABASE_URL=mysql+pymysql://root:password@localhost/finzo_db

SECRET_KEY=your_secret_key

ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## Run Backend Server

```bash
uvicorn app.main:app --reload
```

Backend Server:

```text
http://127.0.0.1:8000
```

---

# Frontend Setup

## Navigate to frontend directory

```bash
cd frontend
```

## Install dependencies

```bash
npm install
```

## Start development server

```bash
npm run dev
```

Frontend Server:

```text
http://localhost:5173
```

---

# API Documentation

FastAPI automatically provides API documentation.

## Swagger UI

```text
http://127.0.0.1:8000/docs
```

## Redoc

```text
http://127.0.0.1:8000/redoc
```

---
# Core Functionalities

- User Registration & Login
- Secure JWT Authentication
- Add/Edit/Delete Expenses
- Expense Categorization
- Financial Analytics Dashboard
- Insurance Management
- Data Visualization with Charts
- Protected User Routes
- API Integration
- Responsive UI Design

---

# Future Enhancements

- AI-based Expense Prediction
- Budget Planning System
- Email Notifications
- Export Reports to PDF/Excel
- Multi-user Collaboration
- Mobile Application
- Cloud Deployment
- Dark Mode Support

---

# Deployment

## Frontend Deployment
- Vercel

## Backend Deployment
- FastAPI + Uvicorn

---

# Author

## Aryan Lavate

GitHub:  
https://github.com/AryanLavate

Project Repository:  
https://github.com/AryanLavate/Finzo-smart_expense_tracker

---

# License

This project is developed for educational and learning purposes.

---

# Acknowledgements

- React
- FastAPI
- Tailwind CSS
- SQLAlchemy
- MySQL
- Recharts
- Vite
- JWT Authentication
