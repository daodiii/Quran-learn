import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

/**
 * Initialize Capacitor mobile app.
 * Controls splash screen visibility during critical initialization:
 * 1. Keeps splash screen visible during font loading and theme setup
 * 2. Hides splash screen when app is ready for interaction
 * 3. Handles native platform events (back button, status bar)
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

    // Handle Android back button
    App.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack) {
        window.history.back();
      } else {
        App.exitApp();
      }
    });

    // Initial theme setup
    const theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    await updateStatusBar(theme);

    // Watch for theme changes to update status bar
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          const newTheme = document.documentElement.getAttribute('data-theme') || 'light';
          updateStatusBar(newTheme);
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    // Wait for critical fonts to be ready
    await document.fonts.ready;

    // Hide splash screen with smooth fade
    await SplashScreen.hide({
      fadeOutDuration: 300,
    });
  } catch (error) {
    console.error('Capacitor initialization error:', error);
    await SplashScreen.hide();
  }
}

async function updateStatusBar(theme: string) {
  try {
    if (theme === 'dark') {
      await StatusBar.setStyle({ style: Style.Dark });
      if (Capacitor.getPlatform() === 'android') {
        await StatusBar.setBackgroundColor({ color: '#000000' });
      }
    } else {
      await StatusBar.setStyle({ style: Style.Light });
      if (Capacitor.getPlatform() === 'android') {
        await StatusBar.setBackgroundColor({ color: '#0D4749' });
      }
    }
  } catch (e) {
    console.warn('StatusBar update failed', e);
  }
}
