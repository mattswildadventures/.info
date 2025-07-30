import { lighten } from "@theme-ui/color";
import { Variants } from "framer-motion";
import { ForwardedRef, forwardRef, useContext } from "react";
import { ThemeUICSSObject } from "theme-ui";
import { GlobalContext } from "../../contexts/GlobalContext";
import useMatchTheme from "../../hooks/useMatchTheme";
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
  const { reduceMotion, hideTaskbar } = useContext(GlobalContext);
  
  // Move hook calls outside conditional usage
  const isSoftTheme = useMatchTheme(ThemeMode.Soft);
  const isClassicTheme = useMatchTheme(ThemeMode.Classic);
  const isTronTheme = useMatchTheme(ThemeMode.Tron);

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

    // Default theme (Flat) with Mac-style shadow
    ...(!isSoftTheme && !isClassicTheme && !isTronTheme && {
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
      />
    </MotionBox>
  );
};

export default forwardRef(PanelConfig);
