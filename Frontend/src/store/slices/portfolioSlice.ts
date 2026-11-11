import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { PORTFOLIO_DATA } from '../../data/portfolioData';
import type {
  PortfolioDataType,
  PersonalData,
  Experience,
  EducationItem,
  ArchitectureNode,
  MobilityData,
  LanguageItem,
} from '../../data/portfolioData';
import { api } from '../../services/api';
import type {
  PortfolioState,
  UpdateSkillPayload,
  AddSkillPayload,
  DeleteSkillPayload,
  UpdateExperiencePayload,
  UpdateArchitectureNodePayload,
  UpdateEducationItemPayload,
} from '../types';

const STORAGE_KEY = 'ritik_portfolio_data_v3';
const AUTH_KEY = 'ritik_portfolio_auth_v1';

export const normalizeArchitectureNode = (node: any): ArchitectureNode => {
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
  const icon: ArchitectureNode['icon'] = node.icon || iconMap[node.id] || 'service';

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

const persistLocalPortfolio = (data: PortfolioDataType) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
};

const getInitialPortfolioData = (): PortfolioDataType => {
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
};

const getInitialEditMode = (): boolean => {
  try {
    return localStorage.getItem(AUTH_KEY) === 'true';
  } catch {
    return false;
  }
};

const initialState: PortfolioState = {
  data: getInitialPortfolioData(),
  editMode: getInitialEditMode(),
  backendConnected: false,
  status: 'idle',
  error: null,
};

// Async thunk to hydrate data from NestJS + Redis aggregate API
export const fetchPortfolioFromBackend = createAsyncThunk<PortfolioDataType | null>(
  'portfolio/fetchFromBackend',
  async () => {
    const remote = await api.getPortfolio();
    return remote;
  }
);

// Async thunk to reset data to canonical defaults
export const resetPortfolioToDefaults = createAsyncThunk<void>(
  'portfolio/resetToDefaults',
  async () => {
    await api.resetPortfolio();
  }
);

