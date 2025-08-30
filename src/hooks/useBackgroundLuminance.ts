import { useContext, useEffect, useState } from 'react';
import { GlobalContext, BackgroundMode } from '../contexts/GlobalContext';

interface BackgroundLuminance {
  luminance: number;
  isDark: boolean;
  textColor: 'white' | 'black';
  confidence: number;
}

export function useBackgroundLuminance(): BackgroundLuminance {
  const { background } = useContext(GlobalContext);
  const [luminance, setLuminance] = useState<BackgroundLuminance>({
    luminance: 0.5,
    isDark: false,
    textColor: 'black',
    confidence: 1,
  });

  useEffect(() => {
    const detectBackgroundLuminance = async () => {
      try {
        // For no background or custom background, use theme defaults
        if (background.val === BackgroundMode.None) {
          setLuminance({
            luminance: 0.9, // Light background
            isDark: false,
            textColor: 'black',
            confidence: 1,
          });
          return;
        }

        if (background.val === BackgroundMode.Custom) {
          // For custom background, we could sample it, but for now use a safe middle ground
          setLuminance({
            luminance: 0.4, // Assume darker custom background
            isDark: true,
            textColor: 'white',
            confidence: 0.7,
          });
          return;
        }

        // For random backgrounds, we need to sample the actual image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) return;

        // Create a small sampling area in the center where tiles appear
        canvas.width = 200;
        canvas.height = 200;

        // Get the background image from the body or main element
        const mainElement = document.querySelector('main');
        if (!mainElement) return;

        const computedStyle = window.getComputedStyle(mainElement);
        const backgroundImage = computedStyle.backgroundImage;
        
        if (backgroundImage && backgroundImage !== 'none') {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          
          img.onload = () => {
            // Draw a sample of the center area where tiles appear
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            // Sample multiple points in the center area
            const samplePoints = 25; // 5x5 grid
            let totalLuminance = 0;
            
            for (let i = 0; i < samplePoints; i++) {
              const x = Math.floor((i % 5 + 1) * (canvas.width / 6));
              const y = Math.floor(Math.floor(i / 5) + 1 * (canvas.height / 6));
              
              const pixel = ctx.getImageData(x, y, 1, 1).data;
              const r = pixel[0];
              const g = pixel[1];
              const b = pixel[2];
              
              // Calculate relative luminance using WCAG formula
              const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
              totalLuminance += luminance;
            }
            
            const avgLuminance = totalLuminance / samplePoints;
            const isDark = avgLuminance < 0.5;
            
            setLuminance({
              luminance: avgLuminance,
              isDark,
              textColor: isDark ? 'white' : 'black',
              confidence: 0.9,
            });
          };
          
          img.onerror = () => {
            // Fallback if image can't be loaded
            setLuminance({
              luminance: 0.3, // Assume dark nature background
              isDark: true,
              textColor: 'white',
              confidence: 0.5,
            });
          };
          
          // Extract URL from CSS background-image
          const match = backgroundImage.match(/url\(['"]?([^'"]+)['"]?\)/);
          if (match && match[1]) {
            img.src = match[1];
          }
        }
      } catch (error) {
        console.warn('Background luminance detection failed:', error);
        // Safe fallback
        setLuminance({
          luminance: 0.5,
          isDark: false,
          textColor: 'black',
          confidence: 0.3,
        });
      }
    };

    // Debounce the detection to avoid excessive calls
    const timeoutId = setTimeout(detectBackgroundLuminance, 500);
    return () => clearTimeout(timeoutId);
  }, [background.val]);

  return luminance;
}