import { Variants } from "framer-motion";
import { ThemeUICSSObject } from "theme-ui";
import useHomepage from "../../hooks/useHomepage";
import useInBreakpoint from "../../hooks/useInBreakpoint";
import useReduceMotion from "../../hooks/useReduceMotion";
import useTaskbarHeight from "../../hooks/useTaskbarHeight";
import useDimensions from "../../hooks/useDimentions";
import routes from "../../misc/routes";
import { translate } from "../../misc/utils";
import { MotionNav } from "../atoms/Container";
import NavLink from "../atoms/NavLink";

export default function Navigation() {
  const isHomePage = useHomepage();
  const isMobile = useInBreakpoint(0);
  const mainTransition = useReduceMotion({ duration: 0.8 });
  const taskbarHeight = useTaskbarHeight();
  const { height: screenHeight } = useDimensions();
  
  // Only show navigation on homepage - left sidebar navigation removed
  if (!isHomePage) {
    return null;
  }


  const motionVariants: Variants = {
    main: {
      ...translate("-50%"),
      ...(isMobile ? {
        // For mobile, calculate true center accounting for taskbar
        // Available viewport = 100vh, taskbar takes up bottom space
        // Center in the remaining space above taskbar
        top: `calc((100vh - ${taskbarHeight}px) / 2)`, // Center in space above taskbar
      } : {
        top: "50%",
      }),
      left: "50%",
      display: "grid", // Always show grid, make it responsive
      transition: mainTransition,
    },
  };

  const containerStyle: ThemeUICSSObject = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr 1fr" : "auto auto auto", // Mobile: 2 columns, Desktop: 3 columns
    gridTemplateRows: isMobile ? "repeat(3, auto)" : "repeat(2, auto)", // Mobile: 3 rows, Desktop: 2 rows
    gap: isMobile ? "16px" : "0", // Add gap on mobile for better spacing
    position: "absolute",
    // Mobile responsive adjustments
    ...(isMobile && {
      width: "356px", // Exact width: 2*150px + 16px gap + 40px padding = 356px
      maxWidth: "calc(100vw - 20px)", // Ensure it doesn't exceed screen width with some margin
      padding: "20px",
      justifyItems: "center", // Center tiles within their grid areas
      alignItems: "center",   // Center tiles vertically within their grid areas
    }),
  };

  return (
    <MotionNav
      sx={containerStyle}
      variants={motionVariants}
      animate="main"
      initial="main"
    >
      {routes.map((route) => (
        <NavLink key={route.path} data={route} />
      ))}
    </MotionNav>
  );
}
