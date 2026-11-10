import * as fs from 'fs';
import * as path from 'path';
import { CANONICAL_PORTFOLIO } from './default-portfolio';

export interface PortfolioStoreData {
  personal: any;
  experiences: any[];
  skillCategories: any[];
  architectureNodes: any[];
  education: any[];
  mobility: any;
  languages: any[];
}

export const DEFAULT_STORE_DATA: PortfolioStoreData = JSON.parse(JSON.stringify(CANONICAL_PORTFOLIO));

class PersistentPortfolioStore {
  private data: PortfolioStoreData;
  private readonly storeFilePath: string;

  constructor() {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      try {
        fs.mkdirSync(dataDir, { recursive: true });
      } catch {
        // ignore
      }
    }
    this.storeFilePath = path.join(dataDir, 'portfolio-store.json');
    this.data = this.loadFromDisk();
  }

  private loadFromDisk(): PortfolioStoreData {
    try {
      if (fs.existsSync(this.storeFilePath)) {
        const raw = fs.readFileSync(this.storeFilePath, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          ...DEFAULT_STORE_DATA,
          ...parsed,
          personal: {
            ...DEFAULT_STORE_DATA.personal,
            ...parsed.personal,
          },
        };
      }
    } catch (err) {
      console.warn('Failed to read portfolio-store.json from disk:', err);
    }
    return JSON.parse(JSON.stringify(DEFAULT_STORE_DATA));
  }

  private saveToDisk() {
    try {
      fs.writeFileSync(this.storeFilePath, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.warn('Failed to write portfolio-store.json to disk:', err);
    }
  }

  getStore(): PortfolioStoreData {
    return this.data;
  }

  resetToDefaults(): PortfolioStoreData {
    this.data = JSON.parse(JSON.stringify(CANONICAL_PORTFOLIO));
    this.saveToDisk();
    return this.data;
  }

  updatePersonal(updateDto: any) {
    this.data.personal = {
      ...this.data.personal,
      ...updateDto,
    };
    this.saveToDisk();
    return this.data.personal;
  }

  createExperience(exp: any) {
    const id = exp.id || `exp-${Date.now()}`;
    const newExp = {
      ...exp,
      id,
      architecturePattern: exp.architectureHighlights || exp.architecturePattern || '',
      architectureHighlights: exp.architectureHighlights || exp.architecturePattern || '',
      deliverables: exp.deliverables || exp.achievements || [],
    };
    this.data.experiences = [newExp, ...this.data.experiences.filter((e) => e.id !== id)];
    this.saveToDisk();
    return newExp;
  }

  updateExperience(id: string, updated: any) {
    this.data.experiences = this.data.experiences.map((exp) => {
      if (exp.id === id) {
        return {
          ...exp,
          ...updated,
          architecturePattern: updated.architectureHighlights || updated.architecturePattern || exp.architecturePattern,
          architectureHighlights: updated.architectureHighlights || updated.architecturePattern || exp.architectureHighlights,
        };
      }
      return exp;
    });
    this.saveToDisk();
    return this.data.experiences.find((e) => e.id === id) || { id, ...updated };
  }

  deleteExperience(id: string) {
    this.data.experiences = this.data.experiences.filter((exp) => exp.id !== id);
    this.saveToDisk();
    return { success: true, deletedId: id };
  }

  addSkill(categoryName: string, skill: { name: string; level: number; featured?: boolean }) {
    let cat = this.data.skillCategories.find((c) => c.category === categoryName);
    if (!cat) {
      cat = { category: categoryName, skills: [], order: this.data.skillCategories.length + 1 };
      this.data.skillCategories.push(cat);
    }
    const existingIdx = cat.skills.findIndex(
      (s: any) => s.name.toLowerCase() === skill.name.toLowerCase(),
    );
    if (existingIdx >= 0) {
      cat.skills[existingIdx] = { ...cat.skills[existingIdx], ...skill };
    } else {
      cat.skills.push(skill);
    }
    this.saveToDisk();
    return skill;
  }

  deleteSkill(categoryName: string, skillName: string) {
    const cat = this.data.skillCategories.find((c) => c.category === categoryName);
    if (cat) {
      cat.skills = cat.skills.filter((s: any) => s.name !== skillName);
      this.saveToDisk();
    }
    return { success: true };
  }

  updateArchitectureNode(id: string, updated: any) {
    const metricVal = updated.metrics?.value || updated.metric || 'Active';
    const metricLbl = updated.metrics?.label || updated.metricLabel || 'Performance';
    const patterns = updated.engineeringPatterns || updated.patterns || [];
    const icon = updated.icon || (id === 'client' ? 'client' : id === 'gateway' ? 'gateway' : id === 'service' ? 'service' : id === 'database' ? 'database' : 'cicd');

    const existingIdx = this.data.architectureNodes.findIndex((n) => n.id === id);
    const nodeObj = {
      id,
      title: updated.title,
      subtitle: updated.subtitle,
      icon,
      metric: metricVal,
      metricLabel: metricLbl,
      metrics: { label: metricLbl, value: metricVal },
      description: updated.description,
      patterns,
      engineeringPatterns: patterns,
    };

    if (existingIdx >= 0) {
      this.data.architectureNodes[existingIdx] = {
        ...this.data.architectureNodes[existingIdx],
        ...nodeObj,
      };
    } else {
      this.data.architectureNodes.push(nodeObj);
    }
    this.saveToDisk();
    return nodeObj;
  }

  createEducation(edu: any) {
    const id = edu.id || `edu-${Date.now()}`;
    const item = { ...edu, id };
    this.data.education.push(item);
    this.saveToDisk();
    return item;
  }

  updateEducation(id: string, updated: any) {
    this.data.education = this.data.education.map((item) =>
      item.id === id || item.degree === id ? { ...item, ...updated } : item,
    );
    this.saveToDisk();
    return { id, ...updated };
  }

  deleteEducation(id: string) {
    this.data.education = this.data.education.filter((item) => item.id !== id && item.degree !== id);
    this.saveToDisk();
    return { success: true };
  }

  updateMobility(updated: any) {
    this.data.mobility = {
      ...this.data.mobility,
      ...updated,
    };
    this.saveToDisk();
    return this.data.mobility;
  }

  addLanguage(lang: { name: string; proficiency: string }) {
    const existingIdx = this.data.languages.findIndex(
      (l) => l.name.toLowerCase() === lang.name.toLowerCase(),
    );
    if (existingIdx >= 0) {
      this.data.languages[existingIdx] = lang;
    } else {
      this.data.languages.push(lang);
    }
    if (this.data.personal) {
      this.data.personal.languages = this.data.languages;
    }
    this.saveToDisk();
    return lang;
  }

  deleteLanguage(name: string) {
    this.data.languages = this.data.languages.filter(
      (l) => l.name.toLowerCase() !== name.toLowerCase(),
    );
    if (this.data.personal) {
      this.data.personal.languages = this.data.languages;
    }
    this.saveToDisk();
    return { success: true };
  }
}

export const portfolioStore = new PersistentPortfolioStore();
