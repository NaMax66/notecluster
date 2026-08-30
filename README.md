# Based on
Initial interface generated with aistudio.google.com
Backend on Cloudflare worker powered by wrangler

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Clone repo: https://github.com/NaMax66/selfkit_api
3. Setup Cloudflare environment or your own server
4. Setup local server endpoint
5. Run the app:
   `npm run dev`

## Authentication

NoteCluster uses Google Sign-In through the same-origin Cloudflare gateway. The
backend creates an HTTP-only session and returns the user's remaining daily quota.
The Google OAuth client must allow `https://notecluster.selfkit.org`, the Pages
preview origin, and `http://localhost:3000` as JavaScript origins.
