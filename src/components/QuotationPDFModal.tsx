import React, { useState } from 'react';
import {
  X,
  Printer,
  FileDown,
  ExternalLink,
  Crown,
  Check,
  Copy,
  Share2,
} from 'lucide-react';
import { Itinerary } from '../types/itinerary';
import { PrintableQuotationDoc } from './PrintableQuotationDoc';
import { exportQuotationAsPDF, downloadOfflineQuotationHTML } from '../utils/pdfExport';

interface QuotationPDFModalProps {
  itinerary: Itinerary | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenPresentation?: (itinerary: Itinerary) => void;
}

export const QuotationPDFModal: React.FC<QuotationPDFModalProps> = ({
  itinerary,
  isOpen,
  onClose,
  onOpenPresentation,
}) => {
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen || !itinerary) return null;

  const handlePrint = () => {
    exportQuotationAsPDF(itinerary);
    setDownloadSuccess('Print dialog initiated! Select "Save as PDF" to save file.');
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  const handleDownloadOfflineDoc = () => {
    downloadOfflineQuotationHTML(itinerary);
    setDownloadSuccess('Offline document downloaded successfully!');
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  const handleCopySummary = () => {
    const total = itinerary.pricingSlots.reduce((sum, s) => sum + s.price, 0);
    const text = `ROYAL TOURS - BESPOKE EXPEDITION QUOTATION\n\nCode: ${itinerary.code}\nClient: ${itinerary.clientName}\nDestination: ${itinerary.destination}\nDuration: ${itinerary.duration}\nTravel Date: ${itinerary.dateOfTravel}\nGroup Size: ${itinerary.groupSizePax}\n\nEstimate: ${itinerary.currency} ${total.toLocaleString('en-IN')}\nConsultant: ${itinerary.consultant.name} (${itinerary.consultant.phone})\n\nTravel in Luxury, Explore in Style.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[94vh]">
        
        {/* Top Control Bar */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Crown className="w-4 h-4 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-900 bg-slate-200/70 px-2 py-0.5 rounded">
                  {itinerary.code}
                </span>
                <span className="text-sm font-bold text-slate-950 font-sans-luxury">
                  {itinerary.clientName}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-sans-luxury">
                {itinerary.destination} · {itinerary.duration} · Curated by {itinerary.consultant.name}
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              title="Open browser print dialog to Save as PDF"
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-sm active:scale-95"
            >
              <FileDown className="w-4 h-4 text-white" />
              <span>Save as PDF</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadOfflineDoc}
              title="Download standalone offline HTML document"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors shadow-2xs"
            >
              <FileDown className="w-3.5 h-3.5 text-slate-700" />
              <span className="hidden sm:inline">Offline Doc (.html)</span>
              <span className="sm:hidden">Doc</span>
            </button>

            {onOpenPresentation && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPresentation(itinerary);
                }}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-950 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors shadow-2xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Presentation</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleCopySummary}
              title="Copy Summary text for WhatsApp/Email"
              className="p-2 text-slate-600 hover:text-slate-950 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors shadow-2xs"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-950 hover:bg-slate-100 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success toast banner */}
        {downloadSuccess && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2 text-xs text-emerald-800 flex items-center justify-between animate-in slide-in-from-top-1">
            <span className="flex items-center gap-2 font-medium">
              <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
              {downloadSuccess}
            </span>
            <button
              type="button"
              onClick={() => setDownloadSuccess(null)}
              className="text-emerald-700 hover:text-emerald-950 text-xs font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Paper Container Preview */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100/70">
          <div className="max-w-[850px] mx-auto shadow-xl rounded-2xl overflow-hidden border border-slate-300/80 bg-white">
            <PrintableQuotationDoc itinerary={itinerary} />
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="px-6 py-3 border-t border-slate-200 bg-white flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <Crown className="w-3.5 h-3.5 text-slate-700" />
            <span className="font-semibold text-slate-700">ROYAL TOURS Official Quotation Format</span>
            <span>· Ready for Client Dispatch</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-[11px] text-slate-400 font-mono">
              Press Ctrl+P / Cmd+P anytime to print
            </span>
            <button
              type="button"
              onClick={handlePrint}
              className="text-slate-900 font-bold hover:underline flex items-center gap-1"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print to PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
