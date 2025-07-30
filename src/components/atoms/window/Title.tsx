import { useRouter } from "next/router";
import { ReactNode } from "react";
import { Flex, ThemeUICSSObject } from "theme-ui";
import useInBreakpoint from "../../../hooks/useInBreakpoint";
import useIsLandscape from "../../../hooks/useIsLandscape";
import useMatchTheme from "../../../hooks/useMatchTheme";
import { ThemeMode } from "../../../themes";
import Help from "./Help";
import MacTrafficLights from "./MacTrafficLights";

type WindowTitleProps = {
  children?: ReactNode;
  help?: string;
  onFullscreen?: () => void;
};

export default function WindowTitle({ children, help, onFullscreen }: WindowTitleProps) {
  const router = useRouter();
  const isLandscape = useIsLandscape();
  const isMobile = useInBreakpoint(0, isLandscape);

  const titleStyle: ThemeUICSSObject = {
    display: "flex",
    bg: "primary",
    color: "textReverse",
    p: isMobile && isLandscape ? 2 : 3,
    alignItems: "center",
    justifyContent: "space-between",

    ...(useMatchTheme(ThemeMode.Classic) && {
      boxShadow: "inset 0 -2px #000",
      fontWeight: 600,
    }),

    ...(useMatchTheme(ThemeMode.Tron) && {
      boxShadow: (theme) => `inset 0 -1px ${theme.colors?.shadow}`,
    }),
  };

  return (
    <h1 sx={titleStyle}>
      <MacTrafficLights 
        onClose={() => router.push("/")}
        onMinimize={() => {/* Minimize functionality can be added later */}}
        onMaximize={onFullscreen}
      />
      <span style={{ flex: 1, textAlign: 'center' }}>{children}</span>
      <Flex>
        {help && <Help style={{ mr: 2 }}>{help}</Help>}
      </Flex>
    </h1>
  );
}
