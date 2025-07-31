/*
 * BLOG FUNCTIONALITY DEACTIVATED - 2025-01-31
 * 
 * This file has been deactivated in favor of the new Research Paper functionality.
 * The blog page was replaced with a local research paper system that doesn't rely on external APIs.
 * 
 * To reactivate blog functionality:
 * 1. Uncomment all code in this file
 * 2. Restore the blog route in src/misc/routes.ts
 * 3. Update the MacDock component to use /blog instead of /research-paper
 * 4. Ensure Dev.to and Viblo API integrations are working
 * 
 * Original blog functionality included:
 * - Integration with Dev.to API for fetching articles
 * - Integration with Viblo API for Vietnamese articles
 * - Static generation with revalidation every 7 days
 * - Platform switching between Dev.to and Viblo
 * - External link navigation to published articles
 */

/*
import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { Flex } from "theme-ui";
import { getArticles as getDevtoArticles } from "../services/devto";
import { getArticles as getVibloArticles } from "../services/viblo";
import { BlogPlatform, DevArticle, VibloArticle } from "../services/_type";
import Window from "../src/components/molecules/Window";
import ContentPane from "../src/components/pages/blog/ContentPane";
import NavigationPane from "../src/components/pages/blog/NavigationPane";
import Layout from "../src/components/pages/Layout";
import { getRoute } from "../src/misc/routes";

type PageProps = {
  devtoArticles: DevArticle[];
  vibloArticles: VibloArticle[];
  lastUpdated?: string;
};

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const [devtoArticles, vibloArticles] = await Promise.all([getDevtoArticles(), getVibloArticles()]);

  return {
    revalidate: 604800,
    props: {
      vibloArticles,
      devtoArticles,
      lastUpdated: new Date().toLocaleDateString(), // this prop shall update per revalidation time met
    },
  };
};

export default function Blog({ devtoArticles, vibloArticles, lastUpdated }: PageProps): JSX.Element {
  const { asPath } = useRouter();
  const [activePlatform, setActivePlatform] = useState<BlogPlatform>(BlogPlatform.Devto);

  return (
    <Window title={getRoute(asPath)?.title}>
      <Flex sx={{ flexDirection: ["column", null, "row"] }}>
        <NavigationPane
          activePlatform={activePlatform}
          lastUpdated={lastUpdated}
          onNavigate={(p) => setActivePlatform(p)}
        />
        <ContentPane activePlatform={activePlatform} articles={{ "Dev.to": devtoArticles, Viblo: vibloArticles }} />
      </Flex>
    </Window>
  );
}

Blog.getLayout = (page: JSX.Element) => <Layout>{page}</Layout>;
*/

// Temporary redirect to prevent 404 errors during transition
export default function Blog() {
  return null;
}
