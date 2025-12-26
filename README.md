# Deadly Job Tracker

Deadly Job Tracker is a full-stack web application that helps users track job and internship applications in one place.  
It allows users to record applications, monitor their status, add notes, and analyze response rates.

This project is built as a solo developer project to demonstrate full-stack development skills from database design to frontend implementation.

---

## 🚀 Features

### Core Features
- User authentication (register & login)
- Add job applications
- Track application status (applied, interview, rejected, accepted)
- Add notes and important dates
- View all applications in a dashboard

### Extra / Planned Features
- Filter applications by status
- Sort by date applied or company
- Simple analytics (response rate, total applications)
- Responsive UI

---

## 🧑‍💻 Tech Stack

### Frontend
- React (Nuxt.js)
- TypeScript
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- MySQL
- JWT Authentication
- bcrypt

### Tools
- Git & GitHub
- VS Code
- MySQL Workbench

---

## 🗄️ Database Design (Sketch)

### users
| Field        | Type        | Notes                    |
|-------------|------------|--------------------------|
| id          | INT (PK)   | Auto increment           |
| name        | VARCHAR    | User full name           |
| email       | VARCHAR    | Unique                   |
| password    | VARCHAR    | Hashed password          |
| created_at | TIMESTAMP  | Account creation time    |

---

### applications
| Field         | Type        | Notes                                   |
|--------------|------------|-----------------------------------------|
| id           | INT (PK)   | Auto increment                          |
| user_id      | INT (FK)   | References users(id)                    |
| company_name | VARCHAR    | Company applied to                      |
| position     | VARCHAR    | Job title                               |
| status       | ENUM       | applied / interview / rejected / hired |
| applied_date | DATE       | Date of application                     |
| notes        | TEXT       | Optional notes                          |
| created_at  | TIMESTAMP  | Record creation time                    |

---

## 🔗 API Endpoints (Sketch)

### Auth
- `POST /api/auth/register` → Register new user
- `POST /api/auth/login` → Login user

### Applications
- `GET /api/applications` → Get all user applications
- `POST /api/applications` → Add new application
- `PUT /api/applications/:id` → Update application
- `DELETE /api/applications/:id` → Delete application

---

## 🎯 Project Goals

- Practice full-stack development as a solo developer
- Implement real-world CRUD operations
- Build a portfolio-ready project for frontend/backend roles

---

## 📌 Status

🚧 Project is currently in early development.

