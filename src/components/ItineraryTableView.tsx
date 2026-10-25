import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  BookOpen,
  Eye,
  Edit3,
  Copy,
  Trash2,
  FileDown,
  Filter,
  MoreVertical,
  Calendar,
  Users,
  MapPin,
  Clock,
  Compass,
} from 'lucide-react';
import { GroupType, Itinerary, TripRegion } from '../types/itinerary';

interface ItineraryTableViewProps {
  itineraries: Itinerary[];
  onSelectItinerary: (itinerary: Itinerary) => void;
  onEditItinerary: (itinerary: Itinerary) => void;
  onDuplicateItinerary: (itinerary: Itinerary) => void;
  onDeleteItinerary: (id: string) => void;
  onDownloadPDF?: (itinerary: Itinerary) => void;
  onCreateItinerary: () => void;
  onOpenKeywords: () => void;
}

export const ItineraryTableView: React.FC<ItineraryTableViewProps> = ({
  itineraries,
  onSelectItinerary,
  onEditItinerary,
  onDuplicateItinerary,
  onDeleteItinerary,
  onDownloadPDF,
  onCreateItinerary,
  onOpenKeywords,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState<'ALL' | TripRegion>('ALL');
  const [groupFilter, setGroupFilter] = useState<'ALL' | GroupType>('ALL');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Dynamically computed counts starting from first (zero mock values)
  const totalCount = itineraries.length;
  const domCount = itineraries.filter((i) => i.region === 'DOM').length;
  const intlCount = itineraries.filter((i) => i.region === 'INTL').length;

  const groupPillStats: { id: 'ALL' | GroupType; label: string; count: number }[] = [
    { id: 'ALL', label: 'ALL', count: totalCount },
    { id: 'FIT', label: 'FIT', count: itineraries.filter((i) => i.groupType === 'FIT').length },
    { id: 'CPL', label: 'CPL', count: itineraries.filter((i) => i.groupType === 'CPL').length },
    { id: 'CLG', label: 'CLG', count: itineraries.filter((i) => i.groupType === 'CLG').length },
    { id: 'SCH', label: 'SCH', count: itineraries.filter((i) => i.groupType === 'SCH').length },
    { id: 'COR', label: 'COR', count: itineraries.filter((i) => i.groupType === 'COR').length },
    { id: 'GD', label: 'GD', count: itineraries.filter((i) => i.groupType === 'GD').length },
  ];

  // Filter itineraries
  const filteredList = useMemo(() => {
    return itineraries.filter((item) => {
      if (regionFilter !== 'ALL' && item.region !== regionFilter) return false;
      if (groupFilter !== 'ALL' && item.groupType !== groupFilter) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesClient = item.clientName.toLowerCase().includes(query);
        const matchesCode = item.code.toLowerCase().includes(query);
        const matchesDest = item.destination.toLowerCase().includes(query);
        const matchesConsultant = item.consultant.name.toLowerCase().includes(query);
        if (!matchesClient && !matchesCode && !matchesDest && !matchesConsultant) {
          return false;
        }
      }

      return true;
    });
  }, [itineraries, regionFilter, groupFilter, searchQuery]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredList.map((it) => it.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-4 pb-20 font-sans-luxury">
      
      {/* ========================================================
          1. SEARCH & MOBILE ACTION BAR
         ======================================================== */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search proposals by client, code, destination..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200/90 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-500 shadow-2xs font-sans-luxury"
          />
        </div>

        {/* Action Buttons for Mobile/Desktop */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenKeywords}
            title="Manage Day Keywords"
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200/90 rounded-xl hover:bg-slate-50 shadow-2xs"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden xs:inline">Keywords</span>
          </button>
          
          <button
            type="button"
            onClick={onCreateItinerary}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Create Itinerary</span>
          </button>
        </div>

      </div>

      {/* ========================================================
          2. FILTER PILLS (DYNAMIC COUNTS - ZERO DEMO VALUES)
         ======================================================== */}
      <div className="flex flex-col gap-2">
        {/* Region Filter */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 border border-slate-200/80 rounded-xl overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setRegionFilter('ALL')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
              regionFilter === 'ALL'
                ? 'bg-slate-900 text-white font-semibold shadow-2xs'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <span>ALL</span>
            <span className="font-mono text-[10px] opacity-80">({totalCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setRegionFilter('DOM')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
              regionFilter === 'DOM'
                ? 'bg-slate-900 text-white font-semibold shadow-2xs'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <span>Domestic</span>
            <span className="font-mono text-[10px] opacity-80">({domCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setRegionFilter('INTL')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
              regionFilter === 'INTL'
                ? 'bg-slate-900 text-white font-semibold shadow-2xs'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <span>International</span>
            <span className="font-mono text-[10px] opacity-80">({intlCount})</span>
          </button>
        </div>

        {/* Group Type Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 border border-slate-200/80 rounded-xl overflow-x-auto no-scrollbar">
          {groupPillStats.map((pill) => (
            <button
              key={pill.id}
              type="button"
              onClick={() => setGroupFilter(pill.id)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all whitespace-nowrap flex items-center gap-1 ${
                groupFilter === pill.id
                  ? 'bg-slate-900 text-white font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <span>{pill.label}</span>
              <span className="font-mono text-[10px] opacity-75">({pill.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================
          3. MOBILE APP VIEW: TOUCH CARDS FOR MOBILE SCREENS
         ======================================================== */}
      <div className="block md:hidden space-y-3">
        {filteredList.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm space-y-3 hover:border-slate-300 transition-colors"
          >
            {/* Top row: Client name, code, region pill */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => onSelectItinerary(item)}
                  className="text-left font-bold text-slate-950 text-sm hover:underline truncate block"
                >
                  {item.clientName}
                </button>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                    {item.code}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                    item.region === 'INTL'
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {item.region} · {item.groupType}
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0 ${
                item.status === 'Confirmed' || item.status === 'Approved'
                  ? 'bg-emerald-100 text-emerald-800'
                  : item.status === 'Presented'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {item.status || 'Draft'}
              </span>
            </div>

            {/* Destination & Duration Details */}
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
              <div className="flex items-center gap-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate font-medium text-slate-800">{item.destination}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-mono font-semibold text-slate-800">{item.duration}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-mono text-slate-600">{item.dateOfTravel}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-medium text-slate-700">{item.groupSizePax} Pax · {item.consultant.name}</span>
              </div>
            </div>

            {/* Mobile Touch Action Buttons */}
            <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-slate-100">
              <button
                type="button"
                onClick={() => onSelectItinerary(item)}
                className="flex-1 flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-slate-600" />
                <span>Preview</span>
              </button>

              <button
                type="button"
                onClick={() => onDownloadPDF ? onDownloadPDF(item) : onSelectItinerary(item)}
                className="flex-1 flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 transition-colors shadow-2xs"
              >
                <FileDown className="w-3.5 h-3.5 text-slate-900" />
                <span>PDF Quotation</span>
              </button>

              <button
                type="button"
                onClick={() => onEditItinerary(item)}
                title="Edit Itinerary"
                className="p-2 rounded-xl text-slate-500 hover:text-slate-950 hover:bg-slate-100 transition-colors border border-slate-200/80"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => onDeleteItinerary(item.id)}
                title="Delete Itinerary"
                className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors border border-slate-200/80"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================
          4. DESKTOP/TABLET TABLE VIEW (EXPANDED SCREENS)
         ======================================================== */}
      <div className="hidden md:block bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/90 bg-slate-50/80 text-[11px] uppercase font-sans-luxury tracking-wider text-slate-500">
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length > 0 &&
                      selectedIds.length === filteredList.length
                    }
                    onChange={handleSelectAll}
                    className="rounded bg-white border-slate-300 text-slate-900 focus:ring-0 focus:ring-offset-0"
                  />
                </th>
                <th className="py-3 px-4 font-semibold">QUOT. DATE</th>
                <th className="py-3 px-4 font-semibold">NAME / CODE</th>
                <th className="py-3 px-4 font-semibold">DESTINATION</th>
                <th className="py-3 px-4 font-semibold">DURATION</th>
                <th className="py-3 px-4 font-semibold">TRAVEL DATE</th>
                <th className="py-3 px-4 font-semibold">PAX</th>
                <th className="py-3 px-4 font-semibold">CONSULTANT</th>
                <th className="py-3 px-4 text-right font-semibold">ACTIONS</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredList.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                return (
                  <tr
                    key={item.id}
                    className={`transition-colors group hover:bg-slate-50/80 ${
                      isSelected ? 'bg-slate-100/60' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(item.id)}
                        className="rounded bg-white border-slate-300 text-slate-900 focus:ring-0 focus:ring-offset-0"
                      />
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 font-sans-luxury">
                      {item.quotationDate}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <button
                          type="button"
                          onClick={() => onSelectItinerary(item)}
                          className="text-left font-semibold text-slate-950 hover:text-slate-700 transition-colors"
                        >
                          {item.clientName}
                        </button>
                        <span className="text-[11px] font-mono text-slate-500 mt-0.5 font-medium">
                          {item.code}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <span className="text-slate-700 font-medium line-clamp-2">
                        {item.destination}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap font-mono font-semibold text-slate-900">
                      {item.duration}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 font-mono">
                      {item.dateOfTravel}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-800 font-semibold font-sans-luxury">
                      {item.groupSizePax}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-700 font-medium">
                      {item.consultant.name}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap relative">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onSelectItinerary(item)}
                          title="Preview Itinerary Quotation"
                          className="p-1.5 rounded-lg text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDownloadPDF ? onDownloadPDF(item) : onSelectItinerary(item)}
                          title="Download Quotation as PDF"
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200/90 transition-all shadow-2xs"
                        >
                          <FileDown className="w-3.5 h-3.5 text-slate-700" />
                          <span>PDF</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onEditItinerary(item)}
                          title="Edit Itinerary"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-950 hover:bg-slate-100 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setActiveMenuId(activeMenuId === item.id ? null : item.id)
                          }
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-950 hover:bg-slate-100 transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>

                      {activeMenuId === item.id && (
                        <div
                          className="absolute right-4 mt-2 w-48 bg-white border border-slate-200/90 rounded-2xl shadow-xl z-30 py-1 text-left text-xs"
                          onMouseLeave={() => setActiveMenuId(null)}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onDuplicateItinerary(item);
                            }}
                            className="w-full px-3 py-2 text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                          >
                            <Copy className="w-3.5 h-3.5 text-slate-600" />
                            <span>Duplicate Proposal</span>
                          </button>
                          <div className="h-px bg-slate-100 my-1" />
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              onDeleteItinerary(item.id);
                            }}
                            className="w-full px-3 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State when list has zero records */}
      {filteredList.length === 0 && (
        <div className="py-12 px-4 bg-white border border-slate-200/90 rounded-2xl text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
            <Compass className="w-6 h-6 stroke-[1.75]" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 font-sans-luxury">
              {itineraries.length === 0 ? 'No itineraries created yet' : 'No matching proposals'}
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {itineraries.length === 0
                ? 'Ready to create your first bespoke itinerary quotation.'
                : 'Try adjusting your search query or region/group filters.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onCreateItinerary}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-sm active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Create First Proposal</span>
          </button>
        </div>
      )}

      {/* Counter footer */}
      {filteredList.length > 0 && (
        <div className="px-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <strong className="text-slate-900 font-mono">{filteredList.length}</strong> of{' '}
            <strong className="text-slate-900 font-mono">{itineraries.length}</strong> proposals
          </span>
          <span className="font-mono text-[10px] text-slate-400">
            Region: {regionFilter}
          </span>
        </div>
      )}

    </div>
  );
};
