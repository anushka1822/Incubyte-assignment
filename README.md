# Sweet Shop Management System

A full-stack web application for managing a sweet shop, featuring user authentication and inventory management. This project was built as part of the Incubyte assessment.

## Deployed Links
- Frontend : [Vercel](https://incubyte-assignment-flame.vercel.app/)
- Backend : [Render](https://incubyte-assignment-1-ea7f.onrender.com/docs)

*Note:The backend is deployed in render so it may take time to reactivate the server. Please visit the backend link before running the frontend as it will fire up the server.*

## Tech Stack

### Frontend
- **Framework:** React (Vite)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Icons:** Lucide React

### Backend
- **Framework:** FastAPI
- **Language:** Python
- **Database:** SQLite (via SQLAlchemy)
- **Authentication:** JWT (JSON Web Tokens)

## Features
- **User Authentication:** Secure Login and Registration pages.
- **Dashboard:** Protected route for managing shop activities.
- **Welcome Page:** Landing page for the application.
- **Responsive Design:** Built with Tailwind CSS for mobile and desktop compatibility.

## Installation and Setup

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment:
   ```bash
   python -m venv venv
   ./venv/scripts/Activate.ps1  # On macos: source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the server:
   ```bash
   uvicorn app.main:app --reload
   ```
   The backend will start at `http://localhost:8000`.

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will start at `http://localhost:5173`.

---

## My AI Usage

### AI Tools Used
I utilized the following AI tools during the development of this project:
- **Gemini 3.0:** My primary AI coding assistant for full-stack development.
- **ChatGPT:** Used for brainstorming edge cases and quick syntax lookups.

### How I Used Them
- **Code Generation:** I used Gemini to generate the initial boilerplate for the FastAPI backend and React frontend, including the directory structure and key configuration files (vite.config.ts, tailwind.config.ts).
- **Debugging:** When I encountered CORS errors between the frontend and backend, I asked the AI to analyze my `main.py` middleware configuration and suggest the correct setup.
- **Database Design:** I brainstormed the data model for User and Sweet entities to ensure proper normalization and relationships.
- **Frontend Logic:** I utilized AI to write the context provider (`AuthContext.tsx`) for managing global authentication state in React.
- **Unit Testing:** I asked the AI to help write Pytest fixtures in `conftest.py` ensuring my tests were isolated and reliable.

### Reflection on AI Usage
AI significantly enhanced my workflow by reducing the time spent on repetitive tasks and boilerplate setup. Instead of manually configuring every file, I could describe the desired architecture and get a working foundation in minutes.

The most impactful part was identifying subtle bugs. For instance, debugging database connection issues in `async` contexts is often tricky, but the AI provided immediate insights into `asynccontextmanager` usage in FastAPI.

However, I learned that AI suggestions always need review. Sometimes the suggested imports or library versions required manual adjustment to fit the specific project constraints. Overall, AI acted as a powerful pair programmer that allowed me to focus more on feature logic and less on configuration.
