import { useRouter } from "next/router";
import { useState } from "react";
import { Flex, Box } from "theme-ui";
import Window from "../src/components/molecules/Window";
import Layout from "../src/components/pages/Layout";
import ContentPane from "../src/components/pages/roadmap/ContentPane";
import NavigationPane from "../src/components/pages/roadmap/NavigationPane";
import MobileDropdownNav from "../src/components/pages/roadmap/MobileDropdownNav";
import useInBreakpoint from "../src/hooks/useInBreakpoint";
import { getRoute } from "../src/misc/routes";

export default function Roadmap(): JSX.Element {
  const { asPath } = useRouter();
  const [activeItem, setActiveItem] = useState<string>();
  const isMobile = useInBreakpoint(1); // Use 768px breakpoint for mobile

  return (
    <Window title={getRoute(asPath)?.title + ' - Career & Personal Development Goals'}>
      <Flex sx={{ 
        height: "100%", 
        flexDirection: isMobile ? "column" : "row"
      }}>
        <NavigationPane title={activeItem} onNavigate={(item) => setActiveItem(item)} />
        {isMobile && (
          <Box sx={{ p: "0 16px 16px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
            <MobileDropdownNav title={activeItem} onNavigate={(item) => setActiveItem(item)} />
          </Box>
        )}
        <ContentPane title={activeItem} />
      </Flex>
    </Window>
  );
}

Roadmap.getLayout = (page: JSX.Element) => <Layout>{page}</Layout>;