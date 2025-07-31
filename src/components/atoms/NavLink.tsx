import { motion, Transition, Variants } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { ThemeUICSSObject } from "theme-ui";
import useHomepage from "../../hooks/useHomepage";
import useInBreakpoint from "../../hooks/useInBreakpoint";
import useIsLandscape from "../../hooks/useIsLandscape";
import useMatchTheme from "../../hooks/useMatchTheme";
import useReduceMotion from "../../hooks/useReduceMotion";
import { Route } from "../../misc/routes";
import { sizes, ThemeMode } from "../../themes";
import { MotionIcon } from "./Icon";

type NavLinkProps = {
  data: Route;
};

export default function NavLink({ data }: NavLinkProps) {
  const isHomePage = useHomepage();
  const isLandscape = useIsLandscape();
  const isMobile = useInBreakpoint(0, isLandscape);
  const defaultSize = isMobile && isLandscape ? 120 : 160;
  const sidebarSize = defaultSize / 2;
  const isActive = useRouter().asPath === data.path;
  
  // Move hook calls outside conditional usage
  const isSoftTheme = useMatchTheme(ThemeMode.Soft);
  const isClassicTheme = useMatchTheme(ThemeMode.Classic);
  const isTronTheme = useMatchTheme(ThemeMode.Tron);

  const linkVariants: Variants = {
    main: {
      width: defaultSize,
      height: defaultSize,
      opacity: 1,
      margin: sizes[isMobile && isLandscape ? 2 : 3],
      transition: useReduceMotion({ duration: 0.6, delay: 0.3 }),
    },
  };

  const iconVariants: Variants = {
    main: {
      width: sidebarSize,
      height: sidebarSize,
      transition: useReduceMotion({ duration: 1 }),
    },
  };

  const labelVariants: Variants = {
    main: {
      height: "auto",
      opacity: 1,
      marginTop: sizes[3],
      transition: useReduceMotion({ duration: 1 }),
    },
  };

  const linkStyle: ThemeUICSSObject = {
    bg: "primary",
    color: "textReverse",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0,
    textDecoration: "none",
    size: defaultSize,
    position: "relative",

    // Apply Mac-style 8px border radius to all dashboard tiles
    borderRadius: "8px",

    ...(isSoftTheme && {
      fontSize: isHomePage ? "2px" : "1px",
      boxShadow: (theme) => `0 2px 10px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)`,
    }),

    ...(isClassicTheme && {
      fontSize: isHomePage ? "2px" : "1px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.1)",
    }),

    ...(isTronTheme && {
      bg: "highlight",
      boxShadow: (theme) => `0 2px 10px rgba(40, 142, 159, 0.3), 0 0 0 1px ${theme.colors?.shadow}`,
    }),

    // Default theme (Flat) with Mac-style shadow
    ...(!isSoftTheme && !isClassicTheme && !isTronTheme && {
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1)",
    }),
  };

  const indicatorStyle: ThemeUICSSObject = {
    size: sidebarSize / 9,
    bg: "highlight",
    borderRadius: "50%",
    position: "absolute",
    top: 2,
    right: 2,

    ...(useMatchTheme(ThemeMode.Classic) && {
      boxShadow: "0 0 0 2px #000",
    }),

    ...(useMatchTheme(ThemeMode.Tron) && {
      bg: "red",
      boxShadow: (theme) => `0 0 0 1.5px ${theme.colors?.shadow}`,
    }),
  };

  const spring: Transition = { type: "spring", duration: 0.5 };

  return (
    <Link href={data.path} passHref={true}>
      <motion.a
        href={data.path}
        sx={linkStyle}
        variants={linkVariants}
        animate="main"
        initial="main"
        whileHover={{ scale: 0.95 }}
      >
        {isActive && <motion.span layoutId="indicator" sx={indicatorStyle} transition={spring} />}
        <MotionIcon
          variants={iconVariants}
          animate="main"
          initial="main"
          iconName={data.icon}
          tag="span"
        />
        <motion.span
          variants={labelVariants}
          animate="main"
          initial="main"
          sx={{ whiteSpace: "nowrap", overflow: "hidden", fontSize: isMobile && isLandscape ? 16 : 20 }}
        >
          {data.title}
        </motion.span>
      </motion.a>
    </Link>
  );
}
