import { GetServerSideProps } from 'next';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, Text, Grid, Card, Badge } from 'theme-ui';
import { motion } from 'framer-motion';
import { checkAdminAuth } from '../../lib/adminAuth';

interface ContentType {
  id: string;
  name: string;
  slug: string;
  icon: string;
  contentItems: Array<{
    id: string;
    title: string;
    isPublic: boolean;
    isPublished: boolean;
  }>;
  _count: {
    contentItems: number;
  };
}

export default function AdminCMS() {
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadContentTypes();
  }, []);

  const loadContentTypes = async () => {
    try {
      const response = await fetch('/api/cms/content-types');
      if (response.ok) {
        const data = await response.json();
        setContentTypes(data);
      } else {
        setError('Failed to load content types');
      }
    } catch (err) {
      setError('Network error loading content types');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    document.cookie = 'admin-session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Text>Loading CMS...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Text sx={{ color: 'red', mb: 3 }}>{error}</Text>
          <Button onClick={loadContentTypes}>Retry</Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bg: 'background', p: 4 }}>
      <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Text sx={{ fontSize: 5, fontWeight: 'bold', color: 'text' }}>
              Content Management System
            </Text>
            <Text sx={{ fontSize: 2, color: 'muted', mt: 1 }}>
              Manage your dynamic content with public/private controls
            </Text>
          </motion.div>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              onClick={() => router.push('/admin/dashboard')}
              variant="outline"
              sx={{ px: 4, py: 2, borderRadius: '8px' }}
            >
              Old Dashboard
            </Button>
            <Button
              onClick={handleLogout}
              sx={{ px: 4, py: 2, borderRadius: '8px', bg: 'muted', color: 'background' }}
            >
              Logout
            </Button>
          </Box>
        </Box>

        {/* Content Types Overview */}
        <Grid columns={[1, 2, 3]} gap={4} sx={{ mb: 5 }}>
          {contentTypes.map((contentType, index) => {
            const publicCount = contentType.contentItems.filter(item => item.isPublic).length;
            const publishedCount = contentType.contentItems.filter(item => item.isPublished).length;

            return (
              <motion.div
                key={contentType.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card
                  sx={{
                    p: 4,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                  onClick={() => router.push(`/admin/content/${contentType.slug}`)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Text sx={{ fontSize: 4 }}>{contentType.icon}</Text>
                      <Box>
                        <Text sx={{ fontSize: 3, fontWeight: 'bold', color: 'text' }}>
                          {contentType.name}
                        </Text>
                        <Text sx={{ fontSize: 1, color: 'muted', mt: 1 }}>
                          /{contentType.slug}
                        </Text>
                      </Box>
                    </Box>
                  </Box>

                  {/* Stats */}
                  <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <Badge sx={{ bg: 'primary', color: 'white', fontSize: 0 }}>
                      {contentType._count.contentItems} Total
                    </Badge>
                    <Badge sx={{ bg: 'secondary', color: 'white', fontSize: 0 }}>
                      {publishedCount} Published
                    </Badge>
                    <Badge sx={{ bg: 'accent', color: 'white', fontSize: 0 }}>
                      {publicCount} Public
                    </Badge>
                  </Box>

                  {/* Recent Items */}
                  <Box>
                    <Text sx={{ fontSize: 1, fontWeight: 'bold', mb: 2, color: 'text' }}>
                      Recent Items:
                    </Text>
                    {contentType.contentItems.length > 0 ? (
                      <Box sx={{ maxHeight: '100px', overflowY: 'auto' }}>
                        {contentType.contentItems.slice(0, 3).map((item) => (
                          <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            <Text sx={{ fontSize: 0, color: 'muted', flex: 1 }}>
                              {item.title}
                            </Text>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              {item.isPublic && (
                                <Badge sx={{ bg: 'green', color: 'white', fontSize: '10px', px: 1 }}>
                                  Public
                                </Badge>
                              )}
                              {item.isPublished && (
                                <Badge sx={{ bg: 'blue', color: 'white', fontSize: '10px', px: 1 }}>
                                  Live
                                </Badge>
                              )}
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <Text sx={{ fontSize: 0, color: 'muted', fontStyle: 'italic' }}>
                        No content items yet
                      </Text>
                    )}
                  </Box>
                </Card>
              </motion.div>
            );
          })}
        </Grid>

        {/* Quick Actions */}
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Text sx={{ fontSize: 2, color: 'muted', mb: 3 }}>
            Quick Actions
          </Text>
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              onClick={() => router.push('/cms/public/content')}
              sx={{ px: 4, py: 2, borderRadius: '8px' }}
            >
              View Public Content
            </Button>
            <Button
              onClick={() => router.push('/')}
              variant="outline"
              sx={{ px: 4, py: 2, borderRadius: '8px' }}
            >
              Preview Site
            </Button>
            <Button
              onClick={() => router.push('/admin/social')}
              variant="outline"
              sx={{ px: 4, py: 2, borderRadius: '8px' }}
            >
              Manage Social Links
            </Button>
          </Box>
        </Box>

        {/* Database Connection Status */}
        <Box sx={{ mt: 6, p: 3, bg: 'muted', borderRadius: '8px', textAlign: 'center' }}>
          <Text sx={{ fontSize: 1, color: 'background' }}>
            🗄️ Database Status: {contentTypes.length > 0 ? '✅ Connected' : '❌ Connection Issues'}
          </Text>
          {contentTypes.length === 0 && (
            <Text sx={{ fontSize: 0, color: 'background', mt: 1 }}>
              Check your PostgreSQL connection and run database migrations
            </Text>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const req = context.req as any;
  
  if (!checkAdminAuth(req)) {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};