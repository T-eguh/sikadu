import { Platform } from 'react-native';

// Fallback IP for development depending on platform
// Android Emulator uses 10.0.2.2 to reach host machine localhost, iOS simulator uses localhost
const getDefaultDevApiUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api';
  }
  return 'http://localhost:5000/api';
};

export const Config = {
  appName: 'BISA',
  appFullName: 'Bisa Insani Smart Academy',
  institutionName: 'PKBM Bina Insani',
  appSubtitle: 'Platform Pembelajaran Digital PKBM Bina Insani',
  motto: 'Hebat • Mandiri • Kreatif',
  tagline: 'Belajar, Berkembang, dan Berkarya Bersama.',
  version: '1.4.5',
  phase: 'Tahap 4.5 - BISA Official Branding & Google Sign-In',
  apiUrl: process.env.EXPO_PUBLIC_API_URL || getDefaultDevApiUrl(),
  fileBaseUrl: process.env.EXPO_PUBLIC_FILE_BASE_URL || (Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000'),
  tokenKey: 'bisa_academy_auth_token',
  timeout: 10000,
  google: {
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || 'bisa-academy-web.apps.googleusercontent.com',
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || 'bisa-academy-android.apps.googleusercontent.com',
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || 'bisa-academy-ios.apps.googleusercontent.com',
  },
};

