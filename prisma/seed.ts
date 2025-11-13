import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPasswordHash = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@fliegercamp.de' },
    update: {},
    create: {
      email: 'admin@fliegercamp.de',
      emailVerified: true,
      firstName: 'Admin',
      lastName: 'User',
      passwordHash: adminPasswordHash,
      isPortalAdmin: true,
    },
  });
  console.log('✅ Created admin user:', admin.email);

  // Create demo organization
  const demoOrg = await prisma.organization.upsert({
    where: { slug: 'demo-segelfluggruppe' },
    update: {},
    create: {
      slug: 'demo-segelfluggruppe',
      name: 'Demo Segelfluggruppe',
      description: 'Eine Demo-Organisation für Testzwecke',
      email: 'info@demo-sfg.de',
      city: 'München',
      country: 'DE',
    },
  });
  console.log('✅ Created demo organization:', demoOrg.name);

  // Create demo airfield
  const demoAirfield = await prisma.airfield.upsert({
    where: { slug: 'demo-flugplatz' },
    update: {},
    create: {
      slug: 'demo-flugplatz',
      name: 'Demo Flugplatz',
      description: 'Ein Demo-Flugplatz für Testzwecke',
      icaoCode: 'DEMO',
      address: 'Flugplatzstraße 1',
      city: 'München',
      postalCode: '80331',
      country: 'DE',
      latitude: 48.1351,
      longitude: 11.582,
      isPublished: true,
    },
  });
  console.log('✅ Created demo airfield:', demoAirfield.name);

  // Link admin to organization
  await prisma.membership.upsert({
    where: {
      userId_organizationId: {
        userId: admin.id,
        organizationId: demoOrg.id,
      },
    },
    update: {},
    create: {
      userId: admin.id,
      organizationId: demoOrg.id,
      role: 'OWNER',
    },
  });
  console.log('✅ Linked admin to organization');

  // Link admin to airfield
  await prisma.airfieldBinding.upsert({
    where: {
      userId_airfieldId: {
        userId: admin.id,
        airfieldId: demoAirfield.id,
      },
    },
    update: {},
    create: {
      userId: admin.id,
      airfieldId: demoAirfield.id,
      role: 'OWNER',
    },
  });
  console.log('✅ Linked admin to airfield');

  console.log('🎉 Database seeding completed!');
  console.log('');
  console.log('📝 Demo Credentials:');
  console.log('   Email: admin@fliegercamp.de');
  console.log('   Password: admin123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
