import { GetServerSideProps } from 'next';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, Input, Textarea, Text, Card } from 'theme-ui';
import { motion } from 'framer-motion';
import { checkAdminAuth } from '../../lib/adminAuth';

interface AboutData {
  title: string;
  content: string;
  image: string | null;
  skills: string[];
}

export default function AdminAbout() {
  const [aboutData, setAboutData] = useState<AboutData>({
    title: '',
    content: '',
    image: null,
    skills: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadAboutData();
  }, []);

  const loadAboutData = async () => {
    try {
      const response = await fetch('/api/admin/content/about');
      if (response.ok) {
        const data = await response.json();
        setAboutData(data);
      }
    } catch (error) {
      console.error('Failed to load about data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/content/about', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(aboutData),
      });

      if (response.ok) {
        setMessage('About page updated successfully!');
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

  const addSkill = () => {
    if (skillInput.trim() && !aboutData.skills.includes(skillInput.trim())) {
      setAboutData({
        ...aboutData,
        skills: [...aboutData.skills, skillInput.trim()],
      });
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setAboutData({
      ...aboutData,
      skills: aboutData.skills.filter(skill => skill !== skillToRemove),
    });
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Text>Loading...</Text>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bg: 'background', p: 4 }}>
      <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Text sx={{ fontSize: 5, fontWeight: 'bold', color: 'text' }}>
              Edit About Me
            </Text>
            <Text sx={{ fontSize: 2, color: 'muted', mt: 1 }}>
              Update your personal information and bio
            </Text>
          </motion.div>
          
          <Button
            onClick={() => router.push('/admin/dashboard')}
            variant="outline"
            sx={{ px: 4, py: 2, borderRadius: '8px' }}
          >
            Back to Dashboard
          </Button>
        </Box>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card sx={{ p: 5, borderRadius: '12px' }}>
            {/* Title */}
            <Box sx={{ mb: 4 }}>
              <Text sx={{ fontSize: 2, fontWeight: 'bold', mb: 2, color: 'text' }}>
                Page Title
              </Text>
              <Input
                value={aboutData.title}
                onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })}
                placeholder="About Me"
                sx={{
                  width: '100%',
                  p: 3,
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: 'muted',
                  fontSize: 2,
                }}
              />
            </Box>

            {/* Content */}
            <Box sx={{ mb: 4 }}>
              <Text sx={{ fontSize: 2, fontWeight: 'bold', mb: 2, color: 'text' }}>
                Bio Content
              </Text>
              <Textarea
                value={aboutData.content}
                onChange={(e) => setAboutData({ ...aboutData, content: e.target.value })}
                placeholder="Write about yourself..."
                rows={8}
                sx={{
                  width: '100%',
                  p: 3,
                  borderRadius: '8px',
                  border: '1px solid',
                  borderColor: 'muted',
                  fontSize: 2,
                  fontFamily: 'inherit',
                  resize: 'vertical',
                }}
              />
            </Box>

            {/* Skills */}
            <Box sx={{ mb: 4 }}>
              <Text sx={{ fontSize: 2, fontWeight: 'bold', mb: 2, color: 'text' }}>
                Key Skills
              </Text>
              
              {/* Add Skill Input */}
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="Add a skill..."
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  sx={{
                    flex: 1,
                    p: 2,
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor: 'muted',
                    fontSize: 1,
                  }}
                />
                <Button
                  onClick={addSkill}
                  sx={{ px: 3, py: 2, borderRadius: '6px', fontSize: 1 }}
                >
                  Add
                </Button>
              </Box>

              {/* Skills List */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {aboutData.skills.map((skill, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      bg: 'primary',
                      color: 'white',
                      px: 3,
                      py: 1,
                      borderRadius: '20px',
                      fontSize: 1,
                    }}
                  >
                    <Text>{skill}</Text>
                    <Box
                      onClick={() => removeSkill(skill)}
                      sx={{
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: 2,
                        lineHeight: 1,
                        '&:hover': { opacity: 0.7 },
                      }}
                    >
                      ×
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>

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

            {/* Save Button */}
            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
              <Button
                onClick={handleSave}
                disabled={saving}
                sx={{
                  px: 6,
                  py: 3,
                  borderRadius: '8px',
                  fontSize: 2,
                  fontWeight: 'bold',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.6 : 1,
                }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              
              <Button
                onClick={() => router.push('/')}
                variant="outline"
                sx={{ px: 6, py: 3, borderRadius: '8px' }}
              >
                Preview Site
              </Button>
            </Box>
          </Card>
        </motion.div>
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