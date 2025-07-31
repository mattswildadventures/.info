import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { requireAdminAuth } from '../../../lib/adminAuth';

const CONTENT_FILE_PATH = path.join(process.cwd(), 'data', 'content.json');

function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const contentData = JSON.parse(fs.readFileSync(CONTENT_FILE_PATH, 'utf8'));

    if (req.method === 'GET') {
      // Get all social links
      return res.status(200).json(contentData.socialLinks || []);
      
    } else if (req.method === 'POST') {
      // Add new social link
      const newLink = req.body;

      if (!newLink.platform || !newLink.url) {
        return res.status(400).json({ message: 'Platform and URL are required' });
      }

      // Generate ID if not provided
      const id = newLink.id || newLink.platform.toLowerCase().replace(/\s+/g, '-');
      
      const socialLink = {
        id,
        platform: newLink.platform,
        url: newLink.url,
        icon: newLink.icon || 'SiGlobe',
        label: newLink.label || newLink.platform,
        order: newLink.order || (contentData.socialLinks?.length || 0) + 1,
      };

      if (!contentData.socialLinks) {
        contentData.socialLinks = [];
      }

      contentData.socialLinks.push(socialLink);
      contentData.settings.lastUpdated = new Date().toISOString();

      fs.writeFileSync(CONTENT_FILE_PATH, JSON.stringify(contentData, null, 2));

      return res.status(201).json(socialLink);
      
    } else if (req.method === 'PUT') {
      // Update existing social link
      const { id } = req.query;
      const updateData = req.body;

      if (!id) {
        return res.status(400).json({ message: 'Link ID is required' });
      }

      const linkIndex = contentData.socialLinks?.findIndex((link: any) => link.id === id);
      
      if (linkIndex === -1 || linkIndex === undefined) {
        return res.status(404).json({ message: 'Social link not found' });
      }

      contentData.socialLinks[linkIndex] = {
        ...contentData.socialLinks[linkIndex],
        ...updateData,
      };

      contentData.settings.lastUpdated = new Date().toISOString();
      fs.writeFileSync(CONTENT_FILE_PATH, JSON.stringify(contentData, null, 2));

      return res.status(200).json(contentData.socialLinks[linkIndex]);
      
    } else if (req.method === 'DELETE') {
      // Delete social link
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ message: 'Link ID is required' });
      }

      const linkIndex = contentData.socialLinks?.findIndex((link: any) => link.id === id);
      
      if (linkIndex === -1 || linkIndex === undefined) {
        return res.status(404).json({ message: 'Social link not found' });
      }

      const deletedLink = contentData.socialLinks.splice(linkIndex, 1)[0];
      contentData.settings.lastUpdated = new Date().toISOString();

      fs.writeFileSync(CONTENT_FILE_PATH, JSON.stringify(contentData, null, 2));

      return res.status(200).json({ message: 'Social link deleted', deletedLink });
      
    } else {
      return res.status(405).json({ message: 'Method not allowed' });
    }
    
  } catch (error) {
    console.error('Social links API error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

export default requireAdminAuth(handler);