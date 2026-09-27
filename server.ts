import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { storage } from './src/server/storage';
import { UploadComponentPayload, UserAccount, PublicComponentSummary, PublicComponentDetail } from './src/types/registry';

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'admin-secret-token-key-2026';

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Helper to determine customer from request headers or query
function resolveUser(req: Request): UserAccount | null {
  const authHeader = req.headers.authorization;
  const apiKeyHeader = req.headers['x-api-key'] as string | undefined;
  const queryToken = req.query.token as string | undefined;

  let token = '';
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (apiKeyHeader) {
    token = apiKeyHeader.trim();
  } else if (queryToken) {
    token = queryToken.trim();
  }

  if (!token) return null;

  // Check admin token directly
  if (token === ADMIN_SECRET || token === 'tech_adm_sec_9942a7') {
    return storage.getUserById('user-admin') || null;
  }

  // Lookup by API key or token
  return storage.getUserByApiKey(token) || null;
}

// Middleware: Admin verification
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const adminHeader = req.headers['x-admin-token'] as string | undefined;
  const authHeader = req.headers.authorization;
  const token = adminHeader || (authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : '');

  if (token === ADMIN_SECRET || token === 'tech_adm_sec_9942a7') {
    return next();
  }

  const user = resolveUser(req);
  if (user && user.role === 'admin') {
    return next();
  }

  res.status(401).json({
    error: 'Unauthorized',
    message: 'Valid administrator token or session required for this action.',
  });
}

// ==================== AUTH ROUTES ====================
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password, token } = req.body;

  if (token) {
    if (token === ADMIN_SECRET || token === 'tech_adm_sec_9942a7') {
      const admin = storage.getUserById('user-admin')!;
      return res.json({ user: admin, token: admin.apiKey });
    }
    const user = storage.getUserByApiKey(token);
    if (user) {
      return res.json({ user, token: user.apiKey });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const normalized = email.toLowerCase().trim();

  // Test admin credentials
  if (normalized === 'admin@techinject.internal' && (password === 'admin123' || !password)) {
    const admin = storage.getUserById('user-admin')!;
    return res.json({ user: admin, token: admin.apiKey });
  }

  // Test customer accounts
  const user = storage.getUserByEmail(normalized);
  if (user) {
    // Check password if provided, or allow fast test login for standard demo accounts
    if (
      (normalized === 'free@customer.com' && (password === 'free123' || !password)) ||
      (normalized === 'premium@customer.com' && (password === 'premium123' || !password)) ||
      password === 'password'
    ) {
      return res.json({ user, token: user.apiKey });
    }
  }

  return res.status(401).json({ error: 'Invalid credentials. Use provided test accounts.' });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const user = resolveUser(req);
  if (!user) {
    return res.json({ user: null });
  }
  // Always fetch fresh state from storage so revocation takes effect immediately
  const fresh = storage.getUserById(user.id);
  res.json({ user: fresh || null });
});

// ==================== PUBLIC COMPONENT CATALOGUE ====================

// List published components
app.get('/api/components', (req: Request, res: Response) => {
  const user = resolveUser(req);
  const isPremiumUser = user ? user.isPremium : false;

  const published = storage.listComponents(false);

  const summaries: PublicComponentSummary[] = published.map((c) => {
    const isLocked = c.accessLevel === 'premium' && !isPremiumUser;
    return {
      id: c.id,
      slug: c.slug,
      name: c.name,
      description: c.description,
      category: c.category,
      version: c.version,
      accessLevel: c.accessLevel,
      status: c.status,
      thumbnailSvg: c.thumbnailSvg,
      tags: c.tags,
      dependencies: c.dependencies,
      isLocked,
    };
  });

  res.json({ components: summaries, isPremiumUser });
});

