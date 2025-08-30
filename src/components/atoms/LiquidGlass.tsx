import { motion } from "framer-motion";
import { ReactNode, useContext, useEffect, useState } from "react";
import { ThemeUICSSObject, useThemeUI } from "theme-ui";
import { GlobalContext } from "../../contexts/GlobalContext";
import { ThemeMode } from "../../themes";
import { liquidGlassConfig, LiquidGlassConfig } from "../../themes/liquidGlass.config";

interface LiquidGlassProps {
  children: ReactNode;
  config?: Partial<LiquidGlassConfig>;
  className?: string;
  intensity?: "subtle" | "standard" | "intense" | "minimal";
  interactive?: boolean;
}

export default function LiquidGlass({
  children,
  config,
  className = "",
  intensity = "standard",
  interactive = true,
}: LiquidGlassProps) {
  const { theme, glassAnimations } = useContext(GlobalContext);
  const { theme: themeUI } = useThemeUI();
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  
  const isLiquidGlass = theme.val === ThemeMode.LiquidGlass;
  
  // Merge default config with custom overrides
  const finalConfig = { ...liquidGlassConfig, ...config };
  
  // Check if animations should be active
  const animationsEnabled = interactive && isLiquidGlass && glassAnimations.val;
  
  useEffect(() => {
    if (!animationsEnabled) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [animationsEnabled]);
  
  // Base glass styles
  const glassStyles: ThemeUICSSObject = {
    backdropFilter: `blur(${finalConfig.blur}px) saturate(${finalConfig.saturation}) brightness(${finalConfig.brightness})`,
    WebkitBackdropFilter: `blur(${finalConfig.blur}px) saturate(${finalConfig.saturation}) brightness(${finalConfig.brightness})`,
    backgroundColor: `rgba(255, 255, 255, ${finalConfig.opacity})`,
    border: `${finalConfig.borderWidth}px solid rgba(255, 255, 255, ${finalConfig.borderOpacity})`,
    borderRadius: `${finalConfig.borderRadius}px`,
    boxShadow: `0 8px 32px ${finalConfig.shadowColor}, inset 0 1px 0 rgba(255, 255, 255, 0.2)`,
    position: "relative",
    overflow: "hidden",
    
    // Fallback for browsers without backdrop-filter support
    "@supports not (backdrop-filter: blur(1px))": {
      backgroundColor: themeUI.colors?.primary || "rgba(255, 255, 255, 0.9)",
    },
  };
  
  // Enhanced glass styles with mouse interaction
  const interactiveGlassStyles: ThemeUICSSObject = animationsEnabled ? {
    ...glassStyles,
    transform: `perspective(1000px) rotateX(${(mousePosition.y - 50) * 0.1}deg) rotateY(${(mousePosition.x - 50) * 0.1}deg)`,
    transformStyle: "preserve-3d",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255, 255, 255, 0.3) 0%, transparent 50%)`,
      pointerEvents: "none",
      transition: `background ${finalConfig.transitionDuration}s ease`,
    },
  } : glassStyles;
  
  // Return normal children if not liquid glass theme
  if (!isLiquidGlass) {
    return <>{children}</>;
  }
  
  return (
    <motion.div
      className={className}
      sx={interactiveGlassStyles}
      whileHover={undefined}
      transition={{
        duration: finalConfig.transitionDuration,
        ease: [0.4, 0, 0.2, 1], // Apple's preferred easing
      }}
    >
      {children}
    </motion.div>
  );
}