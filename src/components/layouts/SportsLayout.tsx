import { Box, Text, Image, Grid, Card, Badge } from 'theme-ui';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SportsEvent {
  title: string;
  eventType: 'Competition' | 'Training' | 'Achievement';
  date?: string;
  description: string;
  location?: string;
  photos?: string[];
  results?: string;
}

interface Achievement {
  title: string;
  description: string;
  date?: string;
  category?: string;
  image?: string;
}

interface SportsData {
  title: string;
  description?: string;
  events?: SportsEvent[];
  achievements?: Achievement[];
  currentSports?: string[];
}

interface SportsLayoutProps {
  data: SportsData;
}

const eventTypeColors = {
  Competition: '#ff6b6b',
  Training: '#4ecdc4', 
  Achievement: '#45b7d1',
};

const eventTypeIcons = {
  Competition: '🏆',
  Training: '💪',
  Achievement: '🌟',
};

export default function SportsLayout({ data }: SportsLayoutProps) {
  const { title, description, events = [], achievements = [], currentSports = [] } = data;

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', p: 4 }}>
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
          {description && (
            <Text sx={{ fontSize: [2, 3], color: 'muted', maxWidth: '600px', mx: 'auto', lineHeight: 1.6 }}>
              {description}
            </Text>
          )}
        </Box>
      </motion.div>

      {/* Current Sports */}
      {currentSports.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Box sx={{ mb: 8 }}>
            <Text sx={{ fontSize: 4, fontWeight: 'bold', color: 'text', mb: 4, textAlign: 'center' }}>
              Current Sports & Activities
            </Text>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
              {currentSports.map((sport, index) => (
                <Badge
                  key={index}
                  sx={{
                    bg: 'primary',
                    color: 'white',
                    px: 4,
                    py: 2,
                    borderRadius: '25px',
                    fontSize: 2,
                    fontWeight: 'bold',
                  }}
                >
                  {sport}
                </Badge>
              ))}
            </Box>
          </Box>
        </motion.div>
      )}

      {/* Achievements Section */}
      {achievements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Box sx={{ mb: 8 }}>
            <Text sx={{ fontSize: 4, fontWeight: 'bold', color: 'text', mb: 5, textAlign: 'center' }}>
              Key Achievements
            </Text>
            <Grid columns={[1, 2, 3]} gap={4}>
              {achievements.map((achievement, index) => (
                <Card
                  key={index}
                  sx={{
                    p: 4,
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                    },
                  }}
                >
                  {achievement.image && (
                    <Box sx={{ mb: 3, borderRadius: '8px', overflow: 'hidden' }}>
                      <Image
                        src={achievement.image}
                        alt={achievement.title}
                        sx={{ width: '100%', height: '150px', objectFit: 'cover' }}
                      />
                    </Box>
                  )}
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Text sx={{ fontSize: 2 }}>🌟</Text>
                    <Text sx={{ fontSize: 2, fontWeight: 'bold', color: 'text' }}>
                      {achievement.title}
                    </Text>
                  </Box>
                  
                  <Text sx={{ fontSize: 1, color: 'muted', mb: 3, lineHeight: 1.5 }}>
                    {achievement.description}
                  </Text>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {achievement.category && (
                      <Badge sx={{ bg: 'secondary', color: 'white', fontSize: 0 }}>
                        {achievement.category}
                      </Badge>
                    )}
                    {achievement.date && (
                      <Text sx={{ fontSize: 0, color: 'muted' }}>
                        {new Date(achievement.date).toLocaleDateString()}
                      </Text>
                    )}
                  </Box>
                </Card>
              ))}
            </Grid>
          </Box>
        </motion.div>
      )}

      {/* Events Timeline */}
      {events.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Box sx={{ mb: 8 }}>
            <Text sx={{ fontSize: 4, fontWeight: 'bold', color: 'text', mb: 5, textAlign: 'center' }}>
              Events & Activities Timeline
            </Text>
            
            <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
              {events
                .sort((a, b) => new Date(b.date || '').getTime() - new Date(a.date || '').getTime())
                .map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                >
                  <Card
                    sx={{
                      p: 4,
                      mb: 4,
                      borderRadius: '12px',
                      borderLeft: '4px solid',
                      borderColor: eventTypeColors[event.eventType],
                      position: 'relative',
                    }}
                  >
                    {/* Event Type Badge */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 3,
                        right: 3,
                        bg: eventTypeColors[event.eventType],
                        color: 'white',
                        px: 2,
                        py: 1,
                        borderRadius: '6px',
                        fontSize: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <Text>{eventTypeIcons[event.eventType]}</Text>
                      <Text>{event.eventType}</Text>
                    </Box>

                    <Text sx={{ fontSize: 3, fontWeight: 'bold', color: 'text', mb: 2, pr: 5 }}>
                      {event.title}
                    </Text>

                    <Box sx={{ display: 'flex', gap: 4, mb: 3, flexWrap: 'wrap' }}>
                      {event.date && (
                        <Text sx={{ fontSize: 1, color: 'muted' }}>
                          📅 {new Date(event.date).toLocaleDateString()}
                        </Text>
                      )}
                      {event.location && (
                        <Text sx={{ fontSize: 1, color: 'muted' }}>
                          📍 {event.location}
                        </Text>
                      )}
                    </Box>

                    <Text sx={{ fontSize: 2, color: 'text', mb: 3, lineHeight: 1.6 }}>
                      {event.description}
                    </Text>

                    {event.results && (
                      <Box sx={{ bg: 'muted', p: 3, borderRadius: '8px', mb: 3 }}>
                        <Text sx={{ fontSize: 1, fontWeight: 'bold', color: 'background', mb: 1 }}>
                          Results:
                        </Text>
                        <Text sx={{ fontSize: 1, color: 'background', lineHeight: 1.5 }}>
                          {event.results}
                        </Text>
                      </Box>
                    )}

                    {/* Photos */}
                    {event.photos && event.photos.length > 0 && (
                      <Grid columns={[2, 3, 4]} gap={2}>
                        {event.photos.map((photo, photoIndex) => (
                          <Box key={photoIndex} sx={{ borderRadius: '6px', overflow: 'hidden' }}>
                            <Image
                              src={photo}
                              alt={`${event.title} photo ${photoIndex + 1}`}
                              sx={{ width: '100%', height: '80px', objectFit: 'cover' }}
                            />
                          </Box>
                        ))}
                      </Grid>
                    )}
                  </Card>
                </motion.div>
              ))}
            </Box>
          </Box>
        </motion.div>
      )}

      {/* Empty States */}
      {events.length === 0 && achievements.length === 0 && currentSports.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Text sx={{ fontSize: 5, mb: 3 }}>🏃‍♂️</Text>
          <Text sx={{ fontSize: 3, color: 'muted' }}>
            No sports activities added yet. Check back soon!
          </Text>
        </Box>
      )}
    </Box>
  );
}