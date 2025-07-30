# Role-Based Admin Dashboard

An admin dashboard web application with role-based access control (RBAC), supporting multiple user roles (Admin, Editor, Viewer). Built with a modern **Next.js** frontend using the App Router, **Express.js** backend APIs, and **MongoDB** as the database. The frontend UI uses **Tailwind CSS** with **shadcn/ui** components and includes a theme toggler with dark/light modes.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Authentication & Authorization](#authentication--authorization)
- [Role-based Access](#role-based-access)
- [API Endpoints](#api-endpoints)
- [Frontend Pages](#frontend-pages)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

This project is a secure and scalable admin dashboard application where users see dynamic UI and data access based on assigned roles. The system supports three main user roles:

- **Admin** — Can manage users (list, edit roles, delete), view system logs, and access all content.
- **Editor** — Can create, edit, delete content posts.
- **Viewer** — Has read-only access to content.

The system emphasizes secure authentication, API protection, client-side role guarding, and a modern responsive UI.

---

## Features

- User registration & authentication with JWT tokens.
- Role-based route and API protection.
- Admin panel to manage users and view system logs.
- Editor panel to create & manage content.
- Viewer panel to browse content in read-only mode.
- Responsive and accessible UI using Tailwind CSS and shadcn/ui components.
- Dark/light theme toggler integrated with next-themes.
- Secure API with Express.js and MongoDB backend.
- Centralized React Context-based auth state management.
- Client-side route guards ensuring only authorized users can access pages.

---

## screenshot

<img width="1919" height="1023" alt="Screenshot 2025-07-30 150817" src="https://github.com/user-attachments/assets/79d053d0-2515-4b58-b545-1ec32e7b9d6b" />


## Tech Stack

| Layer     | Technology                 |
| --------- | --------------------------|
| Frontend  | Next.js 13 (App Router)    |
| Styling   | Tailwind CSS, shadcn/ui    |
| Theme     | next-themes, lucide-icons  |
| State     | React Context (`AuthContext`) with Hooks |
| Backend   | Express.js, Node.js        |
| Authentication | JWT tokens              |
| Database  | MongoDB (using Mongoose)   |
| API Client| Axios                     |

---

## Folder Structure

├── admin
│   ├── logs
│   │   └── page.js # Admin logs page (protected)
│   └── users
│   └── page.js # Admin users management (protected)
├── components
│   ├── Layout.jsx # Client root Layout with user state
│   ├── Navbar.jsx # Navbar component with login/logout
│   ├── ThemeToggle.jsx # Theme toggler (shadcn-ui)
│   └── roleGuard.js # Client role guard hook
├── editor
│   └── content
│   └── page.js # Editor content management (protected)
├── login
│   └── page.js # Login page
├── register
│   └── page.js # Register page
├── viewer
│   └── content
│   └── page.js # Viewer content page (read-only)
├── api.js # Axios API helper
├── context
│   └── AuthContext.jsx # React Context for auth state (+ login/logout)
├── globals.css # Global Tailwind CSS styles
├── layout.js # Server root layout file wrapping ThemeProvider + Layout
└── page.js # Root page that redirects based on user role


---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB (local or cloud)
- npm or yarn package manager


*Use your backend API URL accordingly.*

For backend, create `.env` in `/backend`:

MONGO_URI=mongodb://localhost:27017/admin-dashboard
JWT_SECRET=YOUR_SECRET_HERE
PORT=4000


Never commit `.env` files to Git.

---

## Running the Application

- **Backend:**  
  Setup and run your Express backend server (`node server.js` or `npm start`) on port `4000` (or as configured).

- **Frontend:**  
  Run your Next.js frontend (`npm run dev`) on port `3000`. The frontend uses React Context for auth and consumes the backend APIs.

---

## Authentication & Authorization

- Users authenticate via `/auth/login` on backend, obtaining JWT tokens.
- Auth tokens are stored in localStorage and attached to API requests via Axios.
- React Context (`AuthContext`) holds React user state and provides login/logout functions.
- Role-based API access enforced through backend middleware.
- Client-side roles enforced using `useRoleGuard` hook and React Context state.

---

## Role-based Access

| Role   | Accessible Pages                    |
|--------|-----------------------------------|
| Admin  | `/admin/users`, `/admin/logs`, all content management |
| Editor | `/editor/content`                  |
| Viewer | `/viewer/content`                  |

---

## API Endpoints (Backend)

- POST `/api/auth/register` — Register new users
- POST `/api/auth/login` — Authenticate user, return JWT
- GET `/api/users` — (Admin) List all users
- PUT `/api/users/:id/role` — (Admin) Update user role
- DELETE `/api/users/:id` — (Admin) Delete user
- GET `/api/content` — List posts (any authenticated user)
- POST `/api/content` — Create post (Admin, Editor)
- PUT `/api/content/:id` — Update post (Admin, Editor or post author)
- DELETE `/api/content/:id` — Delete post (Admin, Editor or post author)
- GET `/api/logs` — (Admin) Get system activity logs

---

## Frontend Pages Summary

- `/login` — Login page
- `/register` — Registration page
- `/admin/users` — Admin users management
- `/admin/logs` — Admin system logs
- `/editor/content` — Editor content manager
- `/viewer/content` — Viewer content read-only
- `/` — Root redirect page based on user role

---

## Contributing

Feel free to open issues or pull requests to improve the app.  
Please maintain code quality and add tests for new features.

---

## License

MIT License © Your Name

---

### Contact & Help

If you need help setting up or extending this project, feel free to reach out or create an issue.

---

*This project was generated with modern Next.js 13 architecture and best full-stack practices.*


