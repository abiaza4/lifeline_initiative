import { Router, Response } from 'express';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, authorize('super_admin', 'admin'), async (req: AuthRequest, res: Response) => {
  try {
    const prisma = (req as any).prisma;
    
    const [
      totalDonations,
      donationCount,
      activeCampaigns,
      totalVolunteers,
      totalUsers,
      totalBlogs,
      teamMembers,
      recentDonations,
      recentVolunteers,
    ] = await Promise.all([
      prisma.donation.aggregate({
        _sum: { amount: true },
        where: { paymentStatus: 'completed' },
      }),
      prisma.donation.count({
        where: { paymentStatus: 'completed' },
      }),
      prisma.campaign.count({
        where: { isActive: true },
      }),
      prisma.volunteer.count(),
      prisma.user.count(),
      prisma.blog.count({
        where: { isPublished: true },
      }),
      prisma.teamMember.count({
        where: { isActive: true },
      }),
      prisma.donation.findMany({
        take: 5,
        orderBy: { donationDate: 'desc' },
        include: {
          campaign: { select: { title: true } },
          user: { select: { name: true } },
        },
      }),
      prisma.volunteer.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
    ]);
    
    const monthlyDonations = await prisma.donation.groupBy({
      by: ['donationDate'],
      where: { paymentStatus: 'completed' },
      _sum: { amount: true },
    });
    
    res.json({
      stats: {
        totalDonations: totalDonations._sum.amount || 0,
        donationCount,
        activeCampaigns,
        totalVolunteers,
        totalUsers,
        totalBlogs,
        teamMembers,
      },
      recentDonations,
      recentVolunteers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
