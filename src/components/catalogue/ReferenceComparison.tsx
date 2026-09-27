import React, { useState } from 'react';
import { Layers, CheckCircle2, Sliders, Palette, ShieldCheck, Eye } from 'lucide-react';
import StatusStageBadge from '../crm/StatusStageBadge';
import LeadScoreBadge from '../crm/LeadScoreBadge';
import MetricsKpiCard from '../crm/MetricsKpiCard';
import DealPipelineCard from '../crm/DealPipelineCard';

export const ReferenceComparison: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tokens' | 'boundaries' | 'side-by-side'>('side-by-side');

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Layers className="w-4 h-4" />
              <span>Section 2 Visual Analysis</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Sales CRM Reference UI Analysis & Component Boundaries
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Deconstructed from the Sales CRM reference standard: extracted reusable theme tokens, established clear component boundaries, and verified high fidelity.
            </p>
          </div>

          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs">
            <button
              onClick={() => setActiveTab('side-by-side')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeTab === 'side-by-side'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Side-by-Side Recreation
            </button>
            <button
              onClick={() => setActiveTab('tokens')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeTab === 'tokens'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Extracted Theme Tokens
            </button>
            <button
              onClick={() => setActiveTab('boundaries')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeTab === 'boundaries'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Component Boundaries
            </button>
          </div>
        </div>

        {activeTab === 'side-by-side' && (
          <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            {/* Comparison Item 1: Deal Pipeline Card */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-950/40">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-3">
                  <span className="uppercase tracking-wider">CRM Reference Specification</span>
                  <span className="bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px]">Reference Archetype</span>
                </div>
                <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                  <div className="text-slate-400 font-medium">Observed Design Attributes:</div>
                  <ul className="space-y-1 text-slate-600 dark:text-slate-300 list-disc list-inside text-[11px]">
                    <li>Target account name paired with building icon</li>
                    <li>Tabular currency figures ($240,000) in bold font</li>
                    <li>Semantic pipeline stage badge with colored status dot</li>
                    <li>Visual probability meter bar with 3 color thresholds</li>
                    <li>AE owner avatar with fallback initials</li>
                    <li>Days in stage age counter with stagnation threshold warning</li>
                  </ul>
                </div>
              </div>

              <div className="border border-indigo-200 dark:border-indigo-900/60 rounded-xl p-4 bg-indigo-50/20 dark:bg-indigo-950/20">
                <div className="flex items-center justify-between text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-3">
                  <span className="uppercase tracking-wider">Tech Inject Recreated Component</span>
                  <span className="bg-indigo-100 dark:bg-indigo-900/60 px-2 py-0.5 rounded text-[10px] text-indigo-700 dark:text-indigo-300">Live Rendered</span>
                </div>
                <DealPipelineCard
                  id="deal-comp-1"
                  title="Global SOC-2 & Cloud Security Suite"
                  company="FinCorp Global Ltd."
                  value="$240,000"
                  stage="negotiation"
                  closeDate="Oct 31, 2026"
                  probability={85}
                  ownerName="Sarah Chen"
                  daysInStage={8}
                />
              </div>
            </div>

            {/* Comparison Item 2: KPI Metrics & Predictive Scoring */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-950/40">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-3">
                  <span className="uppercase tracking-wider">CRM Reference Specification</span>
                  <span className="bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px]">Reference Archetype</span>
                </div>
                <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                  <div className="text-slate-400 font-medium">Observed Design Attributes:</div>
                  <ul className="space-y-1 text-slate-600 dark:text-slate-300 list-disc list-inside text-[11px]">
                    <li>Uppercase tracking-wide KPI category label</li>
                    <li>High-contrast percentage delta badge with directional arrow</li>
                    <li>Smooth inline SVG trend sparkline</li>
                    <li>Predictive lead qualification scores with Cold / Cool / Warm / Hot heat tiers</li>
                  </ul>
                </div>
              </div>

              <div className="border border-indigo-200 dark:border-indigo-900/60 rounded-xl p-4 bg-indigo-50/20 dark:bg-indigo-950/20">
                <div className="flex items-center justify-between text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-3">
                  <span className="uppercase tracking-wider">Tech Inject Recreated Component</span>
                  <span className="bg-indigo-100 dark:bg-indigo-900/60 px-2 py-0.5 rounded text-[10px] text-indigo-700 dark:text-indigo-300">Live Rendered</span>
                </div>
                <div className="space-y-3">
                  <MetricsKpiCard
                    title="Active Opportunity Pipeline"
                    value="$1,480,000"
                    changePercentage={24.8}
                    periodLabel="vs previous quarter"
                    progressPercentage={84}
                    targetValue="$1,650,000"
                  />
                  <div className="flex items-center gap-3">
                    <LeadScoreBadge score={92} />
                    <LeadScoreBadge score={68} />
                    <LeadScoreBadge score={42} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tokens' && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Palette className="w-4 h-4 text-indigo-600" />
              Extracted Semantic Color & Pipeline Stage Tokens
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { stage: 'lead', name: 'Lead / Discovery', hex: '#64748B', desc: 'Neutral slate for unqualified prospects' },
                { stage: 'contactMade', name: 'Contact Made', hex: '#3B82F6', desc: 'Clear blue for active outreach touchpoints' },
                { stage: 'qualified', name: 'Qualified Stage', hex: '#6366F1', desc: 'Indigo for validated budget and authority' },
                { stage: 'proposal', name: 'Proposal Sent', hex: '#F59E0B', desc: 'Amber alert for contracts in client review' },
                { stage: 'negotiation', name: 'In Negotiation', hex: '#A855F7', desc: 'Purple for security and legal terms' },
                { stage: 'won', name: 'Closed Won', hex: '#10B981', desc: 'Emerald green for booked revenue' },
                { stage: 'lost', name: 'Closed Lost', hex: '#F43F5E', desc: 'Rose red for archived or lost deals' },
              ].map((item) => (
                <div key={item.stage} className="p-3 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50/50 dark:bg-slate-950/40">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-xs text-slate-900 dark:text-white">{item.name}</span>
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.hex }} />
                  </div>
                  <div className="text-[11px] text-slate-500 mb-2">{item.desc}</div>
                  <StatusStageBadge stage={item.stage as any} size="sm" />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'boundaries' && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3 text-xs text-slate-600 dark:text-slate-300">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Component Boundary & Variant Decisions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
                <div className="font-semibold text-slate-900 dark:text-white mb-1">1. Atomic Badge vs Deal Header</div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Extracted <code>StatusStageBadge</code> as an independent primitive that can be reused anywhere (Kanban cards, headers, tables) instead of locking stage logic inside monolithic deal cards.
                </p>
              </div>
              <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
                <div className="font-semibold text-slate-900 dark:text-white mb-1">2. Variants vs Separate Components</div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Stage differences (lead, qualified, won) and KPI trends (positive/negative) were modelled as <em>variants</em> of a single component contract rather than distinct components.
                </p>
              </div>
              <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
                <div className="font-semibold text-slate-900 dark:text-white mb-1">3. Non-Rebuilt CRM Features</div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Omitted business features (full backend syncing, SMTP email dispatch, billing gateways) in strict accordance with Section 2: "Recreate its component theme, not its business features."
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReferenceComparison;
