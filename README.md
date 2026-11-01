# Mini Project Manager

A modern, full-stack **Project & Task Management** web application built with **React**, **Next.js 16 (App Router)**, **Redux Toolkit (RTK Query)**, **Node.js / Express**, **MongoDB**, and **Three.js WebGL**.

Featuring full multi-tenant data isolation, JWT authentication, real-time milestone progress tracking, status workflows (`todo`, `in-progress`, `done`), due date sorting, and an interactive 3D WebGL monogram with 4 live animated theme worlds.

---

## 🔗 Public Repository
- **GitHub Repository**: [https://github.com/Nitin479/mini-project-manager](https://github.com/Nitin479/mini-project-manager)

---

## 📋 Table of Contents
1. [Tech Stack](#-tech-stack)
2. [Core Features](#-core-features)
3. [Project Setup & Installation](#-project-setup--installation)
4. [Sample Environment Variables (`.env.example`)](#-sample-environment-variables-envexample)
5. [🎮 Functionality of Every Button & Control](#-functionality-of-every-button--control)
6. [📡 REST API Endpoints](#-rest-api-endpoints)
7. [Architecture & Implementation Notes](#-architecture--implementation-notes)

---

## 🛠 Tech Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend Framework** | **Next.js 16 (App Router) + React 19** | Fast SSR & client-side routing with clean modern layout |
| **State Management** | **Redux Toolkit + RTK Query** | Centralized client state & automatic server cache invalidation (`tagTypes`) |
| **Styling & Design** | **Tailwind CSS** | Responsive dark & light themes, high-contrast frosted glass panels |
| **3D Engine** | **Three.js WebGL** | Real-time 3D initial monogram and 4 dynamic animated 3D environments |
| **Backend Framework** | **Node.js + Express** | Modular RESTful microservice API architecture |
| **Database** | **MongoDB (Mongoose ODM)** | Multi-tenant schema design for Users, Projects, and Tasks |
| **Authentication** | **JWT (JSON Web Tokens) + bcryptjs** | Salted password hashing and stateless authorization |

---

## ✨ Core Features

1. **Authentication**: Secure Signup / Login with email and password, bcrypt password hashing, and JWT token protection on all private API endpoints and frontend routes.
2. **Projects Management**: Each authenticated user manages their own projects (`title`, `description`). Automatic real-time progress computation (`completedTasks / totalTasks * 100%`).
3. **Tasks Pipeline**:
   - Each task belongs to a project and has: `title`, `description`, `status` (`todo`, `in-progress`, `done`), and `dueDate`.
   - Create, edit, and delete tasks with instant updates.
   - Quick one-click cycling of task status.
   - Real-time status filtering tabs (`All Tasks`, `To Do`, `In Progress`, `Done`).
   - Due date sorting (`Due ASC / DESC`).
   - In-project live text search.
4. **4 Dynamic 3D Animated Background Environments**:
   - **Chrome**: Wireframe polyhedra (Dodecahedron & Octahedron) and drifting 3D constellation network with dynamic linking lines.
   - **Cyber Core**: Undulating 3D Tron wave horizon plane, falling neon matrix data code beams, and holographic cyber cubes.
   - **Quantum Crystal**: 12 multifaceted floating gemstone crystals gently tumbling in zero-gravity with a 750-particle swirling firefly vortex.
   - **Gyroscope**: 3 massive concentric astronomical celestial rings spinning on multi-axis planetary tilts, a logarithmic spiral galaxy starfield, and shooting meteors.

---

## 🚀 Project Setup & Installation

### Prerequisites
- **Node.js**: `v18.x` or higher (tested on Node v20/v22/v25)
- **npm**: `v9.x` or higher
- **MongoDB**: Local MongoDB instance running on `mongodb://localhost:27017` (or MongoDB Atlas connection string)

---

### Step 1: Backend Setup

1. Open your terminal and navigate into the `backend` folder:
   ```bash
   cd backend
   ```

2. Copy the sample environment file to create `.env`:
   ```bash
   cp .env.example .env
   ```

3. Open `.env` and verify the values:
   ```env
   PORT=5001
   MONGO_URI=mongodb://localhost:27017/mini-project-manager
   JWT_SECRET=super_secret_jwt_key_mini_project_manager_2026
   ```

4. Install backend dependencies:
   ```bash
   npm install
   ```

5. (Optional) Seed realistic starter projects and tasks:
   ```bash
   npm run seed
   ```

6. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server starts on:* `http://localhost:5001` (Connected to MongoDB).

---

### Step 2: Frontend Setup

1. Open a new terminal tab and navigate into the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Copy the sample environment file to create `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

3. Ensure `.env.local` contains:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5001/api
   ```

4. Install frontend dependencies:
   ```bash
   npm install
   ```

5. Start the frontend Next.js development server:
   ```bash
   npm run dev
   ```
   *Open your browser and visit:* `http://localhost:3000`

---

## 🔑 Sample Environment Variables (`.env.example`)

### Backend (`backend/.env.example`)
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/mini-project-manager
JWT_SECRET=your_jwt_secret_key_change_in_production
```

### Frontend (`frontend/.env.example`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

---

## 🎮 Functionality of Every Button & Control

Here is a complete, detailed reference for **every button, control, and action** in the application:

### 1. Global Navigation Bar (`Navbar.js`)
| Button / Control | Visual Icon | Location | Functionality & Behavior |
|---|---|---|---|
| **Theme Mode Toggle** | Sun / Moon Icon | Top Right | Toggles between **Dark Mode** and **Light Mode**. Automatically applies the `dark` class to `<html>`, updates CSS color-scheme, and stores the user's preference in `localStorage` for future visits. |
| **Projects Navigation Link** | Grid / Blocks Icon | Top Right | Navigates the user back to the main Project Dashboard (`/dashboard`). |
| **ProjectManager Brand Logo** | Gradient Checklist Icon + Title | Top Left | Acts as the home link. Clicking redirects to `/dashboard`. |
| **Logout Button** | Sign-out Arrow Icon + "Logout" | Top Right | Signs out the user. Dispatches `logout()` to remove credentials from Redux, clears `token` and `user` from `localStorage`, dispatches `apiSlice.util.resetApiState()` to purge cached project queries (preventing data leakage), and redirects to `/login`. |

---

### 2. Authentication Pages (`/login` & `/signup`)
| Button / Control | Location | Functionality & Behavior |
|---|---|---|
| **SHOW / HIDE Password** | Password Input Box | Toggles input type between `password` (masked bullets `••••••••`) and `text` (plaintext characters) so the user can verify password entry. |
| **Sign In Button** | Login Form | Submits the email and password to `POST /api/auth/login`. On success, stores the JWT token in `localStorage`, updates Redux authentication state, purges stale cache, and redirects to `/dashboard`. Displays an inline red error alert if credentials are invalid. |
| **Create Account Button** | Signup Form | Submits `name`, `email`, and `password` to `POST /api/auth/register`. Hashes password with bcrypt, provisions the account, automatically seeds starter demo projects and tasks in MongoDB, and redirects to the login screen with a success badge. |
| **Switch to Sign Up / Sign In Links** | Bottom of Auth Card | Quick routing links allowing users to switch between the login view (`/login`) and signup view (`/signup`). |

---

### 3. Main Project Dashboard (`/dashboard`)
| Button / Control | Location | Functionality & Behavior |
|---|---|---|
| **+ New Project Button** | Top Right Header | Opens the **Create New Project** modal dialog allowing the user to specify a project title and description. |
| **Auto-Rotate: ON / OFF Button** | 3D Hero Controls | Toggles automatic 360° rotational physics for the 3D monogram on the interactive 3D stage. When OFF, the model stays in place until dragged with the mouse. |
| **Clear Search Button** | Project Search Input | Appears when text is typed in the search field. Clicking resets the query to empty, instantly showing all projects. |
| **Create First Project Button** | Empty State Card | Displayed when the user has 0 projects. Opens the **Create New Project** modal dialog. |
| **⚡ Load Demo Data Button** | Empty State Card | Triggers `POST /api/projects/seed-demo`, which automatically provisions 3 sample projects with complete milestone tasks (To Do, In Progress, Done) for instant testing. |

---

### 4. Interactive 3D Stage & Lusion.co Experience (`Lusion3DHero.js`)
| Button / Control | Type | Functionality & Visual Behavior |
|---|---|---|
| **🧑‍🚀 Lusion Spaceman Button** | Experience Mode | Activates the **3D Zero-G Astronaut** floating through an infinite **Lusion Cyber Data Tunnel**, inspired by the award-winning `lusion.co` web experience. Features reflective visor reflections, blinking chest life-support LEDs, sinusoidal zero-g buoyancy, dynamic mouse head tracking, and chromatic rainbow lens flare halos. |
| **🔤 3D Monogram Button** | Experience Mode | Activates the **Personalized 3D Initial Monogram** extruded in real time from SVG glyphs matching the logged-in user's initial with specular metallic reflections. |
| **• Chrome [Initial]** | Theme Preset | Sets theme to `chrome`. Transforms background to floating wireframe **Dodecahedron & Octahedron** with a dynamic 3D **node constellation network** and blueprint grid. |
| **⚡ Cyber Core** | Theme Preset | Sets theme to `cyber`. Transforms background to an undulating 3D **Tron wave grid**, 45 falling **digital matrix data code beams**, and cyber cubes. |
| **💎 Quantum Crystal** | Theme Preset | Sets theme to `crystal`. Transforms background to 12 multifaceted **floating gemstone crystals** bobbing in zero-gravity and a **750-particle swirling firefly vortex**. |
| **🪐 Gyroscope** | Theme Preset | Sets theme to `gyro`. Transforms background to 3 massive **celestial astrolabe rings**, a **spiral galaxy starfield**, and dynamic **shooting meteors**. |
| **• Chrome [Initial]** | Violet / Indigo Glow | Sets theme to `chrome`. Transforms background to floating wireframe **Dodecahedron & Octahedron** with a dynamic 3D **node constellation network** and blueprint grid. |
| **⚡ Cyber Core** | Cyan / Teal Glow | Sets theme to `cyber`. Transforms background to an undulating 3D **Tron wave grid**, 45 falling **digital matrix data code beams**, and cyber cubes. |
| **💎 Quantum Crystal** | Emerald / Gold Glow | Sets theme to `crystal`. Transforms background to 12 multifaceted **floating gemstone crystals** bobbing in zero-gravity and a **750-particle swirling firefly vortex**. |
| **🪐 Gyroscope** | Pink / Purple Glow | Sets theme to `gyro`. Transforms background to 3 massive **celestial astrolabe rings**, a **spiral galaxy starfield**, and dynamic **shooting meteors**. |

---

### 5. Project Cards (`ProjectCard.js`)
| Button / Control | Location | Functionality & Behavior |
|---|---|---|
| **Card Body Click** | Entire Card | Navigates directly into the project detail view at `/projects/:id`. |
| **View Project & Tasks →** | Card Footer (Left) | Directly navigates into the project's task management workspace at `/projects/:id`. |
| **Edit Button** | Card Footer (Right) | Opens the **Edit Project** modal dialog pre-filled with the current project's title and description. |
| **Delete Button** | Card Footer (Right) | Enters deletion safety confirmation mode, temporarily showing **Confirm** and **Cancel** buttons. |
| **Confirm Deletion Button** | Card Footer (Confirm Mode) | Sends `DELETE /api/projects/:id`. Deletes the project, triggers cascade deletion of all child tasks in MongoDB, updates the dashboard stats, and shows a green toast notification. |
| **Cancel Deletion Button** | Card Footer (Confirm Mode) | Aborts the deletion and restores normal card actions. |

---

### 6. Project Detail View (`/projects/:id`)
| Button / Control | Location | Functionality & Behavior |
|---|---|---|
| **Projects Breadcrumb Link** | Top Left of Header | Navigates back to the Dashboard (`/dashboard`). |
| **Edit Project Button** | Project Header Banner | Switches the static project header into an inline editable form with inputs for Title and Description. |
| **Save Changes Button** | Inline Project Edit Form | Sends `PUT /api/projects/:id` to save updated title and description in MongoDB. Shows a success toast on completion. |
| **Cancel Button** | Inline Project Edit Form | Reverts unsaved changes and closes the inline edit form. |
| **All Tasks Tab Button** | Filter Toolbar | Filters the visible task list to display all tasks regardless of status. |
| **To Do Tab Button** | Filter Toolbar | Filters the task list to only tasks with `status === 'todo'`. |
| **In Progress Tab Button** | Filter Toolbar | Filters the task list to only tasks with `status === 'in-progress'`. |
| **Done Tab Button** | Filter Toolbar | Filters the task list to only tasks with `status === 'done'`. |
| **Due Date Sort Button (`Due ASC / DESC`)** | Filter Toolbar | Toggles the task sort order by due date. `ASC` sorts earliest deadlines first; `DESC` sorts latest deadlines first. |
| **+ Add Task Button** | Filter Toolbar (Right) | Opens the **Add Task** modal dialog to create a milestone task within the project. |
| **Clear Search Button** | Task Search Field | Clears the current task search query. |

---

### 7. Task Cards & Milestone Controls (`TaskCard.js`)
| Button / Control | Location | Functionality & Behavior |
|---|---|---|
| **Quick Complete / Cycle Checkbox** | Left Edge of Card | Cycles the task status instantly: `todo` ➔ `in-progress` ➔ `done` ➔ `todo`. Dispatches `PUT /api/tasks/:id` without needing to open a modal. |
| **Clickable Status Pill Badge** | Next to Task Title | Displays the current status (`TO DO`, `IN PROGRESS`, `DONE`). Clicking this badge also cycles the status to the next stage immediately. |
| **Edit Task Button (Pencil Icon)** | Right Edge of Card | Opens the **Edit Task** modal dialog pre-filled with the task's title, description, status, and due date. |
| **Delete Task Button (Trash Icon)** | Right Edge of Card | Enters confirmation mode displaying **Del** and **Cancel** buttons. |
| **Del Confirmation Button** | Right Edge (Confirm Mode) | Sends `DELETE /api/tasks/:id`. Permanently removes the task from the database and decrements the project task counter. |
| **Cancel Confirmation Button** | Right Edge (Confirm Mode) | Aborts task deletion and restores action icons. |

---

### 8. Modal Dialogs (`Modal.js`, `ProjectForm.js`, `TaskForm.js`)
| Button / Control | Location | Functionality & Behavior |
|---|---|---|
| **Modal Close Button (X)** | Top Right of Modal Header | Closes the modal without saving any changes. |
| **Modal Backdrop Click** | Outside Modal Card | Clicking anywhere outside the modal automatically closes it. |
| **Form Cancel Button** | Bottom Right of Form | Discards form input and dismisses the modal. |
| **Today Shortcut Button** | Due Date Field (Task Form) | Automatically sets the due date input to today's date. |
| **Tomorrow Shortcut Button** | Due Date Field (Task Form) | Automatically sets the due date input to tomorrow's date (+1 day). |
| **+1W Shortcut Button** | Due Date Field (Task Form) | Automatically sets the due date input to one week from today (+7 days). |
| **Status Segmented Chips** | Status Field (Task Form) | Three selectable buttons (`To Do`, `In Progress`, `Done`) to set the initial status of the task. |
| **Submit Button** (`Create Project` / `Update Project` / `Add Task` / `Update Task`) | Bottom Right of Form | Validates that required fields (Title) are not empty, submits the request via RTK Query mutation, closes the modal, and shows a green toast notification. |

---

## 📡 REST API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | No | Register user (`name`, `email`, `password`) |
| `POST` | `/api/auth/login` | No | Login user & return JWT token |
| `GET` | `/api/auth/me` | Yes | Get authenticated user profile |

### Projects
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/projects` | Yes | List all projects belonging to user with computed task counts |
| `GET` | `/api/projects/:id` | Yes | Get single project by ID (validates ownership) |
| `POST` | `/api/projects` | Yes | Create project (`title`, `description`) |
| `PUT` | `/api/projects/:id` | Yes | Update project properties |
| `DELETE` | `/api/projects/:id` | Yes | Delete project and cascade-delete child tasks |
| `POST` | `/api/projects/seed-demo` | Yes | Populate demo projects and tasks for the account |

### Tasks
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/projects/:projectId/tasks` | Yes | List tasks (supports `?status=todo`, `?sortBy=dueDate`, `?order=asc`) |
| `POST` | `/api/projects/:projectId/tasks` | Yes | Create task (`title`, `description`, `status`, `dueDate`) |
| `PUT` | `/api/tasks/:id` | Yes | Update task properties or status |
| `DELETE` | `/api/tasks/:id` | Yes | Delete task |

---

## 💡 Architecture & Implementation Notes

1. **High-Contrast Frosted Glass Cards**:
   - All cards (`ProjectCard`, `TaskCard`, Header Banner, Filter Toolbar) use high-contrast frosted glass styling (`bg-white/95 dark:bg-[#0c101d]/90 backdrop-blur-2xl border-slate-200 dark:border-white/[0.14] shadow-xl`).
   - This ensures content and buttons remain legible over the 3D animated background while allowing the dynamic particles and celestial rings to shine through around the cards.

2. **RTK Query Cache Invalidation**:
   - Centralized `apiSlice` with tag types `['Project', 'Task']`.
   - Creating, updating, or deleting any project or task automatically triggers cache refetches without full page reloads.
   - Logging out calls `apiSlice.util.resetApiState()`, purging cached IDs to prevent multi-tenant token leakage.

3. **Optimized 3D WebGL Rendering**:
   - Geometries, materials, and animation frames are disposed of on theme changes and component unmount to ensure zero memory accumulation and a smooth 60 FPS.
   - Celestial rings in the Gyroscope theme are placed at depth (`z: -14`) and tilted to frame the interface from behind the UI cards.

---


