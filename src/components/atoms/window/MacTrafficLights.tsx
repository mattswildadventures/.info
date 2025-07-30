import { Flex, ThemeUICSSObject } from "theme-ui";
import useInBreakpoint from "../../../hooks/useInBreakpoint";
import useIsLandscape from "../../../hooks/useIsLandscape";
import useMatchTheme from "../../../hooks/useMatchTheme";
import { ThemeMode } from "../../../themes";

type MacTrafficLightsProps = {
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
};

export default function MacTrafficLights({ onClose, onMinimize, onMaximize }: MacTrafficLightsProps) {
  const isLandscape = useIsLandscape();
  const isMobile = useInBreakpoint(0, isLandscape);

  const containerStyle: ThemeUICSSObject = {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    pl: 2, // 8px from left edge
  };

  const buttonBaseStyle: ThemeUICSSObject = {
    border: 0,
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    cursor: "pointer",
    transition: "all 0.2s ease",
    
    "&:hover": {
      transform: "scale(1.1)",
    },

    // Ensure buttons work across all themes
    ...(useMatchTheme(ThemeMode.Classic) && {
      boxShadow: "none",
    }),

    ...(useMatchTheme(ThemeMode.Tron) && {
      boxShadow: "none",
    }),

    ...(useMatchTheme(ThemeMode.Soft) && {
      boxShadow: "none",
    }),
  };

  const closeButtonStyle: ThemeUICSSObject = {
    ...buttonBaseStyle,
    backgroundColor: "#FF5F57",
    "&:hover": {
      transform: "scale(1.1)",
      backgroundColor: "#E04640",
    },
  };

  const minimizeButtonStyle: ThemeUICSSObject = {
    ...buttonBaseStyle,
    backgroundColor: "#FFBD2E",
    "&:hover": {
      transform: "scale(1.1)",
      backgroundColor: "#E6A429",
    },
  };

  const maximizeButtonStyle: ThemeUICSSObject = {
    ...buttonBaseStyle,
    backgroundColor: "#28CA42",
    "&:hover": {
      transform: "scale(1.1)",
      backgroundColor: "#22A336",
    },
  };

  return (
    <Flex sx={containerStyle}>
      <button 
        aria-label="Close"
        onClick={onClose}
        sx={closeButtonStyle}
      />
      <button 
        aria-label="Minimize"
        onClick={onMinimize}
        sx={minimizeButtonStyle}
      />
      <button 
        aria-label="Maximize"
        onClick={onMaximize}
        sx={maximizeButtonStyle}
      />
    </Flex>
  );
}