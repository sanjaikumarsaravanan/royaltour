<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/d71a08e6-c0a5-4a96-a0d8-56dcb844b363

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Authorizing Vercel Domain for Google Sign-In (`https://royaltour-mu.vercel.app`)

When deploying to Vercel, Google and Firebase Authentication require the custom domain to be authorized in your project:

### Step 1: Add Authorized Domain in Firebase Console
1. Open [Firebase Console Authentication Settings](https://console.firebase.google.com/project/royaltours-ea173/authentication/settings)
2. Scroll to **"Authorized domains"**
3. Click **"Add domain"**
4. Enter: `royaltour-mu.vercel.app`
5. Click **Add**

### Step 2: Add Origin in Google Cloud Console
1. Open [Google Cloud Credentials](https://console.cloud.google.com/apis/credentials?project=royaltours-ea173)
2. Under **OAuth 2.0 Client IDs**, click your Web client.
3. Under **Authorized JavaScript origins**, click **+ ADD URI** and add:
   - `https://royaltour-mu.vercel.app`
4. Under **Authorized redirect URIs**, verify:
   - `https://royaltours-ea173.firebaseapp.com/__/auth/handler`
5. Click **Save**


