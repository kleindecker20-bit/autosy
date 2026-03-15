# AutoSync — App Store Deployment with Codemagic
### No Mac Required. No Android Studio. Build from the cloud.

---

## What You Need (accounts to create)

1. **GitHub account** (free) — github.com
2. **Codemagic account** (free tier) — codemagic.io (sign in with GitHub)
3. **Apple Developer account** ($99/year) — developer.apple.com
4. **Google Play Developer account** ($25 one-time) — play.google.com/console

---

## STEP 1: Push Project to GitHub

```bash
# On your local PC (just needs Git installed — no Xcode/Android Studio)

# Unzip the autosync-mobile-app.zip
cd autosync-app

# Initialize git
git init
git add .
git commit -m "AutoSync mobile app v1.0.0"

# Create repo on GitHub (github.com/new)
# Name: autosync-mobile-app (private repo)

git remote add origin https://github.com/YOUR_USERNAME/autosync-mobile-app.git
git branch -M main
git push -u origin main
```

If you don't have Git, you can upload files directly on GitHub:
1. Go to github.com → New Repository → name it `autosync-mobile-app` (Private)
2. Click "Upload files" and drag the project folder contents in
3. Click "Commit changes"

---

## STEP 2: Set Up Apple Developer Account

### 2a. Enroll in Apple Developer Program
1. Go to **developer.apple.com/enroll**
2. Sign in with your Apple ID (or create one)
3. Enroll as **Individual** ($99/year)
4. Wait for approval (usually same day)

### 2b. Create App ID
1. Go to **developer.apple.com/account/resources/identifiers**
2. Click **+** → **App IDs** → **App**
3. Description: `AutoSync Shop Manager`
4. Bundle ID: **Explicit** → `com.autosyncshopmanager.app`
5. Enable capabilities:
   - ✅ Push Notifications
   - ✅ Associated Domains (for deep links)
6. Click **Continue** → **Register**

### 2c. Create App in App Store Connect
1. Go to **appstoreconnect.apple.com**
2. Click **My Apps** → **+** → **New App**
3. Fill in:
   - Platform: iOS
   - Name: **AutoSync**
   - Primary Language: English (U.S.)
   - Bundle ID: select `com.autosyncshopmanager.app`
   - SKU: `autosync-shop-manager`
4. Click **Create**

### 2d. Create API Key for Codemagic
1. In App Store Connect → **Users and Access** → **Integrations** → **App Store Connect API**
2. Click **+** to generate a new key
3. Name: `Codemagic`
4. Access: **App Manager**
5. Click **Generate**
6. **Download the .p8 file** — you'll need it for Codemagic
7. Note your **Issuer ID** and **Key ID** from this page

---

## STEP 3: Set Up Google Play Developer Account

### 3a. Create Developer Account
1. Go to **play.google.com/console**
2. Pay the $25 one-time fee
3. Complete identity verification

### 3b. Create App Listing
1. In Play Console → **All apps** → **Create app**
2. App name: **AutoSync Shop Manager**
3. Default language: English (US)
4. App or Game: **App**
5. Free or Paid: **Free**
6. Accept declarations → **Create app**

### 3c. Create Service Account (for Codemagic auto-deploy)
1. Go to **play.google.com/console** → **Setup** → **API access**
2. Click **Link** to link to Google Cloud
3. Click **Create new service account**
4. Follow the link to Google Cloud Console
5. Create service account with name `codemagic-deploy`
6. Grant role: **Service Account User**
7. Create a JSON key → **Download the JSON file**
8. Back in Play Console, click **Done** → **Grant access** to the service account
9. Set permission to **Release to production**

---

## STEP 4: Set Up Codemagic

### 4a. Connect Repository
1. Go to **codemagic.io** → Sign in with GitHub
2. Click **Add application**
3. Select your `autosync-mobile-app` repository
4. Select **Capacitor** as project type
5. Click **Finish: Add application**

### 4b. Configure iOS Signing
1. In your app settings → **Distribution** → **iOS code signing**
2. Select **Automatic** (recommended)
3. Under **App Store Connect**, click **Connect**
4. Upload the **.p8 API key** from Step 2d
5. Enter the **Issuer ID** and **Key ID**
6. Codemagic will automatically manage certificates and provisioning profiles

