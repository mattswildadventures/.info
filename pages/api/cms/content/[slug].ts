import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';
import { requireAdminAuth } from '../../../../lib/adminAuth';

function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query;

  if (typeof slug !== 'string') {
    return res.status(400).json({ message: 'Invalid slug parameter' });
  }

  if (req.method === 'GET') {
    return getContentItem(req, res, slug);
  } else if (req.method === 'PUT') {
    return updateContentItem(req, res, slug);
  } else if (req.method === 'POST') {
    return createContentItem(req, res, slug);
  } else if (req.method === 'DELETE') {
    return deleteContentItem(req, res, slug);
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}

// Get content item by slug
async function getContentItem(req: NextApiRequest, res: NextApiResponse, slug: string) {
  try {
    const contentItem = await prisma.contentItem.findUnique({
      where: { slug },
      include: {
        contentType: true,
      },
    });

    if (!contentItem) {
      return res.status(404).json({ message: 'Content item not found' });
    }

    res.status(200).json(contentItem);
  } catch (error) {
    console.error('Error fetching content item:', error);
    res.status(500).json({ message: 'Failed to fetch content item' });
  }
}

// Create new content item
async function createContentItem(req: NextApiRequest, res: NextApiResponse, contentTypeSlug: string) {
  try {
    const { title, data, isPublic = false, isPublished = false, metaTitle, metaDescription } = req.body;

    if (!title || !data) {
      return res.status(400).json({ message: 'Title and data are required' });
    }

    // Find content type
    const contentType = await prisma.contentType.findUnique({
      where: { slug: contentTypeSlug },
    });

    if (!contentType) {
      return res.status(404).json({ message: 'Content type not found' });
    }

    // Generate slug from title
    const itemSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const contentItem = await prisma.contentItem.create({
      data: {
        contentTypeId: contentType.id,
        slug: itemSlug,
        title,
        data,
        isPublic,
        isPublished,
        metaTitle,
        metaDescription,
        publishedAt: isPublished ? new Date() : null,
      },
      include: {
        contentType: true,
      },
    });

    res.status(201).json(contentItem);
  } catch (error: any) {
    console.error('Error creating content item:', error);
    if (error.code === 'P2002') {
      res.status(400).json({ message: 'Content item with this slug already exists' });
    } else {
      res.status(500).json({ message: 'Failed to create content item' });
    }
  }
}

// Update content item
async function updateContentItem(req: NextApiRequest, res: NextApiResponse, slug: string) {
  try {
    const { title, data, isPublic, isPublished, metaTitle, metaDescription } = req.body;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (data !== undefined) updateData.data = data;
    if (isPublic !== undefined) updateData.isPublic = isPublic;
    if (isPublished !== undefined) {
      updateData.isPublished = isPublished;
      updateData.publishedAt = isPublished ? new Date() : null;
    }
    if (metaTitle !== undefined) updateData.metaTitle = metaTitle;
    if (metaDescription !== undefined) updateData.metaDescription = metaDescription;

    const contentItem = await prisma.contentItem.update({
      where: { slug },
      data: updateData,
      include: {
        contentType: true,
      },
    });

    res.status(200).json(contentItem);
  } catch (error: any) {
    console.error('Error updating content item:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ message: 'Content item not found' });
    } else {
      res.status(500).json({ message: 'Failed to update content item' });
    }
  }
}

// Delete content item
async function deleteContentItem(req: NextApiRequest, res: NextApiResponse, slug: string) {
  try {
    await prisma.contentItem.delete({
      where: { slug },
    });

    res.status(200).json({ message: 'Content item deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting content item:', error);
    if (error.code === 'P2025') {
      res.status(404).json({ message: 'Content item not found' });
    } else {
      res.status(500).json({ message: 'Failed to delete content item' });
    }
  }
}

export default requireAdminAuth(handler);