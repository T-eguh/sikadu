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
  appName: 'SEKOLAH MODEL',
  appSubtitle: 'Sistem Pembelajaran Digital',
  version: '1.0.0',
  phase: 'Tahap 1 - Fondasi & Autentikasi',
  apiUrl: process.env.EXPO_PUBLIC_API_URL || getDefaultDevApiUrl(),
  tokenKey: 'sekolah_model_auth_token',
  timeout: 10000,
};
