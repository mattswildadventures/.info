import { GetServerSideProps } from 'next';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, Text, Grid, Card, Badge, Textarea, Input, Label, Select } from 'theme-ui';
import { motion } from 'framer-motion';
import { checkAdminAuth } from '../../../lib/adminAuth';

interface ContentItem {
  id: string;
  slug: string;
  title: string;
  data: any;
  isPublic: boolean;
  isPublished: boolean;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

interface ContentType {
  id: string;
  name: string;
  slug: string;
  icon: string;
  schema: any;
  layoutComponent: string;
}

interface ContentManagementProps {
  contentTypeSlug: string;
}

export default function ContentManagement({ contentTypeSlug }: ContentManagementProps) {
  const [contentType, setContentType] = useState<ContentType | null>(null);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (contentTypeSlug) {
      loadContentData();
    }
  }, [contentTypeSlug]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadContentData = async () => {
    try {
      setLoading(true);
      
      // Load content type info
      const typeResponse = await fetch('/api/cms/content-types');
      if (typeResponse.ok) {
        const contentTypes = await typeResponse.json();
        const currentType = contentTypes.find((ct: ContentType) => ct.slug === contentTypeSlug);
        setContentType(currentType);
      }

      // Load content items for this type
      const itemsResponse = await fetch(`/api/cms/content-type/${contentTypeSlug}/items`);
      if (itemsResponse.ok) {
        const items = await itemsResponse.json();
        setContentItems(items);
      } else if (itemsResponse.status === 404) {
        // Content type doesn't exist, redirect back
        router.push('/admin/cms');
        return;
      }
    } catch (err) {
      setError('Failed to load content data');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: ContentItem) => {
    setEditingItem(item);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingItem({
      id: '',
      slug: '',
      title: '',
      data: {},
      isPublic: false,
      isPublished: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  const handleSave = async () => {
    if (!editingItem || !contentType) return;

    try {
      const method = isCreating ? 'POST' : 'PUT';
      const url = isCreating ? '/api/cms/content' : `/api/cms/content/${editingItem.slug}`;
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editingItem,
          contentTypeId: contentType.id,
        }),
      });

      if (response.ok) {
        setEditingItem(null);
        setIsCreating(false);
        loadContentData();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to save content');
      }
    } catch (err) {
      setError('Network error saving content');
    }
  };

