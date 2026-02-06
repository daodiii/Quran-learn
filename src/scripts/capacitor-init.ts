import { SplashScreen } from '@capacitor/splash-screen';
import { Capacitor } from '@capacitor/core';

/**
 * Initialize Capacitor mobile app.
 * Controls splash screen visibility during critical initialization:
 * 1. Keeps splash screen visible during font loading and theme setup
 * 2. Hides splash screen when app is ready for interaction
 * Target: < 2 seconds from tap to interactive on iOS
 */
export async function initCapacitor(): Promise<void> {
  // Only run on native platforms (iOS/Android)
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  try {
    // Keep splash screen visible during initialization
    await SplashScreen.show({
      autoHide: false,
    });

    // Critical initialization tasks:
    // 1. Theme preference from localStorage
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);

    // 2. Wait for critical fonts to be ready
    // (font-display: swap shows fallback immediately, this waits for final fonts)
    await document.fonts.ready;

    // 3. Hide splash screen with smooth fade
    await SplashScreen.hide({
      fadeOutDuration: 300,
    });
  } catch (error) {
    console.error('Capacitor initialization error:', error);
    // Always hide splash screen on error to prevent user stuck on splash
    try {
      await SplashScreen.hide();
    } catch {
      // If hide also fails, nothing more we can do
    }
  }
}
