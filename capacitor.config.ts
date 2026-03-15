import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.autosyncshopmanager.app',
  appName: 'AutoSync',
  webDir: 'www',
  
  // Load your live site inside the native shell
  server: {
    url: 'https://autosyncshopmanager.com',
    cleartext: false,
    allowNavigation: [
      'autosyncshopmanager.com',
      '*.autosyncshopmanager.com',
      'api.autosyncshopmanager.com',
      'connect.stripe.com',
      'js.stripe.com',
      'connect-js.stripe.com',
      'api.stripe.com',
      'checkout.stripe.com',
    ],
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#ffffff',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#ffffff',
    },
    Keyboard: {
      resize: 'body',
      resizeOnFullScreen: true,
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    Camera: {
      // Permissions configured in native projects
    },
  },

  // iOS specific
  ios: {
    contentInset: 'automatic',
    allowsLinkPreview: false,
    backgroundColor: '#ffffff',
    preferredContentMode: 'mobile',
    scheme: 'autosync',
  },

  // Android specific  
  android: {
    allowMixedContent: false,
    backgroundColor: '#ffffff',
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    },
  },
};

export default config;
