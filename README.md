# Task Manager Tutorial

## Overview
Full-stack Task Manager web application with role-based permissions, task lifecycle tracking, attachment upload, checklist progress, and analytics.

- Backend: Node.js, Express, MongoDB (Mongoose), JWT auth, cookie-based session tokens
- Frontend: React + Vite, Tailwind-style (custom CSS) and modern UI components
- File upload: Multer on backend with `/uploads` static serving
- Admin + user separation, task assignment, status updates, and in-app charts

## Repository Structure

- `backend/`
  - `index.js` : Express app entry.
  - `package.json` : dependencies + scripts (`npm run start`, `npm run dev`).
  - `routes/`
    - `auth.route.js` : `/api/auth` (signup, signin, signout, profile, update, upload image)
    - `user.route.js` : `/api/users` (list users, admin-only update/delete)
    - `task.route.js` : `/api/tasks` (create, read, update, delete, status, checklist, dashboard)
    - `report.route.js`: `/api/reports` (export Excel, analytics)
  - `controller/` : request handlers (task, user, auth, report logic)
  - `models/` : MongoDB schema models (`user.model.js`, `task.model.js`)
  - `utils/` : `verifyUser.js` (JWT validation and roles), `multer.js`, `error.js`
  - `uploads/` : persisted attachment files served via `/uploads`

- `frontend/`
  - `package.json` : frontend dependencies and scripts (`npm run dev`, `npm run build`, `npm run preview`)
  - `src/` 
    - `main.jsx`, `App.jsx`, styles
    - `components/` : UI and dashboard components
    - `pages/` : admin/user/auth pages
    - `redux/` : auth slice and store
    - `routes/` : `PrivateRoute.jsx`
    - `utils/` : API helper wrappers and shared functions
  - `public/` : static assets

## Key Features

### Authentication
- Sign up with display name, email, password, optional profile image
- Login with email + password
- JWT cookie set on login via `access_token` HTTP-only cookie
- Role support: `user` and `admin`
- Admin join code to create admin users (from `ADMIN_JOIN_CODE` env var)

### User
- Profile view
- Editable profile (name/email/password)
- Admin: list and manage all users

### Task Management
- Create tasks (admin only)
- Assign tasks to user(s)
- Task properties: title, description, priority, due date, status, attachments, checklist
- Update tasks / delete tasks (admin only)
- Assignees update their status and checklist
- Completed tasks due today auto-delete

### Reporting / Dashboard
- Global task metrics (total, pending, in-progress, completed, overdue)
- Task distribution by status and priority
- Excel export via `/api/reports/export`

### Attachments
- File upload handled by multer
- Attachments served from `/uploads` URL

## API Reference

### Auth
- `POST /api/auth/signup` : register
- `POST /api/auth/signin` : login
- `GET /api/auth/profile` : get current user
- `PUT /api/auth/update` : update profile
- `POST /api/auth/upload-image` : upload profile image (single file)
- `POST /api/auth/signout` : logout

### Users
- `GET /api/users` : list users (admin)
- `GET /api/users/:id` : get user by id
- `PUT /api/users/:id` : update user (admin)
- `DELETE /api/users/:id` : delete user (admin)

### Tasks
- `POST /api/tasks/create` : create task (admin)
- `POST /api/tasks/admin/assign-to-self` : admin take task
- `GET /api/tasks` : get tasks (with `status` query optional)
- `GET /api/tasks/dashboard-data` : task analytics (admin)
- `GET /api/tasks/user-dashboard-data` : user metrics
- `GET /api/tasks/:id` : single task details
- `PUT /api/tasks/:id` : update task
- `DELETE /api/tasks/:id` : delete task (admin)
- `PUT /api/tasks/:id/status` : update status
- `PUT /api/tasks/:id/todo` : update checklist

### Reports
- `GET /api/reports/export` : export tasks to Excel

## Dev Setup

### Prerequisites
- Node.js 18+
- npm
- MongoDB URI (Atlas or local)

### Backend

1. `cd backend`
2. `npm install`
3. Create `.env`:
   - `MONGO_URI=<your-mongo-uri>`
   - `JWT_SECRET=<secure-secret>`
   - `ADMIN_JOIN_CODE=<secret-admin-code>`
   - `FRONT_END_URL=http://localhost:5174`
4. `npm run dev`

### Frontend

1. `cd frontend`
2. `npm install`
3. `npm run dev`
4. Open browser at `http://localhost:5174`

## Notes
- Backend listens on port `3000`
- `uploads` directory stores attachments; avoid committing to Git
- Provide valid JWT/cookie on protected endpoints


---

See `AUTH.md` for login/signup payload examples and auth behavior.  
