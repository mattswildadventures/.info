import { useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, Input, Text } from 'theme-ui';
import { motion } from 'framer-motion';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('Attempting login with password:', password);

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      console.log('Auth response status:', response.status);
      console.log('Auth response headers:', response.headers);

      const data = await response.json();
      console.log('Auth response data:', data);

      if (response.ok) {
        console.log('Login successful, redirecting to dashboard');
        router.push('/admin/dashboard');
      } else {
        console.log('Login failed:', data.message);
        setError(data.message || 'Authentication failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bg: 'background',
        backgroundImage: 'linear-gradient(135deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.1) 100%)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          as="form"
          onSubmit={handleSubmit}
          sx={{
            bg: 'white',
            p: 5,
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(20px)',
            maxWidth: '400px',
            width: '100%',
            mx: 3,
          }}
        >
          <Text
            sx={{
              fontSize: 4,
              fontWeight: 'bold',
              color: 'text',
              textAlign: 'center',
              mb: 4,
            }}
          >
            Admin Login
          </Text>

          <Text
            sx={{
              fontSize: 2,
              color: 'muted',
              textAlign: 'center',
              mb: 4,
            }}
          >
            Enter your admin password to access the dashboard
          </Text>

          <Box sx={{ mb: 3 }}>
            <Input
              type="password"
              placeholder="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                width: '100%',
                p: 3,
                borderRadius: '8px',
                border: '1px solid',
                borderColor: 'muted',
                fontSize: 2,
                '&:focus': {
                  outline: 'none',
                  borderColor: 'primary',
                  boxShadow: '0 0 0 2px rgba(0, 123, 255, 0.25)',
                },
              }}
              required
            />
          </Box>

          {error && (
            <Box
              sx={{
                bg: 'rgba(220, 53, 69, 0.1)',
                color: '#dc3545',
                p: 3,
                borderRadius: '6px',
                mb: 3,
                fontSize: 1,
                textAlign: 'center',
              }}
            >
              {error}
            </Box>
          )}

          <Button
            type="submit"
            disabled={loading || !password}
            sx={{
              width: '100%',
              p: 3,
              borderRadius: '8px',
              fontSize: 2,
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: loading ? 'none' : 'translateY(-1px)',
                boxShadow: loading ? 'none' : '0 4px 12px rgba(0, 123, 255, 0.3)',
              },
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>

          <Text
            sx={{
              fontSize: 0,
              color: 'muted',
              textAlign: 'center',
              mt: 4,
            }}
          >
            Default password: admin123
          </Text>
        </Box>
      </motion.div>
    </Box>
  );
}