export interface DeveloperProfile {
  id: string;
  username: string;
  name: string;
  avatarUrl: string;
  bio: string;
  company: string;
  location: string;
  website: string;
  predictedRole: string;
  roleConfidence: number;
  lastAnalyzed: string;
  stats: {
    publicRepos: number;
    publicReposTrend: string;
    techExposureCount: number;
    activeDaysThisYear: number;
    collaborationIndex: number;
    openSourceIndicator: number;
    followers: number;
    following: number;
  };
}

export interface MonthlyActivity {
  month: string;
  commits: number;
  pullRequests: number;
  issues: number;
  totalActivity: number;
}

export interface HeatmapDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface TechnologyItem {
  name: string;
  category: 'Languages' | 'Frameworks' | 'Databases' | 'Cloud & DevOps' | 'AI & Data';
  usagePercentage: number;
  repoCount: number;
  recentUsage: string;
  color: string;
}

export interface LanguageDistribution {
  name: string;
  percentage: number;
  bytes: number;
  color: string;
}

export interface Repository {
  id: string;
  name: string;
  fullName: string;
  description: string;
  stars: number;
  forks: number;
  watchers: number;
  primaryLanguage: string;
  technologies: string[];
  topics: string[];
  activityScore: number;
  lastUpdated: string;
  isFork: boolean;
  htmlUrl: string;
  readmeSnippet?: string;
}

export interface CollaborationStats {
  pullRequests: number;
  issuesOpened: number;
  issuesResolved: number;
  externalPRs: number;
  contributors: number;
  networkNodes: Array<{ id: string; label: string; type: 'developer' | 'repo' | 'contributor' }>;
  networkLinks: Array<{ source: string; target: string }>;
  monthlyTrend: Array<{ month: string; prs: number; issues: number; external: number }>;
}

export interface RolePredictionDetail {
  predictedRole: string;
  confidence: number;
  secondaryRoles: Array<{ role: string; confidence: number }>;
  whySignals: string[];
  disclaimer: string;
}

export interface SkillItem {
  name: string;
  exposureLevel: number;
  repoCount: number;
  status: 'Strong' | 'Developing' | 'Recommended';
}

export interface SkillCategoryGroup {
  category: 'Programming' | 'Web' | 'Data & AI' | 'Cloud & DevOps' | 'Databases';
  skills: SkillItem[];
}

export interface SkillGapAnalysis {
  targetRole: string;
  strong: string[];
  developing: string[];
  recommended: string[];
}

export interface Recommendation {
  id: string;
  skill: string;
  priority: 'High' | 'Medium' | 'Low';
  why: string;
  suggestedAction: string;
}

export interface GrowthAnalytics {
  repoTimeline: Array<{ year: string; count: number }>;
  techEvolution: Array<{ year: string; technologies: string[] }>;
  activityTrend: Array<{ period: string; activity: number }>;
  collaborationTrend: Array<{ period: string; prs: number; issues: number; external: number }>;
}

export interface CompleteDeveloperInsights {
  profile: DeveloperProfile;
  monthlyActivity: MonthlyActivity[];
  heatmapData: HeatmapDay[];
  technologies: TechnologyItem[];
  languages: LanguageDistribution[];
  repositories: Repository[];
  collaboration: CollaborationStats;
  rolePrediction: RolePredictionDetail;
  skillGroups: SkillCategoryGroup[];
  skillGap: SkillGapAnalysis;
  targetRoleOptions: string[];
  recommendations: Recommendation[];
  growth: GrowthAnalytics;
}
