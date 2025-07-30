import { alpha, darken, getColor } from "@theme-ui/color";
import { motion, Variants } from "framer-motion";
import { ChangeEventHandler, useRef } from "react";
import { ThemeUICSSObject } from "theme-ui";
import { useIsFocused } from "../../hooks/useIsFocused";
import useMatchTheme from "../../hooks/useMatchTheme";
import theme, { ThemeMode } from "../../themes";
import { focus } from "../../themes/common";

type ToggleProps = {
  id: string;
  label: string;
  isChecked?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  style?: ThemeUICSSObject;
};

export default function Toggle({ id, label, isChecked, onChange, style }: ToggleProps) {
  const ref = useRef<HTMLInputElement>(null);
  const isFocused = useIsFocused(ref);
  
  // Move hook calls outside conditional usage
  const isSoftTheme = useMatchTheme(ThemeMode.Soft);
  const isClassicTheme = useMatchTheme(ThemeMode.Classic);
  const isTronTheme = useMatchTheme(ThemeMode.Tron);

  const bgStyle: ThemeUICSSObject = {
    mr: 2,
    width: 40,
    height: 18,
    bg: alpha("secondary", 0.2),
    position: "relative",
    cursor: "pointer",
    // Apply Mac-style 4px border radius for input-like elements
    borderRadius: "4px",

    ...(isSoftTheme && {
      bg: "background",
      height: 20,
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1), inset 0 1px 2px rgba(0, 0, 0, 0.1)",
    }),

    ...(isClassicTheme && {
      bg: "primary",
      height: 20,
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.1)",
    }),

    ...(isTronTheme && {
      height: 20,
      boxShadow: (theme) => `0 1px 3px rgba(40, 142, 159, 0.2), 0 0 0 1px ${theme.colors?.shadow}`,
    }),

    // Default theme (Flat) with Mac-style shadow
    ...(!isSoftTheme && !isClassicTheme && !isTronTheme && {
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1), inset 0 1px 2px rgba(0, 0, 0, 0.05)",
    }),
  };

  const thumbStyle: ThemeUICSSObject = {
    position: "absolute",
    top: "-2px",
    width: "50%",
    height: "100%",
    // Apply Mac-style 3px border radius for small toggle elements
    borderRadius: "3px",

    ...(useMatchTheme(ThemeMode.Soft) && {
      top: "10%",
      left: "10%",
      width: "40%",
      height: "80%",
    }),

    ...(useMatchTheme(ThemeMode.Classic) && {
      top: "5%",
      left: "5%",
      width: "45%",
      height: "90%",
    }),

    ...(useMatchTheme(ThemeMode.Tron) && {
      top: "10%",
      left: "5%",
      width: "45%",
      height: "80%",
    }),
  };

  const variants: Variants = {
    off: {
      x: 0,
      background: darken("secondary", 0.13)(theme),
      boxShadow: "0 4px " + darken("secondary", 0.2)(theme),

      ...(useMatchTheme(ThemeMode.Soft) && {
        background: "var(--theme-ui-colors-shadow)",
        boxShadow: "inset 1px 0 1px #fff, 1px 0 2px var(--theme-ui-colors-highlight)",
      }),

      ...(useMatchTheme(ThemeMode.Classic) && {
        background: "#000",
        boxShadow: "0 0 transparent",
      }),

      ...(useMatchTheme(ThemeMode.Tron) && {
        boxShadow: "0 0 transparent",
      }),
    },
    on: {
      x: "100%",
      background: getColor(theme, "secondary"),
      boxShadow: "0 4px " + darken("secondary", 0.1)(theme),

      ...(useMatchTheme(ThemeMode.Soft) && {
        background: "var(--theme-ui-colors-highlight)",
        boxShadow: "inset 1px 0 1px var(--theme-ui-colors-background)",
      }),

      ...(useMatchTheme(ThemeMode.Classic) && {
        background: "#000",
        boxShadow: "0 0 transparent",
      }),

      ...(useMatchTheme(ThemeMode.Tron) && {
        boxShadow: "0 0 transparent",
      }),
    },
  };

  const handleChange = (e: any) => {
    onChange && onChange(e);
  };

  return (
    <label sx={{ display: "flex", alignItems: "center", ...style }} htmlFor={id}>
      <input
        type="checkbox"
        id={id}
        ref={ref}
        sx={{ size: 0, m: 0, opacity: 0 }}
        checked={isChecked}
        onChange={handleChange}
      />
      <span sx={bgStyle}>
        <motion.span sx={thumbStyle} variants={variants} animate={isChecked ? "on" : "off"} />
        {isFocused && <span sx={{ ...focus, borderRadius: "4px" }} />}
      </span>
      <span sx={{ cursor: "pointer" }}>{label}</span>
    </label>
  );
}
