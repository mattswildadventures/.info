import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

interface JsonContent {
  about: {
    title: string;
    content: string;
    image: string | null;
    skills: string[];
  };
  work: {
    title: string;
    description: string;
    projects: Array<{
      id: string;
      title: string;
      description: string;
      technologies: string[];
      image: string | null;
      url: string | null;
      github: string | null;
    }>;
  };
  skills: {
    title: string;
    description: string;
    categories: Array<{
      name: string;
      skills: Array<{
        name: string;
        level: string;
        icon: string;
      }>;
    }>;
  };
  socialLinks: Array<{
    id: string;
    platform: string;
    url: string;
    icon: string;
    label: string;
    order: number;
  }>;
  settings: {
    adminPassword: string;
    lastUpdated: string;
  };
}

async function migrateJsonToDatabase() {
  console.log('🔄 Starting migration from JSON to database...');
  
  try {
    // Read the existing content.json file
    const contentPath = path.join(process.cwd(), 'data', 'content.json');
    const jsonData: JsonContent = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
    
    console.log('📖 Loaded JSON data successfully');

    // First, ensure content types exist
    const contentTypes = await prisma.contentType.findMany();
    const typeMap = new Map(contentTypes.map(ct => [ct.slug, ct.id]));

    // Migrate About content
    if (jsonData.about && typeMap.has('about')) {
      console.log('📝 Migrating About Me content...');
      
      const existingAbout = await prisma.contentItem.findFirst({
        where: { contentTypeId: typeMap.get('about')! },
      });

      if (!existingAbout) {
        await prisma.contentItem.create({
          data: {
            contentTypeId: typeMap.get('about')!,
            slug: 'about-me',
            title: jsonData.about.title,
            data: {
              title: jsonData.about.title,
              content: jsonData.about.content,
              profileImage: jsonData.about.image,
              skills: jsonData.about.skills,
              location: null,
            },
            isPublic: true,
            isPublished: true,
            publishedAt: new Date(),
            metaTitle: jsonData.about.title,
            metaDescription: jsonData.about.content.substring(0, 160),
          },
        });
        console.log('✅ About Me content migrated');
      } else {
        console.log('⏭️  About Me content already exists, skipping');
      }
    }

    // Migrate Work content
    if (jsonData.work && typeMap.has('work')) {
      console.log('💼 Migrating Work content...');
      
      const existingWork = await prisma.contentItem.findFirst({
        where: { contentTypeId: typeMap.get('work')! },
      });

      if (!existingWork) {
        await prisma.contentItem.create({
          data: {
            contentTypeId: typeMap.get('work')!,
            slug: 'my-work',
            title: jsonData.work.title,
            data: {
              title: jsonData.work.title,
              description: jsonData.work.description,
              projects: jsonData.work.projects,
            },
            isPublic: true,
            isPublished: true,
            publishedAt: new Date(),
            metaTitle: jsonData.work.title,
            metaDescription: jsonData.work.description,
          },
        });
        console.log('✅ Work content migrated');
      } else {
        console.log('⏭️  Work content already exists, skipping');
      }
    }

    // Migrate Skills content
    if (jsonData.skills && typeMap.has('skills')) {
      console.log('🛠️  Migrating Skills content...');
      
      const existingSkills = await prisma.contentItem.findFirst({
        where: { contentTypeId: typeMap.get('skills')! },
      });

      if (!existingSkills) {
        await prisma.contentItem.create({
          data: {
            contentTypeId: typeMap.get('skills')!,
            slug: 'skills',
            title: jsonData.skills.title,
            data: {
              title: jsonData.skills.title,
              description: jsonData.skills.description,
              categories: jsonData.skills.categories,
            },
            isPublic: true,
            isPublished: true,
            publishedAt: new Date(),
            metaTitle: jsonData.skills.title,
            metaDescription: jsonData.skills.description,
          },
        });
        console.log('✅ Skills content migrated');
      } else {
        console.log('⏭️  Skills content already exists, skipping');
      }
    }

    // Migrate Social Links
    if (jsonData.socialLinks) {
      console.log('🔗 Migrating social links...');
      
      for (const socialLink of jsonData.socialLinks) {
        const existing = await prisma.socialLink.findFirst({
          where: { platform: socialLink.platform },
        });

        if (!existing) {
          await prisma.socialLink.create({
            data: {
              platform: socialLink.platform,
              url: socialLink.url,
              icon: socialLink.icon,
              label: socialLink.label,
              order: socialLink.order,
              isVisible: true,
            },
          });
          console.log(`✅ Social link migrated: ${socialLink.platform}`);
        } else {
          console.log(`⏭️  Social link already exists: ${socialLink.platform}`);
        }
      }
    }

    // Migrate admin settings
    if (jsonData.settings) {
      console.log('⚙️  Migrating admin settings...');
      
      const existingPassword = await prisma.adminSetting.findUnique({
        where: { key: 'admin_password' },
      });

      if (!existingPassword) {
        await prisma.adminSetting.create({
          data: {
            key: 'admin_password',
            value: { password: jsonData.settings.adminPassword },
          },
        });
        console.log('✅ Admin password migrated');
      }
    }

    // Create sample Mindset content
    if (typeMap.has('mindset')) {
      console.log('🧠 Creating sample Mindset content...');
      
      const existingMindset = await prisma.contentItem.findFirst({
        where: { contentTypeId: typeMap.get('mindset')! },
      });

      if (!existingMindset) {
        await prisma.contentItem.create({
          data: {
            contentTypeId: typeMap.get('mindset')!,
            slug: 'mindset',
            title: 'Mindset',
            data: {
              title: 'Mindset',
              content: '<p>This is where I share my thoughts, philosophy, and approach to life and work.</p><p>Growth mindset, continuous learning, and embracing challenges are core to who I am.</p>',
              featuredImage: null,
              quotes: [
                {
                  text: 'The only way to do great work is to love what you do.',
                  author: 'Steve Jobs',
                  context: 'Stanford Commencement 2005'
                }
              ],
              categories: ['Philosophy', 'Growth', 'Mindset'],
              philosophy: 'I believe in continuous growth, embracing challenges, and maintaining curiosity about the world around us.',
            },
            isPublic: false, // Start as private
            isPublished: true,
            publishedAt: new Date(),
            metaTitle: 'Mindset - Personal Philosophy',
            metaDescription: 'My thoughts on personal growth, mindset, and philosophy.',
          },
        });
        console.log('✅ Sample Mindset content created');
      }
    }

    // Create sample Sports content
    if (typeMap.has('sports')) {
      console.log('🏃‍♂️ Creating sample Sports content...');
      
      const existingSports = await prisma.contentItem.findFirst({
        where: { contentTypeId: typeMap.get('sports')! },
      });

      if (!existingSports) {
        await prisma.contentItem.create({
          data: {
            contentTypeId: typeMap.get('sports')!,
            slug: 'sports-events',
            title: 'Sports & Events',
            data: {
              title: 'Sports & Events',
              description: 'My athletic journey and sporting achievements.',
              currentSports: ['Running', 'Cycling', 'Swimming'],
              events: [
                {
                  title: 'Marathon Training',
                  eventType: 'Training',
                  date: new Date().toISOString(),
                  description: 'Regular marathon training sessions to build endurance.',
                  location: 'Local Park',
                  photos: [],
                  results: 'Consistent progress in pace and distance.'
                }
              ],
              achievements: [
                {
                  title: 'First 10K Run',
                  description: 'Completed my first 10K run in under 50 minutes.',
                  date: new Date().toISOString(),
                  category: 'Running',
                  image: null
                }
              ],
            },
            isPublic: false, // Start as private
            isPublished: true,
            publishedAt: new Date(),
            metaTitle: 'Sports & Events - Athletic Journey',
            metaDescription: 'My sports activities, events, and achievements.',
          },
        });
        console.log('✅ Sample Sports content created');
      }
    }

    console.log('🎉 Migration completed successfully!');
    console.log('');
    console.log('📋 Summary:');
    console.log('- About Me content migrated from JSON');
    console.log('- Work portfolio migrated from JSON');
    console.log('- Skills migrated from JSON');
    console.log('- Social links migrated from JSON');
    console.log('- Admin settings migrated from JSON');
    console.log('- Sample Mindset content created (private)');
    console.log('- Sample Sports content created (private)');
    console.log('');
    console.log('🔧 Next steps:');
    console.log('1. Visit /admin/cms to manage content');
    console.log('2. Make Mindset and Sports content public if desired');
    console.log('3. Customize the sample content');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration if called directly
if (require.main === module) {
  migrateJsonToDatabase().catch(console.error);
}

export default migrateJsonToDatabase;