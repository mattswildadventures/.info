import fs from 'fs';
import path from 'path';

const CONTENT_FILE_PATH = path.join(process.cwd(), 'data', 'content.json');

export interface ContentData {
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

// Server-side function to read content data
export function getContentData(): ContentData {
  try {
    const fileContents = fs.readFileSync(CONTENT_FILE_PATH, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading content data:', error);
    throw new Error('Failed to load content data');
  }
}

// Client-side function to fetch content data via API
export async function fetchContentData(): Promise<ContentData> {
  try {
    const response = await fetch('/api/content');
    if (!response.ok) {
      throw new Error('Failed to fetch content data');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching content data:', error);
    throw error;
  }
}

// Get specific section of content data
export function getContentSection<K extends keyof ContentData>(section: K): ContentData[K] {
  const data = getContentData();
  return data[section];
}