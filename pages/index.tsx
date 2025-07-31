import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { Box, Text, Grid, Card } from 'theme-ui';
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

interface HomeProps {
  publicContent: ContentItem[];
  error?: string;
}

export default function Home({ publicContent, error }: HomeProps) {
  if (error) {
    return (
      <Layout>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Text sx={{ fontSize: 4, color: 'text', mb: 3 }}>
            Welcome to My Portfolio
          </Text>
          <Text sx={{ fontSize: 2, color: 'muted', mb: 4 }}>
            {error}
          </Text>
          <Text sx={{ fontSize: 1, color: 'muted' }}>
            Content will be loaded from the database once it&apos;s set up.
          </Text>
        </Box>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>Portfolio - Dynamic Content</title>
        <meta name="description" content="Personal portfolio with dynamic content management" />
        <meta property="og:title" content="Portfolio - Dynamic Content" />
        <meta property="og:description" content="Personal portfolio with dynamic content management" />
      </Head>
      
      <Layout>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {publicContent.length > 0 ? (
            <Box>
              {/* Hero Section */}
              <Box sx={{ textAlign: 'center', py: 8, mb: 6 }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Text sx={{ fontSize: [5, 6, 7], fontWeight: 'bold', color: 'text', mb: 3 }}>
                    Welcome to My Portfolio
                  </Text>
                  <Text sx={{ fontSize: [2, 3], color: 'muted', maxWidth: '600px', mx: 'auto' }}>
                    Explore my dynamic content powered by a custom CMS
                  </Text>
                </motion.div>
              </Box>

              {/* Public Content Sections */}
              <Box sx={{ mb: 8 }}>
                {publicContent.map((contentItem, index) => (
                  <motion.div
                    key={contentItem.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                  >
                    <Box sx={{ mb: 8 }}>
                      <DynamicContentRenderer contentItem={contentItem} />
                    </Box>
                  </motion.div>
                ))}
              </Box>

              {/* Content Types Overview */}
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Text sx={{ fontSize: 3, fontWeight: 'bold', color: 'text', mb: 4 }}>
                  Content Types
                </Text>
                <Grid columns={[2, 3, 5]} gap={3}>
                  {Array.from(new Set(publicContent.map(item => item.contentType.slug))).map((typeSlug) => {
                    const contentType = publicContent.find(item => item.contentType.slug === typeSlug)?.contentType;
                    const count = publicContent.filter(item => item.contentType.slug === typeSlug).length;
                    
                    if (!contentType) return null;
                    
                    return (
                      <Card
                        key={typeSlug}
                        sx={{
                          p: 3,
                          textAlign: 'center',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                          },
                        }}
                      >
                        <Text sx={{ fontSize: 4, mb: 2 }}>{contentType.icon}</Text>
                        <Text sx={{ fontSize: 1, fontWeight: 'bold', color: 'text' }}>
                          {contentType.name}
                        </Text>
                        <Text sx={{ fontSize: 0, color: 'muted', mt: 1 }}>
                          {count} item{count !== 1 ? 's' : ''}
                        </Text>
                      </Card>
                    );
                  })}
                </Grid>
              </Box>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Text sx={{ fontSize: 5, mb: 4 }}>🏗️</Text>
              <Text sx={{ fontSize: 4, fontWeight: 'bold', color: 'text', mb: 3 }}>
                Dynamic Content System Ready
              </Text>
              <Text sx={{ fontSize: 2, color: 'muted', mb: 4, maxWidth: '500px', mx: 'auto' }}>
                No public content available yet. Use the admin panel to create and publish content.
              </Text>
              <Text sx={{ fontSize: 1, color: 'muted' }}>
                Access the admin panel at <strong>/admin/cms</strong>
              </Text>
            </Box>
          )}
        </motion.div>
      </Layout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // Fetch all public and published content
    const publicContent = await prisma.contentItem.findMany({
      where: {
        isPublic: true,
        isPublished: true,
      },
      include: {
        contentType: true,
      },
      orderBy: [
        { publishedAt: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return {
      props: {
        publicContent: publicContent.map(item => ({
          ...item,
          createdAt: item.createdAt.toISOString(),
          updatedAt: item.updatedAt.toISOString(),
          publishedAt: item.publishedAt?.toISOString() || null,
          contentType: {
            ...item.contentType,
            createdAt: item.contentType.createdAt.toISOString(),
            updatedAt: item.contentType.updatedAt.toISOString(),
          },
        })),
      },
    };
  } catch (error) {
    console.error('Error fetching public content:', error);
    return {
      props: {
        publicContent: [],
        error: 'Database connection error. Please check your PostgreSQL setup.',
      },
    };
  }
};
