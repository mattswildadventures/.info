import { ReactElement } from 'react';
import { Box, Text } from 'theme-ui';
import MindsetLayout from './layouts/MindsetLayout';
import SportsLayout from './layouts/SportsLayout';
// Note: AboutLayout, WorkLayout, SkillsLayout would be created similarly

interface ContentItem {
  id: string;
  slug: string;
  title: string;
  data: any;
  isPublic: boolean;
  metaTitle?: string;
  metaDescription?: string;
  publishedAt: string;
  contentType: {
    id: string;
    name: string;
    slug: string;
    icon: string;
    layoutComponent: string;
  };
}

interface DynamicContentRendererProps {
  contentItem: ContentItem;
}

// Layout component mapping
const layoutComponents: Record<string, React.ComponentType<{ data: any }>> = {
  MindsetLayout,
  SportsLayout,
  // AboutLayout, (would be added when created)
  // WorkLayout,   (would be added when created)
  // SkillsLayout, (would be added when created)
};

export default function DynamicContentRenderer({ contentItem }: DynamicContentRendererProps) {
  const { contentType, data, title } = contentItem;
  const LayoutComponent = layoutComponents[contentType.layoutComponent];

  if (!LayoutComponent) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Text sx={{ fontSize: 4, mb: 3, color: 'muted' }}>
          {contentType.icon || '📄'}
        </Text>
        <Text sx={{ fontSize: 3, fontWeight: 'bold', color: 'text', mb: 2 }}>
          {title}
        </Text>
        <Text sx={{ fontSize: 2, color: 'muted', mb: 4 }}>
          Layout component &quot;{contentType.layoutComponent}&quot; not found
        </Text>
        <Box sx={{ bg: 'muted', p: 4, borderRadius: '8px', maxWidth: '600px', mx: 'auto' }}>
          <Text sx={{ fontSize: 1, color: 'background', mb: 2, fontWeight: 'bold' }}>
            Raw Content Data:
          </Text>
          <pre style={{ color: 'white', fontSize: '12px', overflow: 'auto' }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </Box>
      </Box>
    );
  }

  return <LayoutComponent data={data} />;
}

// Hook for getting layout component names
export function getAvailableLayouts(): string[] {
  return Object.keys(layoutComponents);
}

// Utility to check if a layout component exists
export function hasLayoutComponent(componentName: string): boolean {
  return componentName in layoutComponents;
}