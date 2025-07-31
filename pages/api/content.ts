import { NextApiRequest, NextApiResponse } from 'next';
import { getContentData } from '../../lib/contentData';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const contentData = getContentData();
    
    // Remove sensitive data before sending to client
    const publicData = {
      ...contentData,
      settings: {
        lastUpdated: contentData.settings.lastUpdated,
      },
    };

    res.status(200).json(publicData);
  } catch (error) {
    console.error('Content API error:', error);
    res.status(500).json({ message: 'Failed to load content data' });
  }
}