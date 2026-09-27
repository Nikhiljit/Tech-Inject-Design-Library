import { ComponentDefinition } from '../types/registry';

export const INITIAL_COMPONENTS: ComponentDefinition[] = [
  {
    id: 'comp-status-stage-badge',
    slug: 'status-stage-badge',
    name: 'Status Stage Badge',
    description: 'Semantic pipeline stage indicator with status dot, subtle badge style, and color-coded theme tokens for Sales CRM deals.',
    category: 'badges',
    version: '1.1.0',
    accessLevel: 'free',
    status: 'published',
    dependencies: {
      'react': '^19.0.0',
      'lucide-react': '^0.546.0',
    },
    propsDocumentation: [
      { name: 'stage', type: "'lead' | 'contactMade' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost'", required: true, description: 'Sales pipeline stage determining color token' },
      { name: 'label', type: 'string', required: false, description: 'Custom label text overriding standard stage name' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", required: false, description: 'Size variation' },
      { name: 'showDot', type: 'boolean', default: 'true', required: false, description: 'Show color-coded pulse/status dot' },
      { name: 'onClick', type: '() => void', required: false, description: 'Optional click handler for interactive badges' },
    ],
    variants: [
      { name: 'qualified', label: 'Qualified Stage', props: { stage: 'qualified', size: 'md' } },
      { name: 'proposal', label: 'Proposal Sent', props: { stage: 'proposal', size: 'md' } },
      { name: 'negotiation', label: 'In Negotiation', props: { stage: 'negotiation', size: 'md' } },
      { name: 'won', label: 'Closed Won', props: { stage: 'won', size: 'md' } },
      { name: 'lost', label: 'Closed Lost', props: { stage: 'lost', size: 'md' } },
    ],
    files: [
      {
        path: 'src/components/crm/StatusStageBadge.tsx',
        content: `import React from 'react';

export type StageVariant =
  | 'lead'
  | 'contactMade'
  | 'qualified'
  | 'proposal'
  | 'negotiation'
  | 'won'
  | 'lost';

export interface StatusStageBadgeProps {
  stage: StageVariant;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
  onClick?: () => void;
  className?: string;
}

const stageLabels: Record<StageVariant, string> = {
  lead: 'New Lead',
  contactMade: 'Contact Made',
  qualified: 'Qualified',
  proposal: 'Proposal Sent',
  negotiation: 'In Negotiation',
  won: 'Closed Won',
  lost: 'Closed Lost',
};

const subtleStyles: Record<StageVariant, { bg: string; text: string; border: string; dot: string }> = {
  lead: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300', border: 'border-slate-200 dark:border-slate-700', dot: 'bg-slate-400' },
  contactMade: { bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800', dot: 'bg-blue-500' },
  qualified: { bg: 'bg-indigo-50 dark:bg-indigo-950/40', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-800', dot: 'bg-indigo-500' },
  proposal: { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-800 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800', dot: 'bg-amber-500' },
  negotiation: { bg: 'bg-purple-50 dark:bg-purple-950/40', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-800', dot: 'bg-purple-500' },
  won: { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800', dot: 'bg-emerald-500' },
  lost: { bg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-200 dark:border-rose-800', dot: 'bg-rose-500' },
};

export const StatusStageBadge: React.FC<StatusStageBadgeProps> = ({
  stage,
  label,
  size = 'md',
  showDot = true,
  onClick,
  className = '',
}) => {
  const displayLabel = label || stageLabels[stage] || stage;
  const config = subtleStyles[stage] || subtleStyles.lead;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-medium',
  }[size];

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  }[size];

  return (
    <span
      onClick={onClick}
      className={\`inline-flex items-center rounded-full border transition-colors \${config.bg} \${config.text} \${config.border} \${sizeClasses} \${
        onClick ? 'cursor-pointer hover:opacity-85' : ''
      } \${className}\`}
    >
      {showDot && <span className={\`rounded-full shrink-0 \${config.dot} \${dotSizes}\`} />}
      <span className="whitespace-nowrap">{displayLabel}</span>
    </span>
  );
};

export default StatusStageBadge;`,
      },
    ],
    exampleUsage: `import { StatusStageBadge } from '@/components/crm/StatusStageBadge';

export function DealHeader() {
  return (
    <div className="flex items-center gap-3">
      <h2>Enterprise SLA Expansion</h2>
      <StatusStageBadge stage="negotiation" />
    </div>
  );
}`,
    thumbnailSvg: `<svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="120" rx="12" fill="#F8FAFC"/>
  <rect x="40" y="44" width="120" height="32" rx="16" fill="#EEF2FF" stroke="#C7D2FE"/>
  <circle cx="58" cy="60" r="5" fill="#6366F1"/>
  <rect x="72" y="55" width="68" height="10" rx="3" fill="#4338CA"/>
</svg>`,
    tags: ['pipeline', 'stage', 'status', 'badge', 'crm'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'comp-lead-score-badge',
    slug: 'lead-score-badge',
    name: 'Lead Score Badge',
    description: 'AI predictive lead scoring component (0-100) featuring heat tier classification (Cold, Cool, Warm, Hot), flame indicator, and factor tooltip.',
    category: 'badges',
    version: '1.0.0',
    accessLevel: 'free',
    status: 'published',
    dependencies: {
      'react': '^19.0.0',
      'lucide-react': '^0.546.0',
    },
    propsDocumentation: [
      { name: 'score', type: 'number', required: true, description: 'Lead qualification score (0-100)' },
      { name: 'showFactors', type: 'boolean', default: 'false', required: false, description: 'Display signal details' },
      { name: 'factors', type: 'string[]', required: false, description: 'Top positive predictive signals' },
      { name: 'compact', type: 'boolean', default: 'false', required: false, description: 'Compact mini mode' },
    ],
    variants: [
      { name: 'hot', label: 'Hot Lead (92)', props: { score: 92, factors: ['VP Title', 'Visited Pricing 4x', 'Budget Confirmed'] } },
      { name: 'warm', label: 'Warm Lead (68)', props: { score: 68, factors: ['Webinar attendee', 'Inbound contact'] } },
      { name: 'cool', label: 'Cool Lead (45)', props: { score: 45, factors: ['Newsletter subscriber'] } },
      { name: 'cold', label: 'Cold Lead (18)', props: { score: 18, factors: ['Inactive 60 days'] } },
    ],
    files: [
      {
        path: 'src/components/crm/LeadScoreBadge.tsx',
        content: `import React, { useState } from 'react';
import { Flame, Sparkles, TrendingUp } from 'lucide-react';

export interface LeadScoreBadgeProps {
  score: number;
  showFactors?: boolean;
  factors?: string[];
  compact?: boolean;
  className?: string;
}

export const LeadScoreBadge: React.FC<LeadScoreBadgeProps> = ({
  score,
  showFactors = false,
  factors = ['High page engagement', 'Executive title', 'Budget confirmed'],
  compact = false,
  className = '',
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const tier = score >= 80 ? 'hot' : score >= 60 ? 'warm' : score >= 40 ? 'cool' : 'cold';

  const tierStyles = {
    hot: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', icon: Flame, label: 'Hot Lead', bar: 'bg-rose-500' },
    warm: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: TrendingUp, label: 'Warm Lead', bar: 'bg-amber-500' },
    cool: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', icon: Sparkles, label: 'Engaged', bar: 'bg-sky-500' },
    cold: { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200', icon: Sparkles, label: 'Cold Lead', bar: 'bg-slate-400' },
  }[tier];

  const Icon = tierStyles.icon;

  return (
    <div className={\`relative inline-flex items-center \${className}\`}>
      <div
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={\`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium cursor-help \${tierStyles.bg} \${tierStyles.text} \${tierStyles.border}\`}
      >
        <Icon className="w-3.5 h-3.5 shrink-0" />
        <span className="font-mono font-bold">{score}</span>
        {!compact && <span className="opacity-75 font-normal">/100 · {tierStyles.label}</span>}
      </div>
    </div>
  );
};

export default LeadScoreBadge;`,
      },
    ],
    exampleUsage: `import { LeadScoreBadge } from '@/components/crm/LeadScoreBadge';

export function ContactRow({ contact }) {
  return (
    <div className="flex items-center justify-between p-3 border-b">
      <span>{contact.name}</span>
      <LeadScoreBadge score={contact.score} />
    </div>
  );
}`,
    thumbnailSvg: `<svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="120" rx="12" fill="#F8FAFC"/>
  <rect x="44" y="44" width="112" height="32" rx="8" fill="#FFF1F2" stroke="#FECDD3"/>
  <circle cx="62" cy="60" r="6" fill="#F43F5E"/>
  <rect x="76" y="55" width="24" height="10" rx="2" fill="#BE123C"/>
  <rect x="106" y="56" width="38" height="8" rx="2" fill="#FDA4AF"/>
</svg>`,
    tags: ['ai', 'scoring', 'lead', 'badge'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'comp-metrics-kpi-card',
    slug: 'metrics-kpi-card',
    name: 'Metrics KPI Card',
    description: 'Executive CRM KPI stat card with percentage change delta badge, trend indicator, goal progress bar, and SVG sparkline chart.',
    category: 'metrics',
    version: '1.2.0',
    accessLevel: 'free',
    status: 'published',
    dependencies: {
      'react': '^19.0.0',
      'lucide-react': '^0.546.0',
    },
    propsDocumentation: [
      { name: 'title', type: 'string', required: true, description: 'Metric card title (e.g. Pipeline Value)' },
      { name: 'value', type: 'string', required: true, description: 'Primary formatted metric value' },
      { name: 'changePercentage', type: 'number', required: true, description: 'Percentage change vs prior period' },
      { name: 'periodLabel', type: 'string', default: "'vs last month'", required: false, description: 'Time comparative label' },
      { name: 'targetValue', type: 'string', required: false, description: 'Target benchmark amount' },
      { name: 'progressPercentage', type: 'number', required: false, description: 'Quota attainment (0-100)' },
      { name: 'sparklineData', type: 'number[]', required: false, description: 'Sparkline trend points' },
    ],
    variants: [
      {
        name: 'pipeline',
        label: 'Pipeline Generated',
        props: {
          title: 'Quarterly Pipeline',
          value: '$1,480,000',
          changePercentage: 24.8,
          periodLabel: 'vs previous quarter',
          progressPercentage: 88,
          targetValue: '$1,650,000',
          sparklineData: [30, 45, 42, 60, 58, 75, 92],
        },
      },
      {
        name: 'winrate',
        label: 'Win Rate',
        props: {
          title: 'Opportunity Win Rate',
          value: '38.4%',
          changePercentage: 4.2,
          periodLabel: 'vs rolling 90 days',
          progressPercentage: 96,
          targetValue: '40.0%',
          sparklineData: [32, 34, 33, 35, 36, 37, 39],
        },
      },
    ],
    files: [
      {
        path: 'src/components/crm/MetricsKpiCard.tsx',
        content: `// Reusable MetricsKpiCard source
import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export interface MetricsKpiCardProps {
  title: string;
  value: string;
  changePercentage: number;
  periodLabel?: string;
  targetValue?: string;
  progressPercentage?: number;
  sparklineData?: number[];
  className?: string;
}

export const MetricsKpiCard: React.FC<MetricsKpiCardProps> = ({
  title,
  value,
  changePercentage,
  periodLabel = 'vs last month',
  targetValue,
  progressPercentage,
  sparklineData = [24, 38, 30, 52, 45, 68, 84],
  className = '',
}) => {
  const isPositive = changePercentage >= 0;
  const points = sparklineData
    .map((d, index) => {
      const x = (index / (sparklineData.length - 1)) * 90;
      const y = 30 - (d / 100) * 26;
      return \`\${x},\${y}\`;
    })
    .join(' ');

  return (
    <div className={\`bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-5 shadow-xs \${className}\`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-500">{title}</span>
        <div className={\`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold \${
          isPositive ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
        }\`}>
          {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
          <span>{Math.abs(changePercentage)}%</span>
        </div>
      </div>
      <div className="flex items-baseline justify-between gap-4">
        <div>
          <div className="text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-white">{value}</div>
          <div className="text-xs text-slate-500 mt-0.5">{periodLabel}</div>
        </div>
        <div className="w-24 h-9">
          <svg viewBox="0 0 90 30" className="w-full h-full">
            <polyline fill="none" stroke={isPositive ? '#059669' : '#e11d48'} strokeWidth="2.2" strokeLinecap="round" points={points} />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default MetricsKpiCard;`,
      },
    ],
    exampleUsage: `import { MetricsKpiCard } from '@/components/crm/MetricsKpiCard';

export function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <MetricsKpiCard
        title="Active Pipeline"
        value="$3,820,000"
        changePercentage={14.2}
        progressPercentage={76}
        targetValue="$5,000,000"
      />
    </div>
  );
}`,
    thumbnailSvg: `<svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="120" rx="12" fill="#F8FAFC"/>
  <rect x="20" y="20" width="160" height="80" rx="8" fill="white" stroke="#E2E8F0"/>
  <rect x="32" y="32" width="60" height="8" rx="2" fill="#94A3B8"/>
  <rect x="136" y="30" width="32" height="14" rx="7" fill="#DCFCE7"/>
  <rect x="32" y="52" width="70" height="18" rx="3" fill="#0F172A"/>
  <path d="M120 74L135 62L148 68L165 52" stroke="#10B981" stroke-width="2.5" stroke-linecap="round"/>
</svg>`,
    tags: ['kpi', 'metric', 'sparkline', 'stat', 'dashboard'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'comp-deal-pipeline-card',
    slug: 'deal-pipeline-card',
    name: 'Deal Pipeline Card',
    description: 'Kanban & pipeline card with company logo, deal amount, close date, win probability progress bar, owner avatar, and quick action menu.',
    category: 'cards',
    version: '1.2.0',
    accessLevel: 'free',
    status: 'published',
    dependencies: {
      'react': '^19.0.0',
      'lucide-react': '^0.546.0',
    },
    propsDocumentation: [
      { name: 'id', type: 'string', required: true, description: 'Deal unique ID' },
      { name: 'title', type: 'string', required: true, description: 'Opportunity title' },
      { name: 'company', type: 'string', required: true, description: 'Account name' },
      { name: 'value', type: 'string', required: true, description: 'Formatted currency deal value' },
      { name: 'stage', type: "'lead' | 'contactMade' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost'", required: true, description: 'Current pipeline stage' },
      { name: 'closeDate', type: 'string', required: true, description: 'Target close date' },
      { name: 'probability', type: 'number', required: true, description: 'Probability percentage (0-100)' },
      { name: 'ownerName', type: 'string', required: true, description: 'Deal owner name' },
      { name: 'daysInStage', type: 'number', default: '12', required: false, description: 'Age in stage for stagnation warning' },
    ],
    variants: [
      {
        name: 'high-value',
        label: 'High Value Enterprise Deal',
        props: {
          id: 'deal-101',
          title: 'Global SOC-2 & IAM Deployment',
          company: 'Acme Financial Inc.',
          value: '$240,000',
          stage: 'negotiation',
          closeDate: 'Oct 31, 2026',
          probability: 85,
          ownerName: 'Sarah Chen',
          daysInStage: 8,
        },
      },
      {
        name: 'stagnant',
        label: 'Stagnant Deal Alert',
        props: {
          id: 'deal-102',
          title: 'Infrastructure Modernization',
          company: 'Legacy Logistics Corp',
          value: '$88,000',
          stage: 'proposal',
          closeDate: 'Nov 14, 2026',
          probability: 45,
          ownerName: 'Marcus Vance',
          daysInStage: 22,
        },
      },
    ],
    files: [
      {
        path: 'src/components/crm/DealPipelineCard.tsx',
        content: `// Reusable DealPipelineCard source
import React from 'react';
import { Building2, Calendar, MoreHorizontal } from 'lucide-react';
import StatusStageBadge, { StageVariant } from './StatusStageBadge';

export interface DealPipelineCardProps {
  id: string;
  title: string;
  company: string;
  value: string;
  stage: StageVariant;
  closeDate: string;
  probability: number;
  ownerName: string;
  daysInStage?: number;
  className?: string;
}

export const DealPipelineCard: React.FC<DealPipelineCardProps> = ({
  title,
  company,
  value,
  stage,
  closeDate,
  probability,
  ownerName,
  className = '',
}) => {
  return (
    <div className={\`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs hover:shadow-md transition-all \${className}\`}>
      <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
        <div className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /><span className="font-medium">{company}</span></div>
        <StatusStageBadge stage={stage} size="sm" />
      </div>
      <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">{title}</h4>
      <div className="text-base font-bold font-mono text-slate-900 dark:text-white mb-3">{value}</div>
      <div className="w-full h-1 bg-slate-100 rounded-full mb-3 overflow-hidden">
        <div className="h-full bg-emerald-500" style={{ width: \`\${probability}%\` }} />
      </div>
      <div className="flex justify-between items-center text-xs text-slate-400">
        <span>{closeDate}</span>
        <span>{ownerName}</span>
      </div>
    </div>
  );
};

export default DealPipelineCard;`,
      },
    ],
    exampleUsage: `import { DealPipelineCard } from '@/components/crm/DealPipelineCard';

export function KanbanColumn({ deals }) {
  return (
    <div className="space-y-3">
      {deals.map(deal => (
        <DealPipelineCard key={deal.id} {...deal} />
      ))}
    </div>
  );
}`,
    thumbnailSvg: `<svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="120" rx="12" fill="#F8FAFC"/>
  <rect x="24" y="16" width="152" height="88" rx="8" fill="white" stroke="#CBD5E1"/>
  <rect x="36" y="28" width="50" height="6" rx="2" fill="#64748B"/>
  <rect x="124" y="26" width="40" height="12" rx="6" fill="#E0E7FF"/>
  <rect x="36" y="42" width="90" height="10" rx="2" fill="#0F172A"/>
  <rect x="36" y="60" width="55" height="14" rx="2" fill="#047857"/>
  <rect x="36" y="82" width="128" height="4" rx="2" fill="#E2E8F0"/>
  <rect x="36" y="82" width="96" height="4" rx="2" fill="#10B981"/>
</svg>`,
    tags: ['pipeline', 'card', 'opportunity', 'kanban', 'deal'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'comp-revenue-forecast-bar',
    slug: 'revenue-forecast-bar',
    name: 'Revenue Forecast Bar',
    description: 'Multi-tiered sales quota vs weighted forecast breakdown bar with hover tooltips, benchmark quota target marker, and gap calculation.',
    category: 'metrics',
    version: '2.0.0',
    accessLevel: 'premium',
    status: 'published',
    dependencies: {
      'react': '^19.0.0',
      'lucide-react': '^0.546.0',
    },
    propsDocumentation: [
      { name: 'quota', type: 'number', required: true, description: 'Sales quota dollar target' },
      { name: 'closedWon', type: 'number', required: true, description: 'Closed won revenue' },
      { name: 'commit', type: 'number', required: true, description: 'Committed revenue (>80%)' },
      { name: 'bestCase', type: 'number', required: true, description: 'Upside forecast revenue (>50%)' },
      { name: 'pipeline', type: 'number', required: true, description: 'Total early stage pipeline' },
      { name: 'periodLabel', type: 'string', default: "'Q3 FY26'", required: false, description: 'Quarterly timeframe' },
    ],
    variants: [
      {
        name: 'on-track',
        label: 'Q3 On-Track Quota Attainment',
        props: {
          quota: 1200000,
          closedWon: 540000,
          commit: 380000,
          bestCase: 240000,
          pipeline: 450000,
          periodLabel: 'Q3 FY26',
        },
      },
      {
        name: 'gap',
        label: 'Early Quarter Pipeline Gap',
        props: {
          quota: 2000000,
          closedWon: 300000,
          commit: 450000,
          bestCase: 400000,
          pipeline: 1200000,
          periodLabel: 'Q4 FY26',
        },
      },
    ],
    files: [
      {
        path: 'src/components/crm/RevenueForecastBar.tsx',
        content: `// Premium RevenueForecastBar implementation
import React, { useState } from 'react';
import { Target, TrendingUp, Info } from 'lucide-react';

export interface RevenueForecastBarProps {
  quota: number;
  closedWon: number;
  commit: number;
  bestCase: number;
  pipeline: number;
  periodLabel?: string;
  className?: string;
}

export const RevenueForecastBar: React.FC<RevenueForecastBarProps> = ({
  quota = 1000000,
  closedWon = 420000,
  commit = 280000,
  bestCase = 180000,
  pipeline = 350000,
  periodLabel = 'Q3 FY26',
  className = '',
}) => {
  const totalCalculated = Math.max(quota * 1.25, closedWon + commit + bestCase + pipeline);
  const formatCurrency = (amt: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amt);

  return (
    <div className={\`bg-white dark:bg-slate-900 border border-slate-200 rounded-xl p-5 shadow-xs \${className}\`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-slate-900 dark:text-white">Revenue Forecast ({periodLabel})</h3>
        <span className="font-mono text-emerald-600 font-bold">{((closedWon / quota) * 100).toFixed(1)}% Attained</span>
      </div>
      <div className="h-7 w-full bg-slate-100 rounded-lg flex overflow-hidden p-0.5 gap-0.5 relative mb-4">
        <div style={{ width: \`\${(closedWon / totalCalculated) * 100}%\` }} className="bg-emerald-500 h-full rounded-l" />
        <div style={{ width: \`\${(commit / totalCalculated) * 100}%\` }} className="bg-indigo-500 h-full" />
        <div style={{ width: \`\${(bestCase / totalCalculated) * 100}%\` }} className="bg-purple-500 h-full" />
        <div style={{ width: \`\${(pipeline / totalCalculated) * 100}%\` }} className="bg-slate-300 h-full rounded-r" />
      </div>
    </div>
  );
};

export default RevenueForecastBar;`,
      },
    ],
    exampleUsage: `import { RevenueForecastBar } from '@/components/crm/RevenueForecastBar';

export function ExecutiveOverview() {
  return (
    <RevenueForecastBar
      quota={1500000}
      closedWon={620000}
      commit={440000}
      bestCase={280000}
      pipeline={650000}
    />
  );
}`,
    thumbnailSvg: `<svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="120" rx="12" fill="#0F172A"/>
  <rect x="24" y="24" width="100" height="8" rx="2" fill="#E2E8F0"/>
  <rect x="24" y="48" width="152" height="24" rx="6" fill="#1E293B"/>
  <rect x="26" y="50" width="50" height="20" rx="4" fill="#10B981"/>
  <rect x="78" y="50" width="34" height="20" fill="#6366F1"/>
  <rect x="114" y="50" width="22" height="20" fill="#A855F7"/>
  <rect x="138" y="50" width="36" height="20" rx="4" fill="#475569"/>
  <line x1="105" y1="42" x2="105" y2="78" stroke="#F43F5E" stroke-width="2"/>
  <rect x="24" y="86" width="30" height="12" rx="3" fill="#065F46"/>
  <rect x="62" y="86" width="30" height="12" rx="3" fill="#3730A3"/>
</svg>`,
    tags: ['revenue', 'forecast', 'quota', 'chart', 'sales', 'premium'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'comp-deal-action-header',
    slug: 'deal-action-header',
    name: 'Deal Action Header',
    description: 'High-density CRM record action header with stage chevron progression stepper, quick-action buttons (Log Call, Email, Task), and deal value editor.',
    category: 'actions',
    version: '1.1.0',
    accessLevel: 'premium',
    status: 'published',
    dependencies: {
      'react': '^19.0.0',
      'lucide-react': '^0.546.0',
    },
    propsDocumentation: [
      { name: 'dealTitle', type: 'string', required: true, description: 'Deal name' },
      { name: 'company', type: 'string', required: true, description: 'Account name' },
      { name: 'amount', type: 'string', required: true, description: 'Deal dollar value' },
      { name: 'currentStage', type: 'StageVariant', required: true, description: 'Current active stage' },
      { name: 'ownerName', type: 'string', required: true, description: 'Deal AE owner' },
      { name: 'onStageChange', type: '(newStage: StageVariant) => void', required: false, description: 'Stage advance handler' },
    ],
    variants: [
      {
        name: 'proposal',
        label: 'In Proposal Review',
        props: {
          dealTitle: 'Enterprise Workspace Cloud Migration',
          company: 'Acme International',
          amount: '$450,000',
          currentStage: 'proposal',
          ownerName: 'Sarah Chen',
        },
      },
    ],
    files: [
      {
        path: 'src/components/crm/DealActionHeader.tsx',
        content: `// Reusable DealActionHeader premium component
import React from 'react';
import { Phone, Mail, CalendarPlus } from 'lucide-react';

export interface DealActionHeaderProps {
  dealTitle: string;
  company: string;
  amount: string;
  currentStage: string;
  ownerName: string;
  className?: string;
}

export const DealActionHeader: React.FC<DealActionHeaderProps> = ({
  dealTitle,
  company,
  amount,
  currentStage,
  ownerName,
  className = '',
}) => {
  return (
    <div className={\`bg-white dark:bg-slate-900 border border-slate-200 rounded-xl p-5 shadow-xs \${className}\`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-xs text-indigo-600 font-semibold">{company}</span>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{dealTitle}</h1>
          <div className="text-xl font-mono font-bold text-emerald-600">{amount}</div>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-xs border rounded-lg flex items-center gap-1.5"><Phone className="w-3.5 h-3.5"/>Log Call</button>
          <button className="px-3 py-1.5 text-xs border rounded-lg flex items-center gap-1.5"><Mail className="w-3.5 h-3.5"/>Email</button>
        </div>
      </div>
    </div>
  );
};

export default DealActionHeader;`,
      },
    ],
    exampleUsage: `import { DealActionHeader } from '@/components/crm/DealActionHeader';

export function DealDetailView() {
  return (
    <DealActionHeader
      dealTitle="Global Infrastructure Expansion"
      company="Stripe"
      amount="$780,000"
      currentStage="negotiation"
      ownerName="Sarah Chen"
    />
  );
}`,
    thumbnailSvg: `<svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="120" rx="12" fill="#0F172A"/>
  <rect x="20" y="20" width="70" height="6" rx="2" fill="#818CF8"/>
  <rect x="20" y="32" width="90" height="12" rx="2" fill="white"/>
  <rect x="20" y="50" width="50" height="10" rx="2" fill="#34D399"/>
  <rect x="130" y="24" width="22" height="14" rx="4" fill="#1E293B" stroke="#475569"/>
  <rect x="156" y="24" width="24" height="14" rx="4" fill="#4F46E5"/>
  <rect x="20" y="76" width="24" height="18" rx="4" fill="#059669"/>
  <rect x="48" y="76" width="24" height="18" rx="4" fill="#059669"/>
  <rect x="76" y="76" width="24" height="18" rx="4" fill="#4F46E5"/>
  <rect x="104" y="76" width="24" height="18" rx="4" fill="#1E293B"/>
  <rect x="132" y="76" width="24" height="18" rx="4" fill="#1E293B"/>
  <rect x="160" y="76" width="20" height="18" rx="4" fill="#1E293B"/>
</svg>`,
    tags: ['header', 'actions', 'stepper', 'pipeline', 'premium'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'comp-activity-timeline-feed',
    slug: 'activity-timeline-feed',
    name: 'Activity Timeline Feed',
    description: 'Omnichannel CRM timeline (Calls, Meetings, Emails, Notes, Stage Advancements) with filters, expandable notes, and quick action logging.',
    category: 'timeline',
    version: '1.1.0',
    accessLevel: 'premium',
    status: 'published',
    dependencies: {
      'react': '^19.0.0',
      'lucide-react': '^0.546.0',
    },
    propsDocumentation: [
      { name: 'initialActivities', type: 'ActivityItem[]', required: false, description: 'Initial CRM activities feed' },
      { name: 'onAddNote', type: '(note: string) => void', required: false, description: 'Callback when note posted' },
    ],
    variants: [
      {
        name: 'standard',
        label: 'Active Account Timeline',
        props: {},
      },
    ],
    files: [
      {
        path: 'src/components/crm/ActivityTimelineFeed.tsx',
        content: `// Reusable ActivityTimelineFeed source
import React, { useState } from 'react';
import { Phone, Mail, Calendar, MessageSquare, ArrowRight } from 'lucide-react';

export interface ActivityTimelineFeedProps {
  className?: string;
}

export const ActivityTimelineFeed: React.FC<ActivityTimelineFeedProps> = () => {
  return (
    <div className="bg-white dark:bg-slate-900 border rounded-xl p-5 shadow-xs">
      <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Activity Timeline</h3>
      <p className="text-xs text-slate-500">Full audit log of communications and deal stage events.</p>
    </div>
  );
};

export default ActivityTimelineFeed;`,
      },
    ],
    exampleUsage: `import { ActivityTimelineFeed } from '@/components/crm/ActivityTimelineFeed';

export function AccountAudit() {
  return <ActivityTimelineFeed />;
}`,
    thumbnailSvg: `<svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="120" rx="12" fill="#0F172A"/>
  <line x1="40" y1="20" x2="40" y2="100" stroke="#334155" stroke-width="2"/>
  <circle cx="40" cy="35" r="7" fill="#6366F1"/>
  <rect x="56" y="28" width="115" height="16" rx="4" fill="#1E293B"/>
  <circle cx="40" cy="65" r="7" fill="#10B981"/>
  <rect x="56" y="58" width="95" height="16" rx="4" fill="#1E293B"/>
  <circle cx="40" cy="95" r="7" fill="#F59E0B"/>
  <rect x="56" y="88" width="125" height="16" rx="4" fill="#1E293B"/>
</svg>`,
    tags: ['timeline', 'audit', 'feed', 'notes', 'premium'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'comp-filterable-deal-table',
    slug: 'filterable-deal-table',
    name: 'Filterable Deal Table',
    description: 'Enterprise Sales CRM data table featuring multi-row selection, column sorting, stage filtering, AI lead scores, and aggregate sum footers.',
    category: 'tables',
    version: '1.0.0',
    accessLevel: 'premium',
    status: 'published',
    dependencies: {
      'react': '^19.0.0',
      'lucide-react': '^0.546.0',
    },
    propsDocumentation: [
      { name: 'initialDeals', type: 'DealRow[]', required: false, description: 'Array of deal opportunities' },
      { name: 'onSelectDeal', type: '(deal: DealRow) => void', required: false, description: 'Row click callback' },
    ],
    variants: [
      {
        name: 'standard',
        label: 'Global Pipeline Table',
        props: {},
      },
    ],
    files: [
      {
        path: 'src/components/crm/FilterableDealTable.tsx',
        content: `// Reusable FilterableDealTable source
import React from 'react';

export const FilterableDealTable: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 border rounded-xl p-5 shadow-xs">
      <h3 className="font-semibold text-slate-900 dark:text-white">Filterable Deal Table</h3>
    </div>
  );
};

export default FilterableDealTable;`,
      },
    ],
    exampleUsage: `import { FilterableDealTable } from '@/components/crm/FilterableDealTable';

export function PipelineView() {
  return <FilterableDealTable />;
}`,
    thumbnailSvg: `<svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="120" rx="12" fill="#0F172A"/>
  <rect x="20" y="20" width="160" height="16" rx="4" fill="#1E293B"/>
  <line x1="20" y1="44" x2="180" y2="44" stroke="#334155"/>
  <rect x="20" y="52" width="160" height="14" rx="2" fill="#1E293B"/>
  <rect x="20" y="72" width="160" height="14" rx="2" fill="#1E293B"/>
  <rect x="20" y="92" width="160" height="14" rx="2" fill="#1E293B"/>
  <circle cx="32" cy="59" r="4" fill="#6366F1"/>
  <circle cx="32" cy="79" r="4" fill="#10B981"/>
  <circle cx="32" cy="99" r="4" fill="#F59E0B"/>
</svg>`,
    tags: ['table', 'grid', 'data', 'sorting', 'selection', 'premium'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
