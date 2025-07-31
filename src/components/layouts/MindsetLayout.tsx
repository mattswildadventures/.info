import { Box, Text, Image, Grid, Card } from 'theme-ui';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface MindsetData {
  title: string;
  content: string;
  featuredImage?: string;
  quotes?: Array<{
    text: string;
    author?: string;
    context?: string;
  }>;
  categories?: string[];
  philosophy?: string;
}

interface MindsetLayoutProps {
  data: MindsetData;
}

export default function MindsetLayout({ data }: MindsetLayoutProps) {
  const { title, content, featuredImage, quotes = [], categories = [], philosophy } = data;

  return (
    <Box sx={{ maxWidth: '900px', mx: 'auto', p: 4 }}>
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Text sx={{ fontSize: [5, 6, 7], fontWeight: 'bold', color: 'text', mb: 3 }}>
            {title}
          </Text>
          
          {/* Categories */}
          {categories.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4, flexWrap: 'wrap' }}>
              {categories.map((category, index) => (
                <Box
                  key={index}
                  sx={{
                    bg: 'primary',
                    color: 'white',
                    px: 3,
                    py: 1,
                    borderRadius: '20px',
                    fontSize: 1,
                    fontWeight: 'bold',
                  }}
                >
                  {category}
                </Box>
              ))}
            </Box>
          )}

          {/* Featured Image */}
          {featuredImage && (
            <Box sx={{ mb: 5, borderRadius: '12px', overflow: 'hidden', maxWidth: '600px', mx: 'auto' }}>
              <Image
                src={featuredImage}
                alt={title}
                sx={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </Box>
          )}
        </Box>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Box sx={{ mb: 6 }}>
          <Box
            sx={{
              fontSize: [2, 3],
              lineHeight: 1.7,
              color: 'text',
              '& p': { mb: 4 },
              '& h2': { fontSize: 4, fontWeight: 'bold', mt: 5, mb: 3 },
              '& h3': { fontSize: 3, fontWeight: 'bold', mt: 4, mb: 2 },
              '& ul, & ol': { ml: 4, mb: 4 },
              '& li': { mb: 2 },
              '& blockquote': {
                borderLeft: '4px solid',
                borderColor: 'primary',
                pl: 4,
                ml: 0,
                fontStyle: 'italic',
                fontSize: 3,
                color: 'muted',
              },
            }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </Box>
      </motion.div>

      {/* Quotes Section */}
      {quotes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Box sx={{ mb: 6 }}>
            <Text sx={{ fontSize: 4, fontWeight: 'bold', color: 'text', mb: 4, textAlign: 'center' }}>
              Inspirational Quotes
            </Text>
            <Grid columns={[1, 1, 2]} gap={4}>
              {quotes.map((quote, index) => (
                <Card
                  key={index}
                  sx={{
                    p: 4,
                    borderRadius: '12px',
                    position: 'relative',
                    '&::before': {
                      content: '"""',
                      position: 'absolute',
                      top: 2,
                      left: 3,
                      fontSize: 6,
                      color: 'primary',
                      opacity: 0.3,
                      lineHeight: 1,
                    },
                  }}
                >
                  <Text sx={{ fontSize: 2, fontStyle: 'italic', color: 'text', mb: 3, pl: 3 }}>
                    {quote.text}
                  </Text>
                  {(quote.author || quote.context) && (
                    <Text sx={{ fontSize: 1, color: 'muted', textAlign: 'right' }}>
                      {quote.author && <strong>— {quote.author}</strong>}
                      {quote.context && <span>, {quote.context}</span>}
                    </Text>
                  )}
                </Card>
              ))}
            </Grid>
          </Box>
        </motion.div>
      )}

      {/* Philosophy Section */}
      {philosophy && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card sx={{ p: 5, borderRadius: '12px', bg: 'secondary', color: 'white' }}>
            <Text sx={{ fontSize: 4, fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
              Personal Philosophy
            </Text>
            <Text sx={{ fontSize: [2, 3], lineHeight: 1.7, textAlign: 'center', fontStyle: 'italic' }}>
              {philosophy}
            </Text>
          </Card>
        </motion.div>
      )}
    </Box>
  );
}