export const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    setEditMode: (state, action: PayloadAction<boolean>) => {
      state.editMode = action.payload;
    },
    toggleEditMode: (state) => {
      state.editMode = !state.editMode;
    },
    setBackendConnected: (state, action: PayloadAction<boolean>) => {
      state.backendConnected = action.payload;
    },

    // Personal Bio Updates
    updatePersonal: (state, action: PayloadAction<Partial<PersonalData>>) => {
      state.data.personal = {
        ...state.data.personal,
        ...action.payload,
      };
      persistLocalPortfolio(state.data);
      api.updatePersonal(action.payload);
    },

    // Experience Updates
    updateExperience: (state, action: PayloadAction<UpdateExperiencePayload>) => {
      const { id, updated } = action.payload;
      state.data.experiences = state.data.experiences.map((exp) =>
        exp.id === id ? { ...exp, ...updated } : exp
      );
      persistLocalPortfolio(state.data);
      api.updateExperience(id, updated);
    },
    addExperience: (state, action: PayloadAction<Omit<Experience, 'id'>>) => {
      const newExp = action.payload;
      const id =
        newExp.company.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now();
      const createdExp: Experience = { ...newExp, id };
      state.data.experiences = [createdExp, ...state.data.experiences];
      persistLocalPortfolio(state.data);
      api.createExperience(createdExp);
    },
    deleteExperience: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.data.experiences = state.data.experiences.filter((exp) => exp.id !== id);
      persistLocalPortfolio(state.data);
      api.deleteExperience(id);
    },

    // Skills Updates
    updateSkill: (state, action: PayloadAction<UpdateSkillPayload>) => {
      const { categoryName, skillName, level } = action.payload;
      state.data.skillCategories = state.data.skillCategories.map((cat) => {
        if (cat.category !== categoryName) return cat;
        return {
          ...cat,
          skills: cat.skills.map((s) => (s.name === skillName ? { ...s, level } : s)),
        };
      });
      persistLocalPortfolio(state.data);
      api.addSkill(categoryName, { name: skillName, level });
    },
    addSkill: (state, action: PayloadAction<AddSkillPayload>) => {
      const { categoryName, skill } = action.payload;
      state.data.skillCategories = state.data.skillCategories.map((cat) => {
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
      });
      persistLocalPortfolio(state.data);
      api.addSkill(categoryName, skill);
    },
    deleteSkill: (state, action: PayloadAction<DeleteSkillPayload>) => {
      const { categoryName, skillName } = action.payload;
      state.data.skillCategories = state.data.skillCategories.map((cat) => {
        if (cat.category !== categoryName) return cat;
        return {
          ...cat,
          skills: cat.skills.filter((s) => s.name !== skillName),
        };
      });
      persistLocalPortfolio(state.data);
      api.deleteSkill(categoryName, skillName);
    },

    // Architecture Node Updates
    updateArchitectureNode: (
      state,
      action: PayloadAction<UpdateArchitectureNodePayload>
    ) => {
      const { id, updated } = action.payload;
      state.data.architectureNodes = state.data.architectureNodes.map((node) =>
        node.id === id ? { ...node, ...updated } : node
      );
      persistLocalPortfolio(state.data);
      api.updateArchitectureNode(id, updated);
    },

    // Education Updates
    updateEducationItem: (state, action: PayloadAction<UpdateEducationItemPayload>) => {
      const { id, updated } = action.payload;
      state.data.education = state.data.education.map((item) =>
        item.id === id ? { ...item, ...updated } : item
      );
      persistLocalPortfolio(state.data);
      api.updateEducation(id, updated);
    },
    addEducationItem: (state, action: PayloadAction<EducationItem>) => {
      const newEdu = action.payload;
      const id = newEdu.id || 'edu-' + Date.now();
      const createdItem: EducationItem = { ...newEdu, id };
      state.data.education = [createdItem, ...state.data.education];
      persistLocalPortfolio(state.data);
      api.createEducation(createdItem);
    },
    deleteEducationItem: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.data.education = state.data.education.filter((item) => item.id !== id);
      persistLocalPortfolio(state.data);
      api.deleteEducation(id);
    },

    // Mobility Updates
    updateMobility: (state, action: PayloadAction<Partial<MobilityData>>) => {
      state.data.mobility = {
        ...state.data.mobility,
        ...action.payload,
      };
      persistLocalPortfolio(state.data);
      api.updateMobility(action.payload);
    },

    // Language Updates
    addLanguage: (state, action: PayloadAction<LanguageItem>) => {
      const lang = action.payload;
      const exists = state.data.personal.languages.some(
        (l) => l.name.toLowerCase() === lang.name.toLowerCase()
      );
      if (!exists) {
        state.data.personal.languages = [...state.data.personal.languages, lang];
        persistLocalPortfolio(state.data);
        api.addLanguage(lang);
      }
    },
    deleteLanguage: (state, action: PayloadAction<string>) => {
      const name = action.payload;
      state.data.personal.languages = state.data.personal.languages.filter(
        (l) => l.name.toLowerCase() !== name.toLowerCase()
      );
      persistLocalPortfolio(state.data);
      api.deleteLanguage(name);
    },
  },
  extraReducers: (builder) => {
    builder
      // Hydrate from backend
      .addCase(fetchPortfolioFromBackend.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPortfolioFromBackend.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const remote = action.payload;
        if (remote && remote.personal) {
          state.backendConnected = true;
          state.data = {
            ...state.data,
            personal: {
              ...state.data.personal,
              ...remote.personal,
              experienceYears:
                remote.personal.experienceYears ||
                state.data.personal.experienceYears ||
                '3+',
              languages: remote.personal.languages || state.data.personal.languages,
              metrics: remote.personal.metrics || state.data.personal.metrics,
            },
            experiences: remote.experiences?.length
              ? remote.experiences
              : state.data.experiences,
            skillCategories: remote.skillCategories?.length
              ? remote.skillCategories
              : state.data.skillCategories,
            architectureNodes: remote.architectureNodes?.length
              ? remote.architectureNodes.map(normalizeArchitectureNode)
              : state.data.architectureNodes,
            education: remote.education?.length
              ? remote.education
              : state.data.education,
            mobility: remote.mobility ? remote.mobility : state.data.mobility,
          };
          persistLocalPortfolio(state.data);
        }
      })
      .addCase(fetchPortfolioFromBackend.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch from backend';
      })
      // Reset to defaults
      .addCase(resetPortfolioToDefaults.fulfilled, (state) => {
        state.data = PORTFOLIO_DATA;
        persistLocalPortfolio(PORTFOLIO_DATA);
      });
  },
});

export const {
  setEditMode,
  toggleEditMode,
  setBackendConnected,
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
} = portfolioSlice.actions;

export default portfolioSlice.reducer;
