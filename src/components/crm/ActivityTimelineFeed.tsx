import React, { useState } from 'react';
import { Phone, Mail, Calendar, MessageSquare, ArrowRight, Plus, Send, Clock, User } from 'lucide-react';

export type ActivityType = 'call' | 'email' | 'meeting' | 'note' | 'stage_change';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  author: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface ActivityTimelineFeedProps {
  initialActivities?: ActivityItem[];
  onAddNote?: (note: string) => void;
  className?: string;
}

const DEFAULT_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    type: 'stage_change',
    title: 'Stage changed to In Negotiation',
    description: 'Advanced deal after security and legal compliance review was completed.',
    author: 'Sarah Chen (VP Sales)',
    timestamp: '2 hours ago',
    metadata: { from: 'Proposal Sent', to: 'In Negotiation' },
  },
  {
    id: 'act-2',
    type: 'meeting',
    title: 'Executive Demo with CTO & Head of Infra',
    description: 'Presented SSO & multi-tenant isolation roadmap. Customer requested enterprise SLA details.',
    author: 'Marcus Vance',
    timestamp: 'Yesterday at 3:30 PM',
    metadata: { duration: '45 mins', attendees: 4 },
  },
  {
    id: 'act-3',
    type: 'email',
    title: 'Pricing agreement draft sent',
    description: 'Attached standard annual enterprise agreement with 15% multi-year discount.',
    author: 'Sarah Chen',
    timestamp: '2 days ago',
  },
  {
    id: 'act-4',
    type: 'call',
    title: 'Discovery call with procurement team',
    description: 'Confirmed procurement calendar. Target sign date is October 15th.',
    author: 'Marcus Vance',
    timestamp: 'Sep 24, 2026',
    metadata: { outcome: 'Follow-up scheduled' },
  },
  {
    id: 'act-5',
    type: 'note',
    title: 'Champion Note',
    description: 'The VP Engineering is our key champion. Prefers automated CLI deployment over manual setups.',
    author: 'Marcus Vance',
    timestamp: 'Sep 20, 2026',
  },
];

export const ActivityTimelineFeed: React.FC<ActivityTimelineFeedProps> = ({
  initialActivities = DEFAULT_ACTIVITIES,
  onAddNote,
  className = '',
}) => {
  const [activities, setActivities] = useState<ActivityItem[]>(initialActivities);
  const [filter, setFilter] = useState<ActivityType | 'all'>('all');
  const [newNote, setNewNote] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'call':
        return <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'email':
        return <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'meeting':
        return <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case 'note':
        return <MessageSquare className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'stage_change':
        return <ArrowRight className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
    }
  };

  const getActivityBadge = (type: ActivityType) => {
    switch (type) {
      case 'call':
        return 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800';
      case 'email':
        return 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800';
      case 'meeting':
        return 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800';
      case 'note':
        return 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800';
      case 'stage_change':
        return 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800';
    }
  };

  const handlePostNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setIsPosting(true);
    const item: ActivityItem = {
      id: `act-${Date.now()}`,
      type: 'note',
      title: 'Internal Account Note',
      description: newNote.trim(),
      author: 'You (Current User)',
      timestamp: 'Just now',
    };

    setActivities([item, ...activities]);
    onAddNote?.(newNote);
    setNewNote('');
    setIsPosting(false);
  };

  const filtered = filter === 'all' ? activities : activities.filter((a) => a.type === filter);

  return (
    <div
      className={`bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-5 shadow-xs ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white text-base">
            Activity Timeline & Touchpoints
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Full history of customer interactions, emails, notes and stage advancements
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs">
          {(['all', 'note', 'call', 'email', 'meeting'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-2.5 py-1 rounded-md font-medium capitalize transition-colors ${
                filter === tab
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {tab === 'all' ? 'All Activity' : `${tab}s`}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Note Input */}
      <form onSubmit={handlePostNote} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Log a quick note, meeting summary, or follow-up note..."
            className="flex-1 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
          />
          <button
            type="submit"
            disabled={!newNote.trim() || isPosting}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            Post
          </button>
        </div>
      </form>

      {/* Feed List */}
      <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
        {filtered.map((item) => (
          <div key={item.id} className="relative group">
            {/* Timeline Dot Icon */}
            <div
              className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full border flex items-center justify-center shadow-xs bg-white dark:bg-slate-900 ${getActivityBadge(
                item.type
              )}`}
            >
              {getActivityIcon(item.type)}
            </div>

            <div className="bg-slate-50/70 dark:bg-slate-800/40 rounded-lg p-3.5 border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all">
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                <span className="text-xs font-semibold text-slate-900 dark:text-white">
                  {item.title}
                </span>
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Clock className="w-3 h-3" />
                  <span>{item.timestamp}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-2">
                {item.description}
              </p>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-slate-100 dark:border-slate-800/60">
                <div className="flex items-center gap-1.5">
                  <User className="w-3 h-3 text-slate-400" />
                  <span>{item.author}</span>
                </div>
                {item.metadata?.duration && (
                  <span className="font-mono">{item.metadata.duration}</span>
                )}
                {item.metadata?.outcome && (
                  <span className="text-emerald-600 font-medium">{item.metadata.outcome}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityTimelineFeed;
