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
 * Connects directly to FastAPI backend (`/api`), with resilient fallback to mock data
 * if the backend is unreachable or during offline development.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// In-memory cache to avoid duplicate network requests in the same session
const insightsCache: Record<string, CompleteDeveloperInsights> = {};

const STORAGE_KEY = 'devinsight_active_developer';

export function getActiveUsername(): string {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const fromUrl = urlParams.get('user');
    if (fromUrl && fromUrl.trim()) {
      return fromUrl.trim().toLowerCase();
    }
    const stored = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
    if (stored && stored.trim()) {
      return stored.trim().toLowerCase();
    }
  } catch {
    // SSR or restricted storage fallback
  }
  return 'octocat';
}

export function setActiveUsername(username: string): void {
  try {
    const clean = username.trim().toLowerCase();
    sessionStorage.setItem(STORAGE_KEY, clean);
    localStorage.setItem(STORAGE_KEY, clean);
  } catch {
    // Ignore storage errors
  }
}

/**
 * Generates an adapted mock profile when backend is offline or for preview.
 */
function getFallbackData(username: string): CompleteDeveloperInsights {
  const clean = username.trim().toLowerCase();
  const formattedName = clean.charAt(0).toUpperCase() + clean.slice(1);
  return {
    ...mockDeveloperData,
    profile: {
      ...mockDeveloperData.profile,
      username: clean,
      name: formattedName,
      avatarUrl: `https://avatars.githubusercontent.com/${clean}`,
    },
  };
}

/**
 * Trigger deep live GitHub ingestion and compute freshly analyzed developer intelligence.
 */
export async function analyzeDeveloper(username: string, maxRepos: number = 30): Promise<CompleteDeveloperInsights> {
  const cleanUser = username.trim().toLowerCase();
  setActiveUsername(cleanUser);

  try {
    const response = await fetch(`${API_BASE_URL}/analyze/${encodeURIComponent(cleanUser)}?max_repos=${maxRepos}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data: CompleteDeveloperInsights = await response.json();
      insightsCache[cleanUser] = data;
      return data;
    } else {
      console.warn(`Analysis API returned status ${response.status}. Attempting direct developer fetch...`);
      return await getDeveloperInsights(cleanUser, false);
    }
  } catch (error) {
    console.warn(`Could not reach backend analysis endpoint (${error}). Falling back to cached or demo profile.`);
    const fallback = getFallbackData(cleanUser);
    insightsCache[cleanUser] = fallback;
    return fallback;
  }
}

/**
 * Retrieve full developer intelligence insights for a user.
 */
export async function getDeveloperInsights(
  username?: string,
  forceRefresh: boolean = false
): Promise<CompleteDeveloperInsights> {
  const targetUser = (username || getActiveUsername()).trim().toLowerCase();

  // Return from in-memory cache if available and not forcing refresh
  if (!forceRefresh && insightsCache[targetUser]) {
    return insightsCache[targetUser];
  }

  try {
    if (forceRefresh) {
      return await analyzeDeveloper(targetUser);
    }

    const response = await fetch(`${API_BASE_URL}/developer/${encodeURIComponent(targetUser)}`);
    if (response.ok) {
      const data: CompleteDeveloperInsights = await response.json();
      insightsCache[targetUser] = data;
      setActiveUsername(targetUser);
      return data;
    } else if (response.status === 404) {
      // User not in DB yet: attempt on-the-fly analysis
      return await analyzeDeveloper(targetUser);
    }
  } catch (err) {
    console.warn(`Backend connection failed for developer insights: ${err}. Using fallback data.`);
  }

  const fallback = getFallbackData(targetUser);
  insightsCache[targetUser] = fallback;
  return fallback;
}

export async function getDeveloper(username?: string): Promise<DeveloperProfile> {
  const insights = await getDeveloperInsights(username);
  return insights.profile;
}

export async function getRepositories(username?: string): Promise<Repository[]> {
  const insights = await getDeveloperInsights(username);
  return insights.repositories;
}

export async function getSkills(username?: string): Promise<SkillCategoryGroup[]> {
  const insights = await getDeveloperInsights(username);
  return insights.skillGroups;
}

export async function getGrowth(username?: string): Promise<GrowthAnalytics> {
  const insights = await getDeveloperInsights(username);
  return insights.growth;
}
