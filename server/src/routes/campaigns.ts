import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authenticate, authorize, optionalAuth, AuthRequest } from '../middleware/auth';

const router = Router();

const campaignSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(20),
  shortDescription: z.string().optional(),
  goalAmount: z.number().positive(),
  image: z.string().url(),
  category: z.string(),
  startDate: z.string().transform(s => new Date(s)),
  endDate: z.string().optional().transform(s => s ? new Date(s) : null),
});

router.get('/', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const prisma = (req as any).prisma;
    const { featured, category, active } = req.query;
    
    const where: any = {};
    
    if (featured === 'true') where.isFeatured = true;
    if (category) where.category = category;
    if (active !== undefined) where.isActive = active === 'true';
    
    const campaigns = await prisma.campaign.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const prisma = (req as any).prisma;
    const campaignId = parseInt(req.params.id as string);
    
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: {
        donations: {
          orderBy: { donationDate: 'desc' },
          take: 10,
        },
      },
    });
    
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', authenticate, authorize('super_admin', 'admin'), async (req: AuthRequest, res: Response) => {
  try {
    const prisma = (req as any).prisma;
    const data = campaignSchema.parse(req.body);
    
    const campaign = await prisma.campaign.create({
      data,
    });
    
    res.status(201).json(campaign);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', authenticate, authorize('super_admin', 'admin'), async (req: AuthRequest, res: Response) => {
  try {
    const prisma = (req as any).prisma;
    const campaignId = parseInt(req.params.id as string);
    const data = campaignSchema.partial().parse(req.body);
    
    const updateData: any = { ...data };
    if (data.startDate) {
      updateData.startDate = new Date(data.startDate);
    }
    if (data.endDate) {
      updateData.endDate = new Date(data.endDate);
    }
    
    const campaign = await prisma.campaign.update({
      where: { id: campaignId },
      data: updateData,
    });
    
    res.json(campaign);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/:id/toggle', authenticate, authorize('super_admin', 'admin'), async (req: AuthRequest, res: Response) => {
  try {
    const prisma = (req as any).prisma;
    const campaignId = parseInt(req.params.id as string);
    
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
    });
    
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    
    const updated = await prisma.campaign.update({
      where: { id: campaignId },
      data: { isActive: !campaign.isActive },
    });
    
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/:id/feature', authenticate, authorize('super_admin', 'admin'), async (req: AuthRequest, res: Response) => {
  try {
    const prisma = (req as any).prisma;
    const campaignId = parseInt(req.params.id as string);
    
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
    });
    
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    
    const updated = await prisma.campaign.update({
      where: { id: campaignId },
      data: { isFeatured: !campaign.isFeatured },
    });
    
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', authenticate, authorize('super_admin'), async (req: AuthRequest, res: Response) => {
  try {
    const prisma = (req as any).prisma;
    const campaignId = parseInt(req.params.id as string);
    
    await prisma.campaign.delete({
      where: { id: campaignId },
    });
    
    res.json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
