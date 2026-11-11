import type {
  PortfolioDataType,
  Experience,
  EducationItem,
  ArchitectureNode,
  SkillItem,
} from '../data/portfolioData';

export type {
  PortfolioDataType,
  PersonalData,
  Experience,
  EducationItem,
  ArchitectureNode,
  MobilityData,
  LanguageItem,
  SkillItem,
} from '../data/portfolioData';

export type ThemeMode = 'dark' | 'light';

export interface ThemeState {
  theme: ThemeMode;
}

export interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export interface PortfolioState {
  data: PortfolioDataType;
  editMode: boolean;
  backendConnected: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export interface UpdateSkillPayload {
  categoryName: string;
  skillName: string;
  level: number;
}

export interface AddSkillPayload {
  categoryName: string;
  skill: SkillItem;
}

export interface DeleteSkillPayload {
  categoryName: string;
  skillName: string;
}

export interface UpdateExperiencePayload {
  id: string;
  updated: Partial<Experience>;
}

export interface UpdateArchitectureNodePayload {
  id: string;
  updated: Partial<ArchitectureNode>;
}

export interface UpdateEducationItemPayload {
  id: string;
  updated: Partial<EducationItem>;
}
