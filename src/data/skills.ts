export type Skill = {
  name: string;
  label: string;
  url: string;
  color: string;
  category?: string;
};

const skills: Skill[] = [
  {
    name: "html",
    label: "HTML",
    url: "https://developer.mozilla.org/en-US/docs/Web/HTML",
    color: "#e34f26",
    category: "Fundamentals",
  },
  {
    name: "css",
    label: "CSS",
    url: "https://developer.mozilla.org/en-US/docs/Web/CSS",
    color: "#0170ba",
    category: "Fundamentals",
  },
  {
    name: "js",
    label: "JavaScript",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    color: "#ffc107",
    category: "Fundamentals",
  },
  {
    name: "ts",
    label: "TypeScript",
    url: "https://www.typescriptlang.org/",
    color: "#3178c6",
  },
  {
    name: "jquery",
    label: "jQuery",
    url: "https://jquery.com/",
    color: "#0868ac",
    category: "Libraries/Frameworks",
  },
  {
    name: "reactjs",
    label: "ReactJS",
    url: "https://reactjs.org/",
    color: "#00bcd4",
    category: "Libraries/Frameworks",
  },
  {
    name: "nextjs",
    label: "NextJS",
    url: "https://nextjs.org/",
    color: "#000",
    category: "Libraries/Frameworks",
  },
  /*{
    name: "vuejs",
    label: "Vue",
    url: "https://vuejs.org/",
    color: "#41b883",
    category: "Libraries/Frameworks",
  },
  {
    name: "vuepress",
    label: "VuePress",
    url: "https://vuepress.vuejs.org/",
    color: "#41b883",
    category: "Libraries/Frameworks",
  },
  {
    name: "svelte",
    label: "Svelte",
    url: "https://svelte.dev/",
    color: "#ff3e00",
    category: "Libraries/Frameworks",
  },*/
  {
    name: "nodejs",
    label: "NodeJS",
    url: "https://nodejs.org/",
    color: "#8cc84b",
    category: "Fundamentals",
  },
  {
    name: "bootstrap",
    label: "Bootstrap",
    url: "https://getbootstrap.com/",
    color: "#563d7c",
    category: "Libraries/Frameworks",
  },
  /*{
    name: "sass",
    label: "Sass",
    url: "https://sass-lang.com/",
    color: "#cd6799",
    category: "Libraries/Frameworks",
  },
  {
    name: "bulma",
    label: "Bulma",
    url: "https://bulma.io/",
    color: "#00D1B2",
    category: "Libraries/Frameworks",
  },*/
  {
    name: "gql",
    label: "GraphQL",
    url: "https://graphql.org/",
    color: "#e10098",
  },
  {
    name: "vscode",
    label: "Visual Studio Code",
    url: "https://code.visualstudio.com/",
    color: "#0075b7",
    category: "Tools",
  },
  {
    name: "vs",
    label: "MS Visual Studio",
    url: "https://visualstudio.microsoft.com/",
    color: "#8555bc",
    category: "Tools",
  },
  {
    name: "office",
    label: "MS Office",
    url: "https://www.office.com/",
    color: "#eb3c00",
    category: "Tools",
  },
  /*{
    name: "eclipse",
    label: "Eclipse",
    url: "https://www.eclipse.org/ide/",
    color: "#272770",
    category: "Tools",
  },
  {
    name: "androidstd",
    label: "Android Studio",
    url: "https://developer.android.com/studio",
    color: "#82b64b",
    category: "Tools",
  },
  {
    name: "balsamiq",
    label: "Balsamiq Mockups",
    url: "https://balsamiq.com/wireframes/",
    color: "#666",
    category: "Tools",
  },*/
  {
    name: "photoshop",
    label: "Photoshop",
    url: "https://www.adobe.com/sea/products/photoshop.html",
    color: "#7fbafb",
    category: "Tools",
  },
  {
    name: "bitbucket",
    label: "Bitbucket",
    url: "https://bitbucket.org/product",
    color: "#0052cc",
    category: "Tools",
  },
  /*{
    name: "crowdin",
    label: "Crowdin",
    url: "https://crowdin.com/",
    color: "#333",
    category: "Tools",
  },*/
  {
    name: "figma",
    label: "Figma",
    url: "https://www.figma.com/",
    color: "#a259ff",
    category: "Tools",
  },
  /*{
    name: "firebase",
    label: "Firebase",
    url: "https://firebase.google.com/",
    color: "#ffa714",
  },*/
  {
    name: "framer",
    label: "Framer Motion",
    url: "https://www.framer.com/motion/",
    color: "#67dbff",
    category: "Libraries/Frameworks",
  },
  {
    name: "git",
    label: "Git",
    url: "https://git-scm.com/",
    color: "#f05133",
  },
  {
    name: "github",
    label: "Github",
    url: "http://github.com/",
    color: "#000",
  },
  {
    name: "jira",
    label: "Jira",
    url: "https://www.atlassian.com/software/jira",
    color: "#2684ff",
    category: "Tools",
  },
  /*{
    name: "strapi",
    label: "Strapi",
    url: "https://strapi.io/",
    color: "#8e75ff",
  },*/
  {
    name: "claude",
    label: "Claude",
    url: "https://claude.ai/",
    color: "#E85A3B",
    category: "Libraries/Frameworks"
  },
  {
    name: "openai",
    label: "OpenAI",
    url: "https://openai.com/",
    color: "#000000",
    category: "Libraries/Frameworks"
  },
  {
    name: "apple",
    label: "Apple",
    url: "https://apple.com/",
    color: "#A3AAAE",
    category: "Libraries/Frameworks"
  },
  {
    name: "microsoft",
    label: "Microsoft Server",
    url: "https://www.microsoft.com/en-au/windows-server",
    color: "#F25022",
    category: "Infrastructure"
  },
  {
    name: "n8n",
    label: "n8n",
    url: "https://n8n.com/",
    color: "#EA4D30",
    category: "Infrastructure"
  },
  {
    name: "laravel",
    label: "Laravel",
    url: "https://www.laravel.com/",
    color: "#FF2D20",
    category: "Infrastructure"
  },
  {
    name: "supabase",
    label: "Supabase",
    url: "https://supabase.com/",
    color: "#3ECF8E",
    category: "Infrastructure"
  },
  {
    name: "pinecone",
    label: "Pinecone",
    url: "https://pinecone.io",
    color: "#111827",
    category: "Infrastructure"
  },
  {
    name: "neo4j",
    label: "Neo4J",
    url: "http://neo4j.com",
    color: "#018BFF",
    category: "Infrastructure"
  },
  {
    name: "replit",
    label: "Replit",
    url: "http://replit.com",
    color: "#F26207",
    category: "Infrastructure"
  },
  {
    name: "mcp",
    label: "Model Context Protocol",
    url: "https://modelcontextprotocol.io",
    color: "#000000",
    category: "Infrastructure"
  },
];

export default skills;
