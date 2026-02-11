import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.quranlearn.app',
    appName: 'Quran-Learn',
    webDir: 'dist',
    bundledWebRuntime: false,
    server: {
        androidScheme: 'https'
    }
};

export default config;
