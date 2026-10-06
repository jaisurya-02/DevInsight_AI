import type { CompleteDeveloperInsights, HeatmapDay } from '../types/developer';

// Helper to generate 365 realistic heatmap days for the past year
const generateMockHeatmap = (): HeatmapDay[] => {
  const days: HeatmapDay[] = [];
  const today = new Date('2026-10-06');
  
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    // Day of week factor (weekends have lower activity)
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    let count = 0;
    const rand = Math.random();
    
    if (isWeekend) {
      if (rand > 0.6) count = Math.floor(Math.random() * 4) + 1;
    } else {
      if (rand > 0.25) count = Math.floor(Math.random() * 12) + 1;
    }
    
    let level: 0 | 1 | 2 | 3 | 4 = 0;
    if (count > 0 && count <= 2) level = 1;
    else if (count > 2 && count <= 5) level = 2;
    else if (count > 5 && count <= 8) level = 3;
    else if (count > 8) level = 4;
    
    days.push({ date: dateStr, count, level });
  }
  
  return days;
};

export const mockDeveloperData: CompleteDeveloperInsights = {
  profile: {
    id: 'usr_8923412',
    username: 'alexjohnson',
    name: 'Alex Johnson',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    bio: 'Full-stack software engineer passionate about distributed systems, modern web architectures, and developer tooling.',
    company: '@TechScale Labs',
    location: 'San Francisco, CA',
    website: 'https://alexjohnson.dev',
    predictedRole: 'Full Stack Developer',
    roleConfidence: 0.82,
    lastAnalyzed: 'Oct 5, 2026',
    stats: {
      publicRepos: 24,
      publicReposTrend: '+4 this year',
      techExposureCount: 12,
      activeDaysThisYear: 186,
      collaborationIndex: 67,
      openSourceIndicator: 82,
      followers: 342,
      following: 89,
    },
  },

  monthlyActivity: [
    { month: 'Jan', commits: 45, pullRequests: 6, issues: 4, totalActivity: 55 },
    { month: 'Feb', commits: 62, pullRequests: 8, issues: 5, totalActivity: 75 },
    { month: 'Mar', commits: 78, pullRequests: 11, issues: 7, totalActivity: 96 },
    { month: 'Apr', commits: 54, pullRequests: 5, issues: 3, totalActivity: 62 },
    { month: 'May', commits: 88, pullRequests: 14, issues: 9, totalActivity: 111 },
    { month: 'Jun', commits: 70, pullRequests: 9, issues: 6, totalActivity: 85 },
    { month: 'Jul', commits: 95, pullRequests: 12, issues: 8, totalActivity: 115 },
    { month: 'Aug', commits: 82, pullRequests: 10, issues: 5, totalActivity: 97 },
    { month: 'Sep', commits: 104, pullRequests: 15, issues: 11, totalActivity: 130 },
    { month: 'Oct', commits: 42, pullRequests: 4, issues: 3, totalActivity: 49 },
  ],

  heatmapData: generateMockHeatmap(),

  technologies: [
    { name: 'TypeScript', category: 'Languages', usagePercentage: 88, repoCount: 14, recentUsage: 'Active today', color: '#3178C6' },
    { name: 'Python', category: 'Languages', usagePercentage: 82, repoCount: 10, recentUsage: 'Active 2 days ago', color: '#3572A5' },
    { name: 'React', category: 'Frameworks', usagePercentage: 85, repoCount: 12, recentUsage: 'Active today', color: '#61DAFB' },
    { name: 'Node.js', category: 'Frameworks', usagePercentage: 78, repoCount: 9, recentUsage: 'Active 3 days ago', color: '#339933' },
    { name: 'FastAPI', category: 'Frameworks', usagePercentage: 65, repoCount: 5, recentUsage: 'Active last week', color: '#009688' },
    { name: 'PostgreSQL', category: 'Databases', usagePercentage: 72, repoCount: 8, recentUsage: 'Active 4 days ago', color: '#4169E1' },
    { name: 'MongoDB', category: 'Databases', usagePercentage: 54, repoCount: 4, recentUsage: 'Active last month', color: '#47A248' },
    { name: 'Docker', category: 'Cloud & DevOps', usagePercentage: 64, repoCount: 7, recentUsage: 'Active 5 days ago', color: '#2496ED' },
    { name: 'AWS', category: 'Cloud & DevOps', usagePercentage: 58, repoCount: 5, recentUsage: 'Active 2 weeks ago', color: '#FF9900' },
    { name: 'PyTorch', category: 'AI & Data', usagePercentage: 42, repoCount: 3, recentUsage: 'Active last month', color: '#EE4C2C' },
  ],

  languages: [
    { name: 'TypeScript', percentage: 34, bytes: 482000, color: '#3178C6' },
    { name: 'Python', percentage: 26, bytes: 368000, color: '#3572A5' },
    { name: 'JavaScript', percentage: 18, bytes: 255000, color: '#F7DF1E' },
    { name: 'Java', percentage: 10, bytes: 141000, color: '#B07219' },
    { name: 'C++', percentage: 7, bytes: 99000, color: '#F34B7D' },
    { name: 'Other', percentage: 5, bytes: 71000, color: '#6E7681' },
  ],

  repositories: [
    {
      id: 'repo_01',
      name: 'SmartAisle',
      fullName: 'alexjohnson/SmartAisle',
      description: 'AI-powered supermarket navigation and real-time inventory tracking platform.',
      stars: 42,
      forks: 8,
      watchers: 42,
      primaryLanguage: 'Python',
      technologies: ['Python', 'FastAPI', 'React', 'PostgreSQL'],
      topics: ['ai', 'navigation', 'fastapi', 'react-dashboard'],
      activityScore: 88,
      lastUpdated: 'Updated 3 days ago',
      isFork: false,
      htmlUrl: 'https://github.com/alexjohnson/SmartAisle',
      readmeSnippet: 'SmartAisle combines computer vision with graph routing algorithms to optimize store inventory and customer journey paths.',
    },
    {
      id: 'repo_02',
      name: 'DevPulse-Analytics',
      fullName: 'alexjohnson/DevPulse-Analytics',
      description: 'Real-time engineering team velocity and pull-request metric visualizer.',
      stars: 128,
      forks: 24,
      watchers: 128,
      primaryLanguage: 'TypeScript',
      technologies: ['TypeScript', 'React', 'Node.js', 'TailwindCSS'],
      topics: ['analytics', 'developer-tools', 'typescript', 'recharts'],
      activityScore: 94,
      lastUpdated: 'Updated yesterday',
      isFork: false,
      htmlUrl: 'https://github.com/alexjohnson/DevPulse-Analytics',
      readmeSnippet: 'High-performance engineering dashboard built with Vite, TypeScript, and Tailwind for continuous integration tracking.',
    },
    {
      id: 'repo_03',
      name: 'FastAPI-Production-Boilerplate',
      fullName: 'alexjohnson/FastAPI-Production-Boilerplate',
      description: 'Production-ready FastAPI starter template with Async SQLAlchemy 2.0, Alembic, Docker, and Pytest.',
      stars: 310,
      forks: 67,
      watchers: 310,
      primaryLanguage: 'Python',
      technologies: ['Python', 'FastAPI', 'Docker', 'PostgreSQL', 'Alembic'],
      topics: ['fastapi', 'boilerplate', 'python', 'docker', 'asyncio'],
      activityScore: 76,
      lastUpdated: 'Updated 2 weeks ago',
      isFork: false,
      htmlUrl: 'https://github.com/alexjohnson/FastAPI-Production-Boilerplate',
      readmeSnippet: 'Includes pre-configured JWT authentication, background tasks with Celery/Redis, structured logging, and OpenAPI documentation.',
    },
    {
      id: 'repo_04',
      name: 'CloudDeploy-CLI',
      fullName: 'alexjohnson/CloudDeploy-CLI',
      description: 'Zero-config CLI tool for deploying static and containerized microservices to AWS Elastic Beanstalk & ECS.',
      stars: 85,
      forks: 14,
      watchers: 85,
      primaryLanguage: 'TypeScript',
      technologies: ['TypeScript', 'Node.js', 'AWS SDK', 'Docker'],
      topics: ['devops', 'cli', 'aws', 'typescript', 'deployment'],
      activityScore: 62,
      lastUpdated: 'Updated last month',
      isFork: false,
      htmlUrl: 'https://github.com/alexjohnson/CloudDeploy-CLI',
    },
    {
      id: 'repo_05',
      name: 'DataStream-Pipeline',
      fullName: 'alexjohnson/DataStream-Pipeline',
      description: 'Distributed event processing pipeline using Kafka, PyTorch embeddings, and Redis caching.',
      stars: 56,
      forks: 9,
      watchers: 56,
      primaryLanguage: 'Python',
      technologies: ['Python', 'PyTorch', 'Redis', 'Kafka'],
      topics: ['data-pipeline', 'machine-learning', 'pytorch', 'redis'],
      activityScore: 54,
      lastUpdated: 'Updated 1 month ago',
      isFork: false,
      htmlUrl: 'https://github.com/alexjohnson/DataStream-Pipeline',
    },
    {
      id: 'repo_06',
      name: 'React-UI-DesignSystem',
      fullName: 'alexjohnson/React-UI-DesignSystem',
      description: 'Accessible dark-themed design system component library built with Tailwind CSS.',
      stars: 194,
      forks: 31,
      watchers: 194,
      primaryLanguage: 'TypeScript',
      technologies: ['TypeScript', 'React', 'TailwindCSS'],
      topics: ['design-system', 'react', 'storybook', 'accessibility'],
      activityScore: 82,
      lastUpdated: 'Updated 5 days ago',
      isFork: false,
      htmlUrl: 'https://github.com/alexjohnson/React-UI-DesignSystem',
    },
  ],

  collaboration: {
    pullRequests: 42,
    issuesOpened: 31,
    issuesResolved: 26,
    externalPRs: 8,
    contributors: 17,
    networkNodes: [
      { id: 'node_dev', label: '@alexjohnson', type: 'developer' },
      { id: 'node_repo1', label: 'SmartAisle', type: 'repo' },
      { id: 'node_repo2', label: 'DevPulse-Analytics', type: 'repo' },
      { id: 'node_c1', label: '@sarah-m', type: 'contributor' },
      { id: 'node_c2', label: '@dave-k', type: 'contributor' },
      { id: 'node_c3', label: '@open-source-bot', type: 'contributor' },
    ],
    networkLinks: [
      { source: 'node_dev', target: 'node_repo1' },
      { source: 'node_dev', target: 'node_repo2' },
      { source: 'node_repo1', target: 'node_c1' },
      { source: 'node_repo1', target: 'node_c2' },
      { source: 'node_repo2', target: 'node_c3' },
    ],
    monthlyTrend: [
      { month: 'May', prs: 14, issues: 9, external: 2 },
      { month: 'Jun', prs: 9, issues: 6, external: 1 },
      { month: 'Jul', prs: 12, issues: 8, external: 3 },
      { month: 'Aug', prs: 10, issues: 5, external: 0 },
      { month: 'Sep', prs: 15, issues: 11, external: 2 },
      { month: 'Oct', prs: 4, issues: 3, external: 0 },
    ],
  },

  rolePrediction: {
    predictedRole: 'Full Stack Developer',
    confidence: 0.82,
    secondaryRoles: [
      { role: 'Backend Developer', confidence: 0.11 },
      { role: 'Frontend Developer', confidence: 0.05 },
      { role: 'Data Scientist', confidence: 0.02 },
    ],
    whySignals: [
      'Strong React & TypeScript usage across 14 web repositories',
      'Consistent Node.js & FastAPI backend service implementations',
      'Database integration signals in PostgreSQL and MongoDB',
      'End-to-end full-stack repository architectures observed',
      'Balanced distribution of UI components and REST API backend code',
    ],
    disclaimer: 'Based on observed repository, language, and technology signals from public GitHub activity. Predictions reflect observed activity patterns rather than career capability.',
  },

  skillGroups: [
    {
      category: 'Programming',
      skills: [
        { name: 'TypeScript', exposureLevel: 88, repoCount: 14, status: 'Strong' },
        { name: 'Python', exposureLevel: 82, repoCount: 10, status: 'Strong' },
        { name: 'JavaScript', exposureLevel: 75, repoCount: 8, status: 'Strong' },
        { name: 'Java', exposureLevel: 45, repoCount: 3, status: 'Developing' },
        { name: 'C++', exposureLevel: 32, repoCount: 2, status: 'Developing' },
      ],
    },
    {
      category: 'Web',
      skills: [
        { name: 'React', exposureLevel: 85, repoCount: 12, status: 'Strong' },
        { name: 'Node.js', exposureLevel: 78, repoCount: 9, status: 'Strong' },
        { name: 'Express', exposureLevel: 70, repoCount: 6, status: 'Strong' },
        { name: 'FastAPI', exposureLevel: 65, repoCount: 5, status: 'Developing' },
        { name: 'TailwindCSS', exposureLevel: 80, repoCount: 10, status: 'Strong' },
      ],
    },
    {
      category: 'Data & AI',
      skills: [
        { name: 'Pandas', exposureLevel: 58, repoCount: 4, status: 'Developing' },
        { name: 'Scikit-learn', exposureLevel: 48, repoCount: 3, status: 'Developing' },
        { name: 'PyTorch', exposureLevel: 42, repoCount: 3, status: 'Developing' },
        { name: 'NumPy', exposureLevel: 52, repoCount: 4, status: 'Developing' },
      ],
    },
    {
      category: 'Cloud & DevOps',
      skills: [
        { name: 'Docker', exposureLevel: 64, repoCount: 7, status: 'Developing' },
        { name: 'AWS', exposureLevel: 58, repoCount: 5, status: 'Developing' },
        { name: 'GitHub Actions', exposureLevel: 55, repoCount: 6, status: 'Developing' },
        { name: 'Kubernetes', exposureLevel: 25, repoCount: 1, status: 'Recommended' },
      ],
    },
    {
      category: 'Databases',
      skills: [
        { name: 'PostgreSQL', exposureLevel: 72, repoCount: 8, status: 'Strong' },
        { name: 'MongoDB', exposureLevel: 54, repoCount: 4, status: 'Developing' },
        { name: 'Redis', exposureLevel: 48, repoCount: 3, status: 'Developing' },
      ],
    },
  ],

  skillGap: {
    targetRole: 'Full Stack Developer',
    strong: ['React', 'TypeScript', 'Node.js', 'REST APIs', 'PostgreSQL', 'TailwindCSS'],
    developing: ['FastAPI', 'Docker', 'AWS', 'PyTorch', 'GitHub Actions'],
    recommended: ['CI/CD Pipeline Optimization', 'System Design & Load Balancing', 'Container Orchestration (Kubernetes)', 'Automated End-to-End Testing'],
  },

  targetRoleOptions: [
    'Full Stack Developer',
    'Backend Developer',
    'Frontend Developer',
    'ML Engineer',
    'Data Scientist',
    'DevOps Engineer',
  ],

  recommendations: [
    {
      id: 'rec_01',
      skill: 'Docker',
      priority: 'High',
      why: 'Appears in several backend projects, but containerization configurations across repositories remain basic.',
      suggestedAction: 'Add multi-stage Docker builds and docker-compose configurations to your Python and Node.js projects.',
    },
    {
      id: 'rec_02',
      skill: 'AWS & Cloud Deployment',
      priority: 'Medium',
      why: 'Existing backend/cloud signals suggest AWS exposure. Formalizing cloud deployments will strengthen full-stack profile indicators.',
      suggestedAction: 'Implement Infrastructure-as-Code (Terraform or AWS CDK) for automated serverless or ECS deployments.',
    },
    {
      id: 'rec_03',
      skill: 'Automated Testing & CI/CD',
      priority: 'Medium',
      why: 'Repository activity shows limited visible automated test coverage across public pull requests.',
      suggestedAction: 'Integrate Pytest and Jest with GitHub Actions workflows on pull request triggers.',
    },
  ],

  growth: {
    repoTimeline: [
      { year: '2023', count: 6 },
      { year: '2024', count: 12 },
      { year: '2025', count: 18 },
      { year: '2026', count: 24 },
    ],
    techEvolution: [
      { year: '2023', technologies: ['JavaScript', 'HTML/CSS', 'React', 'Git'] },
      { year: '2024', technologies: ['TypeScript', 'Node.js', 'Express', 'MongoDB'] },
      { year: '2025', technologies: ['Python', 'FastAPI', 'PostgreSQL', 'Docker'] },
      { year: '2026', technologies: ['AWS', 'PyTorch', 'Redis', 'GitHub Actions'] },
    ],
    activityTrend: [
      { period: '2023 Q1', activity: 25 },
      { period: '2023 Q3', activity: 42 },
      { period: '2024 Q1', activity: 58 },
      { period: '2024 Q3', activity: 74 },
      { period: '2025 Q1', activity: 89 },
      { period: '2025 Q3', activity: 110 },
      { period: '2026 Q1', activity: 125 },
      { period: '2026 Q3', activity: 142 },
    ],
    collaborationTrend: [
      { period: '2024 Q1', prs: 8, issues: 5, external: 1 },
      { period: '2024 Q3', prs: 14, issues: 9, external: 2 },
      { period: '2025 Q1', prs: 22, issues: 14, external: 4 },
      { period: '2025 Q3', prs: 31, issues: 20, external: 6 },
      { period: '2026 Q1', prs: 38, issues: 26, external: 7 },
      { period: '2026 Q3', prs: 42, issues: 31, external: 8 },
    ],
  },
};
