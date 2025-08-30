import { useRouter } from "next/router";
import { useState } from "react";
import { Flex } from "theme-ui";
import Window from "../src/components/molecules/Window";
import Layout from "../src/components/pages/Layout";
import ContentPane from "../src/components/pages/mindset/ContentPane";
import NavigationPane from "../src/components/pages/mindset/NavigationPane";
import { getRoute } from "../src/misc/routes";

export default function Mindset(): JSX.Element {
  const { asPath } = useRouter();
  const [activeItem, setActiveItem] = useState<string>();

  return (
    <Window title={getRoute(asPath)?.title + ' - Personal Philosophy & Mental Models'}>
      <Flex sx={{ height: "100%", flexDirection: ["column", null, "row"] }}>
        <NavigationPane title={activeItem} onNavigate={(item) => setActiveItem(item)} />
        <ContentPane title={activeItem} />
      </Flex>
    </Window>
  );
}

Mindset.getLayout = (page: JSX.Element) => <Layout>{page}</Layout>;