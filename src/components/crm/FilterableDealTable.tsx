import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, ArrowUpDown, Filter, Download, CheckSquare, Square, Building2, User } from 'lucide-react';
import StatusStageBadge, { StageVariant } from './StatusStageBadge';
import LeadScoreBadge from './LeadScoreBadge';

export interface DealRow {
  id: string;
  name: string;
  company: string;
  amount: number;
  stage: StageVariant;
  score: number;
  owner: string;
  closeDate: string;
}

export interface FilterableDealTableProps {
  initialDeals?: DealRow[];
  onSelectDeal?: (deal: DealRow) => void;
  className?: string;
}

const DEFAULT_DEALS: DealRow[] = [
  { id: '1', name: 'Global Enterprise Cloud Migration', company: 'Acme Global', amount: 340000, stage: 'negotiation', score: 92, owner: 'Sarah Chen', closeDate: '2026-10-15' },
  { id: '2', name: 'Security & Compliance Suite', company: 'FinCorp Holdings', amount: 185000, stage: 'proposal', score: 78, owner: 'Marcus Vance', closeDate: '2026-10-28' },
  { id: '3', name: 'CRM Automation Pilot (500 seats)', company: 'Nexus Logistics', amount: 94000, stage: 'qualified', score: 65, owner: 'Elena Rostova', closeDate: '2026-11-04' },
  { id: '4', name: 'Multi-Tenant Analytics Platform', company: 'Stratosphere Tech', amount: 520000, stage: 'won', score: 95, owner: 'Sarah Chen', closeDate: '2026-09-18' },
  { id: '5', name: 'Developer Tooling Renewal', company: 'ByteCraft Systems', amount: 62000, stage: 'contactMade', score: 54, owner: 'David Kim', closeDate: '2026-11-20' },
  { id: '6', name: 'AI Voice Agent Integration', company: 'Apex Healthcare', amount: 275000, stage: 'proposal', score: 88, owner: 'Marcus Vance', closeDate: '2026-10-30' },
];

export const FilterableDealTable: React.FC<FilterableDealTableProps> = ({
  initialDeals = DEFAULT_DEALS,
  onSelectDeal,
  className = '',
}) => {
  const [deals] = useState<DealRow[]>(initialDeals);
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<'amount' | 'score' | 'closeDate'>('amount');
  const [sortAsc, setSortAsc] = useState(false);

  const filteredDeals = useMemo(() => {
    return deals
      .filter((d) => {
        const matchesSearch =
          d.name.toLowerCase().includes(search.toLowerCase()) ||
          d.company.toLowerCase().includes(search.toLowerCase()) ||
          d.owner.toLowerCase().includes(search.toLowerCase());
        const matchesStage = stageFilter === 'all' || d.stage === stageFilter;
        return matchesSearch && matchesStage;
      })
      .sort((a, b) => {
        const factor = sortAsc ? 1 : -1;
        if (sortField === 'amount') return (a.amount - b.amount) * factor;
        if (sortField === 'score') return (a.score - b.score) * factor;
        return a.closeDate.localeCompare(b.closeDate) * factor;
      });
  }, [deals, search, stageFilter, sortField, sortAsc]);

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredDeals.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredDeals.map((d) => d.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const totalFilteredValue = filteredDeals.reduce((sum, d) => sum + d.amount, 0);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div
      className={`bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden ${className}`}
    >
      {/* Table Toolbar */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search deals, companies, reps..."
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-3.5 py-1.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">All Stages</option>
            <option value="qualified">Qualified</option>
            <option value="proposal">Proposal</option>
            <option value="negotiation">Negotiation</option>
            <option value="won">Closed Won</option>
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs">
          {selectedIds.size > 0 && (
            <span className="font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-md border border-indigo-200 dark:border-indigo-800">
              {selectedIds.size} selected
            </span>
          )}
          <span className="text-slate-500 dark:text-slate-400">
            Total Pipeline: <strong className="font-mono text-slate-900 dark:text-white">{formatCurrency(totalFilteredValue)}</strong>
          </span>
        </div>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-800 select-none">
            <tr>
              <th className="p-3 w-8">
                <button type="button" onClick={toggleSelectAll} className="text-slate-400 hover:text-slate-600">
                  {selectedIds.size === filteredDeals.length && filteredDeals.length > 0 ? (
                    <CheckSquare className="w-4 h-4 text-indigo-600" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
              </th>
              <th className="p-3">Deal & Target Account</th>
              <th
                className="p-3 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200"
                onClick={() => {
                  setSortField('amount');
                  setSortAsc(sortField === 'amount' ? !sortAsc : false);
                }}
              >
                <div className="flex items-center gap-1">
                  <span>Deal Value</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="p-3">Stage</th>
              <th
                className="p-3 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200"
                onClick={() => {
                  setSortField('score');
                  setSortAsc(sortField === 'score' ? !sortAsc : false);
                }}
              >
                <div className="flex items-center gap-1">
                  <span>AI Score</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="p-3">Account Rep</th>
              <th
                className="p-3 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200"
                onClick={() => {
                  setSortField('closeDate');
                  setSortAsc(sortField === 'closeDate' ? !sortAsc : false);
                }}
              >
                <div className="flex items-center gap-1">
                  <span>Target Date</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {filteredDeals.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400">
                  No deals match your search criteria.
                </td>
              </tr>
            ) : (
              filteredDeals.map((deal) => {
                const isChecked = selectedIds.has(deal.id);
                return (
                  <tr
                    key={deal.id}
                    onClick={() => onSelectDeal?.(deal)}
                    className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/50 cursor-pointer transition-colors ${
                      isChecked ? 'bg-indigo-50/30 dark:bg-indigo-950/20' : ''
                    }`}
                  >
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => toggleSelect(deal.id)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-indigo-600" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-slate-900 dark:text-white leading-tight">
                        {deal.name}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                        <Building2 className="w-3 h-3" />
                        <span>{deal.company}</span>
                      </div>
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">
                      {formatCurrency(deal.amount)}
                    </td>
                    <td className="p-3">
                      <StatusStageBadge stage={deal.stage} size="sm" />
                    </td>
                    <td className="p-3">
                      <LeadScoreBadge score={deal.score} compact />
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3 h-3 text-slate-400" />
                        <span>{deal.owner}</span>
                      </div>
                    </td>
                    <td className="p-3 font-mono text-slate-500 dark:text-slate-400">
                      {deal.closeDate}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FilterableDealTable;
