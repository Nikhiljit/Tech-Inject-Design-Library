import React, { useState } from 'react';
import StatusStageBadge from '../crm/StatusStageBadge';
import LeadScoreBadge from '../crm/LeadScoreBadge';
import MetricsKpiCard from '../crm/MetricsKpiCard';
import DealPipelineCard from '../crm/DealPipelineCard';
import RevenueForecastBar from '../crm/RevenueForecastBar';
import DealActionHeader from '../crm/DealActionHeader';
import ActivityTimelineFeed from '../crm/ActivityTimelineFeed';
import FilterableDealTable from '../crm/FilterableDealTable';
import { ComponentDefinition, PublicComponentDetail } from '../../types/registry';
import { Monitor, Tablet, Smartphone, Moon, Sun, RotateCcw } from 'lucide-react';

interface ComponentPreviewRendererProps {
  component: PublicComponentDetail | ComponentDefinition;
  activeVariant?: string;
  isDarkCanvas?: boolean;
}

export const ComponentPreviewRenderer: React.FC<ComponentPreviewRendererProps> = ({
  component,
  activeVariant,
  isDarkCanvas = false,
}) => {
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [darkCanvas, setDarkCanvas] = useState(isDarkCanvas);
  const [renderKey, setRenderKey] = useState(0);

  // Find props from active variant or defaults
  const variantObj = component.variants?.find((v) => v.name === activeVariant);
  const variantProps = variantObj?.props || {};

  const getViewportWidth = () => {
    switch (viewport) {
      case 'desktop':
        return 'w-full';
      case 'tablet':
        return 'max-w-[720px] w-full';
      case 'mobile':
        return 'max-w-[375px] w-full';
    }
  };

  const renderComponentLive = () => {
    switch (component.slug) {
      case 'status-stage-badge':
        return (
          <div className="flex flex-wrap items-center justify-center gap-4 p-8">
            <StatusStageBadge
              stage={variantProps.stage || 'proposal'}
              size={variantProps.size || 'md'}
              label={variantProps.label}
              showDot={variantProps.showDot ?? true}
            />
            {/* Show other stages as variants gallery */}
            <div className="w-full pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-center gap-2">
              <StatusStageBadge stage="lead" size="sm" />
              <StatusStageBadge stage="contactMade" size="sm" />
              <StatusStageBadge stage="qualified" size="sm" />
              <StatusStageBadge stage="proposal" size="sm" />
              <StatusStageBadge stage="negotiation" size="sm" />
              <StatusStageBadge stage="won" size="sm" />
              <StatusStageBadge stage="lost" size="sm" />
            </div>
          </div>
        );

      case 'lead-score-badge':
        return (
          <div className="flex flex-col items-center justify-center gap-6 p-8">
            <LeadScoreBadge
              score={variantProps.score ?? 88}
              factors={variantProps.factors || ['High engagement', 'Executive sponsor']}
              compact={variantProps.compact ?? false}
            />
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <LeadScoreBadge score={94} compact />
              <LeadScoreBadge score={72} compact />
              <LeadScoreBadge score={48} compact />
              <LeadScoreBadge score={22} compact />
            </div>
          </div>
        );

      case 'metrics-kpi-card':
        return (
          <div className="p-6 max-w-sm w-full mx-auto">
            <MetricsKpiCard
              title={variantProps.title || 'Quarterly Pipeline'}
              value={variantProps.value || '$1,480,000'}
              changePercentage={variantProps.changePercentage ?? 24.8}
              periodLabel={variantProps.periodLabel || 'vs previous quarter'}
              progressPercentage={variantProps.progressPercentage ?? 84}
              targetValue={variantProps.targetValue || '$1,650,000'}
              sparklineData={variantProps.sparklineData || [24, 38, 30, 52, 45, 68, 84]}
            />
          </div>
        );

      case 'deal-pipeline-card':
        return (
          <div className="p-6 max-w-sm w-full mx-auto">
            <DealPipelineCard
              id="preview-deal-1"
              title={variantProps.title || 'Enterprise IAM & SSO Deployment'}
              company={variantProps.company || 'Global Logistics Co.'}
              value={variantProps.value || '$240,000'}
              stage={variantProps.stage || 'negotiation'}
              closeDate={variantProps.closeDate || 'Oct 31, 2026'}
              probability={variantProps.probability ?? 80}
              ownerName={variantProps.ownerName || 'Sarah Chen'}
              daysInStage={variantProps.daysInStage ?? 9}
            />
          </div>
        );

      case 'revenue-forecast-bar':
        return (
          <div className="p-6 w-full">
            <RevenueForecastBar
              quota={variantProps.quota ?? 1200000}
              closedWon={variantProps.closedWon ?? 540000}
              commit={variantProps.commit ?? 380000}
              bestCase={variantProps.bestCase ?? 240000}
              pipeline={variantProps.pipeline ?? 450000}
              periodLabel={variantProps.periodLabel || 'Q3 FY26'}
            />
          </div>
        );

      case 'deal-action-header':
        return (
          <div className="p-4 w-full">
            <DealActionHeader
              dealTitle={variantProps.dealTitle || 'Multi-Year Cloud Infrastructure Migration'}
              company={variantProps.company || 'FinTech Global Systems'}
              amount={variantProps.amount || '$650,000'}
              currentStage={variantProps.currentStage || 'proposal'}
              ownerName={variantProps.ownerName || 'Marcus Vance'}
            />
          </div>
        );

      case 'activity-timeline-feed':
        return (
          <div className="p-4 max-w-2xl w-full mx-auto">
            <ActivityTimelineFeed />
          </div>
        );

      case 'filterable-deal-table':
        return (
          <div className="p-4 w-full">
            <FilterableDealTable />
          </div>
        );

      default:
        // Dynamically uploaded component preview
        return (
          <div className="p-8 text-center max-w-md mx-auto">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 mb-3 border border-indigo-200 dark:border-indigo-800">
              <span className="font-mono font-bold text-sm">TSX</span>
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-1">{component.name}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{component.description}</p>
            <div className="text-left bg-slate-50 dark:bg-slate-950 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-mono">
              <div className="text-slate-400 text-[10px] mb-1 uppercase font-semibold">Declared Files:</div>
              {component.files?.map((f, i) => (
                <div key={i} className="text-slate-700 dark:text-slate-300 py-0.5 truncate">
                  📄 {f.path}
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-xs">
      {/* Preview Control Toolbar */}
      <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-slate-700 dark:text-slate-200">Interactive Preview</span>
          <span className="text-[11px] text-slate-400 font-mono">({component.slug})</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Viewport Toggles */}
          <div className="flex items-center bg-slate-200/70 dark:bg-slate-700/60 p-0.5 rounded-md">
            <button
              type="button"
              onClick={() => setViewport('desktop')}
              title="Desktop View (100%)"
              className={`p-1 rounded ${viewport === 'desktop' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewport('tablet')}
              title="Tablet View (720px)"
              className={`p-1 rounded ${viewport === 'tablet' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewport('mobile')}
              title="Mobile View (375px)"
              className={`p-1 rounded ${viewport === 'mobile' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Dark / Light Canvas Toggle */}
          <button
            type="button"
            onClick={() => setDarkCanvas(!darkCanvas)}
            title="Toggle Canvas Theme"
            className="p-1.5 rounded-md text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors"
          >
            {darkCanvas ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {/* Reset Render */}
          <button
            type="button"
            onClick={() => setRenderKey((k) => k + 1)}
            title="Reset component state"
            className="p-1.5 rounded-md text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Render Canvas */}
      <div
        className={`p-6 flex items-center justify-center transition-colors min-h-[280px] ${
          darkCanvas ? 'bg-slate-950 text-slate-100' : 'bg-slate-50/60 text-slate-900'
        }`}
      >
        <div key={renderKey} className={`transition-all duration-200 flex justify-center ${getViewportWidth()}`}>
          {renderComponentLive()}
        </div>
      </div>
    </div>
  );
};

export default ComponentPreviewRenderer;
