// Content Type Definitions for the CMS

export interface FieldDefinition {
  name: string;
  type: 'text' | 'textarea' | 'rich_text' | 'array' | 'object' | 'image' | 'select' | 'boolean' | 'date';
  required?: boolean;
  label: string;
  placeholder?: string;
  options?: string[]; // For select fields
  itemType?: string; // For array fields
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

export interface ContentTypeSchema {
  fields: FieldDefinition[];
  layout: {
    sections?: string[];
    columns?: number;
  };
}

export interface ContentTypeDefinition {
  name: string;
  slug: string;
  icon: string;
  schema: ContentTypeSchema;
  layoutComponent: string;
  adminFormConfig: {
    tabs?: string[];
    sections: {
      [key: string]: {
        title: string;
        fields: string[];
      };
    };
  };
}

// Define all content types
export const contentTypeDefinitions: ContentTypeDefinition[] = [
  // About Me Content Type
  {
    name: 'About Me',
    slug: 'about',
    icon: '👤',
    layoutComponent: 'AboutLayout',
    schema: {
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Page Title',
          placeholder: 'About Me',
        },
        {
          name: 'content',
          type: 'rich_text',
          required: true,
          label: 'Bio Content',
          placeholder: 'Write about yourself...',
        },
        {
          name: 'profileImage',
          type: 'image',
          label: 'Profile Image',
        },
        {
          name: 'skills',
          type: 'array',
          itemType: 'text',
          label: 'Key Skills',
        },
        {
          name: 'location',
          type: 'text',
          label: 'Location',
          placeholder: 'City, Country',
        },
      ],
      layout: {
        sections: ['basic', 'content', 'skills'],
        columns: 1,
      },
    },
    adminFormConfig: {
      sections: {
        basic: {
          title: 'Basic Information',
          fields: ['title', 'location', 'profileImage'],
        },
        content: {
          title: 'Content',
          fields: ['content'],
        },
        skills: {
          title: 'Skills',
          fields: ['skills'],
        },
      },
    },
  },

  // My Work Content Type
  {
    name: 'My Work',
    slug: 'work',
    icon: '💼',
    layoutComponent: 'WorkLayout',
    schema: {
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Page Title',
          placeholder: 'My Work',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Page Description',
          placeholder: 'Brief description of your work...',
        },
        {
          name: 'projects',
          type: 'array',
          itemType: 'object',
          label: 'Projects',
        },
      ],
      layout: {
        sections: ['overview', 'projects'],
        columns: 1,
      },
    },
    adminFormConfig: {
      sections: {
        overview: {
          title: 'Overview',
          fields: ['title', 'description'],
        },
        projects: {
          title: 'Projects',
          fields: ['projects'],
        },
      },
    },
  },

  // Skills Content Type
  {
    name: 'Skills',
    slug: 'skills',
    icon: '🛠️',
    layoutComponent: 'SkillsLayout',
    schema: {
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Page Title',
          placeholder: 'Skills',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Page Description',
          placeholder: 'Description of your skills...',
        },
        {
          name: 'categories',
          type: 'array',
          itemType: 'object',
          label: 'Skill Categories',
        },
      ],
      layout: {
        sections: ['overview', 'categories'],
        columns: 1,
      },
    },
    adminFormConfig: {
      sections: {
        overview: {
          title: 'Overview',
          fields: ['title', 'description'],
        },
        categories: {
          title: 'Skill Categories',
          fields: ['categories'],
        },
      },
    },
  },

  // Mindset Content Type (NEW)
  {
    name: 'Mindset',
    slug: 'mindset',
    icon: '🧠',
    layoutComponent: 'MindsetLayout',
    schema: {
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Page Title',
          placeholder: 'Mindset',
        },
        {
          name: 'content',
          type: 'rich_text',
          required: true,
          label: 'Main Content',
          placeholder: 'Share your thoughts and philosophy...',
        },
        {
          name: 'featuredImage',
          type: 'image',
          label: 'Featured Image',
        },
        {
          name: 'quotes',
          type: 'array',
          itemType: 'object',
          label: 'Inspirational Quotes',
        },
        {
          name: 'categories',
          type: 'array',
          itemType: 'text',
          label: 'Categories',
        },
        {
          name: 'philosophy',
          type: 'textarea',
          label: 'Personal Philosophy',
          placeholder: 'Your core beliefs and values...',
        },
      ],
      layout: {
        sections: ['header', 'content', 'quotes', 'philosophy'],
        columns: 1,
      },
    },
    adminFormConfig: {
      sections: {
        header: {
          title: 'Header',
          fields: ['title', 'featuredImage', 'categories'],
        },
        content: {
          title: 'Main Content',
          fields: ['content'],
        },
        quotes: {
          title: 'Quotes',
          fields: ['quotes'],
        },
        philosophy: {
          title: 'Philosophy',
          fields: ['philosophy'],
        },
      },
    },
  },

  // Sports/Events Content Type (NEW)
  {
    name: 'Sports/Events',
    slug: 'sports',
    icon: '🏃‍♂️',
    layoutComponent: 'SportsLayout',
    schema: {
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Page Title',
          placeholder: 'Sports & Events',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Page Description',
          placeholder: 'Description of your sports activities...',
        },
        {
          name: 'events',
          type: 'array',
          itemType: 'object',
          label: 'Events/Activities',
        },
        {
          name: 'achievements',
          type: 'array',
          itemType: 'object',
          label: 'Key Achievements',
        },
        {
          name: 'currentSports',
          type: 'array',
          itemType: 'text',
          label: 'Current Sports',
        },
      ],
      layout: {
        sections: ['overview', 'current', 'events', 'achievements'],
        columns: 1,
      },
    },
    adminFormConfig: {
      sections: {
        overview: {
          title: 'Overview',
          fields: ['title', 'description'],
        },
        current: {
          title: 'Current Sports',
          fields: ['currentSports'],
        },
        events: {
          title: 'Events',
          fields: ['events'],
        },
        achievements: {
          title: 'Achievements',
          fields: ['achievements'],
        },
      },
    },
  },
];