# PROJECT DZIN

Quick start instructions for the project.

Prerequisites
- Node.js (v18+ recommended)
- MongoDB (Atlas or local)

Backend
1. Copy `backend/.env.example` to `backend/.env` and fill values.
2. Install dependencies and start:
   - `cd backend`
   - `npm install`
   - `node server.js` (or add a `start` script)

Frontend
1. Install and run the Vite dev server:
   - `cd dzin-shop`
   - `npm install`
   - `npm run dev`

Build for production
1. `cd dzin-shop && npm run build`
2. Serve static files from `dzin-shop/dist` — the backend already serves this folder.

Pushing to GitHub
1. Create a GitHub repository.
2. Add remote and push:
   - `git remote add origin https://github.com/<user>/<repo>.git`
   - `git push -u origin master`

If you'd like, I can create the initial commit and help add the remote.