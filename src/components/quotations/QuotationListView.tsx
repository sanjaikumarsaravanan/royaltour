import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Quotation } from '../../types/placePackage';
import { ContinuousBrochurePreviewDeck } from '../pdf/ContinuousBrochurePreviewDeck';
import {
  Search,
  Plus,
  FileText,
  Download,
  Copy,
  Trash2,
  Eye,
  Calendar,
  Users,
  Clock,
  MapPin,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ChevronRight,
  X,
  Building,
} from 'lucide-react';

interface QuotationListViewProps {
  onCreateNew: () => void;
  onEditQuotation: (quotation: Quotation) => void;
}

export const QuotationListView: React.FC<QuotationListViewProps> = ({
  onCreateNew,
  onEditQuotation,
}) => {
  const { quotations, deleteQuotation, duplicateQuotation, settings, placePackages } =
    useApp();

  const accent = settings.accentColor || '#0070C0';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<'ALL' | string>('ALL');
  const [activePreviewQuotation, setActivePreviewQuotation] = useState<Quotation | null>(null);
  const [quotationToDelete, setQuotationToDelete] = useState<Quotation | null>(null);

  const filteredQuotations = quotations.filter((q) => {
    if (selectedTypeFilter !== 'ALL' && q.tripType !== selectedTypeFilter) return false;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchCode = q.code?.toLowerCase().includes(query);
      const matchClient = q.clientName?.toLowerCase().includes(query);
      const matchType = q.tripType?.toLowerCase().includes(query);
      const matchDest =
        q.destination?.toLowerCase().includes(query) ||
        q.dayPackages.some((d) => d.customTitle?.toLowerCase().includes(query));
      const matchDate = q.travelDates?.toLowerCase().includes(query);
      if (!matchCode && !matchClient && !matchType && !matchDest && !matchDate) return false;
    }
    return true;
  });

  const availableTripTypes = Array.from(
    new Set(quotations.map((q) => q.tripType).filter(Boolean))
  );

  return (
    <div className="space-y-6 pb-24 font-sans text-slate-900">
      {/* Top Banner - Clean White Theme */}
      <div className="bg-[#f8fafc] border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-mono font-bold tracking-wider uppercase border border-blue-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Royal Tours Itinerary Studio</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-slate-950 font-sans">
            Client Quotations & Brochures
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            Single continuous scrolling brochures with institutional-grade logistics, spot highlights, and instant PDF download.
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateNew}
          className="flex items-center justify-center gap-2 px-6 py-3 text-white rounded-2xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all active:scale-95 whitespace-nowrap"
          style={{ backgroundColor: accent }}
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Create New Quotation</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by client, destination, code or date..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#f8fafc] border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-slate-800 focus:bg-white"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 p-1 bg-[#f8fafc] rounded-2xl border border-slate-200 text-xs overflow-x-auto">
          <button
            type="button"
            onClick={() => setSelectedTypeFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
              selectedTypeFilter === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Types ({quotations.length})
          </button>
          {availableTripTypes.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setSelectedTypeFilter(t)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                selectedTypeFilter === t
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Quotation Dossiers Grid / List */}
      {filteredQuotations.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0070C0]">
            <FileText className="w-6 h-6 stroke-[1.75]" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900">No Quotations Found</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {quotations.length === 0
                ? 'Your quotation history is ready. Build your first continuous PDF brochure using the 5-step wizard.'
                : 'No proposals match your current search query or filter.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onCreateNew}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs"
            style={{ backgroundColor: accent }}
          >
            <Plus className="w-4 h-4" />
            <span>Create First Quotation</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredQuotations.map((q) => {
            const destTitle =
              q.destination ||
              q.dayPackages
                .map((d) => d.customTitle)
                .filter(Boolean)
                .join(' – ') ||
              'Tour Itinerary';

            return (
              <div
                key={q.id}
                className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4 group"
              >
                <div className="space-y-3">
                  {/* Top Bar: Code & Trip Type Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-slate-500 uppercase">
                      {q.code}
                    </span>
                    <span
                      className="text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase"
                      style={{
                        backgroundColor: '#e0f2fe',
                        color: accent,
                      }}
                    >
                      {q.tripType}
                    </span>
                  </div>

                  {/* Client & Destination */}
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-950 group-hover:text-blue-700 transition-colors line-clamp-1">
                      {q.clientName || 'Private Client'}
                    </h3>
                    <p className="text-xs font-semibold text-slate-600 line-clamp-1 mt-0.5">
                      {destTitle}
                    </p>
                  </div>

                  {/* Logistics Pill Badges */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                    <div className="flex items-center gap-1.5 p-2 bg-[#f8fafc] rounded-xl border border-slate-100">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-semibold">{q.duration || `${q.days} Days`}</span>
                    </div>
                    <div className="flex items-center gap-1.5 p-2 bg-[#f8fafc] rounded-xl border border-slate-100">
                      <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-semibold">{q.travelers} Pax</span>
                    </div>
                  </div>

                  {/* Financials & Dates */}
                  <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono block">Package Cost</span>
                      <span className="text-base font-extrabold font-mono text-slate-950">
                        ₹ {q.pricePerPerson.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-500 ml-1">/ person</span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {q.departureDate || q.travelDates || 'Flexible'}
                    </span>
                  </div>
                </div>

                {/* Bottom Actions Toolbar */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setActivePreviewQuotation(q)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Brochure</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onEditQuotation(q)}
                      className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100"
                      title="Edit in Wizard"
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => duplicateQuotation(q.id)}
                      className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100"
                      title="Duplicate"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setQuotationToDelete(q)}
                      className="p-1.5 text-red-500 hover:text-red-700 rounded-lg hover:bg-slate-100"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for Viewing Full Continuous Brochure */}
      {activePreviewQuotation && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh]">
            <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-slate-500">
                  {activePreviewQuotation.code}
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {activePreviewQuotation.clientName || 'Quotation Brochure'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActivePreviewQuotation(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              <ContinuousBrochurePreviewDeck
                quotation={activePreviewQuotation}
                settings={activePreviewQuotation.settingsSnapshot || settings}
                allPackages={placePackages}
                containerDomId="modal-continuous-brochure-view"
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {quotationToDelete && (
        <div className="fixed inset-0 z-60 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <h4 className="text-sm font-bold text-slate-900">Delete Quotation?</h4>
            <p className="text-xs text-slate-600">
              Are you sure you want to delete quotation <span className="font-bold">{quotationToDelete.code}</span> for {quotationToDelete.clientName}?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setQuotationToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteQuotation(quotationToDelete.id);
                  setQuotationToDelete(null);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
