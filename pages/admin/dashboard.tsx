import { GetServerSideProps } from 'next';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, Text, Grid, Card } from 'theme-ui';
import { motion } from 'framer-motion';
import { checkAdminAuth } from '../../lib/adminAuth';

interface DashboardStats {
  totalProjects: number;
  totalSkills: number;
  totalSocialLinks: number;
  lastUpdated: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const [workResponse, skillsResponse, socialResponse] = await Promise.all([
        fetch('/api/admin/content/work'),
        fetch('/api/admin/content/skills'),
        fetch('/api/admin/social'),
      ]);

      const workData = await workResponse.json();
      const skillsData = await skillsResponse.json();
      const socialData = await socialResponse.json();

      setStats({
        totalProjects: workData.projects?.length || 0,
        totalSkills: skillsData.categories?.reduce((acc: number, cat: any) => acc + (cat.skills?.length || 0), 0) || 0,
        totalSocialLinks: socialData.length || 0,
        lastUpdated: new Date().toLocaleDateString(),
      });
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    document.cookie = 'admin-session=; Path=/admin; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/admin/login');
  };

  const menuItems = [
    {
      title: 'About Me',
      description: 'Edit your personal information and bio',
      href: '/admin/about',
      icon: '👤',
    },
    {
      title: 'My Work',
      description: 'Manage your projects and portfolio items',
      href: '/admin/work',
      icon: '💼',
    },
    {
      title: 'Skills',
      description: 'Update your technical skills and expertise',
      href: '/admin/skills',
      icon: '🛠️',
    },
    {
      title: 'Social Links',
      description: 'Manage your social media links in the dock',
      href: '/admin/social',
      icon: '🔗',
    },
  ];

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Text>Loading dashboard...</Text>
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
              Admin Dashboard
            </Text>
            <Text sx={{ fontSize: 2, color: 'muted', mt: 1 }}>
              Manage your portfolio content
            </Text>
          </motion.div>
          
          <Button
            onClick={handleLogout}
            sx={{
              px: 4,
              py: 2,
              borderRadius: '8px',
              bg: 'muted',
              color: 'background',
              '&:hover': { bg: 'text' },
            }}
          >
            Logout
          </Button>
        </Box>

        {/* Stats Cards */}
        {stats && (
          <Grid columns={[1, 2, 4]} gap={4} sx={{ mb: 5 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card sx={{ p: 4, textAlign: 'center', borderRadius: '12px' }}>
                <Text sx={{ fontSize: 4, fontWeight: 'bold', color: 'primary' }}>{stats.totalProjects}</Text>
                <Text sx={{ fontSize: 1, color: 'muted', mt: 1 }}>Projects</Text>
              </Card>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card sx={{ p: 4, textAlign: 'center', borderRadius: '12px' }}>
                <Text sx={{ fontSize: 4, fontWeight: 'bold', color: 'secondary' }}>{stats.totalSkills}</Text>
                <Text sx={{ fontSize: 1, color: 'muted', mt: 1 }}>Skills</Text>
              </Card>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card sx={{ p: 4, textAlign: 'center', borderRadius: '12px' }}>
                <Text sx={{ fontSize: 4, fontWeight: 'bold', color: 'accent' }}>{stats.totalSocialLinks}</Text>
                <Text sx={{ fontSize: 1, color: 'muted', mt: 1 }}>Social Links</Text>
              </Card>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card sx={{ p: 4, textAlign: 'center', borderRadius: '12px' }}>
                <Text sx={{ fontSize: 2, fontWeight: 'bold', color: 'muted' }}>Updated</Text>
                <Text sx={{ fontSize: 1, color: 'muted', mt: 1 }}>{stats.lastUpdated}</Text>
              </Card>
            </motion.div>
          </Grid>
        )}

        {/* Menu Items */}
        <Grid columns={[1, 2]} gap={4}>
          {menuItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 5) }}
            >
              <Card
                sx={{
                  p: 5,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                  },
                }}
                onClick={() => router.push(item.href)}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                  <Text sx={{ fontSize: 5 }}>{item.icon}</Text>
                  <Box>
                    <Text sx={{ fontSize: 3, fontWeight: 'bold', color: 'text', mb: 2 }}>
                      {item.title}
                    </Text>
                    <Text sx={{ fontSize: 2, color: 'muted', lineHeight: 1.5 }}>
                      {item.description}
                    </Text>
                  </Box>
                </Box>
              </Card>
            </motion.div>
          ))}
        </Grid>

        {/* Quick Actions */}
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Text sx={{ fontSize: 2, color: 'muted', mb: 3 }}>
            Quick Actions
          </Text>
          <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              onClick={() => router.push('/')}
              sx={{ px: 4, py: 2, borderRadius: '8px' }}
            >
              View Site
            </Button>
            <Button
              onClick={() => router.push('/admin/about')}
              variant="outline"
              sx={{ px: 4, py: 2, borderRadius: '8px' }}
            >
              Edit About
            </Button>
          </Box>
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