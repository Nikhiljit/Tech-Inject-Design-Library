/**
 * Tech Inject Design Library
 * Shared Registry Types & Contracts
 */

export type AccessLevel = 'free' | 'premium';
export type ComponentStatus = 'published' | 'draft' | 'unpublished';
export type ComponentCategory = 'cards' | 'metrics' | 'badges' | 'tables' | 'timeline' | 'actions' | 'forms';

export interface PropDefinition {
  name: string;
  type: string;
  default?: string;
  description: string;
  required: boolean;
}

export interface ComponentVariant {
  name: string;
  label: string;
  props: Record<string, any>;
  description?: string;
}

export interface ComponentFile {
  path: string; // e.g. "components/crm/DealPipelineCard.tsx"
  content: string;
  isEntry?: boolean;
}

export interface ComponentDefinition {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: ComponentCategory;
  version: string;
  accessLevel: AccessLevel;
  status: ComponentStatus;
  dependencies: Record<string, string>;
  propsDocumentation: PropDefinition[];
  variants: ComponentVariant[];
  files: ComponentFile[];
  exampleUsage: string;
  thumbnailSvg: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Public component summary returned to clients.
 * For premium components when viewed by unauthorized users,
 * source files, code, install command and prompt are stripped.
 */
export interface PublicComponentSummary {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: ComponentCategory;
  version: string;
  accessLevel: AccessLevel;
  status: ComponentStatus;
  thumbnailSvg: string;
  tags: string[];
  dependencies: Record<string, string>;
  isLocked: boolean; // Computed by server based on caller's auth
}

export interface PublicComponentDetail extends PublicComponentSummary {
  propsDocumentation?: PropDefinition[];
  variants?: ComponentVariant[];
  files?: ComponentFile[];
  exampleUsage?: string;
  installCommand?: string;
  agentPrompt?: string;
  lockReason?: string;
}

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'customer';
  isPremium: boolean;
  apiKey: string;
  createdAt: string;
}

export interface AuthSession {
  user: {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'customer';
    isPremium: boolean;
    apiKey: string;
  };
  token: string;
}

export interface UploadComponentPayload {
  slug: string;
  name: string;
  description: string;
  category: ComponentCategory;
  version: string;
  accessLevel: AccessLevel;
  dependencies?: Record<string, string>;
  propsDocumentation?: PropDefinition[];
  variants?: ComponentVariant[];
  files: ComponentFile[];
  exampleUsage?: string;
  thumbnailSvg?: string;
  tags?: string[];
  status?: ComponentStatus;
}
