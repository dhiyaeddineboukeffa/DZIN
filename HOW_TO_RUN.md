# How to Run DZIN Shop (Production Mode)

The application is now configured to run entirely from the backend server.

## Quick Start

1. Open a terminal.
2. Navigate to the backend folder:
   ```powershell
   cd backend
   ```
3. Start the server:
   ```powershell
   node server.js
   ```
   *You should see: "Server running on port 5000" and "MongoDB Connected"*

## Accessing the App

- Open your browser and go to: **http://localhost:5000**
- The website and API are both running on this port.

## Development Mode (Optional)

If you want to edit the frontend code and see changes instantly:
1. Run the backend as above.
2. In a separate terminal, go to `backend/client` and run `npm run dev`.
3. Access via `http://localhost:5173`.
