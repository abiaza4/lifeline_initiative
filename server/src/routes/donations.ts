import { Router, Request, Response } from 'express';
import { z } from 'zod';
import Stripe from 'stripe';
import { authenticate, optionalAuth, AuthRequest } from '../middleware/auth';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia',
});

const donationSchema = z.object({
  campaignId: z.number().int().positive(),
  amount: z.number().positive(),
  paymentMethod: z.enum(['card', 'bank_transfer', 'paypal']),
  donorName: z.string().optional(),
  donorEmail: z.string().email().optional(),
  message: z.string().optional(),
  isAnonymous: z.boolean().optional(),
});

router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const prisma = (req as any).prisma;
    const { campaignId, userId, status } = req.query;
    
    const where: any = {};
    if (campaignId) where.campaignId = parseInt(campaignId as string);
    if (userId) where.userId = parseInt(userId as string);
    if (status) where.paymentStatus = status;
    
    const donations = await prisma.donation.findMany({
      where,
      include: {
        campaign: { select: { id: true, title: true } },
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { donationDate: 'desc' },
    });
    
    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/my-donations', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const prisma = (req as any).prisma;
    const userId = req.user!.id;
    
    const donations = await prisma.donation.findMany({
      where: { userId },
      include: {
        campaign: { select: { id: true, title: true, image: true } },
      },
      orderBy: { donationDate: 'desc' },
    });
    
    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const prisma = (req as any).prisma;
    const data = donationSchema.parse(req.body);
    
    const campaign = await prisma.campaign.findUnique({
      where: { id: data.campaignId },
    });
    
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    
    let paymentIntent;
    let transactionId;
    
    if (data.paymentMethod === 'card') {
      paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(data.amount * 100),
        currency: 'usd',
        metadata: {
          campaignId: data.campaignId.toString(),
        },
      });
      transactionId = paymentIntent.id;
    } else if (data.paymentMethod === 'bank_transfer') {
      transactionId = `BT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    } else {
      transactionId = `PP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    const donation = await prisma.donation.create({
      data: {
        userId: req.user?.id,
        campaignId: data.campaignId,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        transactionId,
        donorName: data.donorName || req.user?.id ? undefined : 'Anonymous',
        donorEmail: data.donorEmail || req.user?.id ? undefined : undefined,
        message: data.message,
        isAnonymous: data.isAnonymous || false,
        paymentStatus: data.paymentMethod === 'card' ? 'pending' : 'completed',
      },
    });
    
    await prisma.campaign.update({
      where: { id: data.campaignId },
      data: {
        raisedAmount: {
          increment: data.amount,
        },
      },
    });
    
    res.status(201).json({
      donation,
      clientSecret: paymentIntent?.client_secret,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/confirm/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const prisma = (req as any).prisma;
    const donationId = parseInt(req.params.id as string);
    
    const donation = await prisma.donation.update({
      where: { id: donationId },
      data: { paymentStatus: 'completed' },
    });
    
    res.json(donation);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/stats', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const prisma = (req as any).prisma;
    
    const totalDonations = await prisma.donation.aggregate({
      _sum: { amount: true },
      where: { paymentStatus: 'completed' },
    });
    
    const donationCount = await prisma.donation.count({
      where: { paymentStatus: 'completed' },
    });
    
    res.json({
      totalAmount: totalDonations._sum.amount || 0,
      donationCount,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
