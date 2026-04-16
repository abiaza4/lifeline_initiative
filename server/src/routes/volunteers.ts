import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = Router();

const volunteerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5),
  skills: z.string().optional(),
  availability: z.string().optional(),
  message: z.string().min(10),
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const prisma = (req as any).prisma;
    const { status } = req.query;
    
    const where: any = {};
    if (status) where.status = status;
    
    const volunteers = await prisma.volunteer.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    
    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const prisma = (req as any).prisma;
    const data = volunteerSchema.parse(req.body);
    
    const volunteer = await prisma.volunteer.create({
      data,
    });
    
    res.status(201).json(volunteer);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/:id/status', authenticate, authorize('super_admin', 'admin'), async (req: AuthRequest, res: Response) => {
  try {
    const prisma = (req as any).prisma;
    const volunteerId = parseInt(req.params.id as string);
    const { status } = req.body;
    
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const volunteer = await prisma.volunteer.update({
      where: { id: volunteerId },
      data: { status },
    });
    
    res.json(volunteer);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', authenticate, authorize('super_admin'), async (req: AuthRequest, res: Response) => {
  try {
    const prisma = (req as any).prisma;
    const volunteerId = parseInt(req.params.id as string);
    
    await prisma.volunteer.delete({
      where: { id: volunteerId },
    });
    
    res.json({ message: 'Volunteer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
