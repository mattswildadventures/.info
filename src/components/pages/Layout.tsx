import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { Fragment, ReactNode, useContext, useEffect } from "react";
import { ThemeUICSSObject } from "theme-ui";
import { GlobalContext, BackgroundMode } from "../../contexts/GlobalContext";
import { useUnsplashBackground } from "../../hooks/useUnsplashBackground";
import useMatchTheme from "../../hooks/useMatchTheme";
import useTaskbarHeight from "../../hooks/useTaskbarHeight";
import useInBreakpoint from "../../hooks/useInBreakpoint";
import { ThemeMode } from "../../themes";
import Navigation from "../molecules/Navigation";
import Desktop from "../organisms/Desktop";
import MacDock from "../organisms/MacDock";

type LayoutProps = {
  children?: ReactNode;
};

export default function Layout({ children }: LayoutProps): JSX.Element {
  const { background } = useContext(GlobalContext);
  const { imageUrl, attribution, loading, error, fetchRandomBackground, clearBackground } = useUnsplashBackground();
  const isLiquidGlassTheme = useMatchTheme(ThemeMode.LiquidGlass);
  const taskbarHeight = useTaskbarHeight();
  const isMobile = useInBreakpoint(1);

  // Fetch random background when Random mode is selected
  useEffect(() => {
    if (background.val === BackgroundMode.Random) {
      fetchRandomBackground();
    } else {
      clearBackground();
    }
  }, [background.val, fetchRandomBackground, clearBackground]);

  const getBackgroundStyle = (): ThemeUICSSObject => {
    switch (background.val) {
      case BackgroundMode.Custom:
        return {
          backgroundImage: "url('/images/custom-background.avif')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        };
      case BackgroundMode.Random:
        if (imageUrl) {
          return {
            backgroundImage: `url('${imageUrl}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          };
        }
        return { background: "secondary" };
      default:
        // Use special blue-gray background for Liquid Glass theme's "No background" option
        return {
          background: isLiquidGlassTheme ? "#e8eaf6" : "secondary",
        };
    }
  };

  const containerStyle: ThemeUICSSObject = {
    position: "relative",
    // Use proper mobile viewport units to avoid content going behind dock
    height: isMobile ? "100dvh" : "100vh",
    // Fallback for browsers that don't support dvh
    minHeight: isMobile ? "100vh" : "-webkit-fill-available",
    overflow: "hidden",
    ...getBackgroundStyle(),
  };

  return (
    <main sx={containerStyle}>
      <Desktop>
        <Navigation />
        <AnimatePresence exitBeforeEnter>
          <Fragment key={useRouter().asPath}>{children}</Fragment>
        </AnimatePresence>
      </Desktop>
      <MacDock />
      
      {/* Unsplash attribution as required by their API terms */}
      {attribution && background.val === BackgroundMode.Random && process.env.NEXT_PUBLIC_SHOW_PHOTOGRAPHER_CREDIT === 'true' && (
        <div
          sx={{
            position: "fixed",
            bottom: `${taskbarHeight + 16}px`, // Dynamic positioning based on taskbar height
            right: "16px",
            padding: "8px 12px",
            background: "rgba(0, 0, 0, 0.7)",
            color: "white",
            borderRadius: "4px",
            fontSize: "12px",
            zIndex: 1000,
            opacity: 0.8,
            transition: "opacity 0.3s ease",
            "&:hover": {
              opacity: 1,
            },
          }}
        >
          <a
            href={attribution.photographerUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: "white",
              textDecoration: "none",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            Photo by {attribution.photographerName} on Unsplash
          </a>
        </div>
      )}
    </main>
  );
}
