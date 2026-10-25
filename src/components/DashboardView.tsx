import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Globe2,
  Home,
  Users,
  Compass,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  Crown,
  FileDown,
  Plus,
} from 'lucide-react';
import { Consultant, GroupType, Itinerary, TripRegion } from '../types/itinerary';

interface DashboardViewProps {
  itineraries: Itinerary[];
  consultants: Consultant[];
  onSelectItinerary: (itinerary: Itinerary) => void;
  onDownloadPDF?: (itinerary: Itinerary) => void;
  onCreateItinerary: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  itineraries,
  consultants,
  onSelectItinerary,
  onDownloadPDF,
  onCreateItinerary,
}) => {
  const [fromDate, setFromDate] = useState<string>('2026-10-01');
  const [toDate, setToDate] = useState<string>('2026-10-31');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedGroupType, setSelectedGroupType] = useState<string>('all');

  // Filter itineraries based on selected controls
  const filteredItineraries = useMemo(() => {
    return itineraries.filter((item) => {
      if (selectedRegion !== 'all' && item.region !== selectedRegion) {
        return false;
      }
      if (selectedGroupType !== 'all' && item.groupType !== selectedGroupType) {
        return false;
      }
      return true;
    });
  }, [itineraries, selectedRegion, selectedGroupType]);

  const totalCount = filteredItineraries.length;
  const domCount = itineraries.filter((i) => i.region === 'DOM').length;
  const intlCount = itineraries.filter((i) => i.region === 'INTL').length;
  
  const todayStr = new Date().toLocaleDateString('en-GB');
  const addedToday = itineraries.filter(
    (i) => i.createdAt === todayStr || i.quotationDate === todayStr
  ).length;

  const totalItins = itineraries.length;

  // Group Type statistics calculated purely from real itineraries
  const groupTypeDefinitions: { type: GroupType; label: string; color: string }[] = [
    { type: 'FIT', label: 'Friends & Family', color: '#0f172a' },
    { type: 'CLG', label: 'College', color: '#475569' },
    { type: 'CPL', label: 'Couple', color: '#64748b' },
    { type: 'GD', label: 'Group Departure', color: '#94a3b8' },
    { type: 'COR', label: 'Corporate', color: '#334155' },
    { type: 'SCH', label: 'School', color: '#cbd5e1' },
  ];

  const groupStats = groupTypeDefinitions.map((g) => {
    const count = itineraries.filter((i) => i.groupType === g.type).length;
    const pct = totalItins > 0 ? Number(((count / totalItins) * 100).toFixed(1)) : 0;
    return { ...g, count, pct };
  });

  // Region statistics calculated purely from real itineraries
  const regionStats = [
    {
      label: 'Domestic',
      count: domCount,
      pct: totalItins > 0 ? Math.round((domCount / totalItins) * 100) : 0,
      color: '#0f172a',
    },
    {
      label: 'International',
      count: intlCount,
      pct: totalItins > 0 ? Math.round((intlCount / totalItins) * 100) : 0,
      color: '#64748b',
    },
  ];

  // Consultant performance derived dynamically from real consultants & real assigned itineraries
  const palette = ['#0f172a', '#334155', '#475569', '#64748b', '#94a3b8', '#0284c7', '#0d9488'];
  const consultantRankings = (consultants || []).map((c, idx) => {
    const assignedCount = itineraries.filter((it) => it.consultant && it.consultant.id === c.id).length;
    return {
      name: c.name,
      count: assignedCount,
      role: c.role,
      color: palette[idx % palette.length],
    };
  });

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Filter Bar strictly following photos with sleek white & grey glassy treatment */}
      <div className="bg-white/80 backdrop-blur-md border border-slate-200/90 rounded-2xl p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          
          {/* Date Pickers */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold tracking-wider text-slate-500 uppercase mb-1.5 font-sans-luxury">
                From (Created Date)
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full bg-slate-50/90 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-slate-400 font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-semibold tracking-wider text-slate-500 uppercase mb-1.5 font-sans-luxury">
                To (Created Date)
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full bg-slate-50/90 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-slate-400 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Region Filter Buttons */}
          <div className="lg:col-span-3">
            <span className="block text-[11px] font-semibold tracking-wider text-slate-500 uppercase mb-1.5 font-sans-luxury">
              Region
            </span>
            <div className="inline-flex items-center p-1 bg-slate-100/80 border border-slate-200/80 rounded-xl w-full backdrop-blur-sm">
              <button
                type="button"
                onClick={() => setSelectedRegion('all')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                  selectedRegion === 'all'
                    ? 'bg-slate-900 text-white font-semibold shadow-sm'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setSelectedRegion('DOM')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap flex items-center justify-center gap-1 ${
                  selectedRegion === 'DOM'
                    ? 'bg-slate-900 text-white font-semibold shadow-sm'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
                <span>Domestic</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRegion('INTL')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap flex items-center justify-center gap-1 ${
                  selectedRegion === 'INTL'
                    ? 'bg-slate-900 text-white font-semibold shadow-sm'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                <Globe2 className="w-3.5 h-3.5" />
                <span>International</span>
              </button>
            </div>
          </div>

          {/* Group Type Filter Buttons */}
          <div className="lg:col-span-5">
            <span className="block text-[11px] font-semibold tracking-wider text-slate-500 uppercase mb-1.5 font-sans-luxury">
              Group Type
            </span>
            <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100/80 border border-slate-200/80 rounded-xl backdrop-blur-sm">
              {[
                { id: 'all', label: 'All' },
                { id: 'FIT', label: 'F&F' },
                { id: 'SCH', label: 'School' },
                { id: 'CLG', label: 'College' },
                { id: 'COR', label: 'Corp' },
                { id: 'CPL', label: 'Couple' },
                { id: 'GD', label: 'GD' },
              ].map((group) => (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => setSelectedGroupType(group.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                    selectedGroupType === group.id
                      ? 'bg-slate-900 text-white font-semibold shadow-sm'
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  {group.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* 4 Metric KPI Cards matching Photo 1 with white theme and grey glassy style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Total Itineraries */}
        <div className="bg-white/85 backdrop-blur-md border border-slate-200/90 rounded-2xl p-5 relative overflow-hidden group hover:border-slate-300 transition-all shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-3xl font-bold tracking-tight text-slate-950 font-mono tabular-nums">
                {totalCount}
              </span>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-sans-luxury font-medium">
                Total Itineraries
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-700">
              <Compass className="w-5 h-5 stroke-[1.8]" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 font-sans-luxury">
            <span className="text-slate-900 font-mono font-semibold">
              {totalCount > 0 ? `${totalCount} active` : 'Pristine state'}
            </span>
            <span>{totalCount > 0 ? 'quotations on file' : 'Starting from first'}</span>
          </div>
        </div>

        {/* Card 2: Domestic */}
        <div className="bg-slate-50/85 backdrop-blur-md border border-slate-200/90 rounded-2xl p-5 relative overflow-hidden group hover:border-slate-300 transition-all shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-3xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
                {domCount}
              </span>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-sans-luxury font-medium">
                Domestic
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700">
              <Home className="w-5 h-5 stroke-[1.8]" />
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-600 font-mono tabular-nums">
            {totalItins > 0 ? `${Math.round((domCount / totalItins) * 100)}% of total portfolio` : '0% of portfolio'}
          </div>
        </div>

        {/* Card 3: International */}
        <div className="bg-slate-100/70 backdrop-blur-md border border-slate-200/90 rounded-2xl p-5 relative overflow-hidden group hover:border-slate-300 transition-all shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-3xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
                {intlCount}
              </span>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-sans-luxury font-medium">
                International
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700">
              <Globe2 className="w-5 h-5 stroke-[1.8]" />
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-600 font-mono tabular-nums">
            {totalItins > 0 ? `${Math.round((intlCount / totalItins) * 100)}% of total portfolio` : '0% of portfolio'}
          </div>
        </div>

        {/* Card 4: Added Today */}
        <div className="bg-white/85 backdrop-blur-md border border-slate-200/90 rounded-2xl p-5 relative overflow-hidden group hover:border-slate-300 transition-all shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-3xl font-bold tracking-tight text-slate-950 font-mono tabular-nums">
                {addedToday}
              </span>
              <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-sans-luxury font-medium">
                Added Today
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <Calendar className="w-5 h-5 stroke-[1.8]" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-600">
            <TrendingUp className="w-3.5 h-3.5 text-slate-800" />
            <span>{addedToday > 0 ? 'Fresh quotations today' : 'Ready for first submission'}</span>
          </div>
        </div>

      </div>

      {/* Analytics Row: Group Type Split + Region Split with white/grey glass */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Group Type Split Card */}
        <div className="bg-white/85 backdrop-blur-md border border-slate-200/90 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-950 font-sans-luxury">
                Group Type Split
              </h2>
              <p className="text-xs text-slate-500">All bespoke expedition categories</p>
            </div>
            <span className="text-xs font-mono text-slate-500">{totalItins} Total</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-2">
            
            {/* SVG Donut Chart with modern grey-glass shades */}
            <div className="md:col-span-5 flex justify-center relative">
              <div className="relative w-40 h-40">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="#f1f5f9"
                    strokeWidth="12"
                    fill="transparent"
                  />
                  {totalItins === 0 ? (
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      stroke="#e2e8f0"
                      strokeWidth="12"
                      fill="transparent"
                    />
                  ) : (
                    (() => {
                      let accumulated = 0;
                      return groupStats.map((item) => {
                        if (item.count === 0) return null;
                        const segment = (item.count / totalItins) * 238.76;
                        const offset = accumulated;
                        accumulated += segment;
                        return (
                          <circle
                            key={item.type}
                            cx="50"
                            cy="50"
                            r="38"
                            stroke={item.color}
                            strokeWidth="12"
                            strokeDasharray={`${segment.toFixed(1)} 238.8`}
                            strokeDashoffset={`-${offset.toFixed(1)}`}
                            fill="transparent"
                          />
                        );
                      });
                    })()
                  )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">{totalItins}</span>
                  <span className="text-[10px] uppercase tracking-widest text-slate-500">Total</span>
                </div>
              </div>
            </div>

            {/* Legend & Breakdown Table */}
            <div className="md:col-span-7 space-y-2">
              {groupStats.map((item) => (
                <div
                  key={item.type}
                  className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-slate-700 font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono tabular-nums text-right">
                    <span className="text-slate-400 text-[11px]">{item.pct}%</span>
                    <span className="text-slate-900 font-semibold w-10">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Region Split Card */}
        <div className="bg-white/85 backdrop-blur-md border border-slate-200/90 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-950 font-sans-luxury">
                Region Split
              </h2>
              <p className="text-xs text-slate-500">Domestic vs International balance</p>
            </div>
            <span className="text-xs font-mono text-slate-500">{totalItins} Total</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-2">
            
            {/* SVG Donut Chart */}
            <div className="md:col-span-5 flex justify-center relative">
              <div className="relative w-40 h-40">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="#f1f5f9"
                    strokeWidth="12"
                    fill="transparent"
                  />
                  {totalItins === 0 ? (
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      stroke="#e2e8f0"
                      strokeWidth="12"
                      fill="transparent"
                    />
                  ) : (
                    (() => {
                      const domLen = (domCount / totalItins) * 238.76;
                      const intlLen = (intlCount / totalItins) * 238.76;
                      return (
                        <>
                          {domLen > 0 && (
                            <circle
                              cx="50"
                              cy="50"
                              r="38"
                              stroke="#0f172a"
                              strokeWidth="12"
                              strokeDasharray={`${domLen.toFixed(1)} 238.8`}
                              strokeDashoffset="0"
                              fill="transparent"
                            />
                          )}
                          {intlLen > 0 && (
                            <circle
                              cx="50"
                              cy="50"
                              r="38"
                              stroke="#64748b"
                              strokeWidth="12"
                              strokeDasharray={`${intlLen.toFixed(1)} 238.8`}
                              strokeDashoffset={`-${domLen.toFixed(1)}`}
                              fill="transparent"
                            />
                          )}
                        </>
                      );
                    })()
                  )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">{totalItins}</span>
                  <span className="text-[10px] uppercase tracking-widest text-slate-500">Total</span>
                </div>
              </div>
            </div>

            {/* Legend & Breakdown Table */}
            <div className="md:col-span-7 space-y-3">
              {regionStats.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between text-xs py-2 px-2.5 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-slate-800 font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-4 font-mono tabular-nums text-right">
                    <span className="text-slate-400 text-xs">{item.pct}%</span>
                    <span className="text-slate-900 font-semibold w-12">{item.count}</span>
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Portfolio Status</span>
                <span className="text-slate-900 font-mono font-semibold">
                  {totalItins > 0 ? `${totalItins} active proposals` : 'Clean slate initialized'}
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Consultant Performance Card strictly matching Photo 1 */}
      <div className="bg-white/85 backdrop-blur-md border border-slate-200/90 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-semibold text-slate-950 font-sans-luxury">
              By Consultant
            </h2>
            <p className="text-xs text-slate-500">Itineraries handled per consultant</p>
          </div>
          <div className="text-xs text-slate-500 font-sans-luxury">
            Senior architects active: <span className="text-slate-900 font-mono font-semibold">{consultants?.length || 0}</span>
          </div>
        </div>

        {consultantRankings.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            No consultants registered yet. Register your team architects to track proposal distribution.
          </div>
        ) : (
          <div className="space-y-4">
            {consultantRankings.map((c) => {
              const maxTarget = Math.max(1, ...consultantRankings.map((r) => r.count));
              const percentage = Math.min(100, Math.round((c.count / maxTarget) * 100));
              return (
                <div key={c.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-900 font-medium">{c.name}</span>
                      <span className="text-[11px] text-slate-500 font-sans-luxury">· {c.role}</span>
                    </div>
                    <span className="text-sm font-semibold font-mono text-slate-950 tabular-nums">
                      {c.count}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200/50">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(4, percentage)}%`,
                        backgroundColor: c.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>


      {/* Recent Bespoke Itineraries preview */}
      <div className="bg-white/85 backdrop-blur-md border border-slate-200/90 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-slate-950 font-sans-luxury">
              Recent Bespoke Proposals
            </h2>
            <p className="text-xs text-slate-500">Active quotations awaiting traveler confirmation</p>
          </div>
          <button
            type="button"
            onClick={onCreateItinerary}
            className="text-xs text-slate-900 hover:text-slate-700 font-semibold uppercase tracking-wider font-sans-luxury flex items-center gap-1"
          >
            <span>+ Draft New Proposal</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {itineraries.length === 0 ? (
          <div className="py-12 px-4 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-700 mb-3">
              <Compass className="w-6 h-6 stroke-[1.75]" />
            </div>
            <h3 className="text-sm font-bold text-slate-950 font-sans-luxury">
              Clean Slate Initialized · Ready for First Proposal
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              All mock values removed. You are starting from first. Click below to craft your first bespoke luxury itinerary quotation.
            </p>
            <button
              type="button"
              onClick={onCreateItinerary}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-sm active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Create Your First Itinerary</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {itineraries.slice(0, 3).map((it) => (
              <div
                key={it.id}
                onClick={() => onSelectItinerary(it)}
                className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 cursor-pointer hover:border-slate-400 hover:bg-white transition-all group flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono mb-2">
                    <span className="font-semibold text-slate-700">{it.code}</span>
                    <span className="text-slate-900 font-medium uppercase tracking-wider">{it.duration}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-950 group-hover:text-slate-800 transition-colors line-clamp-1">
                    {it.clientName}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                    {it.destination}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-sans-luxury">{it.consultant?.name || 'Assigned Lead'}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-950 font-mono font-bold">
                      {it.pricingSlots && it.pricingSlots[0] ? `${it.currency} ${it.pricingSlots[0].price.toLocaleString()}` : 'Custom'}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onDownloadPDF) {
                          onDownloadPDF(it);
                        } else {
                          onSelectItinerary(it);
                        }
                      }}
                      title={`Download Quotation PDF (${it.code})`}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold text-slate-900 bg-slate-200/80 hover:bg-slate-300 border border-slate-300/80 transition-all shadow-2xs hover:scale-105 active:scale-95"
                    >
                      <FileDown className="w-3 h-3 text-slate-800" />
                      <span>PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
