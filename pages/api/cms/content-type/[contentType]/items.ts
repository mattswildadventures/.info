import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../../lib/prisma';
import { checkAdminAuth } from '../../../../../lib/adminAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check admin authentication
  if (!checkAdminAuth(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { contentType } = req.query;

  if (req.method === 'GET') {
    try {
      // First, find the content type
      const contentTypeRecord = await prisma.contentType.findUnique({
        where: { slug: contentType as string },
      });

      if (!contentTypeRecord) {
        return res.status(404).json({ error: 'Content type not found' });
      }

      // Get all content items for this content type
      const contentItems = await prisma.contentItem.findMany({
        where: {
          contentTypeId: contentTypeRecord.id,
        },
        orderBy: [
          { updatedAt: 'desc' },
          { createdAt: 'desc' },
        ],
      });

      // Format the response
      const formattedItems = contentItems.map(item => ({
        id: item.id,
        slug: item.slug,
        title: item.title,
        data: item.data,
        isPublic: item.isPublic,
        isPublished: item.isPublished,
        metaTitle: item.metaTitle,
        metaDescription: item.metaDescription,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
        publishedAt: item.publishedAt?.toISOString() || null,
      }));

      res.status(200).json(formattedItems);
    } catch (error: any) {
      console.error('Error fetching content items:', error);
      res.status(500).json({ error: 'Failed to fetch content items' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}