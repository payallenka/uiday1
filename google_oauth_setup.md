# Google OAuth Setup for Supabase

## Step 1: Configure Google OAuth in Google Cloud Console

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a new project** or select existing project
3. **Enable Google+ API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. **Create OAuth 2.0 Credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `https://qapnaciklgaahrdngwzh.supabase.co/auth/v1/callback`
     - `http://localhost:3000` (for local development)
   - Save the **Client ID** and **Client Secret**

## Step 2: Configure Supabase

1. **Go to Supabase Dashboard**: https://app.supabase.com
2. **Select your project**
3. **Go to Authentication** > **Providers**
4. **Enable Google provider**:
   - Toggle "Enable sign in with Google"
   - Enter your **Google Client ID**
   - Enter your **Google Client Secret**
   - Save configuration

## Step 3: Update Site URL (if needed)

1. **In Supabase Dashboard** > **Authentication** > **URL Configuration**
2. **Set Site URL** to your domain (e.g., `http://localhost:3000` for development)
3. **Add redirect URLs** if needed

## Step 4: Test the Integration

After completing the above steps, the Google OAuth buttons in your app should work correctly.

## Important Notes:

- **Production**: Update redirect URIs with your production domain
- **Local Development**: Make sure `http://localhost:3000` is in authorized redirect URIs
- **HTTPS Required**: Production sites must use HTTPS for Google OAuth
- **Domain Verification**: May be required for production use
