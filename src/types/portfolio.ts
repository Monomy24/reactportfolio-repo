export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  stack: string[];      // Your existing skills matrix array
  liveUrl: string;      // Used for Lifecycle Status
  githubUrl: string;    // Used for Project Type Classification
  featured: boolean;    // Used for Build Complete Flag

  // ADD THESE 3 DYNAMIC KEYS HERE:
  deploymentUrl?: string;     // Live domain deployment anchor URL
  sourceCodeUrl?: string;     // Source control Git link URL
  frameworksArray?: string[]; // Framework infrastructure array
}


export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
}

export interface PortfolioData {
  hero: {
    name: string;
    title: string;
    tagline: string;
    profileImage: string;
  };
    about: {
    bio: string;
    // UPDATED: Evolved from basic text arrays into structural key/value objects
    skills: {
      name: string;      // The public text (e.g. "React Engine Core")
      iconCode: string;  // The Devicon keyword (e.g. "react")
    }[];
  };
  projects: ProjectItem[];
  gallery: GalleryItem[];
  contact: {
    email: string;
    github: string;
    linkedin: string;
    websiteUrl: string;
  };
  settings: {
    theme: string;
    pinHash: string;
  };
}