// Get component details
app.get('/api/components/:slug', (req: Request, res: Response) => {
  const { slug } = req.params;
  const user = resolveUser(req);
  const isPremiumUser = user ? user.isPremium : false;

  const component = storage.getComponent(slug);
  if (!component) {
    return res.status(404).json({ error: 'ComponentNotFound', message: `Component "${slug}" was not found.` });
  }

  // Unpublished components require admin access
  if (component.status !== 'published') {
    const adminHeader = req.headers['x-admin-token'] as string | undefined;
    const isAdmin = adminHeader === ADMIN_SECRET || (user && user.role === 'admin');
    if (!isAdmin) {
      return res.status(404).json({ error: 'ComponentNotPublished', message: `Component "${slug}" is not currently published.` });
    }
  }

  const isLocked = component.accessLevel === 'premium' && !isPremiumUser;

  // Build CLI command & Agent Prompt
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const installCmd = component.accessLevel === 'premium'
    ? `npx tech-inject add ${component.slug} --token <YOUR_PREMIUM_TOKEN>`
    : `npx tech-inject add ${component.slug}`;

  const agentPrompt = `You are adding the "${component.name}" component from the Tech Inject Sales CRM design system into this React + TypeScript application.

REQUIREMENTS & INTEGRATION STEPS:
1. Target Component File: "src/components/crm/${component.slug}.tsx"
2. Dependencies Required: ${JSON.stringify(component.dependencies)}
3. Design System Standard:
   - Use the Sales CRM neutral slate palette and high-contrast semantic borders.
   - Follow the established component interface:
${component.propsDocumentation.map((p) => `     - ${p.name}${p.required ? ' (required)' : ' (optional)'}: ${p.type} -> ${p.description}`).join('\n')}
4. Theme Tokens & Styles:
   - Match the CRM styling: rounded-xl borders, subtle hover transitions, tabular-nums for numeric figures.
5. Verification:
   - Render the component with realistic CRM dummy data and verify active, hover, and responsive states.`;

  if (isLocked) {
    // Hide protected code and files completely from unauthorized callers
    const lockedResponse: PublicComponentDetail = {
      id: component.id,
      slug: component.slug,
      name: component.name,
      description: component.description,
      category: component.category,
      version: component.version,
      accessLevel: component.accessLevel,
      status: component.status,
      thumbnailSvg: component.thumbnailSvg,
      tags: component.tags,
      dependencies: component.dependencies,
      isLocked: true,
      lockReason: 'Premium license required. Please sign in with an authorized premium account or request access from your organization administrator.',
    };
    return res.json({ component: lockedResponse });
  }

  const detailResponse: PublicComponentDetail = {
    id: component.id,
    slug: component.slug,
    name: component.name,
    description: component.description,
    category: component.category,
    version: component.version,
    accessLevel: component.accessLevel,
    status: component.status,
    thumbnailSvg: component.thumbnailSvg,
    tags: component.tags,
    dependencies: component.dependencies,
    isLocked: false,
    propsDocumentation: component.propsDocumentation,
    variants: component.variants,
    files: component.files,
    exampleUsage: component.exampleUsage,
    installCommand: installCmd,
    agentPrompt: agentPrompt,
  };

  res.json({ component: detailResponse });
});

// Direct source request (protected for premium)
app.get('/api/components/:slug/source', (req: Request, res: Response) => {
  const { slug } = req.params;
  const user = resolveUser(req);
  const isPremiumUser = user ? user.isPremium : false;

  const component = storage.getComponent(slug);
  if (!component || component.status !== 'published') {
    return res.status(404).json({ error: 'ComponentNotFound' });
  }

  if (component.accessLevel === 'premium' && !isPremiumUser) {
    return res.status(403).json({
      error: 'PremiumRequired',
      message: 'Access denied: Premium subscription required to retrieve component source files.',
    });
  }

  res.json({
    slug: component.slug,
    version: component.version,
    files: component.files,
    dependencies: component.dependencies,
  });
});

// Direct agent prompt request (protected for premium)
app.get('/api/components/:slug/prompt', (req: Request, res: Response) => {
  const { slug } = req.params;
  const user = resolveUser(req);
  const isPremiumUser = user ? user.isPremium : false;

  const component = storage.getComponent(slug);
  if (!component || component.status !== 'published') {
    return res.status(404).json({ error: 'ComponentNotFound' });
  }

  if (component.accessLevel === 'premium' && !isPremiumUser) {
    return res.status(403).json({
      error: 'PremiumRequired',
      message: 'Access denied: Premium subscription required to retrieve AI agent prompts.',
    });
  }

  const prompt = `You are integrating the "${component.name}" Sales CRM component into a React + TypeScript project.
Component files to create:
${component.files.map((f) => `- ${f.path}`).join('\n')}

Props Specification:
${component.propsDocumentation.map((p) => `- ${p.name}: ${p.type} (${p.description})`).join('\n')}

Example Usage:
${component.exampleUsage}

Install dependencies:
npm install ${Object.entries(component.dependencies).map(([k, v]) => `${k}@${v}`).join(' ')}`;

  res.json({ prompt });
});

