import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.quranlearn.app',
    appName: 'Quran-Learn',
    webDir: 'dist',
    server: {
        androidScheme: 'https'
    }
};

export default config;
