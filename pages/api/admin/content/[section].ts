import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { requireAdminAuth } from '../../../../lib/adminAuth';

const CONTENT_FILE_PATH = path.join(process.cwd(), 'data', 'content.json');

function handler(req: NextApiRequest, res: NextApiResponse) {
  const { section } = req.query;

  if (!section || typeof section !== 'string') {
    return res.status(400).json({ message: 'Section parameter is required' });
  }

  try {
    const contentData = JSON.parse(fs.readFileSync(CONTENT_FILE_PATH, 'utf8'));

    if (req.method === 'GET') {
      // Get content for specific section
      const sectionData = contentData[section];
      
      if (!sectionData) {
        return res.status(404).json({ message: 'Section not found' });
      }

      return res.status(200).json(sectionData);
      
    } else if (req.method === 'PUT') {
      // Update content for specific section
      const updateData = req.body;

      if (!updateData) {
        return res.status(400).json({ message: 'Update data is required' });
      }

      // Update the specific section
      contentData[section] = {
        ...contentData[section],
        ...updateData,
      };

      // Update lastUpdated timestamp
      contentData.settings.lastUpdated = new Date().toISOString();

      // Write back to file
      fs.writeFileSync(CONTENT_FILE_PATH, JSON.stringify(contentData, null, 2));

      return res.status(200).json({ 
        message: 'Content updated successfully',
        data: contentData[section]
      });
      
    } else {
      return res.status(405).json({ message: 'Method not allowed' });
    }
    
  } catch (error) {
    console.error('Content API error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

export default requireAdminAuth(handler);