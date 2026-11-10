import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import type {
  PortfolioDataType,
  PersonalData,
  Experience,
  EducationItem,
  ArchitectureNode,
  MobilityData,
  LanguageItem,
} from '../data/portfolioData';
import { api } from '../services/api';

interface PortfolioContextType {
  data: PortfolioDataType;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  isLoggedIn: boolean;
  editMode: boolean;
  backendConnected: boolean;
  login: (username: string, password: string) => Promise<boolean> | boolean;
  logout: () => void;
  toggleEditMode: () => void;
  setEditMode: (val: boolean) => void;
  updatePersonal: (fields: Partial<PersonalData>) => void;
  updateExperience: (id: string, updated: Partial<Experience>) => void;
  addExperience: (newExp: Omit<Experience, 'id'>) => void;
  deleteExperience: (id: string) => void;
  updateSkill: (category: string, skillName: string, level: number) => void;
  addSkill: (category: string, skill: { name: string; level: number; featured?: boolean }) => void;
  deleteSkill: (category: string, skillName: string) => void;
  updateArchitectureNode: (id: string, updated: Partial<ArchitectureNode>) => void;
  updateEducationItem: (id: string, updated: Partial<EducationItem>) => void;
  addEducationItem: (newEdu: EducationItem) => void;
  deleteEducationItem: (id: string) => void;
  updateMobility: (updated: Partial<MobilityData>) => void;
  addLanguage: (lang: LanguageItem) => void;
  deleteLanguage: (name: string) => void;
  resetToDefaults: () => Promise<void> | void;
  refreshFromBackend: () => Promise<void>;
}

const STORAGE_KEY = 'ritik_portfolio_data_v2';
const AUTH_KEY = 'ritik_portfolio_auth_v1';
const THEME_KEY = 'ritik_portfolio_theme_v1';

