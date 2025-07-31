import { IconName } from "../components/atoms/Icon";

export type Route = {
  path: string;
  title: string;
  icon: IconName;
};

const routes: Route[] = [
  { path: "/about", title: "About Me", icon: "FlatAbout" },
  { path: "/work", title: "My Work", icon: "FlatWork" },
  { path: "/skills", title: "Skills", icon: "FlatSkills" },
  // Changed from Blog to Research Paper - 2025-01-31
  // Old: { path: "/blog", title: "Blog", icon: "FlatEdu" },
  { path: "/research-paper", title: "Research Paper", icon: "FlatEdu" },
];

export function getRoute(path: string) {
  return routes.find(({ path: _path }) => _path === path);
}

export default routes;
