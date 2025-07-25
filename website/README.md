# ReactNativeLLM Documentation

This directory contains the comprehensive documentation for ReactNativeLLM, built with [Docusaurus](https://docusaurus.io/).

## 📚 Documentation Structure

The documentation is organized into several key sections:

### Getting Started
- **Introduction**: Overview and key features
- **Installation**: Complete setup guide
- **Quick Start**: Get running in 5 minutes
- **Project Structure**: Understanding the codebase

### Features
- **Model Management**: Download and manage AI models
- **Context System**: Intelligent context integration
- **Chat Interface**: Beautiful conversation UI
- **Theme Support**: Light/dark themes with customization
- **File Management**: Local storage and file operations

### API Reference
- **Components**: Detailed component documentation
- **Hooks**: Custom React hooks reference
- **Services**: Business logic services
- **Types**: TypeScript type definitions

### Guides
- **Development Setup**: Complete dev environment setup
- **Building & Deployment**: Production builds and app store submission
- **Customization**: Theming, configuration, and personalization
- **Troubleshooting**: Common issues and solutions

### Advanced Topics
- **Context Integration**: Deep dive into context system
- **Model Optimization**: Performance tuning
- **Custom Themes**: Advanced theming options
- **Performance**: Optimization strategies

## 🚀 Running the Documentation

### Prerequisites
- Node.js 16+
- npm or yarn

### Development Server

```bash
# Navigate to the website directory
cd website

# Install dependencies
npm install

# Start the development server
npm start
```

The documentation site will open at `http://localhost:3000`.

### Building for Production

```bash
# Build the static site
npm run build

# Serve the built site locally
npm run serve
```

## 📝 Contributing to Documentation

### Adding New Pages

1. **Create Markdown File**: Add new `.md` files in the appropriate `docs/` subdirectory
2. **Update Sidebar**: Modify `sidebars.ts` to include the new page
3. **Follow Conventions**: Use consistent formatting and structure

### Writing Guidelines

- **Clear Headings**: Use descriptive section headings
- **Code Examples**: Include practical, working code examples
- **Screenshots**: Add relevant screenshots for UI documentation
- **Cross-References**: Link to related documentation pages
- **Accessibility**: Ensure content is accessible and well-structured

### Documentation Standards

#### Markdown Format
```markdown
# Page Title

Brief introduction to the topic.

## Section Heading

Content with examples:

```typescript
// Code example with syntax highlighting
const example = "value";
```

### Subsection

More detailed information.
```

#### Code Blocks
Use language-specific syntax highlighting:

```typescript
// TypeScript example
interface Example {
  prop: string;
}
```

```bash
# Shell commands
npm install
npm start
```

```xml
<!-- XML/HTML examples -->
<key>NSCameraUsageDescription</key>
<string>This app uses camera for feature X</string>
```

#### Callouts and Admonitions

```markdown
:::tip
Helpful tip for users
:::

:::warning
Important warning about potential issues
:::

:::danger
Critical information about breaking changes
:::
```

### File Organization

```
docs/
├── intro.md                    # Introduction page
├── installation.md             # Installation guide
├── getting-started/           # Getting started section
│   ├── quick-start.md
│   ├── project-structure.md
│   └── configuration.md
├── features/                  # Feature documentation
│   ├── model-management.md
│   ├── context-system.md
│   └── ...
├── api/                       # API reference
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── types/
├── guides/                    # How-to guides
│   ├── setup-development.md
│   ├── building-and-deployment.md
│   └── ...
└── advanced/                  # Advanced topics
    ├── context-integration.md
    ├── model-optimization.md
    └── ...
```

## 🎨 Customization

### Theme Configuration

The documentation theme can be customized in `docusaurus.config.ts`:

```typescript
themeConfig: {
  navbar: {
    title: 'ReactNativeLLM',
    items: [
      // Navigation items
    ],
  },
  footer: {
    // Footer configuration
  },
  prism: {
    // Syntax highlighting theme
  },
}
```

### Styling

Custom CSS can be added to `src/css/custom.css`:

```css
/* Custom styles */
:root {
  --ifm-color-primary: #your-color;
}
```

### Components

Custom React components can be added to `src/components/` and used in markdown:

```jsx
import CustomComponent from '@site/src/components/CustomComponent';

<CustomComponent prop="value" />
```

## 📊 Analytics and Monitoring

### Google Analytics (Optional)

Add analytics to `docusaurus.config.ts`:

```typescript
plugins: [
  [
    '@docusaurus/plugin-google-analytics',
    {
      trackingID: 'UA-XXXXXXXXX-X',
    },
  ],
],
```

### Search Integration

Enable search with Algolia DocSearch:

```typescript
themeConfig: {
  algolia: {
    apiKey: 'your-api-key',
    indexName: 'your-index-name',
    appId: 'your-app-id',
  },
}
```

## 🚀 Deployment

### GitHub Pages

1. **Configure Base URL**: Set `baseUrl` in `docusaurus.config.ts`
2. **Deploy**: Use GitHub Actions or manual deployment

```bash
# Manual deployment
npm run build
npm run deploy
```

### Netlify

1. **Build Command**: `npm run build`
2. **Publish Directory**: `build`
3. **Node Version**: 16+

### Vercel

1. **Framework Preset**: Other
2. **Build Command**: `npm run build`
3. **Output Directory**: `build`

## 🔧 Maintenance

### Regular Updates

- **Dependencies**: Keep Docusaurus and plugins updated
- **Content**: Review and update documentation regularly
- **Links**: Check for broken internal and external links
- **Screenshots**: Update screenshots when UI changes

### Best Practices

- **Version Control**: Track all documentation changes in git
- **Review Process**: Use pull requests for documentation changes
- **Testing**: Test all code examples and procedures
- **Feedback**: Collect user feedback to improve documentation

## 📞 Support

For documentation issues:
- **GitHub Issues**: Report bugs or suggest improvements
- **Discussions**: Ask questions in GitHub Discussions
- **Contributing**: See CONTRIBUTING.md for contribution guidelines

---

*Great documentation makes great software even better!* 📖✨