/**
 * Portfolio Backend API Client
 * Connects React Frontend to the NestJS + PostgreSQL + Redis backend.
 * Provides resilient fallbacks and JWT token persistence.
 */

const API_BASE = (import.meta.env.VITE_API_BASE as string) || 'http://localhost:3001/api';
const JWT_STORAGE_KEY = 'ritik_portfolio_jwt';

export interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  error?: string;
  [key: string]: any;
}

class ApiService {
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    try {
      const token = localStorage.getItem(JWT_STORAGE_KEY);
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    } catch {
      // localStorage may fail in restricted environments
    }
    return headers;
  }

  // --- Portfolio Aggregate Endpoint (Redis-cached) ---
  async getPortfolio(): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/portfolio`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('API getPortfolio failed, falling back to local dataset:', err);
      return null;
    }
  }

  // --- Reset Entire Portfolio to Defaults ---
  async resetPortfolio(): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/portfolio/reset`, {
        method: 'POST',
        headers: this.getHeaders(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('API resetPortfolio failed:', err);
      return null;
    }
  }

  // --- Authentication ---
  async login(username: string, password: string): Promise<{ success: boolean; token?: string; user?: any }> {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.accessToken) {
        localStorage.setItem(JWT_STORAGE_KEY, data.accessToken);
        return { success: true, token: data.accessToken, user: data.user };
      }
      return { success: false };
    } catch (err) {
      console.warn('Backend login request failed:', err);
      // Fallback verification for offline local development
      const trimmedUser = username.trim().toLowerCase();
      const trimmedPass = password.trim();
      const valid =
        (trimmedUser === 'ritik' || trimmedUser === 'admin' || trimmedUser === 'sondhiritik666@gmail.com') &&
        trimmedPass === '$Ritik5$Portfolio9$';
      return { success: valid };
    }
  }

  logout() {
    try {
      localStorage.removeItem(JWT_STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  // --- Personal Profile ---
  async updatePersonal(fields: any): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/personal`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(fields),
      });
      return await res.json();
    } catch (err) {
      console.warn('API updatePersonal failed:', err);
      return null;
    }
  }

  // --- Experience Matrix ---
  async createExperience(exp: any): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/experience`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(exp),
      });
      return await res.json();
    } catch (err) {
      console.warn('API createExperience failed:', err);
      return null;
    }
  }

  async updateExperience(id: string, exp: any): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/experience/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(exp),
      });
      return await res.json();
    } catch (err) {
      console.warn(`API updateExperience (${id}) failed:`, err);
      return null;
    }
  }

  async deleteExperience(id: string): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/experience/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
      return await res.json();
    } catch (err) {
      console.warn(`API deleteExperience (${id}) failed:`, err);
      return null;
    }
  }

  // --- Skills Bento ---
  async addSkill(category: string, skill: { name: string; level: number; featured?: boolean }): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/skills`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ category, ...skill }),
      });
      return await res.json();
    } catch (err) {
      console.warn('API addSkill failed:', err);
      return null;
    }
  }

  async deleteSkill(category: string, skillName: string): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/skills`, {
        method: 'DELETE',
        headers: this.getHeaders(),
        body: JSON.stringify({ category, name: skillName }),
      });
      return await res.json();
    } catch (err) {
      console.warn('API deleteSkill failed:', err);
      return null;
    }
  }

  // --- Architecture Nodes ---
  async updateArchitectureNode(id: string, node: any): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/architecture/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(node),
      });
      return await res.json();
    } catch (err) {
      console.warn(`API updateArchitectureNode (${id}) failed:`, err);
      return null;
    }
  }

  // --- Education Items ---
  async createEducation(edu: any): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/education`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(edu),
      });
      return await res.json();
    } catch (err) {
      console.warn('API createEducation failed:', err);
      return null;
    }
  }

  async updateEducation(id: string, edu: any): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/education/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(edu),
      });
      return await res.json();
    } catch (err) {
      console.warn(`API updateEducation (${id}) failed:`, err);
      return null;
    }
  }

  async deleteEducation(id: string): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/education/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
      return await res.json();
    } catch (err) {
      console.warn(`API deleteEducation (${id}) failed:`, err);
      return null;
    }
  }

  // --- Mobility Passport ---
  async updateMobility(mobility: any): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/mobility`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(mobility),
      });
      return await res.json();
    } catch (err) {
      console.warn('API updateMobility failed:', err);
      return null;
    }
  }

  // --- Languages ---
  async addLanguage(lang: { name: string; proficiency: string }): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/languages`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(lang),
      });
      return await res.json();
    } catch (err) {
      console.warn('API addLanguage failed:', err);
      return null;
    }
  }

  async deleteLanguage(name: string): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/languages/${encodeURIComponent(name)}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
      return await res.json();
    } catch (err) {
      console.warn(`API deleteLanguage (${name}) failed:`, err);
      return null;
    }
  }

  // --- Contact Inquiries ---
  async submitInquiry(inquiry: { name: string; email: string; company?: string; message: string }): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiry),
      });
      return await res.json();
    } catch (err) {
      console.warn('API submitInquiry failed:', err);
      return { success: true, localOnly: true };
    }
  }
}

export const api = new ApiService();
