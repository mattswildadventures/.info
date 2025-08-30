import { Variants } from "framer-motion";
import { ThemeUICSSObject } from "theme-ui";
import useHomepage from "../../hooks/useHomepage";
import useInBreakpoint from "../../hooks/useInBreakpoint";
import useReduceMotion from "../../hooks/useReduceMotion";
import routes from "../../misc/routes";
import { translate } from "../../misc/utils";
import { MotionNav } from "../atoms/Container";
import NavLink from "../atoms/NavLink";

export default function Navigation() {
  const isHomePage = useHomepage();
  const isMobile = useInBreakpoint(0);
  const mainTransition = useReduceMotion({ duration: 0.8 });
  
  // Only show navigation on homepage - left sidebar navigation removed
  if (!isHomePage) {
    return null;
  }

  const motionVariants: Variants = {
    main: {
      ...translate("-50%"),
      top: "50%",
      left: "50%",
      display: isMobile ? "none" : "grid",
      transition: mainTransition,
    },
  };

  const containerStyle: ThemeUICSSObject = {
    display: "grid",
    gridTemplateColumns: "auto auto auto", // Changed to 3 columns for 3×2 grid
    position: "absolute",
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
