const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const updates = [
    { email: 'vicky.achayo@liss-southsudan.org', image: '/team/Achayo Vicky Lagu Okumu.jpeg' },
    { email: 'bosco.otim@liss-southsudan.org', image: '/team/Okot Bosco Otim.jpeg' },
    { email: 'petra.achiro@liss-southsudan.org', image: '/team/Achiro Petra Moses.jpeg' },
    { email: 'ogenodickson8421@gmail.com', image: '/team/Ogeno Dickson Atiman Okot.jpeg' },
    { email: 'ayenyogladys@gmail.com', image: '/team/Ayenyo Gladys.jpeg' },
    { email: 'achiroketty35@gmail.com', image: '/team/Achiro Ketty.jpeg' },
    { email: 'john.obale@liss-southsudan.org', image: '/team/John Obale Oloya.jpeg' },
  ];

  for (const update of updates) {
    await prisma.teamMember.updateMany({
      where: { email: update.email },
      data: { image: update.image }
    });
    console.log(`Updated: ${update.email} -> ${update.image}`);
  }

  console.log('All done!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
