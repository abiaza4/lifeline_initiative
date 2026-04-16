import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = Router();

const settingSchema = z.object({
  key: z.string(),
  value: z.string(),
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const prisma = (req as any).prisma;
    const settings = await prisma.siteSettings.findMany();
    
    const settingsObj: Record<string, string> = {};
    settings.forEach((s: { key: string; value: string }) => {
      settingsObj[s.key] = s.value;
    });
    
    res.json(settingsObj);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:key', async (req: Request, res: Response) => {
  try {
    const prisma = (req as any).prisma;
    const { key } = req.params;
    
    const setting = await prisma.siteSettings.findUnique({
      where: { key },
    });
    
    if (!setting) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    
    res.json({ key: setting.key, value: setting.value });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', authenticate, authorize('super_admin', 'admin'), async (req: AuthRequest, res: Response) => {
  try {
    const prisma = (req as any).prisma;
    const data = settingSchema.parse(req.body);
    
    const setting = await prisma.siteSettings.upsert({
      where: { key: data.key },
      update: { value: data.value },
      create: { key: data.key, value: data.value },
    });
    
    res.json(setting);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:key', authenticate, authorize('super_admin'), async (req: AuthRequest, res: Response) => {
  try {
    const prisma = (req as any).prisma;
    const { key } = req.params;
    
    await prisma.siteSettings.delete({
      where: { key },
    });
    
    res.json({ message: 'Setting deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
