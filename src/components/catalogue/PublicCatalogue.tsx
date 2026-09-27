import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Lock,
  Unlock,
  Copy,
  Check,
  Terminal,
  Bot,
  Code2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  BookOpen,
  Layers,
  ArrowLeft,
  Package,
  ShieldAlert,
  Info,
  Sliders,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { PublicComponentSummary, PublicComponentDetail, UserAccount } from '../../types/registry';
import ComponentPreviewRenderer from '../preview/ComponentPreviewRenderer';
import ReferenceComparison from './ReferenceComparison';

interface PublicCatalogueProps {
  currentUser: UserAccount | null;
  onNavigateToAdmin: () => void;
  onQuickLogin: (account: 'free' | 'premium' | 'admin' | 'signout') => void;
}

export const PublicCatalogue: React.FC<PublicCatalogueProps> = ({
  currentUser,
  onNavigateToAdmin,
  onQuickLogin,
}) => {
  const [components, setComponents] = useState<PublicComponentSummary[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [activeDetail, setActiveDetail] = useState<PublicComponentDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [accessFilter, setAccessFilter] = useState<'all' | 'free' | 'premium'>('all');
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'install' | 'prompt'>('preview');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeVariant, setActiveVariant] = useState<string>('');
  const [currentView, setCurrentView] = useState<'catalogue' | 'overview' | 'reference'>('catalogue');

  // Fetch list of components
  const fetchComponents = async () => {
    try {
      setLoading(true);
      const headers: Record<string, string> = {};
      if (currentUser?.apiKey) {
        headers['Authorization'] = `Bearer ${currentUser.apiKey}`;
      }

      const res = await fetch('/api/components', { headers });
      const data = await res.json();
      if (data.components) {
        setComponents(data.components);
      }
    } catch (err) {
      console.error('Failed to fetch components:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComponents();
  }, [currentUser?.isPremium, currentUser?.apiKey]);

  // Fetch single component detail when slug is selected
  useEffect(() => {
    if (!selectedSlug) {
      setActiveDetail(null);
      return;
    }

    const fetchDetail = async () => {
      try {
        setLoading(true);
        const headers: Record<string, string> = {};
        if (currentUser?.apiKey) {
          headers['Authorization'] = `Bearer ${currentUser.apiKey}`;
        }

        const res = await fetch(`/api/components/${selectedSlug}`, { headers });
        const data = await res.json();
        if (data.component) {
          setActiveDetail(data.component);
          if (data.component.variants && data.component.variants.length > 0) {
            setActiveVariant(data.component.variants[0].name);
          }
        }
      } catch (err) {
        console.error('Failed to fetch component detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [selectedSlug, currentUser?.isPremium, currentUser?.apiKey]);

  const filteredComponents = useMemo(() => {
    return components.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase()) ||
        c.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

      const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;
      const matchesAccess = accessFilter === 'all' || c.accessLevel === accessFilter;

      return matchesSearch && matchesCategory && matchesAccess;
    });
  }, [components, search, categoryFilter, accessFilter]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const categories = ['all', 'cards', 'metrics', 'badges', 'tables', 'timeline', 'actions'];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Top Banner & Quick Account Switcher for Reviewer */}
      <div className="bg-slate-900 text-slate-200 text-xs px-4 py-2 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white tracking-wide flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Tech Inject CRM System
          </span>
          <span className="text-slate-400 hidden sm:inline">|</span>
          <span className="text-slate-400 hidden sm:inline">Current Mode:</span>
          {currentUser ? (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${
              currentUser.isPremium
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
            }`}>
              {currentUser.isPremium ? <Sparkles className="w-3 h-3 text-amber-400" /> : <Lock className="w-3 h-3 text-blue-400" />}
              {currentUser.email} ({currentUser.isPremium ? 'Active Premium' : 'Free Customer'})
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
              <Lock className="w-3 h-3 text-slate-400" />
              Signed Out (Visitor)
            </span>
          )}
        </div>

        {/* Quick Reviewer Account Switcher */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 text-[11px] mr-1 hidden md:inline">Test Accounts:</span>
          <button
            type="button"
            onClick={() => onQuickLogin('free')}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
              currentUser?.email === 'free@customer.com'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            Free User
          </button>
          <button
            type="button"
            onClick={() => onQuickLogin('premium')}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
              currentUser?.email === 'premium@customer.com' && currentUser.isPremium
                ? 'bg-amber-600 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-amber-300'
            }`}
          >
            ★ Premium User
          </button>
          <button
            type="button"
            onClick={() => onQuickLogin('signout')}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
              !currentUser ? 'bg-slate-700 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
            }`}
          >
            Sign Out
          </button>
          <div className="h-4 w-px bg-slate-700 mx-1" />
          <button
            type="button"
            onClick={onNavigateToAdmin}
            className="px-2.5 py-1 rounded text-[11px] font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center gap-1"
          >
            Admin Panel
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                  Tech Inject Design Library
                </h1>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200 dark:border-indigo-800">
                  Sales CRM Standard
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Production-ready Next.js / React + TypeScript UI component system
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs">
            <button
              onClick={() => {
                setCurrentView('catalogue');
                setSelectedSlug(null);
              }}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                currentView === 'catalogue' && !selectedSlug
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Components ({components.length})
            </button>
            <button
              onClick={() => {
                setCurrentView('overview');
                setSelectedSlug(null);
              }}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                currentView === 'overview'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Getting Started
            </button>
            <button
              onClick={() => {
                setCurrentView('reference');
                setSelectedSlug(null);
              }}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                currentView === 'reference'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Visual Analysis
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {/* VIEW 1: OVERVIEW / GETTING STARTED */}
        {currentView === 'overview' && (
          <div className="space-y-8 animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-xs">
              <div className="max-w-3xl">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2 block">
                  Design Standard & Developer Guidelines
                </span>
                <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
                  Tech Inject Component Library for Sales CRM
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                  This component library defines the shared design standard for all CRM and revenue intelligence applications across the organization. Built with strict TypeScript typings, accessible primitives, semantic CRM color tokens, and instant CLI/AI agent integration.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
                    <Code2 className="w-5 h-5 text-indigo-600 mb-2" />
                    <div className="font-semibold text-xs text-slate-900 dark:text-white mb-1">Strict TypeScript</div>
                    <p className="text-[11px] text-slate-500">Every component has fully typed props, zero unjustified any, and complete runtime schemas.</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
                    <Terminal className="w-5 h-5 text-emerald-600 mb-2" />
                    <div className="font-semibold text-xs text-slate-900 dark:text-white mb-1">Working CLI Command</div>
                    <p className="text-[11px] text-slate-500">Add any component directly to consumer projects with automatic dependency checks.</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
                    <Bot className="w-5 h-5 text-purple-600 mb-2" />
                    <div className="font-semibold text-xs text-slate-900 dark:text-white mb-1">AI Agent Ready</div>
                    <p className="text-[11px] text-slate-500">Engineered prompts instructing AI agents how to install and preserve theme fidelity.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Consumer Setup Instructions */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-xs">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Documented Consumer Setup (React + TypeScript + Tailwind)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Follow these prerequisite setup steps in your consumer application to install and run any component from this catalogue.
              </p>

              <div className="space-y-4">
                <div>
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Step 1: Install peer dependencies
                  </div>
                  <div className="bg-slate-900 text-slate-200 p-3.5 rounded-lg text-xs font-mono flex items-center justify-between">
                    <code>npm install react@^19.0.0 react-dom@^19.0.0 lucide-react@^0.546.0 tailwindcss</code>
                    <button
                      onClick={() => copyToClipboard('npm install react@^19.0.0 react-dom@^19.0.0 lucide-react@^0.546.0 tailwindcss', 'install-deps')}
                      className="text-slate-400 hover:text-white p-1"
                    >
                      {copiedKey === 'install-deps' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Step 2: Add Tech Inject CLI command
                  </div>
                  <div className="bg-slate-900 text-slate-200 p-3.5 rounded-lg text-xs font-mono flex items-center justify-between">
                    <code>npx tech-inject add deal-pipeline-card</code>
                    <button
                      onClick={() => copyToClipboard('npx tech-inject add deal-pipeline-card', 'cli-ex')}
                      className="text-slate-400 hover:text-white p-1"
                    >
                      {copiedKey === 'cli-ex' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: VISUAL ANALYSIS */}
        {currentView === 'reference' && <ReferenceComparison />}

        {/* VIEW 3: COMPONENT DETAIL VIEW */}
        {selectedSlug && activeDetail && (
          <div className="space-y-6 animate-in fade-in">
            {/* Header / Breadcrumb */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setSelectedSlug(null)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to All Components
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                  v{activeDetail.version}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    activeDetail.accessLevel === 'premium'
                      ? 'bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                  }`}
                >
                  {activeDetail.accessLevel === 'premium' ? (
                    <>
                      <Lock className="w-3 h-3 text-amber-500" />
                      Premium Component
                    </>
                  ) : (
                    <>
                      <Unlock className="w-3 h-3 text-emerald-500" />
                      Free Component
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Component Title & Description */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
              <div className="flex flex-wrap items-baseline gap-3 mb-2">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {activeDetail.name}
                </h2>
                <span className="text-xs font-mono text-slate-400">({activeDetail.slug})</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 capitalize font-medium text-slate-600 dark:text-slate-300">
                  {activeDetail.category}
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
                {activeDetail.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-4">
                {activeDetail.tags?.map((t) => (
                  <span
                    key={t}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* LOCKED STATE BANNER FOR UNAUTHORIZED USERS */}
            {activeDetail.isLocked ? (
              <div className="space-y-6">
                <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-6 shadow-xs">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-300 flex items-center justify-center shrink-0">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <h3 className="text-base font-bold text-amber-900 dark:text-amber-200">
                        Premium Component Access Required
                      </h3>
                      <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                        {activeDetail.lockReason ||
                          'This component contains enterprise CRM features restricted to active Premium accounts. Source code, CLI installation, and AI agent prompts are locked until access is granted by an administrator.'}
                      </p>
                      <div className="pt-2 flex flex-wrap items-center gap-3">
                        <span className="text-xs font-semibold text-amber-900 dark:text-amber-200">
                          Reviewer quick test:
                        </span>
                        <button
                          type="button"
                          onClick={() => onQuickLogin('premium')}
                          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          Sign In with Premium Test Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Static Thumbnail Placeholder for Locked View */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 text-center">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                    Static Thumbnail Representation
                  </div>
                  <div
                    className="max-w-md mx-auto rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner"
                    dangerouslySetInnerHTML={{ __html: activeDetail.thumbnailSvg }}
                  />
                  <p className="text-xs text-slate-400 mt-3">
                    Interactive preview and functional interaction states are available with an active Premium license.
                  </p>
                </div>
              </div>
            ) : (
              /* UNLOCKED FULL ACCESS VIEW */
              <div className="space-y-6">
                {/* Variant Selector */}
                {activeDetail.variants && activeDetail.variants.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                    <span className="font-semibold text-slate-500 shrink-0">Variants:</span>
                    {activeDetail.variants.map((v) => (
                      <button
                        key={v.name}
                        onClick={() => setActiveVariant(v.name)}
                        className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                          activeVariant === v.name
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Live Preview Canvas */}
                <ComponentPreviewRenderer
                  component={activeDetail}
                  activeVariant={activeVariant}
                />

                {/* Integration Tabs (Code / CLI / Prompt) */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
                  {/* Tabs Header */}
                  <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 px-4 pt-2">
                    <button
                      onClick={() => setActiveTab('preview')}
                      className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                        activeTab === 'preview'
                          ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 rounded-t-lg'
                          : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      Props Specification
                    </button>
                    <button
                      onClick={() => setActiveTab('code')}
                      className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                        activeTab === 'code'
                          ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 rounded-t-lg'
                          : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      Copy Code ({activeDetail.files?.length || 1} file)
                    </button>
                    <button
                      onClick={() => setActiveTab('install')}
                      className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                        activeTab === 'install'
                          ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 rounded-t-lg'
                          : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <Terminal className="w-3.5 h-3.5" />
                      NPX Install Command
                    </button>
                    <button
                      onClick={() => setActiveTab('prompt')}
                      className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                        activeTab === 'prompt'
                          ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 rounded-t-lg'
                          : 'border-transparent text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <Bot className="w-3.5 h-3.5 text-purple-500" />
                      AI Agent Prompt
                    </button>
                  </div>

                  {/* Tab Body */}
                  <div className="p-6">
                    {/* TAB 1: PROPS */}
                    {activeTab === 'preview' && (
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                          TypeScript Props Documentation
                        </h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs">
                            <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                              <tr>
                                <th className="py-2 pr-4 font-semibold">Prop</th>
                                <th className="py-2 pr-4 font-semibold">Type</th>
                                <th className="py-2 pr-4 font-semibold">Default</th>
                                <th className="py-2 font-semibold">Description</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                              {activeDetail.propsDocumentation?.map((prop) => (
                                <tr key={prop.name}>
                                  <td className="py-2.5 pr-4 font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                                    {prop.name}
                                    {prop.required && <span className="text-rose-500 ml-1">*</span>}
                                  </td>
                                  <td className="py-2.5 pr-4 font-mono text-slate-600 dark:text-slate-300">
                                    {prop.type}
                                  </td>
                                  <td className="py-2.5 pr-4 font-mono text-slate-400">
                                    {prop.default || '-'}
                                  </td>
                                  <td className="py-2.5 text-slate-600 dark:text-slate-300">
                                    {prop.description}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {activeDetail.exampleUsage && (
                          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Example Usage</span>
                              <button
                                onClick={() => copyToClipboard(activeDetail.exampleUsage!, 'example-use')}
                                className="text-xs text-indigo-600 flex items-center gap-1 hover:underline"
                              >
                                {copiedKey === 'example-use' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                Copy snippet
                              </button>
                            </div>
                            <pre className="bg-slate-900 text-slate-200 p-3.5 rounded-lg text-xs font-mono overflow-x-auto">
                              {activeDetail.exampleUsage}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB 2: CODE */}
                    {activeTab === 'code' && (
                      <div className="space-y-4">
                        {activeDetail.files?.map((file, idx) => (
                          <div key={idx} className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                                📄 {file.path}
                              </span>
                              <button
                                onClick={() => copyToClipboard(file.content, `file-${idx}`)}
                                className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-medium flex items-center gap-1.5 transition-colors"
                              >
                                {copiedKey === `file-${idx}` ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>Copy Source</span>
                                  </>
                                )}
                              </button>
                            </div>
                            <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-[400px]">
                              <code>{file.content}</code>
                            </pre>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* TAB 3: CLI INSTALL */}
                    {activeTab === 'install' && (
                      <div className="space-y-4">
                        <div>
                          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                            NPX Installer Command
                          </div>
                          <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs flex items-center justify-between gap-4">
                            <code>{activeDetail.installCommand}</code>
                            <button
                              onClick={() => copyToClipboard(activeDetail.installCommand!, 'cli-cmd')}
                              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shrink-0 flex items-center gap-1.5 transition-colors"
                            >
                              {copiedKey === 'cli-cmd' ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                                  <span>Copied Command!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copy Command</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                          <div className="font-semibold text-slate-800 dark:text-slate-200">
                            How this installer works:
                          </div>
                          <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-1">
                            <li>Fetches component source securely from the deployed Tech Inject registry.</li>
                            <li>Verifies caller authentication and premium entitlement for protected components.</li>
                            <li>Rejects path traversal attempts (no <code>..</code> or root writes).</li>
                            <li>Writes directly into your consumer project's <code>src/components/crm/</code> directory.</li>
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* TAB 4: AGENT PROMPT */}
                    {activeTab === 'prompt' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Contextual Prompt for Coding Agents (Cursor, Claude, Copilot, Gemini)
                          </span>
                          <button
                            onClick={() => copyToClipboard(activeDetail.agentPrompt!, 'agent-prompt')}
                            className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                          >
                            {copiedKey === 'agent-prompt' ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-300" />
                                <span>Copied Prompt!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Agent Prompt</span>
                              </>
                            )}
                          </button>
                        </div>
                        <div className="bg-slate-900 text-purple-200/90 p-4 rounded-xl font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[380px] border border-purple-950">
                          {activeDetail.agentPrompt}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 4: CATALOGUE GRID (When no component is selected and view is 'catalogue') */}
        {currentView === 'catalogue' && !selectedSlug && (
          <div className="space-y-6">
            {/* Search & Filter Toolbar */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="relative flex-1 min-w-[260px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search components by name, category, or tags..."
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              <div className="flex items-center gap-2">
                {/* Category Dropdown */}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-700 dark:text-slate-200 focus:outline-none capitalize"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      Category: {c}
                    </option>
                  ))}
                </select>

                {/* Access Level Filter */}
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs">
                  <button
                    onClick={() => setAccessFilter('all')}
                    className={`px-2.5 py-1.5 rounded-md font-medium capitalize transition-colors ${
                      accessFilter === 'all'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    All ({components.length})
                  </button>
                  <button
                    onClick={() => setAccessFilter('free')}
                    className={`px-2.5 py-1.5 rounded-md font-medium capitalize transition-colors ${
                      accessFilter === 'free'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Free
                  </button>
                  <button
                    onClick={() => setAccessFilter('premium')}
                    className={`px-2.5 py-1.5 rounded-md font-medium capitalize transition-colors ${
                      accessFilter === 'premium'
                        ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    ★ Premium
                  </button>
                </div>
              </div>
            </div>

            {/* Component Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredComponents.map((comp) => {
                const isLocked = comp.isLocked;

                return (
                  <div
                    key={comp.id}
                    onClick={() => setSelectedSlug(comp.slug)}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:border-indigo-400 dark:hover:border-indigo-700 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col group"
                  >
                    {/* Visual Thumbnail */}
                    <div className="relative bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800/80 p-4 h-40 flex items-center justify-center overflow-hidden">
                      <div
                        className="w-full h-full flex items-center justify-center transform group-hover:scale-102 transition-transform duration-200"
                        dangerouslySetInnerHTML={{ __html: comp.thumbnailSvg }}
                      />

                      {/* Access Badge */}
                      <div className="absolute top-3 right-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                            comp.accessLevel === 'premium'
                              ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 shadow-xs'
                              : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shadow-xs'
                          }`}
                        >
                          {comp.accessLevel === 'premium' ? (
                            <>
                              <Lock className="w-3 h-3 text-amber-600" />
                              Premium
                            </>
                          ) : (
                            <>
                              <Unlock className="w-3 h-3 text-emerald-600" />
                              Free
                            </>
                          )}
                        </span>
                      </div>

                      {/* Category Badge */}
                      <div className="absolute bottom-3 left-3">
                        <span className="text-[10px] uppercase font-mono font-medium px-2 py-0.5 rounded bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 shadow-xs border border-slate-200 dark:border-slate-800">
                          {comp.category}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {comp.name}
                          </h3>
                          <span className="text-[11px] font-mono text-slate-400">
                            v{comp.version}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                          {comp.description}
                        </p>
                      </div>

                      {/* Footer Info */}
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                        {isLocked ? (
                          <span className="inline-flex items-center gap-1 text-amber-600 font-medium">
                            <Lock className="w-3.5 h-3.5" />
                            Premium Locked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                            <Check className="w-3.5 h-3.5" />
                            Full Access
                          </span>
                        )}

                        <span className="text-indigo-600 dark:text-indigo-400 font-medium group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                          Explore
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 px-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <strong>Tech Inject Design Library</strong> — Standardized Sales CRM Component System.
          </div>
          <div className="flex items-center gap-4">
            <span>React 19 + TypeScript</span>
            <span>Tailwind CSS</span>
            <span>npx CLI & AI Agent Integration</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicCatalogue;
