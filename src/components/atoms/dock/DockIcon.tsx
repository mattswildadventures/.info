import { motion } from "framer-motion";
import { MouseEventHandler, ReactNode, useRef } from "react";
import { ThemeUICSSObject } from "theme-ui";
import useInBreakpoint from "../../../hooks/useInBreakpoint";
import { MotionButton } from "../Button";
import Icon, { IconName } from "../Icon";

export type DockIconProps = {
  iconName?: IconName;
  customIcon?: ReactNode;
  label: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  isActive?: boolean;
  href?: string;
  index?: number;
  onMouseEnter?: (index: number) => void;
  onMouseLeave?: () => void;
  scale?: number;
  isNavigationIcon?: boolean;
};

export default function DockIcon({
  iconName,
  customIcon,
  label,
  onClick,
  isActive,
  href,
  index = 0,
  onMouseEnter,
  onMouseLeave,
  scale = 1,
  isNavigationIcon = false,
}: DockIconProps) {
  const isMobile = useInBreakpoint(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const baseSize = isMobile ? 40 : 48;
  const currentSize = baseSize * scale;

  const iconContainerStyle: ThemeUICSSObject = {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    transition: "transform 0.2s ease-out",
    willChange: "transform",
    transform: "translate3d(0, 0, 0)", // Force hardware acceleration
  };

  const iconStyle: ThemeUICSSObject = {
    width: currentSize,
    height: currentSize,
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    cursor: "pointer",
    transition: "all 0.2s ease-out",
    willChange: "transform, background",
    transform: "translate3d(0, 0, 0)", // Force hardware acceleration
    
    // Enhanced touch target for mobile
    minWidth: isMobile ? "44px" : "auto", // Minimum 44px touch target
    minHeight: isMobile ? "44px" : "auto",
    
    "&:hover": {
      background: "rgba(255, 255, 255, 0.2)",
      transform: isMobile ? "scale(1.05)" : "translateY(-2px)", // Different hover for mobile
    },

    "&:active": {
      transform: "translateY(0px) scale(0.95)",
      transition: "all 0.1s ease-out", // Faster feedback on touch
    },

    // Touch-specific styles
    "@media (hover: none) and (pointer: coarse)": {
      "&:hover": {
        background: "rgba(255, 255, 255, 0.1)", // Reset hover for touch devices
        transform: "none",
      },
      "&:active": {
        background: "rgba(255, 255, 255, 0.3)",
        transform: "scale(0.9)",
      },
    },
  };

  const dotIndicatorStyle: ThemeUICSSObject = {
    position: "absolute",
    bottom: -8,
    left: "50%",
    transform: "translateX(-50%)",
    width: 4,
    height: 4,
    borderRadius: "50%",
    background: "rgba(255, 255, 255, 0.8)",
    opacity: isActive ? 1 : 0,
    transition: "opacity 0.2s ease-out",
  };

  const bounceVariants = {
    initial: { y: 0 },
    bounce: { 
      y: [-2, -8, -2, 0],
      transition: { 
        duration: 0.4,
        ease: "easeOut",
        times: [0, 0.3, 0.7, 1]
      }
    }
  };

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    // Trigger bounce animation on click
    const element = buttonRef.current?.parentElement;
    if (element) {
      element.style.animation = "none";
      setTimeout(() => {
        element.style.animation = "dockIconBounce 0.4s ease-out";
      }, 10);
    }
    
    if (onClick) {
      onClick(e);
    }
  };

  const handleMouseEnter = () => {
    if (onMouseEnter) {
      onMouseEnter(index);
    }
  };

  return (
    <motion.div
      sx={iconContainerStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onMouseLeave}
      variants={bounceVariants}
      initial="initial"
      style={{ transform: `scale(${scale})` }}
    >
      <MotionButton
        ref={buttonRef}
        unsetStyle
        sx={iconStyle}
        onClick={handleClick}
        href={href}
        aria-label={label}
      >
        {customIcon || (iconName && <Icon iconName={iconName} size={Math.floor(currentSize * 0.6)} />)}
      </MotionButton>
      
      {/* Active indicator dot */}
      <div sx={dotIndicatorStyle} />
      
      {/* CSS keyframes for bounce animation */}
      <style jsx>{`
        @keyframes dockIconBounce {
          0% { transform: scale(${scale}) translateY(0px); }
          30% { transform: scale(${scale}) translateY(-8px); }
          70% { transform: scale(${scale}) translateY(-2px); }
          100% { transform: scale(${scale}) translateY(0px); }
        }
      `}</style>
    </motion.div>
  );
}