### 4c. Configure Android Signing
1. In your app settings → **Distribution** → **Android code signing**
2. You need a **keystore file**. Codemagic can generate one:
   - Click **Generate keystore**
   - Or create your own: `keytool -genkey -v -keystore autosync.keystore -alias autosync -keyalg RSA -keysize 2048 -validity 10000`
3. Upload the keystore file
4. Enter the **alias**, **keystore password**, and **key password**

### 4d. Add Environment Variables
1. Go to your app → **Environment variables**
2. Create a group called `app_store_credentials` with:
   - Your App Store Connect API key details are already linked from 4b
3. Create a group called `google_play_credentials` with:
   - `GCLOUD_SERVICE_ACCOUNT_CREDENTIALS` = paste the entire JSON content from Step 3c
4. Create a group called `android_keystore` with:
   - `CM_KEYSTORE` = upload your .keystore file
   - `CM_KEYSTORE_PASSWORD` = your keystore password
   - `CM_KEY_ALIAS` = your key alias
   - `CM_KEY_PASSWORD` = your key password

---

## STEP 5: Build & Deploy

### First Build
1. In Codemagic, click **Start new build**
2. Select workflow: `iOS Release` or `Android Release`
3. Click **Start build**
4. Wait ~10-15 minutes
5. Codemagic builds the app, signs it, and uploads to:
   - **TestFlight** (iOS) — you'll get an email when ready to test
   - **Google Play Internal Testing** (Android)

### Test on Your Phone
**iOS:**
1. Download **TestFlight** app from App Store on your iPhone
2. You'll receive an email invite → tap to install

**Android:**
1. In Google Play Console → **Testing** → **Internal testing**
2. Add your email as a tester
3. Open the test link on your Android phone → install

### Submit to Stores
When you're happy with testing:

**iOS:**
1. In App Store Connect → **My Apps** → **AutoSync** → **App Store** tab
2. Select the TestFlight build
3. Fill in:
   - Screenshots (take them from your phone)
   - Description, keywords, support URL
   - Age rating
4. Click **Submit for Review**
5. Apple reviews in 24-48 hours

**Android:**
1. In Google Play Console → **Production** → **Create new release**
2. Select the AAB from internal testing
3. Fill in store listing, screenshots
4. Click **Start rollout to production**
5. Google reviews in a few hours to 7 days

---

## STEP 6: App Icon

Before building, you need a 1024x1024 app icon.

**Option A — Create one free:**
1. Go to **canva.com** (free)
2. Create a 1024x1024 design
3. Blue gradient background (#2563eb)
4. White car/wrench icon
5. Export as PNG

**Option B — Use an AI tool:**
- Ask me to generate one, or use Midjourney/DALL-E

Place the icon as `resources/icon.png` in your project, commit, and push.
Codemagic will auto-generate all required sizes.

---

## Costs Summary

| Item | Cost | Frequency |
|------|------|-----------|
| Apple Developer | $99 | Annual |
| Google Play | $25 | One-time |
| Codemagic | $0 | Free tier (500 min/mo) |
| GitHub | $0 | Free for private repos |
| **Total to launch** | **$124** | |

---

## After Launch

- **Updates are automatic** — when you update your PHP site, the app loads the new version immediately
- **Only rebuild for:** new native plugins, version bumps, app store requirement changes
- **Trigger builds:** push to GitHub → Codemagic auto-builds (or click "Start build" manually)

---

## Troubleshooting

**Build fails on iOS signing:**
→ Make sure your App ID bundle identifier matches `com.autosyncshopmanager.app` exactly

**Build fails on Android:**
→ Check that your keystore credentials are correct in Codemagic environment variables

**App shows blank white screen:**
→ Check `capacitor.config.ts` → `server.url` matches your live site URL

**Push notifications not working:**
→ iOS: ensure Push Notifications capability is added to the App ID
→ Android: add `google-services.json` from Firebase to the project

**App rejected by Apple:**
→ Most common: missing privacy policy URL, broken links, or "minimal functionality" (rare with a full app like AutoSync)
→ Add a privacy policy page at `autosyncshopmanager.com/privacy`
