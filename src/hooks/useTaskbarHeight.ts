import { useEffect, useState, useMemo } from "react";
import { sizes } from "../themes";
import useInBreakpoint from "./useInBreakpoint";
import useIsLandscape from "./useIsLandscape";
import useDimensions from "./useDimentions";

export default function useTaskbarHeight() {
  const isLandscape = useIsLandscape();
  const isMobile = useInBreakpoint(0, isLandscape);
  const isMobilePortrait = useInBreakpoint(1); // Use breakpoint 1 to match MacDock mobile detection
  const { width: screenWidth } = useDimensions();
  const [height, setHeight] = useState(sizes[8]);

  // Calculate dynamic mobile taskbar height (same logic as MacDock)
  const calculatedMobileHeight = useMemo(() => {
    if (!isMobilePortrait) return 76; // Default mobile height

    // Navigation icons count (matching MacDock)
    const navigationCount = 7; // Based on MacDock navigationIcons array
    const socialCount = 1; // Share icon on mobile
    const settingsCount = 1;
    const totalIcons = navigationCount + socialCount + settingsCount;

    // Available width calculation
    const taskbarPadding = 24; // 12px on each side
    const availableWidth = screenWidth - taskbarPadding;
    
    // Calculate optimal icon size (matching MacDock logic)
    const minIconSize = 28; // Reduced minimum size to ensure gaps fit
    const maxIconSize = 44; // Reduced max size to leave more room for gaps
    const minGap = 4; // Minimum gap between icons - ensure visible separation
    
    let optimalIconSize = minIconSize; // Start with minimum
    
    // Calculate what fits with guaranteed minimum gaps
    for (let iconSize = maxIconSize; iconSize >= minIconSize; iconSize -= 2) {
      const totalIconsWidth = totalIcons * iconSize;
      const requiredGapSpace = (totalIcons - 1) * minGap;
      const totalRequiredWidth = totalIconsWidth + requiredGapSpace;
      
      if (totalRequiredWidth <= availableWidth) {
        optimalIconSize = iconSize;
        break;
      }
    }
    
    // Calculate taskbar height based on icon size
    const padding = 16; // 8px top + 8px bottom
    return optimalIconSize + padding;
  }, [isMobilePortrait, screenWidth]);

  useEffect(() => {
    if (isMobilePortrait) {
      setHeight(calculatedMobileHeight);
    } else {
      // Desktop dock height calculation
      setHeight(sizes[isMobile && isLandscape ? 7 : 8]);
    }
  }, [isLandscape, isMobile, isMobilePortrait, calculatedMobileHeight]);

  return height;
}
