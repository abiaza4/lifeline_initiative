import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authenticate, authorize, optionalAuth, AuthRequest } from '../middleware/auth';

const router = Router();

const projectSchema = z.object({
  title: z.string().min(5),
  slug: z.string().min(5),
  description: z.string().min(20),
  image: z.string().url(),
  category: z.string(),
  goalAmount: z.number().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

router.get('/', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const prisma = (req as any).prisma;
    const { active, featured } = req.query;
    
    const where: any = {};
    if (active !== undefined) where.isActive = active === 'true';
    if (featured === 'true') where.isFeatured = true;
    
    const projects = await prisma.project.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:slug', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const prisma = (req as any).prisma;
    const { slug } = req.params;
    
    const project = await prisma.project.findUnique({
      where: { slug },
    });
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', authenticate, authorize('super_admin', 'admin'), async (req: AuthRequest, res: Response) => {
  try {
    const prisma = (req as any).prisma;
    const data = projectSchema.parse(req.body);
    
    const existingProject = await prisma.project.findUnique({
      where: { slug: data.slug },
    });
    
    if (existingProject) {
      data.slug = `${data.slug}-${Date.now()}`;
    }
    
    const project = await prisma.project.create({
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
      },
    });
    
    res.status(201).json(project);
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
    const projectId = parseInt(req.params.id as string);
    const data = projectSchema.partial().parse(req.body);
    
    const updateData: any = { ...data };
    if (data.startDate) updateData.startDate = new Date(data.startDate);
    if (data.endDate) updateData.endDate = new Date(data.endDate);
    
    const project = await prisma.project.update({
      where: { id: projectId },
      data: updateData,
    });
    
    res.json(project);
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
    const projectId = parseInt(req.params.id as string);
    
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    const updated = await prisma.project.update({
      where: { id: projectId },
      data: { isActive: !project.isActive },
    });
    
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', authenticate, authorize('super_admin'), async (req: AuthRequest, res: Response) => {
  try {
    const prisma = (req as any).prisma;
    const projectId = parseInt(req.params.id as string);
    
    await prisma.project.delete({
      where: { id: projectId },
    });
    
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
