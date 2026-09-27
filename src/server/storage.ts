import fs from 'fs';
import path from 'path';
import { ComponentDefinition, UploadComponentPayload, UserAccount } from '../types/registry';
import { INITIAL_COMPONENTS } from './seedData';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const COMPONENTS_FILE = path.join(DATA_DIR, 'components.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

const INITIAL_USERS: UserAccount[] = [
  {
    id: 'user-admin',
    email: 'admin@techinject.internal',
    name: 'Platform Administrator',
    role: 'admin',
    isPremium: true,
    apiKey: 'tech_adm_sec_9942a7',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-free',
    email: 'free@customer.com',
    name: 'Jordan (Free Tier)',
    role: 'customer',
    isPremium: false,
    apiKey: 'tech_cli_free_0884b2',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-premium',
    email: 'premium@customer.com',
    name: 'Taylor (Enterprise License)',
    role: 'customer',
    isPremium: true,
    apiKey: 'tech_cli_prem_1884c9',
    createdAt: new Date().toISOString(),
  },
];

class StorageManager {
  private components: Map<string, ComponentDefinition> = new Map();
  private users: Map<string, UserAccount> = new Map();

  constructor() {
    this.ensureInitialized();
  }

  private ensureInitialized() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    // Load or seed components
    if (fs.existsSync(COMPONENTS_FILE)) {
      try {
        const raw = fs.readFileSync(COMPONENTS_FILE, 'utf-8');
        const list: ComponentDefinition[] = JSON.parse(raw);
        list.forEach((c) => this.components.set(c.slug, c));
      } catch (err) {
        console.error('Failed reading components file, resetting to seeds:', err);
        this.resetComponents();
      }
    } else {
      this.resetComponents();
    }

    // Load or seed users
    if (fs.existsSync(USERS_FILE)) {
      try {
        const raw = fs.readFileSync(USERS_FILE, 'utf-8');
        const list: UserAccount[] = JSON.parse(raw);
        list.forEach((u) => this.users.set(u.id, u));
      } catch (err) {
        console.error('Failed reading users file, resetting to seeds:', err);
        this.resetUsers();
      }
    } else {
      this.resetUsers();
    }
  }

  private persistComponents() {
    try {
      const arr = Array.from(this.components.values());
      fs.writeFileSync(COMPONENTS_FILE, JSON.stringify(arr, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed persisting components:', err);
    }
  }

  private persistUsers() {
    try {
      const arr = Array.from(this.users.values());
      fs.writeFileSync(USERS_FILE, JSON.stringify(arr, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed persisting users:', err);
    }
  }

  public resetComponents() {
    this.components.clear();
    INITIAL_COMPONENTS.forEach((c) => this.components.set(c.slug, { ...c }));
    this.persistComponents();
  }

  public resetUsers() {
    this.users.clear();
    INITIAL_USERS.forEach((u) => this.users.set(u.id, { ...u }));
    this.persistUsers();
  }

  // Component Methods
  public listComponents(includePrivate = false): ComponentDefinition[] {
    const all = Array.from(this.components.values());
    if (includePrivate) return all;
    return all.filter((c) => c.status === 'published');
  }

  public getComponent(slug: string): ComponentDefinition | undefined {
    return this.components.get(slug);
  }

  public createComponent(payload: UploadComponentPayload): ComponentDefinition {
    // Validate slug
    if (!/^[a-z0-9-]+$/.test(payload.slug)) {
      throw new Error('Slug must only contain lowercase alphanumeric characters and dashes.');
    }
    if (this.components.has(payload.slug)) {
      throw new Error(`Component with slug "${payload.slug}" already exists.`);
    }

    // Validate files paths
    for (const f of payload.files) {
      if (f.path.includes('..') || path.isAbsolute(f.path)) {
        throw new Error(`Illegal relative or absolute path traversal in file: ${f.path}`);
      }
    }

    const component: ComponentDefinition = {
      id: `comp-${payload.slug}-${Date.now()}`,
      slug: payload.slug,
      name: payload.name,
      description: payload.description,
      category: payload.category || 'cards',
      version: payload.version || '1.0.0',
      accessLevel: payload.accessLevel || 'free',
      status: payload.status || 'draft',
      dependencies: payload.dependencies || { react: '^19.0.0', 'lucide-react': '^0.546.0' },
      propsDocumentation: payload.propsDocumentation || [],
      variants: payload.variants || [],
      files: payload.files || [],
      exampleUsage: payload.exampleUsage || `import { ${payload.name.replace(/\\s+/g, '')} } from '@/components/crm/${payload.slug}';`,
      thumbnailSvg: payload.thumbnailSvg || `<svg viewBox="0 0 200 120" fill="none"><rect width="200" height="120" rx="8" fill="#F1F5F9"/><text x="100" y="65" text-anchor="middle" fill="#64748B" font-size="14" font-weight="600">${payload.name}</text></svg>`,
      tags: payload.tags || ['crm', payload.category],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.components.set(component.slug, component);
    this.persistComponents();
    return component;
  }

  public updateComponent(slug: string, updates: Partial<ComponentDefinition>): ComponentDefinition {
    const existing = this.components.get(slug);
    if (!existing) {
      throw new Error(`Component "${slug}" not found.`);
    }

    if (updates.files) {
      for (const f of updates.files) {
        if (f.path.includes('..') || path.isAbsolute(f.path)) {
          throw new Error(`Illegal path in file: ${f.path}`);
        }
      }
    }

    const updated: ComponentDefinition = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.components.set(slug, updated);
    this.persistComponents();
    return updated;
  }

  public setStatus(slug: string, status: 'published' | 'draft' | 'unpublished'): ComponentDefinition {
    return this.updateComponent(slug, { status });
  }

  public deleteComponent(slug: string): boolean {
    const deleted = this.components.delete(slug);
    if (deleted) {
      this.persistComponents();
    }
    return deleted;
  }

  // User & Access Methods
  public listUsers(): UserAccount[] {
    return Array.from(this.users.values());
  }

  public getUserById(id: string): UserAccount | undefined {
    return this.users.get(id);
  }

  public getUserByEmail(email: string): UserAccount | undefined {
    return Array.from(this.users.values()).find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public getUserByApiKey(apiKey: string): UserAccount | undefined {
    return Array.from(this.users.values()).find((u) => u.apiKey === apiKey);
  }

  public setPremiumStatus(userId: string, isPremium: boolean): UserAccount {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found.`);
    }

    user.isPremium = isPremium;
    this.users.set(userId, user);
    this.persistUsers();
    return user;
  }
}

export const storage = new StorageManager();
