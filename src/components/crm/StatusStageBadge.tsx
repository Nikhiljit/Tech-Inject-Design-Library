import React from 'react';

export type StageVariant =
  | 'lead'
  | 'contactMade'
  | 'qualified'
  | 'proposal'
  | 'negotiation'
  | 'won'
  | 'lost';

export interface StatusStageBadgeProps {
  /** The stage identifier */
  stage: StageVariant;
  /** Custom label override (defaults to standard stage title) */
  label?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Show live status indicator dot */
  showDot?: boolean;
  /** Visual style variant */
  styleVariant?: 'subtle' | 'outline' | 'solid';
  /** Optional click handler for interactive badges */
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
  styleVariant = 'subtle',
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
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`inline-flex items-center rounded-full border transition-colors ${config.bg} ${config.text} ${config.border} ${sizeClasses} ${
        onClick ? 'cursor-pointer hover:opacity-85 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500' : ''
      } ${className}`}
    >
      {showDot && <span className={`rounded-full shrink-0 ${config.dot} ${dotSizes}`} />}
      <span className="whitespace-nowrap">{displayLabel}</span>
    </span>
  );
};

export default StatusStageBadge;
