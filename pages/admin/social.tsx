import { GetServerSideProps } from 'next';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, Input, Text, Card, Grid } from 'theme-ui';
import { motion } from 'framer-motion';
import { checkAdminAuth } from '../../lib/adminAuth';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  label: string;
  order: number;
}

export default function AdminSocial() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const router = useRouter();

  // Form state for new/edit link
  const [formData, setFormData] = useState({
    platform: '',
    url: '',
    icon: '',
    label: '',
  });

  useEffect(() => {
    loadSocialLinks();
  }, []);

  const loadSocialLinks = async () => {
    try {
      const response = await fetch('/api/admin/social');
      if (response.ok) {
        const data = await response.json();
        setSocialLinks(data.sort((a: SocialLink, b: SocialLink) => a.order - b.order));
      }
    } catch (error) {
      console.error('Failed to load social links:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.platform || !formData.url) {
      setMessage('Platform and URL are required');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      const url = editingLink ? `/api/admin/social?id=${editingLink.id}` : '/api/admin/social';
      const method = editingLink ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          label: formData.label || formData.platform,
          icon: formData.icon || 'SiGlobe',
        }),
      });

      if (response.ok) {
        setMessage(editingLink ? 'Social link updated!' : 'Social link added!');
        resetForm();
        loadSocialLinks();
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message}`);
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (linkId: string) => {
    if (!confirm('Are you sure you want to delete this social link?')) {
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/admin/social?id=${linkId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessage('Social link deleted!');
        loadSocialLinks();
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message}`);
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({ platform: '', url: '', icon: '', label: '' });
    setEditingLink(null);
    setShowAddForm(false);
  };

  const startEdit = (link: SocialLink) => {
    setFormData({
      platform: link.platform,
      url: link.url,
      icon: link.icon,
      label: link.label,
    });
    setEditingLink(link);
    setShowAddForm(true);
  };

  const popularIcons = [
    { name: 'GitHub', icon: 'SiGithub' },
    { name: 'LinkedIn', icon: 'FaLinkedinIn' },
    { name: 'Twitter', icon: 'SiTwitter' },
    { name: 'Instagram', icon: 'SiInstagram' },
    { name: 'Facebook', icon: 'SiFacebook' },
    { name: 'YouTube', icon: 'SiYoutube' },
    { name: 'Discord', icon: 'SiDiscord' },
    { name: 'Website', icon: 'SiGlobe' },
  ];

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Text>Loading...</Text>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bg: 'background', p: 4 }}>
      <Box sx={{ maxWidth: '1000px', mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Text sx={{ fontSize: 5, fontWeight: 'bold', color: 'text' }}>
              Social Links
            </Text>
            <Text sx={{ fontSize: 2, color: 'muted', mt: 1 }}>
              Manage social media links in the dock
            </Text>
          </motion.div>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              sx={{ px: 4, py: 2, borderRadius: '8px' }}
            >
              {showAddForm ? 'Cancel' : 'Add Link'}
            </Button>
            <Button
              onClick={() => router.push('/admin/dashboard')}
              variant="outline"
              sx={{ px: 4, py: 2, borderRadius: '8px' }}
            >
              Back
            </Button>
          </Box>
        </Box>

        {/* Add/Edit Form */}
        {showAddForm && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <Card sx={{ p: 4, mb: 5, borderRadius: '12px' }}>
              <Text sx={{ fontSize: 3, fontWeight: 'bold', mb: 3, color: 'text' }}>
                {editingLink ? 'Edit Social Link' : 'Add New Social Link'}
              </Text>

              <Grid columns={[1, 2]} gap={3} sx={{ mb: 3 }}>
                <Box>
                  <Text sx={{ fontSize: 1, fontWeight: 'bold', mb: 1, color: 'text' }}>Platform</Text>
                  <Input
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    placeholder="e.g., GitHub"
                    sx={{ p: 2, borderRadius: '6px' }}
                  />
                </Box>
                <Box>
                  <Text sx={{ fontSize: 1, fontWeight: 'bold', mb: 1, color: 'text' }}>URL</Text>
                  <Input
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://..."
                    sx={{ p: 2, borderRadius: '6px' }}
                  />
                </Box>
              </Grid>

              <Grid columns={[1, 2]} gap={3} sx={{ mb: 3 }}>
                <Box>
                  <Text sx={{ fontSize: 1, fontWeight: 'bold', mb: 1, color: 'text' }}>Label</Text>
                  <Input
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    placeholder="Display label (optional)"
                    sx={{ p: 2, borderRadius: '6px' }}
                  />
                </Box>
                <Box>
                  <Text sx={{ fontSize: 1, fontWeight: 'bold', mb: 1, color: 'text' }}>Icon</Text>
                  <Input
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="Icon name (e.g., SiGithub)"
                    sx={{ p: 2, borderRadius: '6px' }}
                  />
                </Box>
              </Grid>

              {/* Popular Icons */}
              <Box sx={{ mb: 3 }}>
                <Text sx={{ fontSize: 1, fontWeight: 'bold', mb: 2, color: 'text' }}>Popular Icons:</Text>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  {popularIcons.map((item) => (
                    <Button
                      key={item.icon}
                      onClick={() => setFormData({ ...formData, icon: item.icon, platform: formData.platform || item.name })}
                      variant="outline"
                      sx={{
                        px: 2,
                        py: 1,
                        fontSize: 0,
                        borderRadius: '4px',
                        bg: formData.icon === item.icon ? 'primary' : 'transparent',
                        color: formData.icon === item.icon ? 'white' : 'text',
                      }}
                    >
                      {item.name}
                    </Button>
                  ))}
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  sx={{
                    px: 4,
                    py: 2,
                    borderRadius: '6px',
                    cursor: saving ? 'not-allowed' : 'pointer',
                    opacity: saving ? 0.6 : 1,
                  }}
                >
                  {saving ? 'Saving...' : (editingLink ? 'Update' : 'Add')}
                </Button>
                <Button
                  onClick={resetForm}
                  variant="outline"
                  sx={{ px: 4, py: 2, borderRadius: '6px' }}
                >
                  Cancel
                </Button>
              </Box>
            </Card>
          </motion.div>
        )}

        {/* Message */}
        {message && (
          <Box
            sx={{
              bg: message.startsWith('Error') ? 'rgba(220, 53, 69, 0.1)' : 'rgba(40, 167, 69, 0.1)',
              color: message.startsWith('Error') ? '#dc3545' : '#28a745',
              p: 3,
              borderRadius: '6px',
              mb: 4,
              textAlign: 'center',
            }}
          >
            {message}
          </Box>
        )}

        {/* Social Links List */}
        <Grid columns={[1, 2, 3]} gap={4}>
          {socialLinks.map((link, index) => (
            <motion.div
              key={link.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card
                sx={{
                  p: 4,
                  borderRadius: '12px',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                  <Box>
                    <Text sx={{ fontSize: 2, fontWeight: 'bold', color: 'text', mb: 1 }}>
                      {link.platform}
                    </Text>
                    <Text sx={{ fontSize: 1, color: 'muted', mb: 1 }}>
                      {link.label}
                    </Text>
                    <Text sx={{ fontSize: 0, color: 'muted', fontFamily: 'monospace' }}>
                      Icon: {link.icon}
                    </Text>
                  </Box>
                  <Text sx={{ fontSize: 1, bg: 'muted', color: 'background', px: 2, py: 1, borderRadius: '4px' }}>
                    #{link.order}
                  </Text>
                </Box>

                <Text
                  sx={{
                    fontSize: 1,
                    color: 'primary',
                    mb: 3,
                    wordBreak: 'break-all',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                  }}
                  onClick={() => window.open(link.url, '_blank')}
                >
                  {link.url}
                </Text>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    onClick={() => startEdit(link)}
                    variant="outline"
                    sx={{ flex: 1, py: 2, fontSize: 1, borderRadius: '6px' }}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(link.id)}
                    sx={{
                      flex: 1,
                      py: 2,
                      fontSize: 1,
                      borderRadius: '6px',
                      bg: '#dc3545',
                      '&:hover': { bg: '#c82333' },
                    }}
                  >
                    Delete
                  </Button>
                </Box>
              </Card>
            </motion.div>
          ))}
        </Grid>

        {socialLinks.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Text sx={{ fontSize: 3, color: 'muted' }}>
              No social links yet. Add your first one!
            </Text>
          </Box>
        )}
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