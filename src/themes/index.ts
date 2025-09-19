import type { Theme } from "theme-ui";

export const sizes: number[] = [0, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 256, 512];

export const breakpoints = ["480px", "768px", "1024px"];

export enum ThemeMode {
  Flat = "flat",
  Soft = "soft",
  Tron = "tron",
  Classic = "classic",
  LiquidGlass = "liquidglass",
  Cyberpunk = "cyberpunk",
}

const theme: Theme = {
  colors: {
    background: "#f2f3f5",
    primary: "#2c3e50",
    secondary: "#1abc9c",
    highlight: "#1abc9c",
    shadow: undefined,
    text: "#2c3e50",
    textReverse: "#fff",
    muted: "rgba(0, 0, 0, 0.6)",
    mutedReverse: "rgba(255, 255, 255, 0.6)",
    white: "#fff",
    red: "#ed4c5a",
    green: "#00c851",

    modes: {
      soft: {
        background: "#f1f1f8",
        primary: "#e2e3f0",
        secondary: "#d4d7ec",
        highlight: "#93a1d2",
        shadow: "#ccd0e8",
        text: "#232246",
        textReverse: "#232246",
        muted: "rgba(35, 34, 70, 0.8)",
        mutedReverse: "rgba(35, 34, 70, 0.8)",
        white: "#e2e3f0",
        red: "#ed4c5a",
        green: "#00c851",
      },

      classic: {
        background: "#f8f3e7",
        primary: "#f3ebd9",
        secondary: "#d7eae6",
        highlight: "#f9a48c",
        shadow: "#000",
        text: "#000",
        textReverse: "#000",
        muted: "rgba(0, 0, 0, 0.6)",
        mutedReverse: "rgba(0, 0, 0, 0.8)",
        white: "#fff",
        red: "#f8c3c5",
        green: "#cbe7c5",
      },

      tron: {
        background: "#0a1d20",
        primary: "#001d23",
        secondary: "#0a1d20",
        highlight: "#043236",
        shadow: "#288e9f",
        text: "#fff",
        textReverse: "#adeaeb",
        muted: "rgba(255, 255, 255, 0.6)",
        mutedReverse: "rgba(255, 255, 255, 0.6)",
        white: "#fff",
        red: "#166775",
        green: "#0b363d",
      },

      liquidglass: {
        background: "rgba(255, 255, 255, 0.1)",
        primary: "rgba(255, 255, 255, 0.2)",
        secondary: "rgba(255, 255, 255, 0.15)",
        highlight: "rgba(59, 130, 246, 0.6)",
        shadow: "rgba(0, 0, 0, 0.1)",
        text: "#000",
        textReverse: "#000",
        muted: "rgba(0, 0, 0, 0.6)",
        mutedReverse: "rgba(0, 0, 0, 0.7)",
        white: "rgba(255, 255, 255, 0.9)",
        red: "rgba(239, 68, 68, 0.8)",
        green: "rgba(16, 185, 129, 0.8)",
      },

      cyberpunk: {
        background: "#0a0a0f",
        primary: "#1a0a1f",
        secondary: "#2a1a2f",
        highlight: "#00ffff",
        shadow: "#ff0080",
        text: "#ffffff",
        textReverse: "#00ffff",
        muted: "rgba(255, 255, 255, 0.7)",
        mutedReverse: "rgba(0, 255, 255, 0.8)",
        white: "#ffffff",
        red: "#ff0080",
        green: "#00ff80",
      },
    },
  },
  fonts: { heading: "inherit" },
  breakpoints,
  sizes,
  space: sizes,
};

export default theme;
