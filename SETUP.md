# WhoYouAre — Setup & Deployment Guide

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
3. Gemini generates a deep read, trait scores, and recommendations, and more
4. The result is displayed in the new analysis layout
