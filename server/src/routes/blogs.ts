import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authenticate, authorize, optionalAuth, AuthRequest } from '../middleware/auth';

const router = Router();

const blogSchema = z.object({
  title: z.string().min(5),
  slug: z.string().min(5),
  content: z.string().min(20),
  excerpt: z.string().optional(),
  image: z.string().url(),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  publishDate: z.date().optional(),
});

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

router.get('/', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const prisma = (req as any).prisma;
    const { published, featured } = req.query;
    
    const where: any = {};
    if (published === 'true') where.isPublished = true;
    if (featured === 'true') where.isFeatured = true;
    
    const blogs = await prisma.blog.findMany({
      where,
      include: {
        author: { select: { id: true, name: true } },
      },
      orderBy: { publishDate: 'desc' },
    });
    
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:slug', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const prisma = (req as any).prisma;
    const { slug } = req.params;
    
    const blog = await prisma.blog.findUnique({
      where: { slug },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
      },
    });
    
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', authenticate, authorize('super_admin', 'admin'), async (req: AuthRequest, res: Response) => {
  try {
    const prisma = (req as any).prisma;
    const data = blogSchema.parse(req.body);
    
    const existingBlog = await prisma.blog.findUnique({
      where: { slug: data.slug },
    });
    
    if (existingBlog) {
      data.slug = `${data.slug}-${Date.now()}`;
    }
    
    const blog = await prisma.blog.create({
      data: {
        ...data,
        authorId: req.user!.id,
        publishDate: data.isPublished ? new Date() : null,
      },
    });
    
    res.status(201).json(blog);
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
    const blogId = parseInt(req.params.id as string);
    const data = blogSchema.partial().parse(req.body);
    const updateData: any = { ...data };
    
    if (data.isPublished) {
      const existing = await prisma.blog.findUnique({ where: { id: blogId } });
      if (existing && !existing.publishDate) {
        updateData.publishDate = new Date();
      }
    }
    
    const blog = await prisma.blog.update({
      where: { id: blogId },
      data: updateData,
    });
    
    res.json(blog);
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
    const blogId = parseInt(req.params.id as string);
    
    await prisma.blog.delete({
      where: { id: blogId },
    });
    
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
