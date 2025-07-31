import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { checkAdminAuth } from '../../../lib/adminAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check admin authentication
  if (!checkAdminAuth(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    try {
      const {
        contentTypeId,
        slug,
        title,
        data,
        isPublic = false,
        isPublished = false,
        metaTitle,
        metaDescription,
      } = req.body;

      // Validate required fields
      if (!contentTypeId || !slug || !title) {
        return res.status(400).json({ 
          error: 'Missing required fields: contentTypeId, slug, title' 
        });
      }

      // Check if slug already exists
      const existingItem = await prisma.contentItem.findUnique({
        where: { slug },
      });

      if (existingItem) {
        return res.status(400).json({ 
          error: 'Slug already exists. Please choose a different slug.' 
        });
      }

      // Create the content item
      const contentItem = await prisma.contentItem.create({
        data: {
          contentTypeId,
          slug,
          title,
          data: data || {},
          isPublic,
          isPublished,
          publishedAt: isPublished ? new Date() : null,
          metaTitle,
          metaDescription,
        },
        include: {
          contentType: true,
        },
      });

      // Format the response
      const formattedItem = {
        id: contentItem.id,
        slug: contentItem.slug,
        title: contentItem.title,
        data: contentItem.data,
        isPublic: contentItem.isPublic,
        isPublished: contentItem.isPublished,
        metaTitle: contentItem.metaTitle,
        metaDescription: contentItem.metaDescription,
        createdAt: contentItem.createdAt.toISOString(),
        updatedAt: contentItem.updatedAt.toISOString(),
        publishedAt: contentItem.publishedAt?.toISOString() || null,
        contentType: contentItem.contentType,
      };

      res.status(201).json(formattedItem);
    } catch (error: any) {
      console.error('Error creating content item:', error);
      
      if (error.code === 'P2002') {
        return res.status(400).json({ error: 'Slug already exists' });
      }
      
      res.status(500).json({ error: 'Failed to create content item' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}