import React, { useState } from 'react';
import { Target, TrendingUp, Info } from 'lucide-react';

export interface ForecastSegment {
  name: string;
  amount: number;
  color: string;
  badgeClass: string;
  description: string;
}

export interface RevenueForecastBarProps {
  /** Quota target in dollars */
  quota: number;
  /** Closed won revenue */
  closedWon: number;
  /** Committed / highly probable revenue */
  commit: number;
  /** Best case deals */
  bestCase: number;
  /** Total pipeline deals */
  pipeline: number;
  /** Current quarter label (e.g. "Q3 2026") */
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
  const [activeSegment, setActiveSegment] = useState<ForecastSegment | null>(null);

  const totalForecast = closedWon + commit + bestCase;
  const coverageRatio = (totalForecast / quota) * 100;
  const gap = quota - closedWon - commit;

  const segments: ForecastSegment[] = [
    {
      name: 'Closed Won',
      amount: closedWon,
      color: 'bg-emerald-500',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
      description: 'Booked and signed revenue',
    },
    {
      name: 'Committed',
      amount: commit,
      color: 'bg-indigo-500',
      badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800',
      description: 'Verbal agreement, contract in review (>80%)',
    },
    {
      name: 'Best Case',
      amount: bestCase,
      color: 'bg-purple-500',
      badgeClass: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800',
      description: 'Upside opportunities with active champions (>50%)',
    },
    {
      name: 'Open Pipeline',
      amount: pipeline,
      color: 'bg-slate-300 dark:bg-slate-700',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
      description: 'Early stage opportunities in discovery/demo',
    },
  ];

  const totalCalculated = Math.max(quota * 1.25, closedWon + commit + bestCase + pipeline);

  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amt);
  };

  return (
    <div
      className={`bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-5 shadow-xs ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-900 dark:text-white text-base">
              Revenue Forecast & Quota Attainment
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-md font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {periodLabel}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time pipeline weighting against team target of {formatCurrency(quota)}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-medium">Attainment</span>
            <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">
              {((closedWon / quota) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />
          <div className="text-right">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-medium">Commit + Won</span>
            <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {(((closedWon + commit) / quota) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Segmented Bar */}
      <div className="relative mb-5">
        <div className="h-7 w-full bg-slate-100 dark:bg-slate-800 rounded-lg flex overflow-hidden p-0.5 gap-0.5 shadow-inner">
          {segments.map((seg, i) => {
            const widthPct = (seg.amount / totalCalculated) * 100;
            return (
              <div
                key={i}
                onMouseEnter={() => setActiveSegment(seg)}
                onMouseLeave={() => setActiveSegment(null)}
                style={{ width: `${widthPct}%` }}
                className={`${seg.color} h-full transition-all duration-200 cursor-pointer first:rounded-l-md last:rounded-r-md hover:brightness-110 relative group`}
              />
            );
          })}
        </div>

        {/* Quota Marker Line */}
        <div
          className="absolute top-0 bottom-0 pointer-events-none flex flex-col items-center z-10"
          style={{ left: `${(quota / totalCalculated) * 100}%` }}
        >
          <div className="w-0.5 h-7 bg-rose-600 shadow-sm" />
          <div className="bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm -mt-0.5 flex items-center gap-1 whitespace-nowrap">
            <Target className="w-2.5 h-2.5" />
            Quota {formatCurrency(quota)}
          </div>
        </div>
      </div>

      {/* Legend & Breakdown Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
        {segments.map((seg, i) => (
          <div
            key={i}
            onMouseEnter={() => setActiveSegment(seg)}
            onMouseLeave={() => setActiveSegment(null)}
            className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
              activeSegment?.name === seg.name
                ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/20'
                : 'border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className={`w-2 h-2 rounded-full ${seg.color}`} />
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                {seg.name}
              </span>
            </div>
            <div className="text-sm font-bold font-mono text-slate-900 dark:text-white">
              {formatCurrency(seg.amount)}
            </div>
            <div className="text-[11px] text-slate-400">
              {((seg.amount / quota) * 100).toFixed(0)}% of quota
            </div>
          </div>
        ))}
      </div>

      {gap > 0 ? (
        <div className="mt-3 text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-lg border border-amber-200 dark:border-amber-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Info className="w-4 h-4 shrink-0" />
            <span>Gap to Quota with Commit: <strong>{formatCurrency(gap)}</strong></span>
          </div>
          <span className="font-medium text-amber-800 dark:text-amber-200">
            Pipeline coverage: {(pipeline / gap).toFixed(1)}x required
          </span>
        </div>
      ) : (
        <div className="mt-3 text-xs text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 shrink-0" />
          <span>Quota achieved with Closed Won + Commitments! Surplus: <strong>{formatCurrency(Math.abs(gap))}</strong></span>
        </div>
      )}
    </div>
  );
};

export default RevenueForecastBar;
