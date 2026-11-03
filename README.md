# SprintBoard – Real-Time Collaborative Issue Tracker

SprintBoard is a MERN Stack project and issue management application created for the KvonTech Consultancy Services Pvt. Ltd. Full Stack Developer technical assessment. It gives authenticated users one workspace for creating projects, managing issues, tracking status and priority, and reviewing activity.

> **Implementation note:** The current application is collaborative in its workflow, but it does not currently implement Socket.IO or server-pushed real-time synchronization.

## Table of contents

- [Project overview](#project-overview)
- [Features implemented](#features-implemented)
- [Technology stack](#technology-stack)
- [Project structure](#project-structure)
- [Database architecture](#database-architecture)
- [Installation](#installation)
- [API setup and documentation](#api-setup-and-documentation)
- [Environment variables](#environment-variables)
- [Application workflow](#application-workflow)
- [Screenshots](#screenshots)
- [Future improvements](#future-improvements)

## Project overview

### Problem

Project work can become difficult to track when project notes, issue status, priorities, and progress updates are separated across different tools. SprintBoard provides a focused authenticated workspace where a user can organize projects and their related issues.

### Purpose

Users can create projects, add issues, assign exact workflow statuses and priorities, search and filter issue work, and review dashboard statistics and recent activity. Project and issue queries are scoped to the authenticated user's projects.

### Intended users

The current implementation is suitable for individual developers and small development teams who need a lightweight project and issue tracker. It does not currently include team membership, roles, or multi-user project collaboration controls.

## Features implemented

### Authentication

- User registration with required name, email, and password.
- Minimum six-character password validation.
- Password hashing with `bcryptjs`.
- User login with credential verification.
- JWT generation with a one-day expiry.
- Frontend token storage in local storage.
- Protected frontend routes using `ProtectedRoute`.
- Protected project, issue, dashboard, and activity API routes using `authMiddleware`.
- Passwords are excluded from registration and login response summaries.

**Incomplete:** `/api/auth/profile` is registered without `authMiddleware`, although its controller expects `req.user`. It is documented as a known implementation gap rather than a completed protected feature.

### Project management

- Create projects with a name and optional description.
- List the authenticated user's projects.
- Display issue counts on project list responses using an aggregation lookup.
- Retrieve an owned project by id.
- Update an owned project's name and description.
- Delete an owned project and its issues.
- Project ownership checks prevent access to another user's projects.

### Issue management

- Create an issue in an owned project.
- Edit issue title, description, status, and priority through the API.
- The current project detail UI edits the issue title through a browser prompt.
- Delete issues owned through the user's projects.
- Update issue status using the exact values `To Do`, `In Progress`, and `Done`.
- Set priority using the exact values `Low`, `Medium`, and `High`.
- Access checks prevent users from reading or changing issues in another user's projects.

### Dashboard

The authenticated dashboard requests real data from the backend and displays:

- Total projects.
- Total issues.
- Open issues (`To Do`).
- Issues in progress (`In Progress`).
- Completed issues (`Done`).
- High-priority issues (`High`).
- Recent projects.
- Recent issues.
- Recent activity.

Dashboard statistics are calculated by aggregating issues belonging to projects created by the authenticated user.

### Advanced features

- Issue title search using the `search` query parameter.
- Status filtering using `status`.
- Priority filtering using `priority`.
- Project filtering using `project` or `projectId`.
- Activity records for issue creation and updates.
- Recent activity display with populated user and issue titles.
- Responsive dark monochromatic frontend styling.

**Not implemented:** Socket.IO synchronization, role-based access, pagination, and push notifications.

## Technology stack

Versions below are the versions declared in the current package manifests.

| Technology | Version / source | Purpose |
|---|---:|---|
| React | `^19.3.1` | Frontend component framework |
| React DOM | `^19.3.1` | Browser rendering |
| Vite | `^8.3.5` | Frontend development server and build tool |
| JavaScript | ES modules | Application language and module format |
| React Hooks | React built-in | Local component state and effects |
| React Router DOM | `^7.18.5` | Client-side routing and protected route layout |
| Axios | `^1.21.0` | HTTP communication with the API |
| Lucide React | `^1.66.0` | Outline interface icons |
| CSS | Native CSS | Responsive styling and design system |
| Node.js | Runtime | Backend JavaScript runtime |
| Express | `^5.3.0` | HTTP API framework |
| MongoDB Atlas | Configured through `MONGODB_URI` | Database hosting target |
| Mongoose | `^9.11.4` | MongoDB schemas, models, queries, and population |
| jsonwebtoken | `^9.0.3` | JWT creation and verification |
| bcryptjs | `^3.0.3` | Password hashing and comparison |
| cors | `^2.8.6` | Configured frontend-origin access |
| dotenv | `^18.0.9` | Loads server environment variables |

## Project structure

```text
SprintBoard/
├── client/
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       ├── App.css
│       ├── components/
│       │   ├── ActivityFeed.jsx
│       │   ├── Layout.jsx
│       │   ├── Navbar.jsx
│       │   ├── ProtectedRoute.jsx
│       │   ├── Sidebar.jsx
│       │   └── Toast.jsx
│       ├── pages/
│       │   ├── Activity.jsx
│       │   ├── Dashboard.jsx
│       │   ├── Issues.jsx
│       │   ├── Login.jsx
│       │   ├── ProjectDetails.jsx
│       │   ├── Projects.jsx
│       │   └── Register.jsx
│       └── services/
│           └── api.js
├── server/
│   ├── package.json
│   ├── server.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Activity.js
│   │   ├── Issue.js
│   │   ├── Project.js
│   │   └── User.js
│   ├── controllers/
│   │   ├── activityController.js
│   │   ├── authController.js
│   │   ├── dashboardController.js
│   │   ├── issueController.js
│   │   └── projectController.js
│   └── routes/
│       ├── activityRoutes.js
│       ├── authRoutes.js
│       ├── dashboardRoutes.js
│       ├── issueRoutes.js
│       └── projectRoutes.js
├── .gitignore
├── README.md
└── Project_Context.md
```

### Important frontend files

- `client/src/App.jsx`: declares public and protected browser routes.
- `client/src/components/Layout.jsx`: shared sidebar, navbar, and page shell.
- `client/src/components/ProtectedRoute.jsx`: redirects users without a stored token to `/login`.
- `client/src/services/api.js`: Axios instance configured for the API.
- `client/src/pages/Dashboard.jsx`: loads statistics, projects, issues, and activity presentation.
- `client/src/pages/Projects.jsx`: project listing and project CRUD actions.
- `client/src/pages/ProjectDetails.jsx`: project-scoped issue creation, filtering, updates, and deletion.
- `client/src/pages/Issues.jsx`: cross-project issue search and filters.

### Important backend files

- `server/server.js`: Express setup, CORS, JSON parsing, route mounting, MongoDB connection, and listener startup.
- `server/middleware/authMiddleware.js`: JWT extraction and verification.
- `server/models/`: Mongoose schema definitions.
- `server/controllers/`: validation, ownership checks, database operations, activity creation, and responses.
- `server/routes/`: HTTP method and URL declarations.

## Database architecture

The application uses MongoDB through Mongoose. Mongoose timestamps add `createdAt` and `updatedAt` to `User`, `Project`, and `Activity`, while the `Issue` schema also enables timestamps.

### Users collection

| Field | Type | Constraints |
|---|---|---|
| `name` | String | Required, trimmed |
| `email` | String | Required, unique, lowercased, trimmed |
| `password` | String | Required; stores the bcrypt hash |

### Projects collection

| Field | Type | Constraints |
|---|---|---|
| `name` | String | Required |
| `description` | String | Optional |
| `createdBy` | ObjectId → `User` | Required |
| `createdAt`, `updatedAt` | Date | Mongoose timestamps |

### Issues collection

| Field | Type | Constraints |
|---|---|---|
| `title` | String | Required |
| `description` | String | Optional |
| `status` | String | `To Do`, `In Progress`, or `Done`; defaults to `To Do` |
| `priority` | String | `Low`, `Medium`, or `High`; defaults to `Medium` |
| `projectId` | ObjectId → `Project` | Required |
| `createdBy` | ObjectId → `User` | Required |
| `createdAt`, `updatedAt` | Date | Mongoose timestamps |

### Activities collection

| Field | Type | Constraints |
|---|---|---|
| `userId` | ObjectId → `User` | Required |
| `issueId` | ObjectId → `Issue` | Required |
| `action` | String | Required |
| `createdAt`, `updatedAt` | Date | Mongoose timestamps |

## Installation

The commands below are Windows-friendly and use the npm scripts present in the manifests.

### 1. Clone the repository

```powershell
git clone <repository-url>
cd SprintBoard
```

### 2. Open the project in VS Code

```powershell
code .
```

If the `code` command is unavailable, open the folder through **File > Open Folder** in VS Code.

### 3. Install backend dependencies

```powershell
cd server
npm install
```

### 4. Install frontend dependencies

```powershell
cd ..\client
npm install
```

### 5. Configure environment variables

Create `server\.env` using the variable names in the [Environment variables](#environment-variables) section. Do not commit credentials.

### 6. Start the backend

From `server\`:

```powershell
npm start
```

The server uses `PORT` or defaults to port `5000`.

### 7. Start the frontend

Open a second PowerShell terminal:

```powershell
cd SprintBoard\client
npm run dev
```

### 8. Open the application

Open the Vite URL printed in the terminal, normally `http://localhost:5173`.

### Available validation scripts

From `client\`:

```powershell
npm run lint
npm run build
npm run preview
```

The server manifest provides `npm start` and `npm run dev`.

## API setup and documentation

The backend mounts its API under `/api`. The default local base URL is `http://localhost:5000/api`.

Authentication requirements below describe the route middleware in the current source, not an assumed future configuration.

### Authentication APIs

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| POST | `/api/auth/register` | Validate input, hash the password, and create a user | Not required |
| POST | `/api/auth/login` | Verify credentials and return a one-day JWT plus safe user summary | Not required |
| GET | `/api/auth/profile` | Read a profile using `req.user.id` in the controller | **No route middleware currently attached; known bug** |

### Project APIs

All project routes use `authMiddleware`.

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| POST | `/api/projects` | Create a project owned by the authenticated user | Bearer JWT |
| GET | `/api/projects` | List owned projects and calculated issue counts | Bearer JWT |
| GET | `/api/projects/:id` | Retrieve an owned project | Bearer JWT |
| PUT | `/api/projects/:id` | Update an owned project's name or description | Bearer JWT |
| DELETE | `/api/projects/:id` | Delete an owned project and its issues | Bearer JWT |

### Issue APIs

All issue routes use `authMiddleware`.

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| POST | `/api/issues` | Create an issue in an owned project | Bearer JWT |
| GET | `/api/issues` | List issues in the user's projects | Bearer JWT |
| GET | `/api/issues/:id` | Retrieve an accessible issue | Bearer JWT |
| PUT | `/api/issues/:id` | Update title, description, status, or priority | Bearer JWT |
| DELETE | `/api/issues/:id` | Delete an accessible issue and associated activity records | Bearer JWT |

`GET /api/issues` accepts:

| Query parameter | Behavior |
|---|---|
| `search` | Case-insensitive regular-expression match against issue title |
| `status` | Exact value: `To Do`, `In Progress`, or `Done` |
| `priority` | Exact value: `Low`, `Medium`, or `High` |
| `project` | Project ObjectId filter |
| `projectId` | Alias accepted by the controller for project filtering |

### Dashboard API

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| GET | `/api/dashboard/stats` | Aggregate project count and issue counts for the user's projects | Bearer JWT |

Response fields are `totalProjects`, `totalIssues`, `openIssues`, `inProgressIssues`, `completedIssues`, and `highPriorityIssues`.

### Activity API

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| GET | `/api/activities` | Return up to ten recent activity records for the user's projects, populated with user name and issue title | Bearer JWT |

### Server health route

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| GET | `/` | Returns a server-running confirmation message | Not required |

## Environment variables

The current server reads these names:

| Variable | Purpose | Required |
|---|---|---|
| `PORT` | HTTP server port; defaults to `5000` when omitted | No |
| `MONGODB_URI` | MongoDB connection string passed to `mongoose.connect` | Yes for startup |
| `JWT_SECRET` | Secret used by `jsonwebtoken` to sign and verify tokens | Yes for authentication |
| `CLIENT_URL` | CORS allowed origin; defaults to `http://localhost:5173` | No |

Example without credentials:

```env
PORT=5000
MONGODB_URI=<MongoDB connection string>
JWT_SECRET=<JWT signing secret>
CLIENT_URL=http://localhost:5173
```

There is no `.env.example` file currently present in the inspected repository. The real `server/.env` file was not reproduced here and no credential values are documented.

## Application workflow

1. **Registration:** the user submits name, email, and password to `/api/auth/register`.
2. **Login:** the user submits credentials to `/api/auth/login`; the client stores the returned token and user summary.
3. **Dashboard:** the protected dashboard requests statistics, projects, issues, and activity.
4. **Create project:** the user submits a project name and description to `/api/projects`.
5. **Create issues:** the project detail page submits title, description, priority, and project id to `/api/issues`.
6. **Update status:** a status selection sends a PUT request with `To Do`, `In Progress`, or `Done`.
7. **View activity:** issue creation and updates create Activity documents, which are retrieved through `/api/activities`.

## Screenshots

Actual screenshot files were not supplied to the repository. Add images when available using these names:

- `[Login screenshot placeholder]`
- `[Registration screenshot placeholder]`
- `[Dashboard screenshot placeholder]`
- `[Projects screenshot placeholder]`
- `[Project Details screenshot placeholder]`
- `[Issue Management screenshot placeholder]`

## Future improvements

These are not currently implemented:

- Socket.IO real-time synchronization.
- Role-based access and project membership.
- Issue, project, and activity pagination.
- Enhanced notifications and durable toast history.
- Automated API, component, and end-to-end tests.
- Centralized request schema validation and error handling.
- Configurable frontend API base URL for deployed environments.
- Protecting `/api/auth/profile` with the existing authentication middleware.
