# WhoYouAre — Setup & Deployment Guide

## What's been done in this update
- ✅ Real Supabase OTP email verification (replaces the fake demo code)
- ✅ Google Gemini AI powers the full profile analysis (name extraction + deep read + traits)
- ✅ coached.com-style analysis layout: personalised greeting, archetype badge, deep read paragraphs, trait scores, share links
- ✅ Vercel deployment config (`vercel.json`)

---

## Step 1 — Configure Supabase Auth (OTP Email)

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/dhsqxysiaeeqhsjqypye
2. Navigate to **Authentication → Providers → Email**
3. Make sure **"Enable Email Provider"** is ON
4. Turn **"Confirm email"** ON (this is what triggers the OTP email)
5. Set **"Mailer OTP Expiry"** to `3600` (1 hour)
6. Go to **Authentication → Email Templates → "Magic Link"** and optionally customize the email

### Optional: Use a custom SMTP sender (recommended for production)
Go to **Project Settings → Authentication → SMTP Settings** and add your SMTP credentials
(e.g. SendGrid, Resend, Postmark). Without this, Supabase uses its built-in sender which
has rate limits of ~4 emails per hour.

---

## Step 2 — Push to GitHub

```bash
cd path/to/this/project

# Initialize git
git init
git add .
git commit -m "Initial commit — WhoYouAre platform"

# Create a new repo on GitHub (github.com/new), then:
git remote add origin https://github.com/YOUR_USERNAME/whoyouare.git
git branch -M main
git push -u origin main
```

---

## Step 3 — Deploy to Vercel

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"** → select your `whoyouare` repo
3. Vercel will auto-detect it as a **Vite** project
4. Before deploying, add these **Environment Variables** in the Vercel UI:

| Key | Value |
|-----|-------|
| `VITE_GEMINI_API_KEY` | `AIzaSyCIBAglOhYmoBMGnLDFfr2J1O4rjXTidH8` |
| `VITE_SUPABASE_URL` | `https://dhsqxysiaeeqhsjqypye.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (your anon key) |

5. Click **Deploy** — Vercel handles the rest!

---

## Step 4 — Add your Vercel domain to Supabase

After deploying, Vercel gives you a URL like `https://whoyouare.vercel.app`.

1. Go to Supabase → **Authentication → URL Configuration**
2. Set **Site URL** to `https://whoyouare.vercel.app`
3. Add `https://whoyouare.vercel.app` to **Redirect URLs**
4. Click Save

This ensures Supabase OTP emails redirect users back to your live site.

---

## Local Development

```bash
npm install
npm run dev
```

The app runs at http://localhost:5173

---

## How the AI analysis works

When a user enters a LinkedIn or X URL and verifies their email:
1. The profile URL is passed to Google Gemini 1.5 Flash
2. Gemini extracts the person's name from the URL slug
3. Gemini generates a coached.com-style deep read, trait scores, and recommendations
4. The result is displayed in the new analysis layout

The Gemini API key is stored as `VITE_GEMINI_API_KEY` in your environment variables.
