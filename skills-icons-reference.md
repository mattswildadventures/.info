# Skills Icons Reference

This document lists all the skills icons and their corresponding codes used in the application.

## How Icons Work

Icons are referenced by their `name` field in the skills data (`src/data/skills.ts`) and correspond to SVG files in `src/icons/` with the pattern `skill-{name}.svg`.

## Available Icons (Current)

### Fundamentals
- **html** → `skill-html.svg` - HTML
- **css** → `skill-css.svg` - CSS  
- **js** → `skill-js.svg` - JavaScript
- **ts** → `skill-ts.svg` - TypeScript
- **nodejs** → `skill-nodejs.svg` - NodeJS

### Libraries/Frameworks
- **jquery** → `skill-jquery.svg` - jQuery
- **reactjs** → `skill-reactjs.svg` - ReactJS
- **nextjs** → `skill-nextjs.svg` - NextJS
- **bootstrap** → `skill-bootstrap.svg` - Bootstrap
- **framer** → `skill-framer.svg` - Framer Motion

### Tools
- **vscode** → `skill-vscode.svg` - Visual Studio Code
- **vs** → `skill-vs.svg` - MS Visual Studio
- **office** → `skill-office.svg` - MS Office
- **photoshop** → `skill-photoshop.svg` - Photoshop
- **bitbucket** → `skill-bitbucket.svg` - Bitbucket
- **figma** → `skill-figma.svg` - Figma
- **jira** → `skill-jira.svg` - Jira

### Infrastructure/Misc
- **gql** → `skill-gql.svg` - GraphQL
- **git** → `skill-git.svg` - Git
- **github** → `skill-github.svg` - Github

## Missing Icons (Need to be Created)

These skills are defined in the data but don't have corresponding SVG files:

- **claudecode** → `skill-claudecode.svg` - Claude Code ⚠️ MISSING
- **microsoftserver** → `skill-microsoftserver.svg` - Microsoft Server ⚠️ MISSING

## Available but Commented Out

These icons exist but the skills are commented out in `skills.ts`:

- **vuejs** → `skill-vuejs.svg` - Vue
- **vuepress** → `skill-vuepress.png` - VuePress (PNG format)
- **svelte** → `skill-svelte.svg` - Svelte
- **sass** → `skill-sass.svg` - Sass
- **bulma** → `skill-bulma.svg` - Bulma
- **eclipse** → `skill-eclipse.svg` - Eclipse
- **androidstd** → `skill-androidstd.svg` - Android Studio
- **balsamiq** → `skill-balsamiq.svg` - Balsamiq Mockups
- **crowdin** → `skill-crowdin.svg` - Crowdin
- **firebase** → `skill-firebase.svg` - Firebase
- **strapi** → `skill-strapi.svg` - Strapi

## To Add New Icons

1. Create SVG file: `src/icons/skill-{name}.svg`
2. Add import to `src/icons/index.ts`: `import Logo{name} from "./skill-{name}.svg";`
3. Add to Icon object in `src/icons/index.ts`: `Logo{name},`
4. Add skill entry in `src/data/skills.ts` with matching `name` field

## Icon Import Pattern

Icons are imported in `src/icons/index.ts` with the pattern:
```typescript
import Logo{name} from "./skill-{name}.svg";
```

And exported in the Icon object as:
```typescript
const Icon = {
  Logo{name},
  // ... other icons
};
```