# Railway Post-Deployment Guide

Congratulations on deploying your app! Here is how to get it running live.

## 1. Get Your Public URL

1. Go to your **Railway Dashboard**.
2. Click on your project.
3. Click on the **Settings** tab.
4. Scroll down to **Networking**.
5. Click **Generate Domain** (or "Custom Domain" if you have one).
6. Railway will give you a URL like `dzin-shop-production.up.railway.app`.
   - **Click this link** to view your site!

## 2. Seed Your Database (Important!)

Your production database is empty. You need to create the admin user and initial products.

1. In your Railway project, click on the **Variables** tab.
2. Ensure `MONGODB_URI` is set correctly.
3. Go to the **Deployments** tab.
4. Click on the latest deployment to view details.
5. Click on the **Shell** or **Command** tab (sometimes called "Exec").
6. Run this command to seed the database:
   ```bash
   node backend/seed.js
   ```
   *This will create the admin user (password: `admin123`) and initial products.*

## 3. Login as Admin

- Go to your new website URL.
- Navigate to `/admin` (e.g., `https://your-app.up.railway.app/admin`).
- Login with:
  - **Password**: `admin123` (or whatever you set in your seed script/database).

## Troubleshooting

- **"Application Error"**: Check the **Logs** tab in Railway.
- **"Connection Error"**: Check your `MONGODB_URI` variable.
- **Images not loading**: Check your Cloudinary variables.
