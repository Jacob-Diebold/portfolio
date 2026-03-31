export const site = {
  name: "Jacob Diebold",
  titleTemplate: "%s · Jacob Diebold's Portfolio",
  defaultTitle: "Jacob Diebold's Portfolio",
  description: "Personal portfolio of Jacob Diebold.",
  url: "https://jacobdiebold.com",
  links: {
    github: "https://github.com/Jacob-Diebold",
    linkedin: "https://linkedin.com/in/jacob-diebold",
    email: "mailto:diebold.jacob@gmail.com",
  },
} as const;

export type Project = {
  title: string;
  description: string;
  href: string;
  tags: string[];
};

export const featuredProjects: Project[] = [
  {
    title: "Invite Everyone",
    description:
      "Personalized mass texting for events: contact groups, templates with names, and sends through Messages — no huge group thread.",
    href: "https://apps.apple.com/us/app/invite-everyone/id6444068969",
    tags: ["React Native", "TypeScript"],
  },
  {
    title: "Grace Note",
    description:
      "Karaoke night queue app: sign up, song verification, line position, and timed signup so everyone gets a shot at the mic.",
    href: "https://grace-note.vercel.app/",
    tags: ["Next.js", "Firebase"],
  },
];
