import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@liss-southsudan.org' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@liss-southsudan.org',
      password: hashedPassword,
      role: 'super_admin',
      phone: '+211 929 000 000',
    },
  });

  const defaultAdminPassword = await bcrypt.hash('Atiman@Okot44', 10);
  
  const defaultAdmin = await prisma.user.upsert({
    where: { email: 'ogenodickson8421@gmail.com' },
    update: {},
    create: {
      name: 'Ogeno Dickson',
      email: 'ogenodickson8421@gmail.com',
      password: defaultAdminPassword,
      role: 'super_admin',
      phone: '+211 929 328 421',
    },
  });

  const teamMembers = [
    {
      name: 'Achayo Vicky Lagu Okumu',
      position: 'Founder & Program Coordinator',
      email: 'vicky.achayo@liss-southsudan.org',
      phone: '+211 929 328 421',
      bio: 'Leading the organization with vision and dedication to community development',
      image: '/team/Achayo Vicky Lagu Okumu.jpeg',
      skills: 'Program Coordination, Community Development',
      isActive: true,
    },
    {
      name: 'Okot Bosco Otim',
      position: 'Communications & Partnerships Lead',
      email: 'bosco.otim@liss-southsudan.org',
      phone: '+211 929 328 421',
      bio: 'Building partnerships and communicating our mission to the world',
      image: '/team/Okot Bosco Otim.jpeg',
      skills: 'Communications, Partnership Building',
      isActive: true,
    },
    {
      name: 'Achiro Petra Moses',
      position: 'Programs and Field Implementation Officer',
      email: 'petra.achiro@liss-southsudan.org',
      phone: '+211 929 328 421',
      bio: 'Ensuring effective implementation of programs in the field',
      image: '/team/Achiro Petra Moses.jpeg',
      skills: 'Field Operations, Program Implementation',
      isActive: true,
    },
    {
      name: 'Ogeno Dickson Atiman Okot',
      position: 'Operations & Administration Lead',
      email: 'ogenodickson8421@gmail.com',
      phone: '+211 929 328 421',
      bio: 'Managing operations and administration for organizational effectiveness',
      image: '/team/Ogeno Dickson Atiman Okot.jpeg',
      skills: 'Operations Management, Administration',
      isActive: true,
    },
    {
      name: 'Ayenyo Gladys',
      position: 'Volunteer and Capacity Building Coordinator',
      email: 'ayenyogladys@gmail.com',
      phone: '+211 924 382 956',
      bio: 'Coordinating volunteers and building community capacity',
      image: '/team/Ayenyo Gladys.jpeg',
      skills: 'Volunteer Management, Capacity Building',
      isActive: true,
    },
    {
      name: 'Achiro Ketty',
      position: 'Finance and Resource Mobilization Lead',
      email: 'achiroketty35@gmail.com',
      phone: '+211 927 290 123',
      bio: 'Managing finances and mobilizing resources for our programs',
      image: '/team/Achiro Ketty.jpeg',
      skills: 'Finance, Resource Mobilization',
      isActive: true,
    },
    {
      name: 'John Obale Oloya',
      position: 'Monitoring, Evaluation, Accountability & Learning Officer',
      email: 'john.obale@liss-southsudan.org',
      phone: '+211 929 328 421',
      bio: 'Ensuring accountability and learning through systematic monitoring and evaluation',
      image: '/team/John Obale Oloya.jpeg',
      skills: 'M&E, Accountability, Learning',
      isActive: true,
    },
  ];

  for (const member of teamMembers) {
    const existing = await prisma.teamMember.findFirst({
      where: { email: member.email }
    });
    
    if (!existing) {
      await prisma.teamMember.create({
        data: member,
      });
    }
  }

  const campaigns = [
    {
      title: 'Support Orphan Education',
      description: 'Help provide quality education to orphaned children in South Sudan. Your donation will cover school fees, uniforms, books, and transportation for children who have lost their parents.',
      shortDescription: 'Providing education for orphaned children',
      goalAmount: 50000,
      image: '/placeholder.jpg',
      category: 'Education',
      isFeatured: true,
    },
    {
      title: 'Clean Water for Rural Communities',
      description: 'Build wells and water systems in rural communities lacking access to clean drinking water. This campaign aims to provide safe water to 10,000 people.',
      shortDescription: 'Bringing clean water to rural areas',
      goalAmount: 75000,
      image: '/placeholder.jpg',
      category: 'Health',
      isFeatured: true,
    },
    {
      title: 'Emergency Medical Support',
      description: 'Provide emergency medical supplies and healthcare services to those in critical need. Your contribution can save lives in medical emergencies.',
      shortDescription: 'Emergency medical care for those in need',
      goalAmount: 100000,
      image: '/placeholder.jpg',
      category: 'Health',
      isFeatured: true,
    },
  ];

  for (const campaign of campaigns) {
    await prisma.campaign.create({
      data: {
        ...campaign,
        raisedAmount: 0,
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
    });
  }

  const projects = [
    {
      title: 'Clean Water Initiative',
      slug: 'clean-water-initiative',
      description: 'Providing clean and safe drinking water to rural communities through boreholes and water systems.',
      image: '/placeholder.jpg',
      category: 'Water & Sanitation',
      goalAmount: 75000,
      isFeatured: true,
    },
    {
      title: 'Emergency Food Relief',
      slug: 'emergency-food-relief',
      description: 'Distributing food packages to families affected by conflict and flooding in Eastern Equatoria.',
      image: '/placeholder.jpg',
      category: 'Food Security',
      goalAmount: 50000,
      isFeatured: true,
    },
    {
      title: 'Mobile Health Clinics',
      slug: 'mobile-health-clinics',
      description: 'Bringing healthcare services to remote villages through mobile clinic units.',
      image: '/placeholder.jpg',
      category: 'Health',
      goalAmount: 100000,
      isFeatured: false,
    },
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: {},
      create: {
        ...project,
        raisedAmount: 0,
        startDate: new Date(),
        isActive: true,
      },
    });
  }

  console.log('Seed completed successfully');
  console.log('Default admin created: ogenodickson8421@gmail.com / Atiman@Okot44');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
