import { Router, Request, Response } from 'express';
import { z } from 'zod';

const router = Router();

const newsletterSchema = z.object({
  email: z.string().email(),
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const prisma = (req as any).prisma;
    const subscribers = await prisma.newsletter.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(subscribers);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/subscribe', async (req: Request, res: Response) => {
  try {
    const prisma = (req as any).prisma;
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    const existing = await prisma.newsletter.findUnique({
      where: { email },
    });
    
    if (existing) {
      if (!existing.isActive) {
        await prisma.newsletter.update({
          where: { email },
          data: { isActive: true },
        });
        return res.json({ message: 'Successfully re-subscribed!' });
      }
      return res.status(400).json({ error: 'Email already subscribed' });
    }
    
    const subscriber = await prisma.newsletter.create({
      data: { email },
    });
    
    res.status(201).json(subscriber);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/unsubscribe', async (req: Request, res: Response) => {
  try {
    const prisma = (req as any).prisma;
    const { email } = req.body;
    
    await prisma.newsletter.update({
      where: { email },
      data: { isActive: false },
    });
    
    res.json({ message: 'Successfully unsubscribed' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
