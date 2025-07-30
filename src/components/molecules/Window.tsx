import { useIsPresent } from "framer-motion";
import { ReactNode, useContext, useRef } from "react";
import { useFullscreen, useToggle } from "react-use";
import { ThemeUICSSObject } from "theme-ui";
import { fadeZoomIn } from "../../animations/fade";
import { dockScaleIn, dockScaleInFallback } from "../../animations/dockScale";
import { GlobalContext } from "../../contexts/GlobalContext";
import useMatchTheme from "../../hooks/useMatchTheme";
import { sizes, ThemeMode } from "../../themes";
import { zIndex } from "../../themes/common";
import { Box, MotionBox } from "../atoms/Container";
import WindowBody from "../atoms/window/Body";
import WindowTitle from "../atoms/window/Title";

type WindowProps = {
  title?: ReactNode;
  children?: ReactNode;
  help?: string;
};

export default function Window({ title, children, help }: WindowProps) {
  const { reduceMotion } = useContext(GlobalContext);
  const [fullscreen, toggleFullscreen] = useToggle(false);
  const ref = useRef(null);
  const isPresent = useIsPresent();
  useFullscreen(ref, fullscreen);
  const w = ["100%", null, null, 900];
  const h = ["100%", null, null, `calc(100% - ${sizes[2] * 2}px)`];

  const Container = reduceMotion.val ? Box : MotionBox;
  
  // Check if we have a dock origin for the animation
  const hasDockOrigin = typeof window !== 'undefined' && sessionStorage.getItem('windowOrigin');
  const animation = hasDockOrigin ? dockScaleIn : dockScaleInFallback;
  
  // Move hook calls outside conditional usage
  const isSoftTheme = useMatchTheme(ThemeMode.Soft);
  const isClassicTheme = useMatchTheme(ThemeMode.Classic);
  const isTronTheme = useMatchTheme(ThemeMode.Tron);

  const style: ThemeUICSSObject = {
    maxWidth: w,
    minWidth: w,
    maxHeight: h,
    minHeight: ["100%", null, "initial"],
    display: "flex",
    flexDirection: "column",
    zIndex: zIndex.window,
    overflow: "hidden",

    // Apply Mac-style 12px border radius to all themes
    borderRadius: "12px",

    ...(isSoftTheme && {
      bg: "primary",
      boxShadow: (theme) => `0 4px 20px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1)`,
    }),

    ...(isClassicTheme && {
      bg: "background",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.1)",
    }),

    ...(isTronTheme && {
      boxShadow: (theme) => `0 4px 20px rgba(40, 142, 159, 0.3), 0 0 0 1px ${theme.colors?.shadow}`,
    }),

    // Default theme (Flat)
    ...(!isSoftTheme && !isClassicTheme && !isTronTheme && {
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1)",
    }),
  };

  return (
    <Container ref={ref} sx={style} {...animation}>
      <WindowTitle onFullscreen={toggleFullscreen} help={help}>
        {isPresent && title}
      </WindowTitle>
      <WindowBody>{children}</WindowBody>
    </Container>
  );
}
