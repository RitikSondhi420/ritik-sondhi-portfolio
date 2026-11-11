import React, { createContext, useContext, useEffect, useCallback, useMemo } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import type {
  PortfolioDataType,
  PersonalData,
  Experience,
  EducationItem,
  ArchitectureNode,
  MobilityData,
  LanguageItem,
} from '../data/portfolioData';
import { toggleTheme, setTheme } from '../store/slices/themeSlice';
import { loginAdmin, logout as logoutAction } from '../store/slices/authSlice';
import {
  fetchPortfolioFromBackend,
  resetPortfolioToDefaults,
  setEditMode as setEditModeAction,
  toggleEditMode as toggleEditModeAction,
  updatePersonal as updatePersonalAction,
  updateExperience as updateExperienceAction,
  addExperience as addExperienceAction,
  deleteExperience as deleteExperienceAction,
  updateSkill as updateSkillAction,
  addSkill as addSkillAction,
  deleteSkill as deleteSkillAction,
  updateArchitectureNode as updateArchitectureNodeAction,
  updateEducationItem as updateEducationItemAction,
  addEducationItem as addEducationItemAction,
  deleteEducationItem as deleteEducationItemAction,
  updateMobility as updateMobilityAction,
  addLanguage as addLanguageAction,
  deleteLanguage as deleteLanguageAction,
} from '../store/slices/portfolioSlice';

