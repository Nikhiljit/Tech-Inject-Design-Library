import React, { useState } from 'react';
import { Mail, Phone, CalendarPlus, CheckCircle2, ChevronRight, Edit3, UserCheck, ShieldAlert } from 'lucide-react';
import StatusStageBadge, { StageVariant } from './StatusStageBadge';

export interface DealActionHeaderProps {
  dealTitle: string;
  company: string;
  amount: string;
  currentStage: StageVariant;
  ownerName: string;
  onStageChange?: (newStage: StageVariant) => void;
  onLogCall?: () => void;
  onSendEmail?: () => void;
  onCreateTask?: () => void;
  onEditAmount?: () => void;
  className?: string;
}

const STAGES_ORDER: StageVariant[] = [
  'lead',
  'contactMade',
  'qualified',
  'proposal',
  'negotiation',
  'won',
];

export const DealActionHeader: React.FC<DealActionHeaderProps> = ({
  dealTitle,
  company,
  amount,
  currentStage,
  ownerName,
  onStageChange,
  onLogCall,
  onSendEmail,
  onCreateTask,
  onEditAmount,
  className = '',
}) => {
  const currentStageIndex = STAGES_ORDER.indexOf(currentStage);

  return (
    <div
      className={`bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-5 shadow-xs ${className}`}
    >
      {/* Top Bar: Title, Company, Actions */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">{company}</span>
            <span>/</span>
            <span>Opportunities</span>
            <span>/</span>
            <span className="font-mono text-[11px] text-slate-400">#OPP-2026-94</span>
          </div>

          <div className="flex flex-wrap items-baseline gap-3">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {dealTitle}
            </h1>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {amount}
              </span>
              <button
                onClick={onEditAmount}
                title="Edit Deal Value"
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={onLogCall}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 shadow-xs transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-slate-500" />
            Log Call
          </button>
          <button
            type="button"
            onClick={onSendEmail}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 shadow-xs transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-indigo-500" />
            Send Email
          </button>
          <button
            type="button"
            onClick={onCreateTask}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 shadow-xs transition-colors"
          >
            <CalendarPlus className="w-3.5 h-3.5 text-amber-500" />
            Create Task
          </button>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1" />
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Owner: <strong>{ownerName}</strong></span>
          </div>
        </div>
      </div>

      {/* Stage Progression Stepper */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 flex items-center justify-between">
          <span>Pipeline Stage Progress</span>
          <span>Click any stage to advance or backtrack</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-1.5">
          {STAGES_ORDER.map((stage, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            const isFuture = idx > currentStageIndex;

            return (
              <button
                key={stage}
                type="button"
                onClick={() => onStageChange?.(stage)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium border transition-all text-left ${
                  isCurrent
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : isCompleted
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
                    : 'bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="capitalize truncate">
                  {stage.replace(/([A-Z])/g, ' $1')}
                </span>
                {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />}
                {isCurrent && <ChevronRight className="w-3.5 h-3.5 shrink-0 text-white" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DealActionHeader;