const normalizeArchitectureNode = (node: any): ArchitectureNode => {
  const iconMap: Record<string, ArchitectureNode['icon']> = {
    'client-tier': 'client',
    'api-gateway': 'gateway',
    'service-layer': 'service',
    'data-engine': 'database',
    'cicd-pipeline': 'cicd',
  };

  const metricValue = node.metrics?.value || node.metric || 'Active';
  const metricLabel = node.metrics?.label || node.metricLabel || 'Performance';
  const patterns = node.engineeringPatterns || node.patterns || [];
  const icon = node.icon || iconMap[node.id] || 'service';

  return {
    id: node.id,
    title: node.title,
    subtitle: node.subtitle,
    icon,
    metrics: {
      label: metricLabel,
      value: metricValue,
    },
    description: node.description || '',
    engineeringPatterns: patterns,
  };
};

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioDataType>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const rawNodes = parsed.architectureNodes || PORTFOLIO_DATA.architectureNodes;
        return {
          ...PORTFOLIO_DATA,
          ...parsed,
          architectureNodes: Array.isArray(rawNodes)
            ? rawNodes.map(normalizeArchitectureNode)
            : PORTFOLIO_DATA.architectureNodes,
          mobility: parsed.mobility || PORTFOLIO_DATA.mobility,
        };
      }
    } catch {
      // fallback
    }
    return PORTFOLIO_DATA;
  });

  const [backendConnected, setBackendConnected] = useState<boolean>(false);

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
      }
    } catch {
      // fallback
    }
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // fallback
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem(AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [editMode, setEditMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem(AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Fetch initial data from NestJS + Redis aggregate API on mount
  const refreshFromBackend = useCallback(async () => {
    try {
      const remote = await api.getPortfolio();
      if (remote && remote.personal) {
        setBackendConnected(true);
        setData((prev) => ({
          ...prev,
          personal: {
            ...prev.personal,
            ...remote.personal,
            experienceYears: remote.personal.experienceYears || prev.personal.experienceYears || '3+',
            languages: remote.personal.languages || prev.personal.languages,
            metrics: remote.personal.metrics || prev.personal.metrics,
          },
          experiences: remote.experiences?.length ? remote.experiences : prev.experiences,
          skillCategories: remote.skillCategories?.length ? remote.skillCategories : prev.skillCategories,
          architectureNodes: remote.architectureNodes?.length
            ? remote.architectureNodes.map(normalizeArchitectureNode)
            : prev.architectureNodes,
          education: remote.education?.length ? remote.education : prev.education,
          mobility: remote.mobility ? remote.mobility : prev.mobility,
        }));
      }
    } catch (err) {
      console.warn('Backend hydration notice:', err);
    }
  }, []);

  useEffect(() => {
    refreshFromBackend();
  }, [refreshFromBackend]);

  // Persist local copy to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore
    }
  }, [data]);

  const login = async (user: string, pass: string): Promise<boolean> => {
    const result = await api.login(user, pass);
    if (result.success) {
      setIsLoggedIn(true);
      setEditMode(true);
      localStorage.setItem(AUTH_KEY, 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    api.logout();
    setIsLoggedIn(false);
    setEditMode(false);
    localStorage.removeItem(AUTH_KEY);
  };

  const toggleEditMode = () => {
    if (isLoggedIn) {
      setEditMode((prev) => !prev);
    }
  };

  const updatePersonal = (fields: Partial<PersonalData>) => {
    setData((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        ...fields,
      },
    }));
    // Async backend mutation
    api.updatePersonal(fields);
  };

  const updateExperience = (id: string, updated: Partial<Experience>) => {
    setData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) =>
        exp.id === id ? { ...exp, ...updated } : exp
      ),
    }));
    // Async backend mutation
    api.updateExperience(id, updated);
  };

  const addExperience = (newExp: Omit<Experience, 'id'>) => {
    const id = newExp.company.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now();
    const createdExp = { ...newExp, id };
    setData((prev) => ({
      ...prev,
      experiences: [createdExp, ...prev.experiences],
    }));
    // Async backend mutation
    api.createExperience(createdExp);
  };

  const deleteExperience = (id: string) => {
    setData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((exp) => exp.id !== id),
    }));
    // Async backend mutation
    api.deleteExperience(id);
  };

  const updateSkill = (categoryName: string, skillName: string, level: number) => {
    setData((prev) => ({
      ...prev,
      skillCategories: prev.skillCategories.map((cat) => {
        if (cat.category !== categoryName) return cat;
        return {
          ...cat,
          skills: cat.skills.map((s) => (s.name === skillName ? { ...s, level } : s)),
        };
      }),
    }));
    // Async backend mutation
    api.addSkill(categoryName, { name: skillName, level });
  };

  const addSkill = (categoryName: string, skill: { name: string; level: number; featured?: boolean }) => {
    setData((prev) => ({
      ...prev,
      skillCategories: prev.skillCategories.map((cat) => {
        if (cat.category !== categoryName) return cat;
        if (cat.skills.some((s) => s.name.toLowerCase() === skill.name.toLowerCase())) {
          return {
            ...cat,
            skills: cat.skills.map((s) =>
              s.name.toLowerCase() === skill.name.toLowerCase()
                ? { ...s, level: skill.level, featured: skill.featured }
                : s
            ),
          };
        }
        return {
          ...cat,
          skills: [...cat.skills, skill],
        };
      }),
    }));
    // Async backend mutation
    api.addSkill(categoryName, skill);
  };

  const deleteSkill = (categoryName: string, skillName: string) => {
    setData((prev) => ({
      ...prev,
      skillCategories: prev.skillCategories.map((cat) => {
        if (cat.category !== categoryName) return cat;
        return {
          ...cat,
          skills: cat.skills.filter((s) => s.name !== skillName),
        };
      }),
    }));
    // Async backend mutation
    api.deleteSkill(categoryName, skillName);
  };

  const updateArchitectureNode = (id: string, updated: Partial<ArchitectureNode>) => {
    setData((prev) => ({
      ...prev,
      architectureNodes: prev.architectureNodes.map((node) =>
        node.id === id ? { ...node, ...updated } : node
      ),
    }));
    // Async backend mutation
    api.updateArchitectureNode(id, updated);
  };

  const updateEducationItem = (id: string, updated: Partial<EducationItem>) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.map((edu) =>
        (edu.id === id || edu.degree === id) ? { ...edu, ...updated } : edu
      ),
    }));
    // Async backend mutation
    api.updateEducation(id, updated);
  };

  const addEducationItem = (newEdu: EducationItem) => {
    const id = newEdu.id || 'edu-' + Date.now();
    const itemWithId = { ...newEdu, id };
    setData((prev) => ({
      ...prev,
      education: [...prev.education, itemWithId],
    }));
    // Async backend mutation
    api.createEducation(itemWithId);
  };

  const deleteEducationItem = (id: string) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id && edu.degree !== id),
    }));
    // Async backend mutation
    api.deleteEducation(id);
  };

  const updateMobility = (updated: Partial<MobilityData>) => {
    setData((prev) => ({
      ...prev,
      mobility: {
        ...prev.mobility,
        ...updated,
      },
    }));
    // Async backend mutation
    api.updateMobility(updated);
  };

  const addLanguage = (lang: LanguageItem) => {
    setData((prev) => {
      const exists = prev.personal.languages.some(
        (l) => l.name.toLowerCase() === lang.name.toLowerCase()
      );
      return {
        ...prev,
        personal: {
          ...prev.personal,
          languages: exists
            ? prev.personal.languages.map((l) =>
                l.name.toLowerCase() === lang.name.toLowerCase() ? lang : l
              )
            : [...prev.personal.languages, lang],
        },
      };
    });
    // Async backend mutation
    api.addLanguage(lang);
  };

  const deleteLanguage = (name: string) => {
    setData((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        languages: prev.personal.languages.filter((l) => l.name !== name),
      },
    }));
    // Async backend mutation
    api.deleteLanguage(name);
  };

  const resetToDefaults = async () => {
    try {
      const res = await api.resetPortfolio();
      if (res && (res.data || res.personal)) {
        const payload = res.data || res;
        const normalized: PortfolioDataType = {
          personal: {
            ...PORTFOLIO_DATA.personal,
            ...payload.personal,
            experienceYears: payload.personal?.experienceYears || PORTFOLIO_DATA.personal.experienceYears,
            languages: payload.personal?.languages || PORTFOLIO_DATA.personal.languages,
            metrics: payload.personal?.metrics || PORTFOLIO_DATA.personal.metrics,
          },
          experiences: payload.experiences?.length ? payload.experiences : PORTFOLIO_DATA.experiences,
          skillCategories: payload.skillCategories?.length ? payload.skillCategories : PORTFOLIO_DATA.skillCategories,
          architectureNodes: payload.architectureNodes?.length
            ? payload.architectureNodes.map(normalizeArchitectureNode)
            : PORTFOLIO_DATA.architectureNodes,
          education: payload.education?.length ? payload.education : PORTFOLIO_DATA.education,
          mobility: payload.mobility || PORTFOLIO_DATA.mobility,
        };
        setData(normalized);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
        return;
      }
    } catch (err) {
      console.warn('Backend reset call failed, falling back to local canonical data:', err);
    }

    setData(PORTFOLIO_DATA);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(PORTFOLIO_DATA));
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        theme,
        toggleTheme,
        isLoggedIn,
        editMode,
        backendConnected,
        login,
        logout,
        toggleEditMode,
        setEditMode,
        updatePersonal,
        updateExperience,
        addExperience,
        deleteExperience,
        updateSkill,
        addSkill,
        deleteSkill,
        updateArchitectureNode,
        updateEducationItem,
        addEducationItem,
        deleteEducationItem,
        updateMobility,
        addLanguage,
        deleteLanguage,
        resetToDefaults,
        refreshFromBackend,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = (): PortfolioContextType => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