  const handleDelete = async (item: ContentItem) => {
    if (!confirm(`Are you sure you want to delete "${item.title}"?`)) return;

    try {
      const response = await fetch(`/api/cms/content/${item.slug}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadContentData();
      } else {
        setError('Failed to delete content');
      }
    } catch (err) {
      setError('Network error deleting content');
    }
  };

  const handleLogout = () => {
    document.cookie = 'admin-session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Text>Loading content management...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Text sx={{ color: 'red', mb: 3 }}>{error}</Text>
          <Button onClick={loadContentData}>Retry</Button>
        </Box>
      </Box>
    );
  }

  if (!contentType) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Text sx={{ color: 'red', mb: 3 }}>Content type not found</Text>
          <Button onClick={() => router.push('/admin/cms')}>Back to CMS</Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bg: 'background', p: 4 }}>
      <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
              <Button 
                onClick={() => router.push('/admin/cms')}
                variant="outline"
                sx={{ px: 3, py: 1, borderRadius: '6px' }}
              >
                ← Back to CMS
              </Button>
              <Text sx={{ fontSize: 1, color: 'muted' }}>/</Text>
              <Text sx={{ fontSize: 4 }}>{contentType.icon}</Text>
              <Text sx={{ fontSize: 5, fontWeight: 'bold', color: 'text' }}>
                {contentType.name}
              </Text>
            </Box>
            <Text sx={{ fontSize: 2, color: 'muted' }}>
              Manage {contentType.name.toLowerCase()} content with public/private controls
            </Text>
          </motion.div>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              onClick={handleCreate}
              sx={{ px: 4, py: 2, borderRadius: '8px' }}
            >
              + Create New
            </Button>
            <Button
              onClick={handleLogout}
              sx={{ px: 4, py: 2, borderRadius: '8px', bg: 'muted', color: 'background' }}
            >
              Logout
            </Button>
          </Box>
        </Box>

        {/* Content Items Grid */}
        {!editingItem ? (
          <Grid columns={[1, 2, 3]} gap={4}>
            {contentItems.map((item, index) => (
              <motion.div
                key={item.id}
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
                  <Box sx={{ mb: 3 }}>
                    <Text sx={{ fontSize: 2, fontWeight: 'bold', color: 'text', mb: 1 }}>
                      {item.title}
                    </Text>
                    <Text sx={{ fontSize: 1, color: 'muted', mb: 2 }}>
                      /{item.slug}
                    </Text>
                    
                    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                      <Badge sx={{ 
                        bg: item.isPublic ? 'green' : 'gray', 
                        color: 'white', 
                        fontSize: 0 
                      }}>
                        {item.isPublic ? 'Public' : 'Private'}
                      </Badge>
                      <Badge sx={{ 
                        bg: item.isPublished ? 'blue' : 'orange', 
                        color: 'white', 
                        fontSize: 0 
                      }}>
                        {item.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                    </Box>

                    <Text sx={{ fontSize: 0, color: 'muted' }}>
                      Updated: {new Date(item.updatedAt).toLocaleDateString()}
                    </Text>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      onClick={() => handleEdit(item)}
                      variant="outline"
                      sx={{ flex: 1, py: 2, borderRadius: '6px' }}
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => window.open(`/${item.slug}`, '_blank')}
                      variant="outline"
                      sx={{ px: 3, py: 2, borderRadius: '6px' }}
                    >
                      View
                    </Button>
                    <Button
                      onClick={() => handleDelete(item)}
                      sx={{ 
                        px: 3, 
                        py: 2, 
                        borderRadius: '6px', 
                        bg: 'red', 
                        color: 'white',
                        '&:hover': { bg: 'darkred' }
                      }}
                    >
                      Delete
                    </Button>
                  </Box>
                </Card>
              </motion.div>
            ))}

            {contentItems.length === 0 && (
              <Box sx={{ gridColumn: '1 / -1', textAlign: 'center', py: 8 }}>
                <Text sx={{ fontSize: 5, mb: 3 }}>📝</Text>
                <Text sx={{ fontSize: 3, color: 'text', mb: 2 }}>
                  No {contentType.name.toLowerCase()} content yet
                </Text>
                <Text sx={{ fontSize: 2, color: 'muted', mb: 4 }}>
                  Create your first {contentType.name.toLowerCase()} item to get started
                </Text>
                <Button onClick={handleCreate} sx={{ px: 4, py: 2, borderRadius: '8px' }}>
                  Create First Item
                </Button>
              </Box>
            )}
          </Grid>
        ) : (
          /* Edit Form */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card sx={{ p: 5, borderRadius: '12px', maxWidth: '800px', mx: 'auto' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Text sx={{ fontSize: 4, fontWeight: 'bold', color: 'text' }}>
                  {isCreating ? 'Create New' : 'Edit'} {contentType.name}
                </Text>
                <Button
                  onClick={() => {
                    setEditingItem(null);
                    setIsCreating(false);
                  }}
                  variant="outline"
                  sx={{ px: 3, py: 1, borderRadius: '6px' }}
                >
                  Cancel
                </Button>
              </Box>

              <Box sx={{ display: 'grid', gap: 4 }}>
                <Box>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={editingItem.title}
                    onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
                    sx={{ mt: 1 }}
                  />
                </Box>

                <Box>
                  <Label htmlFor="slug">Slug (URL path)</Label>
                  <Input
                    id="slug"
                    value={editingItem.slug}
                    onChange={(e) => setEditingItem({...editingItem, slug: e.target.value})}
                    sx={{ mt: 1 }}
                  />
                  <Text sx={{ fontSize: 0, color: 'muted', mt: 1 }}>
                    Will be accessible at: /{editingItem.slug}
                  </Text>
                </Box>

                <Box>
                  <Label htmlFor="content">Content (JSON format)</Label>
                  <Textarea
                    id="content"
                    value={JSON.stringify(editingItem.data, null, 2)}
                    onChange={(e) => {
                      try {
                        const data = JSON.parse(e.target.value);
                        setEditingItem({...editingItem, data});
                      } catch (err) {
                        // Invalid JSON, don't update
                      }
                    }}
                    rows={10}
                    sx={{ mt: 1, fontFamily: 'monospace' }}
                  />
                </Box>

                <Box>
                  <Label htmlFor="metaTitle">Meta Title (SEO)</Label>
                  <Input
                    id="metaTitle"
                    value={editingItem.metaTitle || ''}
                    onChange={(e) => setEditingItem({...editingItem, metaTitle: e.target.value})}
                    sx={{ mt: 1 }}
                  />
                </Box>

                <Box>
                  <Label htmlFor="metaDescription">Meta Description (SEO)</Label>
                  <Textarea
                    id="metaDescription"
                    value={editingItem.metaDescription || ''}
                    onChange={(e) => setEditingItem({...editingItem, metaDescription: e.target.value})}
                    rows={3}
                    sx={{ mt: 1 }}
                  />
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                  <Box>
                    <Label>
                      <input
                        type="checkbox"
                        checked={editingItem.isPublic}
                        onChange={(e) => setEditingItem({...editingItem, isPublic: e.target.checked})}
                        style={{ marginRight: '8px' }}
                      />
                      Public (show on main page)
                    </Label>
                  </Box>
                  <Box>
                    <Label>
                      <input
                        type="checkbox"
                        checked={editingItem.isPublished}
                        onChange={(e) => setEditingItem({...editingItem, isPublished: e.target.checked})}
                        style={{ marginRight: '8px' }}
                      />
                      Published (live on site)
                    </Label>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 3, justifyContent: 'flex-end', pt: 3, borderTop: '1px solid', borderColor: 'muted' }}>
                  <Button
                    onClick={() => {
                      setEditingItem(null);
                      setIsCreating(false);
                    }}
                    variant="outline"
                    sx={{ px: 4, py: 2, borderRadius: '8px' }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    sx={{ px: 4, py: 2, borderRadius: '8px' }}
                  >
                    {isCreating ? 'Create' : 'Save Changes'}
                  </Button>
                </Box>
              </Box>
            </Card>
          </motion.div>
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

  const { contentType } = context.params as { contentType: string };

  return {
    props: {
      contentTypeSlug: contentType,
    },
  };
};