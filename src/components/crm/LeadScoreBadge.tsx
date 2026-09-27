import React, { useState } from 'react';
import { Flame, Sparkles, TrendingUp } from 'lucide-react';

export interface LeadScoreBadgeProps {
  /** Score value from 0 to 100 */
  score: number;
  /** Show explanatory factors in tooltip / badge */
  showFactors?: boolean;
  /** Factors contributing to the score */
  factors?: string[];
  /** Compact representation */
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

  // Determine heat tier
  const tier =
    score >= 80 ? 'hot' : score >= 60 ? 'warm' : score >= 40 ? 'cool' : 'cold';

  const tierStyles = {
    hot: {
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      text: 'text-rose-700 dark:text-rose-300',
      border: 'border-rose-200 dark:border-rose-800',
      icon: Flame,
      label: 'Hot Lead',
      bar: 'bg-rose-500',
    },
    warm: {
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      text: 'text-amber-700 dark:text-amber-300',
      border: 'border-amber-200 dark:border-amber-800',
      icon: TrendingUp,
      label: 'Warm Lead',
      bar: 'bg-amber-500',
    },
    cool: {
      bg: 'bg-sky-50 dark:bg-sky-950/40',
      text: 'text-sky-700 dark:text-sky-300',
      border: 'border-sky-200 dark:border-sky-800',
      icon: Sparkles,
      label: 'Engaged',
      bar: 'bg-sky-500',
    },
    cold: {
      bg: 'bg-slate-100 dark:bg-slate-800',
      text: 'text-slate-600 dark:text-slate-400',
      border: 'border-slate-200 dark:border-slate-700',
      icon: Sparkles,
      label: 'Cold Lead',
      bar: 'bg-slate-400',
    },
  }[tier];

  const Icon = tierStyles.icon;

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <div
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium cursor-help transition-all shadow-xs ${tierStyles.bg} ${tierStyles.text} ${tierStyles.border}`}
      >
        <Icon className="w-3.5 h-3.5 shrink-0" />
        <span className="font-mono font-bold tracking-tight">{score}</span>
        {!compact && <span className="opacity-75 font-normal">/100 · {tierStyles.label}</span>}
      </div>

      {showTooltip && (
        <div className="absolute bottom-full left-0 mb-2 w-52 p-2.5 bg-slate-900 text-white rounded-lg shadow-xl text-xs z-50 animate-in fade-in zoom-in-95 pointer-events-none">
          <div className="flex justify-between items-center mb-1.5">
            <span className="font-semibold text-slate-200">AI Predictive Score</span>
            <span className="font-mono font-bold text-amber-400">{score}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden mb-2">
            <div
              className={`h-full rounded-full ${tierStyles.bar}`}
              style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
            />
          </div>
          {factors.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">Top Positive Signals</span>
              {factors.map((f, i) => (
                <div key={i} className="flex items-center gap-1.5 text-slate-300 text-[11px]">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LeadScoreBadge;
