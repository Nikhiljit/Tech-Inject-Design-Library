import React, { useState } from 'react';
import { MoreHorizontal, Calendar, Building2, User, CheckCircle2, AlertCircle } from 'lucide-react';
import StatusStageBadge, { StageVariant } from './StatusStageBadge';

export interface DealPipelineCardProps {
  /** Unique deal ID */
  id: string;
  /** Deal title / opportunity name */
  title: string;
  /** Target account / company name */
  company: string;
  /** Opportunity value formatted (e.g. "$125,000") */
  value: string;
  /** Numerical value for calculation */
  amount?: number;
  /** Pipeline stage */
  stage: StageVariant;
  /** Expected close date (e.g. "Oct 15, 2026") */
  closeDate: string;
  /** Close probability (0 - 100) */
  probability: number;
  /** Deal owner / account executive name */
  ownerName: string;
  /** Deal owner avatar URL or fallback initials */
  ownerAvatar?: string;
  /** Days currently spent in this stage */
  daysInStage?: number;
  /** Selected state in board */
  isSelected?: boolean;
  /** Drag or select callback */
  onSelect?: (id: string) => void;
  /** Quick action callback */
  onAction?: (action: 'advance' | 'edit' | 'archive', id: string) => void;
  className?: string;
}

export const DealPipelineCard: React.FC<DealPipelineCardProps> = ({
  id,
  title,
  company,
  value,
  stage,
  closeDate,
  probability,
  ownerName,
  ownerAvatar,
  daysInStage = 12,
  isSelected = false,
  onSelect,
  onAction,
  className = '',
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div
      onClick={() => onSelect && onSelect(id)}
      className={`relative bg-white dark:bg-slate-900 border rounded-xl p-4 transition-all duration-150 cursor-pointer shadow-xs ${
        isSelected
          ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-md'
          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md'
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <Building2 className="w-3.5 h-3.5 shrink-0" />
          <span className="font-medium truncate max-w-[140px]">{company}</span>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {showMenu && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-full mt-1 w-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg py-1 z-30 text-xs"
            >
              <button
                onClick={() => {
                  setShowMenu(false);
                  onAction?.('advance', id);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Advance Stage
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  onAction?.('edit', id);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                Edit Deal
              </button>
              <button
                onClick={() => {
                  setShowMenu(false);
                  onAction?.('archive', id);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-rose-600 dark:text-rose-400"
              >
                Archive Deal
              </button>
            </div>
          )}
        </div>
      </div>

      <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2 leading-snug hover:text-indigo-600 transition-colors">
        {title}
      </h4>

      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="text-base font-bold font-mono text-slate-900 dark:text-white tracking-tight">
          {value}
        </div>
        <StatusStageBadge stage={stage} size="sm" />
      </div>

      {/* Probability and Close Date */}
      <div className="space-y-1.5 mb-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400">
          <span>Win Probability</span>
          <span className="font-mono font-medium text-slate-700 dark:text-slate-300">{probability}%</span>
        </div>
        <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${
              probability >= 70
                ? 'bg-emerald-500'
                : probability >= 40
                ? 'bg-amber-500'
                : 'bg-rose-500'
            }`}
            style={{ width: `${probability}%` }}
          />
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <span className="text-[11px]">{closeDate}</span>
        </div>

        <div className="flex items-center gap-1.5" title={`Owner: ${ownerName}`}>
          <span className="text-[11px] hidden sm:inline">{ownerName.split(' ')[0]}</span>
          {ownerAvatar ? (
            <img src={ownerAvatar} alt={ownerName} className="w-5 h-5 rounded-full object-cover" />
          ) : (
            <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold flex items-center justify-center">
              {getInitials(ownerName)}
            </div>
          )}
        </div>
      </div>

      {daysInStage > 14 && (
        <div className="mt-2.5 flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-md">
          <AlertCircle className="w-3 h-3 shrink-0" />
          <span>In stage for {daysInStage} days (Needs follow-up)</span>
        </div>
      )}
    </div>
  );
};

export default DealPipelineCard;
