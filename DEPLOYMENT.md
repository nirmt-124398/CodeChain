# Deployment Guide

This project is a monorepo containing a **Next.js frontend** and an **Express backend**. Here is how to deploy them for free using Vercel and Render.

## Prerequisites

1.  Push your code to a GitHub repository.

## Part 1: Deploy Backend to Render

Render is excellent for hosting Node.js APIs.

1.  **Create a Web Service**:
    *   Go to [dashboard.render.com](https://dashboard.render.com/).
    *   Click **New +** -> **Web Service**.
    *   Connect your GitHub repository.

2.  **Configure the Service**:
    *   **Name**: `codechain-backend` (or similar).
    *   **Root Directory**: `backend` (Important for monorepos!).
    *   **Runtime**: `Node`.
    *   **Build Command**: `npm install`.
    *   **Start Command**: `npm start`.
    *   *Note: Do NOT use `npm run dev` in production, as it uses nodemon which wastes resources.*
    *   **Instance Type**: `Free`.

3.  **Environment Variables**:
    *   Scroll down to the **Environment Variables** section.
    *   Add the following keys from your local `.env`:
        *   `GEMINI_API_KEY`: Your Gemini API Key.
    *   *Note: Do NOT add `PORT`. Render sets this automatically, and your code is ready to handle it.*
    *   *Note: For the free tier, the internal filesystem is ephemeral. Uploads will be lost on restart.*

4.  **Deploy**:
    *   Click **Create Web Service**.
    *   Wait for the build to finish.
    *   **Copy the URL** of your deployed backend (e.g., `https://codechain-backend.onrender.com`). You will need this for the frontend.

## Part 2: Deploy Frontend to Vercel

Vercel is the creators of Next.js and the best place to host it.

1.  **Create a New Project**:
    *   Go to [vercel.com/new](https://vercel.com/new).
    *   Import your `CodeChain` repository.

2.  **Configure Project**:
    *   **Framework Preset**: Next.js (Should detect automatically).
    *   **Root Directory**: Click "Edit" and select `frontend`.

3.  **Environment Variables**:
    *   Expand the **Environment Variables** section.
    *   Add:
        *   `NEXT_PUBLIC_API_URL`: Paste your Render Backend URL (e.g., `https://codechain-backend.onrender.com`).
        *   *Important: Do not add a trailing slash `/` at the end.*

4.  **Deploy**:
    *   Click **Deploy**.
    *   Vercel will build and deploy your site.

## Final Verification

1.  Open your Vercel URL.
2.  Try uploading a product image and generating content.
3.  If it fails, check the Browser Console (F12) network tab to ensure it is calling the Render URL, not localhost.
