import { lighten } from "@theme-ui/color";
import { Variants } from "framer-motion";
import { ForwardedRef, forwardRef, useContext } from "react";
import { ThemeUICSSObject } from "theme-ui";
import { GlobalContext, BackgroundMode } from "../../contexts/GlobalContext";
import useMatchTheme from "../../hooks/useMatchTheme";
import useInBreakpoint from "../../hooks/useInBreakpoint";
import useReduceMotion from "../../hooks/useReduceMotion";
import useTaskbarHeight from "../../hooks/useTaskbarHeight";
import { sizes, ThemeMode } from "../../themes";
import { zIndex } from "../../themes/common";
import { List, MotionBox } from "../atoms/Container";
import ThemeButton from "../atoms/ThemeButton";
import Toggle from "../atoms/Toggle";

type PanelConfigProps = {
  isVisible?: boolean;
};

const PanelConfig = ({ isVisible }: PanelConfigProps, ref: ForwardedRef<HTMLElement>) => {
  const { reduceMotion, hideTaskbar, background, glassAnimations, showExtendedDockDesktop, showExtendedDockMobile } = useContext(GlobalContext);
  
  // Move hook calls outside conditional usage
  const isMobile = useInBreakpoint(1);
  const isSoftTheme = useMatchTheme(ThemeMode.Soft);
  const isClassicTheme = useMatchTheme(ThemeMode.Classic);
  const isTronTheme = useMatchTheme(ThemeMode.Tron);
  const isLiquidGlassTheme = useMatchTheme(ThemeMode.LiquidGlass);
  const isCyberpunkTheme = useMatchTheme(ThemeMode.Cyberpunk);

  // Get the appropriate extended dock setting and setter based on current platform
  const currentShowExtendedDock = isMobile ? showExtendedDockMobile : showExtendedDockDesktop;

  const panelConfigStyle: ThemeUICSSObject = {
    p: 4,
    bg: "primary",
    color: "textReverse",
    position: "absolute",
    left: 2,
    bottom: useTaskbarHeight() + sizes[2],
    zIndex: zIndex.taskbar,

    // Apply Mac-style 8px border radius to all panel themes
    borderRadius: "8px",

    ...(isSoftTheme && {
      bg: lighten("primary", 0.02),
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
    }),

    ...(isClassicTheme && {
      bg: "background",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.1)",
    }),

    ...(isTronTheme && {
      boxShadow: "0 4px 20px rgba(40, 142, 159, 0.3), 0 0 0 1px var(--theme-ui-colors-shadow)",
    }),

    ...(isLiquidGlassTheme && {
      bg: "rgba(255, 255, 255, 0.2)",
      backdropFilter: "blur(20px) saturate(1.8)",
      WebkitBackdropFilter: "blur(20px) saturate(1.8)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
    }),

    ...(isCyberpunkTheme && {
      bg: "primary",
      border: "1px solid var(--theme-ui-colors-highlight)",
      boxShadow: "0 4px 20px rgba(255, 0, 128, 0.3), 0 0 0 1px var(--theme-ui-colors-highlight), 0 0 10px rgba(0, 255, 255, 0.2)",
    }),

    // Default theme (Flat) with Mac-style shadow
    ...(!isSoftTheme && !isClassicTheme && !isTronTheme && !isLiquidGlassTheme && !isCyberpunkTheme && {
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1)",
    }),
  };

  const variants: Variants = {
    default: { x: "-105%", transitionEnd: { display: "none" } },
    active: { x: 0, display: "block" },
  };

  return (
    <MotionBox
      ref={ref}
      sx={panelConfigStyle}
      variants={variants}
      initial="default"
      animate={isVisible ? "active" : "default"}
      transition={useReduceMotion()}
    >
      <List sx={{ display: "grid", gridTemplateColumns: "auto auto", gap: 3, mb: 4 }}>
        <li>
          <ThemeButton theme={ThemeMode.Flat} />
        </li>
        <li>
          <ThemeButton theme={ThemeMode.Soft} />
        </li>
        <li>
          <ThemeButton theme={ThemeMode.Tron} />
        </li>
        <li>
          <ThemeButton theme={ThemeMode.Classic} />
        </li>
        <li>
          <ThemeButton theme={ThemeMode.LiquidGlass} />
        </li>
        <li>
          <ThemeButton theme={ThemeMode.Cyberpunk} />
        </li>
      </List>
      <Toggle
        id="toggle-reduceMotion"
        label="Reduce motion"
        isChecked={reduceMotion.val}
        onChange={() => reduceMotion.set(!reduceMotion.val)}
        style={{ mb: 3 }}
      />
      <Toggle
        id="toggle-hideTaskbar"
        label="Hide taskbar"
        isChecked={hideTaskbar.val}
        onChange={() => hideTaskbar.set(!hideTaskbar.val)}
        style={{ mb: 3 }}
      />
      <Toggle
        id="toggle-showExtendedDock"
        label={`Show extended dock (${isMobile ? 'Mobile' : 'Desktop'})`}
        isChecked={currentShowExtendedDock.val}
        onChange={() => currentShowExtendedDock.set(!currentShowExtendedDock.val)}
        style={{ mb: 3 }}
      />
      
      <div sx={{ mb: 3 }}>
        <span sx={{ fontSize: 1, fontWeight: "bold", mb: 2, display: "block" }}>
          Background
        </span>
        <div sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Toggle
            id="toggle-background-none"
            label="None"
            isChecked={background.val === BackgroundMode.None}
            onChange={() => background.set(BackgroundMode.None)}
          />
          <Toggle
            id="toggle-background-custom"
            label="My background"
            isChecked={background.val === BackgroundMode.Custom}
            onChange={() => background.set(BackgroundMode.Custom)}
          />
          <Toggle
            id="toggle-background-random"
            label="Random nature"
            isChecked={background.val === BackgroundMode.Random}
            onChange={() => background.set(BackgroundMode.Random)}
          />
        </div>
      </div>

      {isLiquidGlassTheme && (
        <Toggle
          id="toggle-glass-animations"
          label="Glass animations"
          isChecked={glassAnimations.val}
          onChange={() => glassAnimations.set(!glassAnimations.val)}
          style={{ mb: 3 }}
        />
      )}
    </MotionBox>
  );
};

export default forwardRef(PanelConfig);
