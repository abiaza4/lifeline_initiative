import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = Router();

const albumSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  coverImage: z.string().optional(),
  category: z.string().default('Projects'),
  date: z.string().optional(),
  location: z.string().optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const prisma = (req as any).prisma;
    const { category, featured, active } = req.query;
    
    const where: any = {};
    if (category) where.category = category as string;
    if (featured !== undefined) where.isFeatured = featured === 'true';
    if (active !== undefined) where.isActive = active === 'true';
    
    const albums = await prisma.album.findMany({
      where,
      include: {
        photos: {
          orderBy: { order: 'asc' },
          take: 1,
        },
        _count: {
          select: { photos: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    
    res.json(albums);
  } catch (error) {
    console.error('Error fetching albums:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const prisma = (req as any).prisma;
    const albumId = parseInt(req.params.id as string);
    
    const album = await prisma.album.findUnique({
      where: { id: albumId },
      include: {
        photos: {
          orderBy: { order: 'asc' },
        },
      },
    });
    
    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }
    
    res.json(album);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', authenticate, authorize('super_admin', 'admin'), async (req: AuthRequest, res: Response) => {
  try {
    const prisma = (req as any).prisma;
    const data = albumSchema.parse(req.body);
    
    const album = await prisma.album.create({
      data: {
        ...data,
        date: data.date ? new Date(data.date) : null,
      },
    });
    
    res.status(201).json(album);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error creating album:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', authenticate, authorize('super_admin', 'admin'), async (req: AuthRequest, res: Response) => {
  try {
    const prisma = (req as any).prisma;
    const albumId = parseInt(req.params.id as string);
    const data = albumSchema.partial().parse(req.body);
    
    const album = await prisma.album.update({
      where: { id: albumId },
      data: {
        ...data,
        date: data.date ? new Date(data.date) : undefined,
      },
    });
    
    res.json(album);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error updating album:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', authenticate, authorize('super_admin', 'admin'), async (req: AuthRequest, res: Response) => {
  try {
    const prisma = (req as any).prisma;
    const albumId = parseInt(req.params.id as string);
    
    await prisma.album.delete({
      where: { id: albumId },
    });
    
    res.json({ message: 'Album deleted successfully' });
  } catch (error) {
    console.error('Error deleting album:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/:id/feature', authenticate, authorize('super_admin', 'admin'), async (req: AuthRequest, res: Response) => {
  try {
    const prisma = (req as any).prisma;
    const albumId = parseInt(req.params.id as string);
    
    const album = await prisma.album.findUnique({ where: { id: albumId } });
    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }
    
    const updated = await prisma.album.update({
      where: { id: albumId },
      data: { isFeatured: !album.isFeatured },
    });
    
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
