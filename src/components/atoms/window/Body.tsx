import { lighten } from "@theme-ui/color";
import { ReactNode } from "react";
import { ThemeUICSSObject } from "theme-ui";
import useInBreakpoint from "../../../hooks/useInBreakpoint";
import useMatchTheme from "../../../hooks/useMatchTheme";
import { ThemeMode } from "../../../themes";

type WindowBodyProps = {
  children: ReactNode;
};

export default function WindowBody({ children }: WindowBodyProps) {
  const isMobile = useInBreakpoint(1); // Use 768px breakpoint for consistency
  
  const bodyStyle: ThemeUICSSObject = {
    bg: "white",
    p: 4,
    flex: 1,
    overflow: "auto",

    // Mobile-specific scrolling enhancements
    ...(isMobile && {
      // Ensure proper touch scrolling
      WebkitOverflowScrolling: "touch",
      // Prevent momentum scrolling from affecting parent
      overscrollBehavior: "contain",
      // Smooth scrolling for better UX
      scrollBehavior: "smooth",
    }),

    ...(!useMatchTheme(ThemeMode.Flat) && { bg: "background" }),

    ...(useMatchTheme(ThemeMode.Tron) && {
      background: (theme) =>
        `linear-gradient(135deg, ${theme.colors?.background} 10%, ${lighten("background", 0.1)(theme)})`,
    }),
  };

  return <div sx={bodyStyle}>{children}</div>;
}
