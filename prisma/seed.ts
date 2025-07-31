import { PrismaClient } from '@prisma/client';
import { contentTypeDefinitions } from '../lib/contentTypes';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create content types
  for (const contentType of contentTypeDefinitions) {
    const existingType = await prisma.contentType.findUnique({
      where: { slug: contentType.slug },
    });

    if (!existingType) {
      console.log(`Creating content type: ${contentType.name}`);
      await prisma.contentType.create({
        data: {
          name: contentType.name,
          slug: contentType.slug,
          icon: contentType.icon,
          schema: contentType.schema as any,
          layoutComponent: contentType.layoutComponent,
          adminFormConfig: contentType.adminFormConfig as any,
        },
      });
    } else {
      console.log(`Content type already exists: ${contentType.name}`);
    }
  }

  // Create initial navigation items
  const navigationItems = [
    {
      label: 'Home',
      slug: 'home',
      icon: 'home',
      order: 1,
      isVisible: true,
    },
    {
      label: 'About Me',
      slug: 'about',
      icon: 'FlatAbout',
      order: 2,
      isVisible: true,
    },
    {
      label: 'My Work',
      slug: 'work',
      icon: 'FlatWork',
      order: 3,
      isVisible: true,
    },
    {
      label: 'Skills',
      slug: 'skills',
      icon: 'FlatSkills',
      order: 4,
      isVisible: true,
    },
    {
      label: 'Mindset',
      slug: 'mindset',
      icon: 'FlatEdu',
      order: 5,
      isVisible: true,
    },
    {
      label: 'Sports/Events',
      slug: 'sports',
      icon: 'FlatWork',
      order: 6,
      isVisible: true,
    },
  ];

  for (const navItem of navigationItems) {
    const existing = await prisma.navigationItem.findUnique({
      where: { slug: navItem.slug },
    });

    if (!existing) {
      console.log(`Creating navigation item: ${navItem.label}`);
      await prisma.navigationItem.create({
        data: navItem,
      });
    }
  }

  // Migrate existing social links
  const existingSocialLinks = [
    {
      platform: 'GitHub',
      url: 'https://github.com/mattswildadventures',
      icon: 'SiGithub',
      label: 'GitHub',
      order: 1,
    },
    {
      platform: 'LinkedIn',
      url: 'https://www.linkedin.com/in/khangnd',
      icon: 'FaLinkedinIn',
      label: 'LinkedIn',
      order: 2,
    },
    {
      platform: 'Twitter',
      url: 'https://twitter.com/_khangnd',
      icon: 'SiTwitter',
      label: 'Twitter',
      order: 3,
    },
    {
      platform: 'Fandom',
      url: 'https://dev.fandom.com/wiki/User:KhangND',
      icon: 'SiFandom',
      label: 'Fandom',
      order: 4,
    },
  ];

  for (const socialLink of existingSocialLinks) {
    const existing = await prisma.socialLink.findFirst({
      where: { platform: socialLink.platform },
    });

    if (!existing) {
      console.log(`Creating social link: ${socialLink.platform}`);
      await prisma.socialLink.create({
        data: socialLink,
      });
    }
  }

  // Create admin settings
  const adminSettings = [
    {
      key: 'admin_password',
      value: { password: 'admin123' },
    },
    {
      key: 'site_settings',
      value: {
        title: 'Portfolio',
        description: 'Personal portfolio website',
        theme: 'flat',
      },
    },
  ];

  for (const setting of adminSettings) {
    const existing = await prisma.adminSetting.findUnique({
      where: { key: setting.key },
    });

    if (!existing) {
      console.log(`Creating admin setting: ${setting.key}`);
      await prisma.adminSetting.create({
        data: setting,
      });
    }
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });