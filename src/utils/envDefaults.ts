import { ThemeMode } from '../themes';
import { BackgroundMode } from '../contexts/GlobalContext';

/**
 * Parse environment variables for default settings with proper validation and fallbacks
 */

export function getDefaultTheme(): ThemeMode {
  const envTheme = process.env.NEXT_PUBLIC_DEFAULT_THEME?.toLowerCase();
  
  switch (envTheme) {
    case 'flat':
      return ThemeMode.Flat;
    case 'soft':
      return ThemeMode.Soft;
    case 'tron':
      return ThemeMode.Tron;
    case 'classic':
      return ThemeMode.Classic;
    case 'liquidglass':
      return ThemeMode.LiquidGlass;
    default:
      // Fallback to Flat theme if invalid or missing
      return ThemeMode.Flat;
  }
}

export function getDefaultBackground(): BackgroundMode {
  const envBackground = process.env.NEXT_PUBLIC_DEFAULT_BACKGROUND?.toLowerCase();
  
  switch (envBackground) {
    case 'none':
      return BackgroundMode.None;
    case 'custom':
      return BackgroundMode.Custom;
    case 'random':
      return BackgroundMode.Random;
    default:
      // Fallback to None if invalid or missing
      return BackgroundMode.None;
  }
}

export function getDefaultReduceMotion(): boolean {
  const envValue = process.env.NEXT_PUBLIC_DEFAULT_REDUCE_MOTION?.toLowerCase();
  
  // Parse boolean values
  if (envValue === 'true' || envValue === '1') {
    return true;
  }
  if (envValue === 'false' || envValue === '0') {
    return false;
  }
  
  // Fallback to false if invalid or missing
  return false;
}

export function getDefaultHideTaskbar(): boolean {
  const envValue = process.env.NEXT_PUBLIC_DEFAULT_HIDE_TASKBAR?.toLowerCase();
  
  // Parse boolean values
  if (envValue === 'true' || envValue === '1') {
    return true;
  }
  if (envValue === 'false' || envValue === '0') {
    return false;
  }
  
  // Fallback to false if invalid or missing
  return false;
}

export function getDefaultGlassAnimations(): boolean {
  const envValue = process.env.NEXT_PUBLIC_DEFAULT_GLASS_ANIMATIONS?.toLowerCase();
  
  // Parse boolean values
  if (envValue === 'true' || envValue === '1') {
    return true;
  }
  if (envValue === 'false' || envValue === '0') {
    return false;
  }
  
  // Fallback to true if invalid or missing (glass animations enabled by default)
  return true;
}

export function getDefaultShowExtendedDock(): boolean {
  const envValue = process.env.NEXT_PUBLIC_DEFAULT_SHOW_EXTENDED_DOCK?.toLowerCase();
  
  // Parse boolean values
  if (envValue === 'true' || envValue === '1') {
    return true;
  }
  if (envValue === 'false' || envValue === '0') {
    return false;
  }
  
  // Fallback to false if invalid or missing (extended dock hidden by default)
  return false;
}

/**
 * Get all default settings as an object for easy access
 */
export function getAllDefaults() {
  return {
    theme: getDefaultTheme(),
    background: getDefaultBackground(),
    reduceMotion: getDefaultReduceMotion(),
    hideTaskbar: getDefaultHideTaskbar(),
    glassAnimations: getDefaultGlassAnimations(),
    showExtendedDock: getDefaultShowExtendedDock(),
  };
}