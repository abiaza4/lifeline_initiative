import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = Router();

const photoSchema = z.object({
  albumId: z.number(),
  image: z.string(),
  caption: z.string().optional(),
  order: z.number().optional(),
});

router.get('/album/:albumId', async (req: Request, res: Response) => {
  try {
    const prisma = (req as any).prisma;
    const albumId = parseInt(req.params.albumId as string);
    
    const photos = await prisma.galleryPhoto.findMany({
      where: { albumId },
      orderBy: { order: 'asc' },
    });
    
    res.json(photos);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const prisma = (req as any).prisma;
    const photoId = parseInt(req.params.id as string);
    
    const photo = await prisma.galleryPhoto.findUnique({
      where: { id: photoId },
    });
    
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    
    res.json(photo);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', authenticate, authorize('super_admin', 'admin'), async (req: AuthRequest, res: Response) => {
  try {
    const prisma = (req as any).prisma;
    const data = photoSchema.parse(req.body);
    
    const photo = await prisma.galleryPhoto.create({
      data,
    });
    
    res.status(201).json(photo);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error creating photo:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/bulk', authenticate, authorize('super_admin', 'admin'), async (req: AuthRequest, res: Response) => {
  try {
    const prisma = (req as any).prisma;
    const { photos } = req.body;
    
    if (!Array.isArray(photos)) {
      return res.status(400).json({ error: 'Photos must be an array' });
    }
    
    const created = await prisma.galleryPhoto.createMany({
      data: photos.map((p: any, index: number) => ({
        albumId: p.albumId,
        image: p.image,
        caption: p.caption || null,
        order: p.order ?? index,
      })),
    });
    
    res.status(201).json({ count: created.count });
  } catch (error) {
    console.error('Error creating photos:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', authenticate, authorize('super_admin', 'admin'), async (req: AuthRequest, res: Response) => {
  try {
    const prisma = (req as any).prisma;
    const photoId = parseInt(req.params.id as string);
    const data = photoSchema.partial().parse(req.body);
    
    const photo = await prisma.galleryPhoto.update({
      where: { id: photoId },
      data,
    });
    
    res.json(photo);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error updating photo:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', authenticate, authorize('super_admin', 'admin'), async (req: AuthRequest, res: Response) => {
  try {
    const prisma = (req as any).prisma;
    const photoId = parseInt(req.params.id as string);
    
    await prisma.galleryPhoto.delete({
      where: { id: photoId },
    });
    
    res.json({ message: 'Photo deleted successfully' });
  } catch (error) {
    console.error('Error deleting photo:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
