import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { useContext, useRef, useState } from "react";
import { useClickAway, useKey } from "react-use";
import { ThemeUICSSObject } from "theme-ui";
import { GlobalContext } from "../../contexts/GlobalContext";
import useInBreakpoint from "../../hooks/useInBreakpoint";
import useMatchTheme from "../../hooks/useMatchTheme";
import { getRoute } from "../../misc/routes";
import { ThemeMode } from "../../themes";
import { zIndex } from "../../themes/common";
import DockIcon from "../atoms/dock/DockIcon";
import ReactIcon from "../atoms/IconReact";
import PanelConfig from "../molecules/PanelConfig";

export default function MacDock() {
  const router = useRouter();
  const { hideTaskbar } = useContext(GlobalContext);
  const [isConfigActive, setIsConfigActive] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [configPanel, setConfigPanel] = useState(false);
  const [clickOrigin, setClickOrigin] = useState<{ x: number; y: number } | null>(null);
  const isMobile = useInBreakpoint(0);
  
  const panelRef = useRef<HTMLElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  
  const route = getRoute(router.asPath);
  const isHomePage = router.asPath === "/";
  

  // Move hook calls outside conditional usage
  const isSoftTheme = useMatchTheme(ThemeMode.Soft);
  const isClassicTheme = useMatchTheme(ThemeMode.Classic);
  const isTronTheme = useMatchTheme(ThemeMode.Tron);

  useClickAway(panelRef, (event) => {
    const isDockClick = dockRef.current?.contains(event.target as Node);
    if (!isDockClick) {
      setIsConfigActive(false);
    }
  });

  useKey("Escape", () => setIsConfigActive(false));

  // Calculate magnification based on hover (disabled on mobile)
  const getMagnification = (index: number): number => {
    if (isMobile || hoveredIndex === null) return 1;
    
    const distance = Math.abs(index - hoveredIndex);
    if (distance === 0) return 1.33; // Primary hover: 64px (48px * 1.33)
    if (distance === 1) return 1.17; // Adjacent: 56px (48px * 1.17)
    if (distance === 2) return 1.08; // Second adjacent: 52px (48px * 1.08)
    return 1; // Default: 48px
  };

  const dockStyle: ThemeUICSSObject = {
    position: "fixed",
    bottom: "16px",
    left: "0",
    right: "0",
    display: "flex",
    justifyContent: "center",
    alignItems: "end",
    pointerEvents: "none", // Allow clicks to pass through the container
    zIndex: zIndex.taskbar,
    
    // Mobile responsive adjustment for bottom spacing
    ...(isMobile && {
      bottom: "12px",
    }),
  };

  const dockInnerStyle: ThemeUICSSObject = {
    display: "flex",
    alignItems: "end",
    gap: "4px",
    pointerEvents: "auto", // Re-enable pointer events for the actual dock
    padding: "8px",
    borderRadius: "20px",
    willChange: "transform",
    transform: "translate3d(0, 0, 0)", // Hardware acceleration
    
    // Base glassmorphism styling
    background: "rgba(255, 255, 255, 0.15)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",

    // Theme-specific adjustments
    ...(isSoftTheme && {
      background: "rgba(255, 255, 255, 0.2)",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
    }),

    ...(isClassicTheme && {
      background: "rgba(248, 243, 231, 0.2)",
      border: "1px solid rgba(0, 0, 0, 0.2)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
    }),

    ...(isTronTheme && {
      background: "rgba(40, 142, 159, 0.15)",
      border: "1px solid rgba(40, 142, 159, 0.3)",
      boxShadow: "0 8px 32px rgba(40, 142, 159, 0.4)",
    }),

    // Enhanced responsive adjustments
    ...(isMobile && {
      padding: "6px",
      borderRadius: "16px",
      gap: "2px",
      maxWidth: "calc(100vw - 24px)", // Prevent overflow on small screens
      overflowX: "auto", // Allow horizontal scroll if needed
      "&::-webkit-scrollbar": {
        display: "none", // Hide scrollbar on mobile
      },
      scrollbarWidth: "none", // Hide scrollbar on Firefox mobile
    }),
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const handleIconHover = (index: number) => {
    setHoveredIndex(index);
  };

  const handleIconClick = (onClick: () => void, event: React.MouseEvent) => {
    // Store click origin for window animation
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const origin = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
    setClickOrigin(origin);
    
    // Store in sessionStorage for Layout component to access
    sessionStorage.setItem('windowOrigin', JSON.stringify(origin));
    
    // Execute the original click handler
    onClick();
  };

  // Custom home icon
  const HomeIcon = () => (
    <svg 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="currentColor"
      sx={{ opacity: 0.8 }}
    >
      <path d="M12 2.1L1 12h3v9h6v-6h4v6h6v-9h3L12 2.1zM12 4.7L18 10.1V19h-2v-6H8v6H6v-8.9L12 4.7z"/>
    </svg>
  );

  // Dock icons configuration
  const dockIcons = [
    {
      customIcon: <HomeIcon />,
      label: "Home",
      onClick: () => router.push("/"),
      isActive: isHomePage,
      isNavigationIcon: true,
    },
    {
      iconName: "FlatAbout" as const,
      label: "About Me",
      onClick: () => router.push("/about"),
      isActive: router.asPath === "/about",
      isNavigationIcon: true,
    },
    {
      iconName: "FlatWork" as const,
      label: "My Work",
      onClick: () => router.push("/work"),
      isActive: router.asPath === "/work",
      isNavigationIcon: true,
    },
    {
      iconName: "FlatSkills" as const,
      label: "Skills",
      onClick: () => router.push("/skills"),
      isActive: router.asPath === "/skills",
      isNavigationIcon: true,
    },
    {
      iconName: "FlatEdu" as const,
      label: "Research Paper",
      onClick: () => router.push("/research-paper"),
      isActive: router.asPath === "/research-paper",
      isNavigationIcon: true,
    },
    {
      iconName: "FlatAbout" as const,
      label: "My Mindset",
      onClick: () => router.push("/mindset"),
      isActive: router.asPath === "/mindset",
      isNavigationIcon: true,
    },
    {
      iconName: "FlatWork" as const,
      label: "Roadmap",
      onClick: () => router.push("/roadmap"),
      isActive: router.asPath === "/roadmap",
      isNavigationIcon: true,
    },
    // Divider (visual separator)
    {
      customIcon: <div sx={{ width: "2px", height: "32px", background: "rgba(255,255,255,0.3)", borderRadius: "1px" }} />,
      label: "Separator",
      onClick: () => {},
      isActive: false,
      isNavigationIcon: false,
    },
    // Social Media Icons
    {
      customIcon: <ReactIcon iconName="SiGithub" size={28} />,
      label: "GitHub",
      href: "https://github.com/khang-nd",
      isActive: false,
      isNavigationIcon: false,
    },
    {
      customIcon: <ReactIcon iconName="FaLinkedinIn" size={28} />,
      label: "LinkedIn", 
      href: "https://www.linkedin.com/in/khangnd",
      isActive: false,
      isNavigationIcon: false,
    },
    {
      customIcon: <ReactIcon iconName="SiTwitter" size={28} />,
      label: "Twitter",
      href: "https://twitter.com/_khangnd", 
      isActive: false,
      isNavigationIcon: false,
    },
    {
      customIcon: <ReactIcon iconName="SiFandom" size={28} />,
      label: "Fandom",
      href: "https://dev.fandom.com/wiki/User:KhangND",
      isActive: false,
      isNavigationIcon: false,
    },
    // Settings
    {
      iconName: "FlatSettings" as const,
      label: "Settings",
      onClick: () => setIsConfigActive(!isConfigActive),
      isActive: isConfigActive,
      isNavigationIcon: false,
    },
  ];

  return (
    <>
      <div sx={dockStyle}>
        <motion.div
          ref={dockRef}
          sx={dockInnerStyle}
          onMouseLeave={handleMouseLeave}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {dockIcons.map((icon, index) => (
            <DockIcon
              key={`${icon.label}-${index}`}
              iconName={icon.iconName}
              customIcon={icon.customIcon}
              label={icon.label}
              onClick={icon.isNavigationIcon && icon.onClick ? 
                (e) => handleIconClick(icon.onClick!, e) : 
                icon.onClick
              }
              href={icon.href}
              isActive={icon.isActive}
              index={index}
              onMouseEnter={handleIconHover}
              onMouseLeave={handleMouseLeave}
              scale={getMagnification(index)}
              isNavigationIcon={icon.isNavigationIcon}
            />
          ))}
        </motion.div>
      </div>
      
      <PanelConfig isVisible={isConfigActive} ref={panelRef} />
    </>
  );
}