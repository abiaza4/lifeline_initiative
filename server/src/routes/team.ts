import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = Router();

const teamMemberSchema = z.object({
  name: z.string().min(2),
  position: z.string().min(2),
  bio: z.string().optional(),
  email: z.string(),
  phone: z.string(),
  image: z.string(),
  skills: z.string().optional(),
  isActive: z.boolean().optional(),
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const prisma = (req as any).prisma;
    const { active } = req.query;
    
    const where: any = {};
    if (active !== undefined) where.isActive = active === 'true';
    
    const teamMembers = await prisma.teamMember.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    
    res.json(teamMembers);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const prisma = (req as any).prisma;
    const memberId = parseInt(req.params.id as string);
    
    const member = await prisma.teamMember.findUnique({
      where: { id: memberId },
    });
    
    if (!member) {
      return res.status(404).json({ error: 'Team member not found' });
    }
    
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', authenticate, authorize('super_admin', 'admin'), async (req: AuthRequest, res: Response) => {
  try {
    const prisma = (req as any).prisma;
    const data = teamMemberSchema.parse(req.body);
    
    const member = await prisma.teamMember.create({
      data,
    });
    
    res.status(201).json(member);
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
    const memberId = parseInt(req.params.id as string);
    const data = teamMemberSchema.partial().parse(req.body);
    
    const member = await prisma.teamMember.update({
      where: { id: memberId },
      data,
    });
    
    res.json(member);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', authenticate, authorize('super_admin'), async (req: AuthRequest, res: Response) => {
  try {
    const prisma = (req as any).prisma;
    const memberId = parseInt(req.params.id as string);
    
    await prisma.teamMember.delete({
      where: { id: memberId },
    });
    
    res.json({ message: 'Team member deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