export interface PortfolioContextType {
  data: PortfolioDataType;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
  isLoggedIn: boolean;
  editMode: boolean;
  backendConnected: boolean;
  login: (username: string, password: string) => Promise<boolean>;
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
  resetToDefaults: () => Promise<void>;
  refreshFromBackend: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

const PortfolioBridge: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.theme);
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const { data, editMode, backendConnected } = useAppSelector((state) => state.portfolio);

  // Hydrate from backend on initial mount
  useEffect(() => {
    dispatch(fetchPortfolioFromBackend());
  }, [dispatch]);

  const handleToggleTheme = useCallback(() => {
    dispatch(toggleTheme());
  }, [dispatch]);

  const handleSetTheme = useCallback((mode: 'dark' | 'light') => {
    dispatch(setTheme(mode));
  }, [dispatch]);

  const handleLogin = useCallback(async (user: string, pass: string): Promise<boolean> => {
    const resultAction = await dispatch(loginAdmin({ user, pass }));
    if (loginAdmin.fulfilled.match(resultAction)) {
      dispatch(setEditModeAction(true));
      return true;
    }
    return false;
  }, [dispatch]);

  const handleLogout = useCallback(() => {
    dispatch(logoutAction());
    dispatch(setEditModeAction(false));
  }, [dispatch]);

  const handleToggleEditMode = useCallback(() => {
    if (isLoggedIn) {
      dispatch(toggleEditModeAction());
    }
  }, [dispatch, isLoggedIn]);

  const handleSetEditMode = useCallback((val: boolean) => {
    dispatch(setEditModeAction(val));
  }, [dispatch]);

  const handleUpdatePersonal = useCallback((fields: Partial<PersonalData>) => {
    dispatch(updatePersonalAction(fields));
  }, [dispatch]);

  const handleUpdateExperience = useCallback((id: string, updated: Partial<Experience>) => {
    dispatch(updateExperienceAction({ id, updated }));
  }, [dispatch]);

  const handleAddExperience = useCallback((newExp: Omit<Experience, 'id'>) => {
    dispatch(addExperienceAction(newExp));
  }, [dispatch]);

  const handleDeleteExperience = useCallback((id: string) => {
    dispatch(deleteExperienceAction(id));
  }, [dispatch]);

  const handleUpdateSkill = useCallback((categoryName: string, skillName: string, level: number) => {
    dispatch(updateSkillAction({ categoryName, skillName, level }));
  }, [dispatch]);

  const handleAddSkill = useCallback(
    (categoryName: string, skill: { name: string; level: number; featured?: boolean }) => {
      dispatch(addSkillAction({ categoryName, skill }));
    },
    [dispatch]
  );

  const handleDeleteSkill = useCallback((categoryName: string, skillName: string) => {
    dispatch(deleteSkillAction({ categoryName, skillName }));
  }, [dispatch]);

  const handleUpdateArchitectureNode = useCallback(
    (id: string, updated: Partial<ArchitectureNode>) => {
      dispatch(updateArchitectureNodeAction({ id, updated }));
    },
    [dispatch]
  );

  const handleUpdateEducationItem = useCallback(
    (id: string, updated: Partial<EducationItem>) => {
      dispatch(updateEducationItemAction({ id, updated }));
    },
    [dispatch]
  );

  const handleAddEducationItem = useCallback((newEdu: EducationItem) => {
    dispatch(addEducationItemAction(newEdu));
  }, [dispatch]);

  const handleDeleteEducationItem = useCallback((id: string) => {
    dispatch(deleteEducationItemAction(id));
  }, [dispatch]);

  const handleUpdateMobility = useCallback((updated: Partial<MobilityData>) => {
    dispatch(updateMobilityAction(updated));
  }, [dispatch]);

  const handleAddLanguage = useCallback((lang: LanguageItem) => {
    dispatch(addLanguageAction(lang));
  }, [dispatch]);

  const handleDeleteLanguage = useCallback((name: string) => {
    dispatch(deleteLanguageAction(name));
  }, [dispatch]);

  const handleResetToDefaults = useCallback(async () => {
    await dispatch(resetPortfolioToDefaults());
  }, [dispatch]);

  const handleRefreshFromBackend = useCallback(async () => {
    await dispatch(fetchPortfolioFromBackend());
  }, [dispatch]);

  const contextValue = useMemo<PortfolioContextType>(
    () => ({
      data,
      theme,
      toggleTheme: handleToggleTheme,
      setTheme: handleSetTheme,
      isLoggedIn,
      editMode,
      backendConnected,
      login: handleLogin,
      logout: handleLogout,
      toggleEditMode: handleToggleEditMode,
      setEditMode: handleSetEditMode,
      updatePersonal: handleUpdatePersonal,
      updateExperience: handleUpdateExperience,
      addExperience: handleAddExperience,
      deleteExperience: handleDeleteExperience,
      updateSkill: handleUpdateSkill,
      addSkill: handleAddSkill,
      deleteSkill: handleDeleteSkill,
      updateArchitectureNode: handleUpdateArchitectureNode,
      updateEducationItem: handleUpdateEducationItem,
      addEducationItem: handleAddEducationItem,
      deleteEducationItem: handleDeleteEducationItem,
      updateMobility: handleUpdateMobility,
      addLanguage: handleAddLanguage,
      deleteLanguage: handleDeleteLanguage,
      resetToDefaults: handleResetToDefaults,
      refreshFromBackend: handleRefreshFromBackend,
    }),
    [
      data,
      theme,
      handleToggleTheme,
      handleSetTheme,
      isLoggedIn,
      editMode,
      backendConnected,
      handleLogin,
      handleLogout,
      handleToggleEditMode,
      handleSetEditMode,
      handleUpdatePersonal,
      handleUpdateExperience,
      handleAddExperience,
      handleDeleteExperience,
      handleUpdateSkill,
      handleAddSkill,
      handleDeleteSkill,
      handleUpdateArchitectureNode,
      handleUpdateEducationItem,
      handleAddEducationItem,
      handleDeleteEducationItem,
      handleUpdateMobility,
      handleAddLanguage,
      handleDeleteLanguage,
      handleResetToDefaults,
      handleRefreshFromBackend,
    ]
  );

  return <PortfolioContext.Provider value={contextValue}>{children}</PortfolioContext.Provider>;
};

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Provider store={store}>
      <PortfolioBridge>{children}</PortfolioBridge>
    </Provider>
  );
};

export const usePortfolio = (): PortfolioContextType => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};

// Re-export Redux typed hooks for direct use
export { useAppDispatch, useAppSelector } from '../store/hooks';
export type { RootState, AppDispatch } from '../store';
