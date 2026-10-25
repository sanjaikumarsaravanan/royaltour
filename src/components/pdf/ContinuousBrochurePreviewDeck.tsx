import React, { useState } from 'react';
import { AppSettings, Quotation, PlacePackage, PdfThemeSettings } from '../../types/placePackage';
import { ContinuousBrochureView } from './ContinuousBrochureView';
import {
  generateContinuousBrochurePDF,
  getQuotationFileName,
} from '../../utils/quotationPdfGenerator';
import {
  Download,
  ZoomIn,
  ZoomOut,
  AlertCircle,
  FileText,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ContinuousBrochurePreviewDeckProps {
  quotation: Quotation;
  settings?: AppSettings;
  allPackages?: PlacePackage[];
  onSaveQuotation?: () => void;
  onSaved?: () => void;
  containerDomId?: string;
}

export const ContinuousBrochurePreviewDeck: React.FC<ContinuousBrochurePreviewDeckProps> = ({
  quotation,
  settings: propSettings,
  allPackages: propPackages,
  onSaveQuotation,
  onSaved,
  containerDomId = 'royal-tours-brochure-render',
}) => {
  const appContext = useApp();
  const settings = propSettings || quotation.settingsSnapshot || appContext.settings;
  const allPackages = propPackages || appContext.placePackages;
  const handleSave = onSaveQuotation || onSaved;

  // Active theme state (defaults to snapshot or live settings)
  const initialTheme: PdfThemeSettings =
    quotation.settingsSnapshot?.pdfTheme ||
    settings?.pdfTheme || {
      fontFamily: 'Montserrat, sans-serif',
      headingFont: 'Montserrat, sans-serif',
      backgroundColor: '#0F172A',
      textColor: '#FFFFFF',
      accentColor: '#0070C0',
      secondaryColor: '#E2E8F0',
      cardBackground: 'rgba(255, 255, 255, 0.10)',
      cardBorder: 'rgba(255, 255, 255, 0.20)',
      dividerColor: 'rgba(255, 255, 255, 0.15)',
    };

  const [activeTheme] = useState<PdfThemeSettings>(initialTheme);

  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatusText, setExportStatusText] = useState('');
  const [exportError, setExportError] = useState<string | null>(null);
  const [zoomScale, setZoomScale] = useState<number>(0.85);

  // Check for required settings fields
  const missingFields: string[] = [];
  if (!settings?.companyName?.trim()) missingFields.push('Company Name');
  if (!settings?.phone?.trim() && !settings?.email?.trim()) missingFields.push('Contact (Phone/Email)');
  if (!settings?.consultants || settings.consultants.length === 0) missingFields.push('Consultant');

  const pdfContainerId = `${containerDomId}-pdf-export`;

  const handleDownloadPDF = async () => {
    setIsExporting(true);
    setExportError(null);
    setExportProgress(5);
    setExportStatusText('Initializing PDF rendering engine...');

    try {
      // Use the clean print container which omits all placeholders
      const targetDomId = document.getElementById(pdfContainerId)
        ? pdfContainerId
        : containerDomId;

      const pdfBlob = await generateContinuousBrochurePDF(
        targetDomId,
        quotation,
        (progress, status) => {
          setExportProgress(progress);
          setExportStatusText(status);
        }
      );

      const fileName = getQuotationFileName(quotation);
      const downloadUrl = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);

      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
        setExportStatusText('');
      }, 1000);
    } catch (err: any) {
      console.error('PDF generation error:', err);
      setExportError(err?.message || 'Failed to render PDF brochure.');
      setIsExporting(false);
    }
  };

  const currentAccent = activeTheme.accentColor || '#0070C0';

  return (
    <div className="space-y-4 font-sans">
      {/* Required Settings Missing Warning */}
      {missingFields.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 shadow-xs animate-in fade-in">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <h5 className="font-bold text-amber-900">
              Required Settings Incomplete
            </h5>
            <p className="text-amber-800 leading-relaxed">
              The following required fields are not configured:{' '}
              <span className="font-bold">{missingFields.join(', ')}</span>.
              Neutral placeholders are shown in this on-screen preview, but will be hidden on the exported PDF.
            </p>
          </div>
        </div>
      )}


      {/* Top Controls Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center font-bold"
            style={{ backgroundColor: `${currentAccent}18`, color: currentAccent }}
          >
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Continuous Brochure Preview
            </h4>
            <p className="text-[11px] text-slate-500 font-mono">
              Single continuous page (794px width) · No page breaks
            </p>
          </div>
        </div>

        {/* Zoom & Action Controls */}
        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setZoomScale((prev) => Math.max(0.4, Number((prev - 0.1).toFixed(2))))}
              className="p-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-[11px] font-mono font-bold text-slate-700 min-w-10 text-center">
              {Math.round(zoomScale * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoomScale((prev) => Math.min(1.2, Number((prev + 0.1).toFixed(2))))}
              className="p-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoomScale(0.85)}
              className="px-2 py-0.5 text-[10px] font-bold text-slate-500 hover:text-slate-900"
              title="Reset Zoom"
            >
              Fit
            </button>
          </div>

          {/* Download PDF Button */}
          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={isExporting}
            style={{ backgroundColor: currentAccent }}
            className="flex items-center gap-2 px-4 py-2 hover:opacity-90 disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Generating PDF...' : 'Download PDF'}</span>
          </button>
        </div>
      </div>

      {/* Progress & Error Alerts */}
      {isExporting && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 shadow-xs space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between text-xs font-bold text-blue-900">
            <span>{exportStatusText}</span>
            <span className="font-mono">{exportProgress}%</span>
          </div>
          <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-300"
              style={{ width: `${exportProgress}%`, backgroundColor: currentAccent }}
            />
          </div>
        </div>
      )}

      {exportError && (
        <div className="bg-red-50 border border-red-200 text-red-800 text-xs rounded-2xl p-3.5 flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{exportError}</span>
        </div>
      )}

      {/* Scrollable Viewport Frame */}
      <div className="w-full bg-slate-900/5 border border-slate-200 rounded-3xl p-4 sm:p-8 flex justify-center overflow-auto max-h-[75vh] shadow-inner">
        <div
          style={{
            transform: `scale(${zoomScale})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
            borderRadius: '16px',
            overflow: 'hidden',
          }}
        >
          {/* On-screen Preview (shows neutral placeholders if fields are empty) */}
          <ContinuousBrochureView
            id={containerDomId}
            quotation={quotation}
            settings={settings}
            allPackages={allPackages}
            isPrintPdf={false}
            customTheme={activeTheme}
          />
        </div>
      </div>

      {/* Hidden Pristine Container for PDF Capture (hides empty placeholders, full opacity offscreen) */}
      <div
        style={{
          position: 'absolute',
          left: '-99999px',
          top: 0,
          pointerEvents: 'none',
          opacity: 1,
          visibility: 'visible',
          zIndex: -9999,
          width: '794px',
        }}
        aria-hidden="true"
      >
        <ContinuousBrochureView
          id={pdfContainerId}
          quotation={quotation}
          settings={settings}
          allPackages={allPackages}
          isPrintPdf={true}
          customTheme={activeTheme}
        />
      </div>
    </div>
  );
};