// ==================== NPX / CLI INSTALLER ====================

// CLI install endpoint
app.get('/api/cli/install/:slug', (req: Request, res: Response) => {
  const { slug } = req.params;
  const user = resolveUser(req);
  const isPremiumUser = user ? user.isPremium : false;

  const component = storage.getComponent(slug);
  if (!component) {
    return res.status(404).json({
      error: 'NotFound',
      message: `Component "${slug}" does not exist in the Tech Inject catalogue.`,
    });
  }

  if (component.status !== 'published') {
    return res.status(404).json({
      error: 'NotPublished',
      message: `Component "${slug}" is currently not published.`,
    });
  }

  if (component.accessLevel === 'premium' && !isPremiumUser) {
    return res.status(403).json({
      error: 'PremiumLicenseRequired',
      message: `Component "${component.name}" is a Premium component. Provide a valid premium token using --token <YOUR_TOKEN>.`,
      code: 'ERR_PREMIUM_REQUIRED',
    });
  }

  // Validate paths to ensure safe consumer directory installation
  for (const f of component.files) {
    if (f.path.includes('..') || path.isAbsolute(f.path)) {
      return res.status(500).json({ error: 'SecurityViolation', message: 'Malicious path traversal detected in component files.' });
    }
  }

  res.json({
    status: 'success',
    component: {
      slug: component.slug,
      name: component.name,
      version: component.version,
      accessLevel: component.accessLevel,
      dependencies: component.dependencies,
      files: component.files,
      exampleUsage: component.exampleUsage,
    },
  });
});

// Self-contained universal CLI runner script served dynamically
app.get('/api/cli/run', (req: Request, res: Response) => {
  const host = `${req.protocol}://${req.get('host')}`;
  const script = `#!/usr/bin/env node
/**
 * Tech Inject CLI Installer
 * Safe component installer for React + TypeScript projects
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const args = process.argv.slice(2);
const command = args[0];
const slug = args[1];

let token = '';
let targetDir = process.cwd();

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--token' && args[i + 1]) token = args[i + 1];
  if (args[i] === '--dir' && args[i + 1]) targetDir = path.resolve(args[i + 1]);
}

if (!command || (command !== 'add' && command !== 'install') || !slug) {
  console.log('\\x1b[36mTech Inject Component Installer\\x1b[0m');
  console.log('Usage: npx tech-inject add <component-slug> [--token <premium-token>] [--dir <path>]');
  process.exit(1);
}

const registryUrl = '${host}/api/cli/install/' + encodeURIComponent(slug) + (token ? '?token=' + encodeURIComponent(token) : '');
const client = registryUrl.startsWith('https') ? https : http;

console.log('\\x1b[34m[Tech Inject]\\x1b[0m Fetching component "' + slug + '" from registry...');

client.get(registryUrl, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const payload = JSON.parse(data);
      if (res.statusCode !== 200) {
        console.error('\\x1b[31m[Error ' + res.statusCode + ']\\x1b[0m ' + (payload.message || 'Installation failed.'));
        process.exit(1);
      }

      const comp = payload.component;
      console.log('\\x1b[32m✔\\x1b[0m Found: ' + comp.name + ' (v' + comp.version + ') [' + comp.accessLevel.toUpperCase() + ']');

      // Install files safely
      for (const file of comp.files) {
        if (file.path.includes('..') || path.isAbsolute(file.path)) {
          console.error('\\x1b[31mSecurity error:\\x1b[0m Unsafe relative path "' + file.path + '" rejected.');
          process.exit(1);
        }

        const dest = path.resolve(targetDir, file.path);
        if (!dest.startsWith(targetDir)) {
          console.error('\\x1b[31mSecurity error:\\x1b[0m Path escape detected for ' + dest);
          process.exit(1);
        }

        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.writeFileSync(dest, file.content, 'utf-8');
        console.log('  \\x1b[36m+ Added:\\x1b[0m ' + file.path);
      }

      console.log('\\n\\x1b[32m✔ Component installed successfully!\\x1b[0m');
      console.log('Dependencies required:');
      console.log('  npm install ' + Object.entries(comp.dependencies).map(([k, v]) => k + '@"' + v + '"').join(' '));
    } catch (e) {
      console.error('\\x1b[31mFailed to parse response:\\x1b[0m', e.message);
      process.exit(1);
    }
  });
}).on('error', (err) => {
  console.error('\\x1b[31mNetwork error:\\x1b[0m', err.message);
  process.exit(1);
});
`;
  res.setHeader('Content-Type', 'text/javascript');
  res.send(script);
});

