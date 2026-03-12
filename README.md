# TaskManager

A full-stack task management and team collaboration system built with FastAPI and React. Create projects, manage tasks, assign work to teammates, track your assigned tasks, and measure progress through an analytics dashboard.

![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)
![Material UI](https://img.shields.io/badge/MUI-v5-007FFF?style=flat&logo=mui&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=flat&logo=sqlite&logoColor=white)

---

## Features

- **Authentication** — JWT-based registration and login with protected routes
- **Projects** — Create, edit, and delete projects with full ownership control
- **Task Board** — Kanban-style board with Pending, In Progress, and Completed columns
- **My Tasks** — Dedicated view for tasks assigned to you across all projects
- **Task Assignment** — Assign tasks to any registered user
- **Notifications** — In-app notifications on task assignment including self-assignment
- **Analytics** — Charts and progress tracking per project and by status
- **Dashboard** — Personal overview of your projects, assigned tasks, and stats

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | FastAPI, SQLAlchemy ORM, SQLite, python-jose, bcrypt |
| Frontend | React 18, Vite, Material UI v5, React Router v6, Axios, Recharts |

---

## Project Structure

```
TaskManager/
├── backend/
│   ├── main.py                 # App entry point, CORS, router registration
│   ├── database.py             # SQLAlchemy engine and session factory
│   ├── models.py               # User, Project, Task, Notification models
│   ├── schemas.py              # Pydantic request and response schemas
│   ├── auth.py                 # JWT creation, bcrypt hashing, auth dependency
│   ├── requirements.txt
│   └── routers/
│       ├── auth.py             # POST /auth/register, POST /auth/login
│       ├── projects.py         # CRUD /projects
│       ├── tasks.py            # CRUD /tasks, assignment, /tasks/assigned
│       ├── analytics.py        # GET /analytics/tasks
│       └── notifications.py    # GET/PUT/DELETE /notifications
│
└── frontend/
    └── src/
        ├── api/
        │   └── axios.js        # Configured Axios instance with auth interceptor
        ├── context/
        │   └── AuthContext.jsx # Auth state, login/logout, JWT decode
        ├── theme/
        │   ├── theme.js        # MUI dark theme configuration
        │   └── AppTheme.jsx    # ThemeProvider wrapper
        ├── styles/             # Shared MUI sx style objects per domain
        │   ├── authStyles.js
        │   ├── layoutStyles.js
        │   ├── dashboardStyles.js
        │   ├── taskStyles.js
        │   ├── analyticsStyles.js
        │   ├── modalStyles.js
        │   └── notificationStyles.js
        ├── components/
        │   ├── layout/
        │   │   ├── AppLayout.jsx       # Master shell: Sidebar + TopBar + main
        │   │   ├── Sidebar.jsx         # Permanent/temporary drawer navigation
        │   │   └── TopBar.jsx          # Fixed AppBar with notifications + logout
        │   ├── ProjectCard.jsx
        │   ├── ProjectFormModal.jsx
        │   ├── TaskCard.jsx
        │   ├── TaskFormModal.jsx
        │   └── NotificationPanel.jsx
        ├── pages/
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── Dashboard.jsx           # Home: overview stats + recent activity
        │   ├── ProjectDashboard.jsx
        │   ├── TaskBoard.jsx
        │   ├── MyTasks.jsx             # All tasks assigned to logged-in user
        │   └── AnalyticsDashboard.jsx
        └── App.jsx
```

---

## Getting Started

### Prerequisites

- Python 3.10 or higher
- Node.js 18 or higher
- npm

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd TaskManager
```

### 2. Backend Setup

```bash
# Create and activate a virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Start the development server
uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

- API: `http://127.0.0.1:8000`
- Swagger UI: `http://127.0.0.1:8000/docs`

### 3. Frontend Setup

```bash
# Open a new terminal
cd frontend
npm install
npm run dev
```

- App: `http://localhost:5173`

### 4. Reset the Database

```bash
# Stop the backend server first (Ctrl+C), then:

# Windows
del backend\task_manager.db

# macOS / Linux
rm backend/task_manager.db

# Restart the server — all tables are recreated automatically
uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

---

## API Reference

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | No | Register a new user |
| POST | `/auth/login` | No | Login, returns JWT token |

### Projects

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/projects` | Yes | List your projects |
| POST | `/projects` | Yes | Create a project |
| PUT | `/projects/{id}` | Yes | Edit a project |
| DELETE | `/projects/{id}` | Yes | Delete a project |

### Tasks

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/projects/{id}/tasks` | Yes | List tasks in a project |
| POST | `/tasks` | Yes | Create a task |
| PUT | `/tasks/{id}` | Yes | Update a task |
| DELETE | `/tasks/{id}` | Yes | Delete a task |
| POST | `/tasks/{id}/assign` | Yes | Assign task to a user |
| GET | `/tasks/assigned` | Yes | Tasks assigned to you |

### Other

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/analytics/tasks` | Yes | Task analytics for your projects |
| GET | `/users` | Yes | List all registered users |
| GET | `/notifications` | Yes | Your notifications |
| PUT | `/notifications/mark-read` | Yes | Mark all notifications as read |
| PUT | `/notifications/{id}/read` | Yes | Mark one notification as read |
| DELETE | `/notifications/{id}` | Yes | Delete a notification |

---

## Using Swagger UI

1. Open `http://127.0.0.1:8000/docs`
2. Register via `POST /auth/register`
3. Click the **Authorize** button (lock icon, top right)
4. In the **username** field — enter your **email address**
5. In the **password** field — enter your password
6. Click **Authorize** — all protected endpoints are now unlocked

> Swagger's OAuth2 form labels the identifier field as "username" by spec.
> This application uses email as the login identifier — type your email there.


---
