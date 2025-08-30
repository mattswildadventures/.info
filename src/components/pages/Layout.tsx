import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { Fragment, ReactNode, useContext } from "react";
import { ThemeUICSSObject } from "theme-ui";
import { GlobalContext, BackgroundMode } from "../../contexts/GlobalContext";
import Navigation from "../molecules/Navigation";
import Desktop from "../organisms/Desktop";
import MacDock from "../organisms/MacDock";

type LayoutProps = {
  children?: ReactNode;
};

export default function Layout({ children }: LayoutProps): JSX.Element {
  const { background } = useContext(GlobalContext);

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
        return {
          backgroundImage: "url('https://source.unsplash.com/random/1920x1080/?mountains,nature,backpacking,wilderness')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        };
      default:
        return {
          background: "secondary",
        };
    }
  };

  const containerStyle: ThemeUICSSObject = {
    position: "relative",
    height: "100vh",
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
    </main>
  );
}
