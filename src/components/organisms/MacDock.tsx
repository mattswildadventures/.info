import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { useContext, useRef, useState, useEffect } from "react";
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
  const [socialLinks, setSocialLinks] = useState<any[]>([]);
  const isMobile = useInBreakpoint(0);
  
  const panelRef = useRef<HTMLElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  
  const route = getRoute(router.asPath);
  const isHomePage = router.asPath === "/";

  // Load social links from content data
  useEffect(() => {
    const loadSocialLinks = async () => {
      try {
        const response = await fetch('/api/content');
        if (response.ok) {
          const data = await response.json();
          setSocialLinks(data.socialLinks?.sort((a: any, b: any) => a.order - b.order) || []);
        }
      } catch (error) {
        console.error('Failed to load social links:', error);
        // Fallback to empty array
        setSocialLinks([]);
      }
    };

    loadSocialLinks();
  }, []);

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

  // Create dock icons configuration with dynamic social links
  const dockIcons = [
    // Navigation icons
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
      label: "Blog",
      onClick: () => router.push("/blog"),
      isActive: router.asPath === "/blog",
      isNavigationIcon: true,
    },
    // Separator
    {
      customIcon: <div sx={{ width: "2px", height: "32px", background: "rgba(255,255,255,0.3)", borderRadius: "1px" }} />,
      label: "Separator",
      onClick: () => {},
      isActive: false,
      isNavigationIcon: false,
    },
    // Dynamic social media icons
    ...socialLinks.map((link) => ({
      customIcon: <ReactIcon iconName={link.icon as any} size={28} />,
      label: link.label,
      href: link.url,
      isActive: false,
      isNavigationIcon: false,
    })),
    // Settings icon
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
              iconName={'iconName' in icon ? icon.iconName : undefined}
              customIcon={'customIcon' in icon ? icon.customIcon : undefined}
              label={icon.label}
              onClick={'onClick' in icon && icon.isNavigationIcon && icon.onClick ? 
                (e) => handleIconClick(icon.onClick!, e) : 
                ('onClick' in icon ? icon.onClick : undefined)
              }
              href={'href' in icon ? icon.href : undefined}
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