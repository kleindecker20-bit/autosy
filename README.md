# AutoSync Shop Manager — Mobile App

## Overview
Native iOS & Android app that wraps your live AutoSync site in a Capacitor shell with native features: camera, push notifications, haptics, offline detection, and deep linking.

## Architecture
```
┌─────────────────────────────────┐
│   Native App Shell (Capacitor)  │
│  ┌───────────────────────────┐  │
│  │    WebView                │  │
│  │    Loads your live site:  │  │
│  │    autosyncshopmanager.com│  │
│  │                           │  │
│  │  ┌─────────────────────┐  │  │
│  │  │   native-bridge.js  │  │  │
│  │  │   Camera, Push,     │  │  │
│  │  │   Haptics, Network  │  │  │
│  │  └─────────────────────┘  │  │
│  └───────────────────────────┘  │
│  Native Plugins (iOS/Android)   │
└─────────────────────────────────┘
```

Your PHP site runs on your server as-is. The app loads it in a WebView with native capabilities injected via the bridge script.

---

## Prerequisites

1. **Node.js 18+** — https://nodejs.org
2. **For iOS:** macOS + Xcode 15+ + Apple Developer Account ($99/year)
3. **For Android:** Android Studio + JDK 17

---

## Setup (one-time)

```bash
# 1. Clone or download this project
cd autosync-app

# 2. Install dependencies
npm install

# 3. Add platforms
npx cap add ios
npx cap add android

# 4. Sync web assets to native projects
npx cap sync
```

---

## Building

### iOS
```bash
# Open in Xcode
npx cap open ios

# In Xcode:
# 1. Select your Team in Signing & Capabilities
# 2. Set Bundle ID: com.autosyncshopmanager.app
# 3. Set Display Name: AutoSync
# 4. Select a device or simulator
# 5. Product → Run (⌘R) to test
# 6. Product → Archive to build for App Store
```

### Android
```bash
# Open in Android Studio
npx cap open android

# In Android Studio:
# 1. Wait for Gradle sync
# 2. Select a device or emulator
# 3. Run (▶) to test
# 4. Build → Generate Signed Bundle for Play Store
```

---

## App Store Submission

### Apple App Store
1. Archive in Xcode (Product → Archive)
2. Upload via Xcode Organizer → Distribute App → App Store Connect
3. In App Store Connect (appstoreconnect.apple.com):
   - Create app listing
   - Add screenshots (6.7" and 5.5" iPhones required)
   - Set pricing (Free)
   - Submit for review

### Google Play Store
1. Build signed AAB: Build → Generate Signed Bundle
2. In Google Play Console (play.google.com/console):
   - Create app
   - Upload AAB to Production track
   - Add store listing, screenshots
   - Submit for review

---

## Configuration

### Change Server URL
Edit `capacitor.config.ts`:
```typescript
server: {
    url: 'https://yourdomain.com',  // Change this
}
```

### App Icons
1. Place a 1024x1024 PNG icon in `resources/icon.png`
2. Place a 2732x2732 splash screen in `resources/splash.png`
3. Run: `npm run icons`

### Push Notifications

**iOS:** Add Push Notification capability in Xcode → Signing & Capabilities.

**Android:** 
1. Create project in Firebase Console
2. Download `google-services.json` to `android/app/`
3. Push tokens are auto-sent to your server via `native-bridge.js`

**Server side:** Handle tokens at `/admin/api/push-token.php`

---

## Files

| File | Purpose |
|------|---------|
| `capacitor.config.ts` | App config — server URL, plugins, platform settings |
| `package.json` | Dependencies — all Capacitor plugins |
| `www/index.html` | Offline fallback — shown when server unreachable |
| `www/native-bridge.js` | Native API bridge — camera, push, haptics, network |
| `www/mobile-app.js` | **⬆ UPLOAD TO YOUR SERVER** — mobile CSS + menu + camera override |
| `www/manifest.json` | PWA manifest (also enables Add to Home Screen) |

---

## Important: Add to Your Live Site

Upload `mobile-app.js` to your server at `/admin/assets/js/mobile-app.js`

Then add this line to your `header.php` (before `</head>`):
```html
<script src="/admin/assets/js/mobile-app.js"></script>
```

This script:
- Makes your site responsive on mobile (sidebar collapses to hamburger menu)
- Detects Capacitor shell and loads native features
- Overrides file inputs to use native camera
- Shows in-app push notification banners
- Handles safe areas for notch devices

---

## Native Bridge API

From anywhere in your PHP site's JavaScript, call:

```javascript
// Check if running in native app
if (window.AutoSyncNative?.isNative) {
    
    // Take photo (for inspections)
    const photo = await AutoSyncNative.takePhoto({ source: 'camera' });
    // photo.base64 = base64 image data
    
    // Vibrate
    await AutoSyncNative.vibrate('medium');
    
    // Local notification  
    await AutoSyncNative.localNotify('Payment Received', '$450.00 from John Smith', { wo_id: 123 });
    
    // Share
    await AutoSyncNative.share('Invoice #1234', 'View invoice', 'https://autosyncshopmanager.com/invoice/1234');
    
    // Get location
    const loc = await AutoSyncNative.getLocation();
    
    // Save file
    await AutoSyncNative.saveFile('invoice.pdf', base64Data, 'application/pdf');
    
    // Get app info
    const info = await AutoSyncNative.getAppInfo();
    // info.version, info.build, info.name
}
```

---

## After First Build

Any time you change your PHP site, the app automatically gets the update (it loads the live site). You only need to rebuild the native app when you:
- Update Capacitor plugins
- Change native configurations
- Need to submit a new version to the app store
