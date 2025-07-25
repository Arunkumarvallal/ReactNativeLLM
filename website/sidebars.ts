import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // Main documentation sidebar
  tutorialSidebar: [
    'intro',
    'installation',
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started/quick-start',
        'getting-started/project-structure',
        'getting-started/configuration',
      ],
    },
    {
      type: 'category',
      label: 'Features',
      items: [
        'features/model-management',
        'features/context-system',
        'features/chat-interface',
        'features/theme-support',
        'features/file-management',
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      items: [
        'api/components/overview',
        {
          type: 'category',
          label: 'Components',
          items: [
            'api/components/chat-header',
            'api/components/context-toggle-button',
            'api/components/context-status-indicator',
            'api/components/custom-gifted-chat',
            'api/components/model-selection',
            'api/components/network-info',
            'api/components/theme-toggle-button',
          ],
        },
        {
          type: 'category',
          label: 'Hooks',
          items: [
            'api/hooks/use-chat-messages',
            'api/hooks/use-chat-screen-state',
            'api/hooks/use-context-manager',
            'api/hooks/use-model-download',
            'api/hooks/use-model-preparation',
          ],
        },
        {
          type: 'category',
          label: 'Services',
          items: [
            'api/services/mcp-context-manager',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'guides/setup-development',
        'guides/building-and-deployment',
        'guides/customization',
        'guides/troubleshooting',
      ],
    },
    {
      type: 'category',
      label: 'Advanced',
      items: [
        'advanced/context-integration',
      ],
    },
  ],
};

export default sidebars;
