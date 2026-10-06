import { mockDeveloperData } from '../data/mockDeveloper';
import type {
  CompleteDeveloperInsights,
  DeveloperProfile,
  Repository,
  SkillCategoryGroup,
  GrowthAnalytics,
} from '../types/developer';

/**
 * DevInsight AI API Service Layer.
 * Currently uses mock data. Will later integrate directly with FastAPI endpoints.
 */

// Simulated async delay to emulate REST API roundtrip
const simulateDelay = (ms: number = 400): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function analyzeDeveloper(username: string): Promise<CompleteDeveloperInsights> {
  await simulateDelay(1200); // Slightly longer for analysis animation simulation
  return {
    ...mockDeveloperData,
    profile: {
      ...mockDeveloperData.profile,
      username: username.toLowerCase(),
      name: username.charAt(0).toUpperCase() + username.slice(1) + ' (Analyzed)',
    },
  };
}

export async function getDeveloper(username?: string): Promise<DeveloperProfile> {
  await simulateDelay(300);
  if (username && username.toLowerCase() !== mockDeveloperData.profile.username) {
    return {
      ...mockDeveloperData.profile,
      username: username.toLowerCase(),
      name: username.charAt(0).toUpperCase() + username.slice(1),
    };
  }
  return mockDeveloperData.profile;
}

export async function getDeveloperInsights(_username?: string): Promise<CompleteDeveloperInsights> {
  await simulateDelay(400);
  return mockDeveloperData;
}

export async function getRepositories(_username?: string): Promise<Repository[]> {
  await simulateDelay(300);
  return mockDeveloperData.repositories;
}

export async function getSkills(_username?: string): Promise<SkillCategoryGroup[]> {
  await simulateDelay(300);
  return mockDeveloperData.skillGroups;
}

export async function getGrowth(_username?: string): Promise<GrowthAnalytics> {
  await simulateDelay(300);
  return mockDeveloperData.growth;
}
