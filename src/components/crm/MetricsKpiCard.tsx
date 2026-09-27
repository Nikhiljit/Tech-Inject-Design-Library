import React from 'react';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

export interface MetricsKpiCardProps {
  /** Metric title */
  title: string;
  /** Primary metric value (e.g. "$482,900" or "84") */
  value: string;
  /** Percentage change vs prior period (e.g. 18.4) */
  changePercentage: number;
  /** Period description (e.g. "vs last month", "Q3 target") */
  periodLabel?: string;
  /** Optional target value (e.g. "$500,000") */
  targetValue?: string;
  /** Target progress percentage (0 - 100) */
  progressPercentage?: number;
  /** Mini sparkline data points (normalized 0 to 100) */
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

  // Simple SVG sparkline points
  const points = sparklineData
    .map((d, index) => {
      const x = (index / (sparklineData.length - 1)) * 90;
      const y = 30 - (d / 100) * 26;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div
      className={`bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div
          className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold ${
            isPositive
              ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800'
              : 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800'
          }`}
        >
          {isPositive ? (
            <ArrowUpRight className="w-3.5 h-3.5" />
          ) : (
            <ArrowDownRight className="w-3.5 h-3.5" />
          )}
          <span>{Math.abs(changePercentage)}%</span>
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-4">
        <div>
          <div className="text-2xl font-bold font-mono tracking-tight text-slate-900 dark:text-white">
            {value}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {periodLabel}
          </div>
        </div>

        {sparklineData && sparklineData.length > 1 && (
          <div className="w-24 h-9">
            <svg viewBox="0 0 90 30" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id={`kpi-grad-${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isPositive ? '#10b981' : '#f43f5e'} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={isPositive ? '#10b981' : '#f43f5e'} stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <polyline
                fill="none"
                stroke={isPositive ? '#059669' : '#e11d48'}
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
              />
            </svg>
          </div>
        )}
      </div>

      {progressPercentage !== undefined && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex justify-between items-center text-xs mb-1.5">
            <span className="text-slate-500 dark:text-slate-400">Target Progress</span>
            <span className="font-mono font-medium text-slate-700 dark:text-slate-200">
              {progressPercentage}% {targetValue ? `of ${targetValue}` : ''}
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                progressPercentage >= 100 ? 'bg-emerald-500' : 'bg-indigo-600'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, progressPercentage))}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MetricsKpiCard;
