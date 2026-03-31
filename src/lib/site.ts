export const site = {
  name: "Jacob Diebold",
  titleTemplate: "%s · Jacob Diebold's Portfolio",
  defaultTitle: "Jacob Diebold's Portfolio",
  description:
    "Full-stack software developer in Arvada, CO — React Native, Next.js, Node.js, and AWS. Building usable tools for real-world operations.",
  url: "https://jacobdiebold.com",
  location: "Denver, CO",
  links: {
    github: "https://github.com/Jacob-Diebold",
    linkedin: "https://www.linkedin.com/in/jacob-diebold/",
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
      "iOS app (~5k downloads) for personalized mass texts: groups, name-filled templates, and sends through Messages—no huge group thread.",
    href: "https://apps.apple.com/us/app/invite-everyone/id6444068969",
    tags: ["React Native", "TypeScript", "Expo", "iOS"],
  },
  {
    title: "Grace Note",
    description:
      "Next.js and Firebase for karaoke nights: guest queue, song checks, line position, and timed signup so the rotation stays fair.",
    href: "https://grace-note.vercel.app/",
    tags: ["Next.js", "Firebase", "TypeScript"],
  },
];
