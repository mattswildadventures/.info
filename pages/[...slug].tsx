import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Box, Button } from 'theme-ui';
import { motion } from 'framer-motion';
import Layout from '../src/components/pages/Layout';
import DynamicContentRenderer from '../src/components/DynamicContentRenderer';
import { prisma } from '../lib/prisma';

interface ContentItem {
  id: string;
  slug: string;
  title: string;
  data: any;
  isPublic: boolean;
  metaTitle?: string;
  metaDescription?: string;
  publishedAt: string;
  contentType: {
    id: string;
    name: string;
    slug: string;
    icon: string;
    layoutComponent: string;
  };
}

interface DynamicPageProps {
  contentItem: ContentItem | null;
  error?: string;
}

export default function DynamicPage({ contentItem, error }: DynamicPageProps) {
  const router = useRouter();

  if (error) {
    return (
      <Layout>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Box sx={{ fontSize: 6, mb: 4 }}>🚫</Box>
            <Box sx={{ fontSize: 4, fontWeight: 'bold', color: 'text', mb: 3 }}>
              Page Not Found
            </Box>
            <Box sx={{ fontSize: 2, color: 'muted', mb: 4, maxWidth: '400px', mx: 'auto' }}>
              {error}
            </Box>
            <Button
              onClick={() => router.push('/')}
              sx={{ px: 4, py: 2, borderRadius: '8px' }}
            >
              Return Home
            </Button>
          </motion.div>
        </Box>
      </Layout>
    );
  }

  if (!contentItem) {
    return (
      <Layout>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Box sx={{ fontSize: 6, mb: 4 }}>⚠️</Box>
          <Box sx={{ fontSize: 3, color: 'muted' }}>
            Content not available
          </Box>
        </Box>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>{contentItem.metaTitle || contentItem.title}</title>
        {contentItem.metaDescription && (
          <meta name="description" content={contentItem.metaDescription} />
        )}
        <meta property="og:title" content={contentItem.metaTitle || contentItem.title} />
        {contentItem.metaDescription && (
          <meta property="og:description" content={contentItem.metaDescription} />
        )}
        <meta property="og:type" content="article" />
      </Head>
      
      <Layout>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <DynamicContentRenderer contentItem={contentItem} />
        </motion.div>
      </Layout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.query;
  
  if (!slug || !Array.isArray(slug)) {
    return {
      props: {
        contentItem: null,
        error: 'Invalid page URL',
      },
    };
  }

  const pageSlug = slug.join('/');

  try {
    // Try to find content item by slug
    const contentItem = await prisma.contentItem.findUnique({
      where: { 
        slug: pageSlug,
        isPublished: true, // Only show published content
      },
      include: {
        contentType: true,
      },
    });

    if (!contentItem) {
      return {
        props: {
          contentItem: null,
          error: `No content found for "${pageSlug}"`,
        },
      };
    }

    return {
      props: {
        contentItem: {
          ...contentItem,
          createdAt: contentItem.createdAt.toISOString(),
          updatedAt: contentItem.updatedAt.toISOString(),
          publishedAt: contentItem.publishedAt?.toISOString() || null,
          contentType: {
            ...contentItem.contentType,
            createdAt: contentItem.contentType.createdAt.toISOString(),
            updatedAt: contentItem.contentType.updatedAt.toISOString(),
          },
        },
      },
    };
  } catch (error) {
    console.error('Error fetching dynamic content:', error);
    return {
      props: {
        contentItem: null,
        error: 'Failed to load content',
      },
    };
  }
};