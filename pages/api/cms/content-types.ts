import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { requireAdminAuth } from '../../../lib/adminAuth';

function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return getContentTypes(req, res);
  } else if (req.method === 'POST') {
    return createContentType(req, res);
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}

async function getContentTypes(req: NextApiRequest, res: NextApiResponse) {
  try {
    const contentTypes = await prisma.contentType.findMany({
      where: { isActive: true },
      include: {
        contentItems: {
          select: {
            id: true,
            title: true,
            isPublic: true,
            isPublished: true,
          },
        },
        _count: {
          select: {
            contentItems: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    res.status(200).json(contentTypes);
  } catch (error) {
    console.error('Error fetching content types:', error);
    res.status(500).json({ message: 'Failed to fetch content types' });
  }
}

async function createContentType(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { name, slug, icon, schema, layoutComponent, adminFormConfig } = req.body;

    if (!name || !slug || !schema || !layoutComponent) {
      return res.status(400).json({ 
        message: 'Name, slug, schema, and layoutComponent are required' 
      });
    }

    const contentType = await prisma.contentType.create({
      data: {
        name,
        slug,
        icon,
        schema,
        layoutComponent,
        adminFormConfig,
      },
    });

    res.status(201).json(contentType);
  } catch (error: any) {
    console.error('Error creating content type:', error);
    if (error.code === 'P2002') {
      res.status(400).json({ message: 'Content type with this slug already exists' });
    } else {
      res.status(500).json({ message: 'Failed to create content type' });
    }
  }
}

export default requireAdminAuth(handler);