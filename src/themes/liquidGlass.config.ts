export interface LiquidGlassConfig {
  // Glass effect properties
  blur: number;
  saturation: number;
  brightness: number;
  opacity: number;
  
  // Border and shape
  borderRadius: number;
  borderWidth: number;
  borderOpacity: number;
  
  // Animation properties
  hoverScale: number;
  transitionDuration: number;
  
  // Interactive effects
  mouseInfluence: boolean;
  elasticity: number;
  
  // Shadows and depth
  shadowBlur: number;
  shadowOpacity: number;
  shadowColor: string;
}

export const liquidGlassConfig: LiquidGlassConfig = {
  // Apple-inspired glass effect
  blur: 10,
  saturation: 1.8,
  brightness: 1.1,
  opacity: 0.7,
  
  // Rounded corners like macOS
  borderRadius: 12,
  borderWidth: 1,
  borderOpacity: 0.2,
  
  // Smooth animations
  hoverScale: 1.02,
  transitionDuration: 0.3,
  
  // Interactive glass
  mouseInfluence: true,
  elasticity: 0.4,
  
  // Depth and shadows
  shadowBlur: 20,
  shadowOpacity: 0.1,
  shadowColor: "rgba(0, 0, 0, 0.2)",
};

// Preset variations for different glass intensities
export const glassPresets = {
  subtle: {
    ...liquidGlassConfig,
    blur: 10,
    opacity: 0.5,
    saturation: 1.2,
  },
  
  standard: liquidGlassConfig,
  
  intense: {
    ...liquidGlassConfig,
    blur: 30,
    opacity: 0.9,
    saturation: 2.2,
    brightness: 1.3,
  },
  
  minimal: {
    ...liquidGlassConfig,
    blur: 5,
    opacity: 0.3,
    borderOpacity: 0.1,
    shadowOpacity: 0.05,
  },
};