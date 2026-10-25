import React, { useState } from 'react';
import { X, Plus, BookOpen, Trash2, Search, Sparkles, Tag, Check, Crown } from 'lucide-react';
import { DayKeywordPreset, TripRegion } from '../types/itinerary';

interface KeywordsManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  keywords: DayKeywordPreset[];
  onAddKeyword: (preset: DayKeywordPreset) => void;
  onDeleteKeyword: (id: string) => void;
}

export const KeywordsManagementModal: React.FC<KeywordsManagementModalProps> = ({
  isOpen,
  onClose,
  keywords,
  onAddKeyword,
  onDeleteKeyword,
}) => {
  const [search, setSearch] = useState('');
  const [filterRegion, setFilterRegion] = useState<'ALL' | TripRegion>('ALL');

  // New Keyword Form
  const [isCreating, setIsCreating] = useState(false);
  const [newKeyword, setNewKeyword] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newActivities, setNewActivities] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newRegion, setNewRegion] = useState<TripRegion>('DOM');

  if (!isOpen) return null;

  const filtered = keywords.filter((k) => {
    if (filterRegion !== 'ALL' && k.region !== filterRegion) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        k.keyword.toLowerCase().includes(q) ||
        k.title.toLowerCase().includes(q) ||
        k.defaultActivities.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyword.trim() || !newTitle.trim()) return;

    const preset: DayKeywordPreset = {
      id: `kw-${Date.now()}`,
      keyword: newKeyword.trim(),
      title: newTitle.trim(),
      defaultActivities: newActivities.trim(),
      defaultNotes: newNotes.trim() || undefined,
      region: newRegion,
      suggestedHighlight: newKeyword.split('/')[1] || newKeyword,
    };

    onAddKeyword(preset);
    setIsCreating(false);
    setNewKeyword('');
    setNewTitle('');
    setNewActivities('');
    setNewNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold font-sans-luxury text-slate-950">
                Keywords & Itinerary Day Templates
              </h2>
              <p className="text-xs text-slate-500">
                Manage fast-insert keywords used by consultants during day curation
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-950 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar in white & grey glass */}
        <div className="p-4 border-b border-slate-100 bg-white flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search templates e.g. Havelock, Bio, Heli..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 font-sans-luxury"
              />
            </div>

            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setFilterRegion('ALL')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filterRegion === 'ALL'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                ALL
              </button>
              <button
                type="button"
                onClick={() => setFilterRegion('DOM')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filterRegion === 'DOM'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                DOM
              </button>
              <button
                type="button"
                onClick={() => setFilterRegion('INTL')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  filterRegion === 'INTL'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                INTL
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCreating(!isCreating)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow transition-colors"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>New Keyword Template</span>
          </button>
        </div>

        {/* Content list & Form */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          
          {/* Create Form Drawer */}
          {isCreating && (
            <form
              onSubmit={handleSaveNew}
              className="bg-slate-50/90 border border-slate-300 rounded-2xl p-5 space-y-3 mb-6 shadow-xs"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-950 uppercase tracking-wider">
                  Create Day Template
                </span>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="text-slate-500 hover:text-slate-950 text-xs font-medium"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Keyword (e.g. Ooty/TeaPlantation, Andaman/ReefDive)
                  </label>
                  <input
                    type="text"
                    required
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    placeholder="e.g. Coorg/RainforestHike"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                    Region
                  </label>
                  <select
                    value={newRegion}
                    onChange={(e) => setNewRegion(e.target.value as TripRegion)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-400"
                  >
                    <option value="DOM">DOM (Domestic)</option>
                    <option value="INTL">INTL (International)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Full Day Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Western Ghats Shola Canopy Walk & Micro-Roast Cupping"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-400 font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Default Activities (Multi-line)
                </label>
                <textarea
                  rows={3}
                  required
                  value={newActivities}
                  onChange={(e) => setNewActivities(e.target.value)}
                  placeholder="Detailed morning, afternoon, and evening bespoke adventure activities..."
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-600 mb-1">
                  Default Expedition Notes (Optional)
                </label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Technical hiking boots, emergency beacon, certified guide."
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-slate-400"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow"
                >
                  Save to Keyword Repository
                </button>
              </div>
            </form>
          )}

          {/* Preset list */}
          <div className="space-y-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 hover:shadow-xs transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {item.keyword}
                      </span>
                      <span className="text-[10px] font-mono uppercase text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                        {item.region}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-950 pt-1">
                      {item.title}
                    </h4>

                    <p className="text-xs text-slate-600 leading-relaxed font-light pt-1">
                      {item.defaultActivities}
                    </p>

                    {item.defaultNotes && (
                      <div className="text-[11px] text-slate-500 pt-1">
                        <strong className="text-slate-800 font-semibold">Notes: </strong>
                        {item.defaultNotes}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => onDeleteKeyword(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 transition-colors shrink-0"
                    title="Delete preset"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="py-12 text-center text-slate-400 text-xs">
                No keyword templates matched your search.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