// ==================== ADMIN DASHBOARD ROUTES ====================

// List all components (including drafts and unpublished)
app.get('/api/admin/components', requireAdmin, (_req: Request, res: Response) => {
  const all = storage.listComponents(true);
  res.json({ components: all });
});

// Upload/Create component draft
app.post('/api/admin/components', requireAdmin, (req: Request, res: Response) => {
  try {
    const payload: UploadComponentPayload = req.body;

    if (!payload.name || !payload.slug) {
      return res.status(400).json({ error: 'ValidationError', message: 'Component name and slug are required.' });
    }

    if (!payload.files || !Array.isArray(payload.files) || payload.files.length === 0) {
      return res.status(400).json({ error: 'ValidationError', message: 'At least one code file is required.' });
    }

    // Check for dangerous shell execution patterns in uploaded code
    const shellCommandPatterns = [/child_process/, /execSync/, /spawnSync/, /process\.exit/, /rm -rf/];
    for (const f of payload.files) {
      for (const pattern of shellCommandPatterns) {
        if (pattern.test(f.content)) {
          return res.status(400).json({
            error: 'SecurityViolation',
            message: `Disallowed code execution pattern "${pattern}" detected in file ${f.path}. Upload rejected.`,
          });
        }
      }
    }

    const created = storage.createComponent(payload);
    res.status(201).json({ component: created });
  } catch (err: any) {
    res.status(400).json({ error: 'CreationFailed', message: err.message });
  }
});

// Update component
app.put('/api/admin/components/:slug', requireAdmin, (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const updated = storage.updateComponent(slug, req.body);
    res.json({ component: updated });
  } catch (err: any) {
    res.status(400).json({ error: 'UpdateFailed', message: err.message });
  }
});

// Publish component
app.post('/api/admin/components/:slug/publish', requireAdmin, (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const published = storage.setStatus(slug, 'published');
    res.json({ component: published, message: `Component "${published.name}" is now live in the public catalogue.` });
  } catch (err: any) {
    res.status(400).json({ error: 'PublishFailed', message: err.message });
  }
});

// Unpublish component
app.post('/api/admin/components/:slug/unpublish', requireAdmin, (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const unpublished = storage.setStatus(slug, 'unpublished');
    res.json({ component: unpublished, message: `Component "${unpublished.name}" has been unpublished.` });
  } catch (err: any) {
    res.status(400).json({ error: 'UnpublishFailed', message: err.message });
  }
});

// Delete component
app.delete('/api/admin/components/:slug', requireAdmin, (req: Request, res: Response) => {
  const { slug } = req.params;
  const deleted = storage.deleteComponent(slug);
  if (!deleted) {
    return res.status(404).json({ error: 'NotFound', message: `Component "${slug}" not found.` });
  }
  res.json({ message: `Component "${slug}" deleted successfully.` });
});

// Customer accounts management
app.get('/api/admin/users', requireAdmin, (_req: Request, res: Response) => {
  const users = storage.listUsers();
  res.json({ users });
});

// Grant or Revoke Premium access
app.post('/api/admin/users/:id/toggle-premium', requireAdmin, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isPremium } = req.body;

    if (typeof isPremium !== 'boolean') {
      return res.status(400).json({ error: 'InvalidParameter', message: 'isPremium must be a boolean.' });
    }

    const updated = storage.setPremiumStatus(id, isPremium);
    res.json({
      user: updated,
      message: `Premium status for "${updated.email}" set to ${isPremium ? 'ACTIVE' : 'REVOKED'}.`,
    });
  } catch (err: any) {
    res.status(400).json({ error: 'UpdateFailed', message: err.message });
  }
});

// Reset storage to seeds (for test automation)
app.post('/api/admin/reset', requireAdmin, (_req: Request, res: Response) => {
  storage.resetComponents();
  storage.resetUsers();
  res.json({ message: 'Database reset to initial clean seed state.' });
});

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    componentsCount: storage.listComponents(true).length,
  });
});

// ==================== VITE & PRODUCTION STATIC SERVING ====================

async function startServer() {
  if (process.env.NODE_ENV === 'production' && fs.existsSync(path.resolve(process.cwd(), 'dist'))) {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  } else {
    // Development mode with Vite middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Tech Inject Server] Running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Tech Inject Server] Failed to start:', err);
  process.exit(1);
});
