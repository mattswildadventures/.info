import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { type, publicOnly = 'true' } = req.query;

    let whereClause: any = {
      isPublished: true,
    };

    // Add public filter if requested
    if (publicOnly === 'true') {
      whereClause.isPublic = true;
    }

    // Filter by content type if specified
    if (type && typeof type === 'string') {
      whereClause.contentType = {
        slug: type,
      };
    }

    const contentItems = await prisma.contentItem.findMany({
      where: whereClause,
      include: {
        contentType: {
          select: {
            id: true,
            name: true,
            slug: true,
            icon: true,
            layoutComponent: true,
          },
        },
      },
      orderBy: [
        { publishedAt: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    // Group content by type for easier consumption
    const contentByType: Record<string, any> = {};
    
    contentItems.forEach((item) => {
      const typeSlug = item.contentType.slug;
      if (!contentByType[typeSlug]) {
        contentByType[typeSlug] = {
          contentType: item.contentType,
          items: [],
        };
      }
      contentByType[typeSlug].items.push({
        id: item.id,
        slug: item.slug,
        title: item.title,
        data: item.data,
        isPublic: item.isPublic,
        metaTitle: item.metaTitle,
        metaDescription: item.metaDescription,
        publishedAt: item.publishedAt,
      });
    });

    // Also get social links
    const socialLinks = await prisma.socialLink.findMany({
      where: { isVisible: true },
      orderBy: { order: 'asc' },
    });

    res.status(200).json({
      content: contentByType,
      socialLinks,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching public content:', error);
    res.status(500).json({ 
      message: 'Failed to fetch content',
      content: {},
      socialLinks: [],
      timestamp: new Date().toISOString(),
    });
  }
}