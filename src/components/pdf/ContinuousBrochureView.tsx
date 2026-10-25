import React from 'react';
import {
  AppSettings,
  Quotation,
  PlacePackage,
  SectionId,
  PdfThemeSettings,
} from '../../types/placePackage';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Calendar,
  Users,
  Bus,
  Building,
  Globe,
  Star,
  Check,
  X as XIcon,
  Crown,
  User,
} from 'lucide-react';
import { DEFAULT_QUOTATION_BACKGROUND } from '../../data/defaultBackgroundTexture';

interface ContinuousBrochureViewProps {
  quotation: Quotation;
  settings?: AppSettings;
  allPackages?: PlacePackage[];
  id?: string;
  isPrintPdf?: boolean;
  customTheme?: PdfThemeSettings;
}

/**
 * Single continuous long-page brochure template replicating the exact
 * visual layout, typography, cards, and styling of Royal_Tours_KPR_Quotation_Background.pdf.
 * Width: strictly 794 CSS px (A4 width, 595pt), Poppins font everywhere.
 */
export const ContinuousBrochureView: React.FC<ContinuousBrochureViewProps> = ({
  quotation,
  settings: propSettings,
  allPackages = [],
  id = 'royal-tours-brochure-container',
  isPrintPdf = false,
  customTheme,
}) => {
  // Use snapshot if present, otherwise live settings
  const s = quotation.settingsSnapshot || propSettings;

  // Active theme colors
  const pdfTheme: PdfThemeSettings =
    customTheme ||
    quotation.settingsSnapshot?.pdfTheme ||
    s?.pdfTheme || {
      accentColor: s?.accentColor || '#0070C0',
      headingColor: '#FFFFFF',
      backgroundColor: '#080E24',
      cardBackground: 'linear-gradient(180deg, rgba(255, 255, 255, 0.94) 0%, rgba(229, 231, 235, 0.92) 100%)',
      borderColor: 'rgba(255, 255, 255, 0.7)',
      textColor: '#111827',
      secondaryTextColor: '#6B7280',
      fontFamily: "'Poppins', sans-serif",
      useBackgroundImage: true,
      backgroundImageUrl: DEFAULT_QUOTATION_BACKGROUND,
      backgroundOverlayOpacity: 0.15,
    };

  const accent = pdfTheme.accentColor || s?.accentColor || '#0070C0';
  const fontFamily = pdfTheme.fontFamily || "'Poppins', sans-serif";
  const useBgImage = pdfTheme.useBackgroundImage ?? true;
  const rawBgImageUrl = pdfTheme.backgroundImageUrl || DEFAULT_QUOTATION_BACKGROUND;
  const effectiveBgImage =
    !rawBgImageUrl ||
    rawBgImageUrl.includes('download_22b91a26.png') ||
    rawBgImageUrl.includes('iVBORw0KGgoAAAANSUhEUgAABIAAAAgACAYAAABeuEj2')
      ? DEFAULT_QUOTATION_BACKGROUND
      : rawBgImageUrl;
  const overlayOpacity = Math.min(0.6, Math.max(0, pdfTheme.backgroundOverlayOpacity ?? 0.15));

  // Active consultant
  const consultant =
    quotation.consultantSnapshot ||
    s?.consultants?.find((c) => c.id === quotation.consultantId) ||
    s?.consultants?.[0] || {
      name: 'Mr.Thianeshwar',
      phone: s?.phone || '+91 9042737100',
      email: s?.email || 'contact@adventureholidays.co',
    };

  const companyName = s?.companyName || 'Royal Tours';

  // Sections ordered and filtered
  const layout = s?.sectionLayout || [
    { id: 'header', name: 'Company Logo (Centered)', enabled: true, order: 1 },
    { id: 'greeting', name: 'Greeting & Client Block', enabled: true, order: 2 },
    { id: 'journey_overview', name: 'Journey Overview Card', enabled: true, order: 3 },
    { id: 'the_experience', name: 'The Experience (Daily Itinerary)', enabled: true, order: 4 },
    { id: 'inclusions_exclusions', name: 'Inclusions & Exclusions', enabled: true, order: 5 },
    { id: 'notes', name: 'Important Notes', enabled: true, order: 6 },
    { id: 'terms', name: 'Terms & Conditions', enabled: true, order: 7 },
    { id: 'cancellation', name: 'Cancellation Policy', enabled: true, order: 8 },
    { id: 'rating', name: 'Google Rating Strip', enabled: true, order: 9 },
    { id: 'about_us', name: 'About Us & Photos', enabled: true, order: 10 },
    { id: 'stats', name: 'Statistics & Achievements', enabled: true, order: 11 },
    { id: 'reach_us', name: 'Ways to Reach Us', enabled: true, order: 12 },
    { id: 'footer', name: 'Footer Copyright', enabled: true, order: 13 },
  ];

  const sortedSections = [...layout]
    .filter((sec) => sec.enabled)
    .sort((a, b) => a.order - b.order);

  // Centered section banner (for Journey Overview and The Experience)
  const renderCenteredHeading = (title: string) => (
    <div className="text-center my-7">
      <h2 className="text-[13px] font-extrabold tracking-[0.25em] text-white uppercase font-sans">
        {title}
      </h2>
      <div className="w-16 h-[2px] bg-white/70 mx-auto mt-1.5 shadow-[0_0_8px_rgba(255,255,255,0.7)]" />
    </div>
  );

  // Left-aligned section heading with 4px white vertical bar and text shadow
  const renderLeftHeading = (title: string) => (
    <div className="flex items-center gap-2.5 text-white font-bold tracking-wider text-[13px] drop-shadow-sm mb-3">
      <span className="w-1 h-5 bg-white rounded-full shadow-[0_0_6px_rgba(255,255,255,0.6)]" />
      <span className="uppercase">{title}</span>
    </div>
  );

  return (
    <div
      id={id}
      style={{
        width: '794px',
        minWidth: '794px',
        maxWidth: '794px',
        fontFamily,
        position: 'relative',
        margin: '0 auto',
        boxSizing: 'border-box',
        backgroundColor: '#080E24',
        color: '#FFFFFF',
        lineHeight: 1.5,
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        textRendering: 'geometricPrecision',
      }}
    >
      {/* -----------------------------------------------------------------
          BACKGROUND LAYERS
          Top Hero: near-black navy gradient with faint dotted grid overlay (~400px)
          Below: dark violet/purple atmospheric background with soft vertical light beams
          Optional: settings-editable grey background texture overlay
         ----------------------------------------------------------------- */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          background: useBgImage && effectiveBgImage
            ? `url(${effectiveBgImage}) top center / 794px auto repeat-y`
            : `url(${DEFAULT_QUOTATION_BACKGROUND}) top center / 794px auto repeat-y`,
          backgroundColor: '#080E24',
        }}
      />

      {/* Hero dark navy top overlay with dotted pattern */}
      <div
        className="absolute top-0 left-0 right-0 h-[430px] pointer-events-none"
        style={{
          zIndex: 1,
          background:
            'radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px) 0 0 / 18px 18px, linear-gradient(180deg, #050811 0%, #070B17 40%, rgba(13, 18, 43, 0.95) 85%, transparent 100%)',
        }}
      />

      {/* Global subtle opacity tint overlay if background image is active */}
      {useBgImage && overlayOpacity > 0 && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 1,
            backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`,
          }}
        />
      )}

      {/* Ambient violet radiant glow below hero */}
      <div
        className="absolute top-[380px] left-0 right-0 h-[700px] pointer-events-none"
        style={{
          zIndex: 1,
          background:
            'radial-gradient(ellipse 70% 500px at 50% 120px, rgba(168, 85, 247, 0.22), transparent 70%)',
        }}
      />

      {/* -----------------------------------------------------------------
          MAIN CONTENT CONTAINER (794px width)
         ----------------------------------------------------------------- */}
      <div className="relative px-8 pt-8 pb-10" style={{ zIndex: 2 }}>
        {sortedSections.map((section) => {
          switch (section.id) {
            // ==========================================
            // 1. HERO LOGO & GREETINGS
            // ==========================================
            case 'header': {
              const rawLogo = s?.logoUrl || '/assets/aistudio/royal_tours_logo_trimmed.png';
              const logoSrc = rawLogo.includes('WhatsApp_Image_2026-10-23')
                ? '/assets/aistudio/royal_tours_logo_trimmed.png'
                : rawLogo;

              return (
                <div key="header" className="flex flex-col items-center justify-center pt-2 pb-3 text-center">
                  {logoSrc && (
                    <div className="max-w-[420px] mb-3">
                      <img
                        src={logoSrc}
                        alt={companyName}
                        style={{
                          maxHeight: '105px',
                          maxWidth: '400px',
                          width: 'auto',
                          height: 'auto',
                          objectFit: 'contain',
                          display: 'block',
                          margin: '0 auto',
                        }}
                        crossOrigin="anonymous"
                      />
                    </div>
                  )}

                  {/* Greetings from <Company> bar */}
                  <div className="inline-flex items-center px-6 py-2 rounded-full border border-white/30 bg-black/55 backdrop-blur-md text-white text-[15px] sm:text-[16px] font-bold tracking-widest uppercase shadow-md mt-1">
                    {s?.greetingHeading || `Greetings from ${companyName}`}
                  </div>
                </div>
              );
            }

            // ==========================================
            // 2. GREETINGS & CLIENT PRESENTATION
            // ==========================================
            case 'greeting': {
              return (
                <div key="greeting" className="text-center px-4 pt-2 pb-5 space-y-1.5">
                  <p className="text-white/75 text-[11.5px] italic font-normal tracking-wide">
                    {s?.greetingIntro || 'it is our heartfelt pleasure to present this quotation to'}
                  </p>

                  <h1 className="text-white text-xl sm:text-2xl font-extrabold uppercase tracking-wider font-sans drop-shadow-sm py-0.5">
                    {quotation.clientName || 'Valued Travelers'}
                  </h1>

                  <p className="text-white/80 text-[11px] font-normal leading-relaxed max-w-lg mx-auto">
                    {s?.greetingSuffix ||
                      'we would be truly honoured to craft a journey filled with comfort, care and unforgettable moments, tailored especially for you.'}
                  </p>

                  {/* Glowing short divider line */}
                  <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-3 shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
                </div>
              );
            }

            // ==========================================
            // 3. JOURNEY OVERVIEW (4 Frosted-Glass Cards)
            // ==========================================
            case 'journey_overview': {
              return (
                <div key="journey_overview" className="mt-2 mb-4 space-y-4">
                  {renderCenteredHeading(s?.journeyOverviewTitle || 'JOURNEY OVERVIEW')}

                  {/* Card 1: CONSULTANT */}
                  <div
                    className="relative rounded-2xl p-4 pt-5 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg"
                    style={{
                      background: 'rgba(255, 255, 255, 0.10)',
                      borderColor: 'rgba(255, 255, 255, 0.20)',
                    }}
                  >
                    <div className="absolute -top-3 left-6 bg-black/80 border border-white/20 text-white text-[10px] font-bold tracking-widest uppercase px-3 py-0.5 rounded-full shadow-md">
                      CONSULTANT
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-white">
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-white/60 tracking-wider block">
                          Name
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5 font-bold text-xs text-white">
                          <User className="w-3.5 h-3.5 text-white/70 shrink-0" />
                          <span>{consultant.name || 'Travel Specialist'}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-semibold text-white/60 tracking-wider block">
                          Phone
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5 font-bold text-xs font-mono text-white">
                          <Phone className="w-3.5 h-3.5 text-white/70 shrink-0" />
                          <span>{consultant.phone || s?.phone || '+91 9042737100'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: TRIP DETAILS */}
                  <div
                    className="relative rounded-2xl p-4 pt-5 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg space-y-3"
                    style={{
                      background: 'rgba(255, 255, 255, 0.10)',
                      borderColor: 'rgba(255, 255, 255, 0.20)',
                    }}
                  >
                    <div className="absolute -top-3 left-6 bg-black/80 border border-white/20 text-white text-[10px] font-bold tracking-widest uppercase px-3 py-0.5 rounded-full shadow-md">
                      TRIP DETAILS
                    </div>

                    {/* Destination (Full Width) */}
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-white/60 tracking-wider block">
                        Destination
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5 font-bold text-xs text-white">
                        <MapPin className="w-3.5 h-3.5 text-white/70 shrink-0" />
                        <span>{(quotation.destination || 'Karnataka Highlights').replace(/[{}]/g, '')}</span>
                      </div>
                    </div>

                    {/* Duration & Date of Travel (2 Columns) */}
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/15">
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-white/60 tracking-wider block">
                          Duration
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5 font-bold text-xs text-white">
                          <Clock className="w-3.5 h-3.5 text-white/70 shrink-0" />
                          <span>{quotation.duration || `${quotation.days} Days`}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-semibold text-white/60 tracking-wider block">
                          Date of Travel
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5 font-bold text-xs text-white">
                          <Calendar className="w-3.5 h-3.5 text-white/70 shrink-0" />
                          <span>{quotation.departureDate || quotation.travelDates || 'Flexible'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Group Size & Transport (2 Columns) */}
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/15">
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-white/60 tracking-wider block">
                          Group Size
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5 font-bold text-xs text-white">
                          <Users className="w-3.5 h-3.5 text-white/70 shrink-0" />
                          <span>
                            {quotation.travelers} Students
                            {quotation.staffFocCount ? ` + ${quotation.staffFocCount}` : ''}
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-semibold text-white/60 tracking-wider block">
                          Transport
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5 font-bold text-xs text-white">
                          <Bus className="w-3.5 h-3.5 text-white/70 shrink-0" />
                          <span>{quotation.vehicle || 'Luxury Tourist Coach'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: CLIENT DETAILS */}
                  <div
                    className="relative rounded-2xl p-4 pt-5 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg"
                    style={{
                      background: 'rgba(255, 255, 255, 0.10)',
                      borderColor: 'rgba(255, 255, 255, 0.20)',
                    }}
                  >
                    <div className="absolute -top-3 left-6 bg-black/80 border border-white/20 text-white text-[10px] font-bold tracking-widest uppercase px-3 py-0.5 rounded-full shadow-md">
                      CLIENT DETAILS
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-semibold text-white/60 tracking-wider block">
                        Name
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5 font-bold text-xs text-white">
                        <Building className="w-3.5 h-3.5 text-white/70 shrink-0" />
                        <span>{quotation.clientName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 4: COSTING */}
                  <div
                    className="relative rounded-2xl p-4 pt-5 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg"
                    style={{
                      background: 'rgba(255, 255, 255, 0.10)',
                      borderColor: 'rgba(255, 255, 255, 0.20)',
                    }}
                  >
                    <div className="absolute -top-3 left-6 bg-black/80 border border-white/20 text-white text-[10px] font-bold tracking-widest uppercase px-3 py-0.5 rounded-full shadow-md">
                      COSTING
                    </div>

                    {/* Black-Gradient Price Tile */}
                    <div
                      className="rounded-xl p-3 text-white shadow-sm flex items-center justify-between border border-white/15"
                      style={{
                        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(20, 20, 20, 0.8) 100%)',
                      }}
                    >
                      <div>
                        <span className="text-[10px] text-white/70 font-medium tracking-wider uppercase block">
                          {s?.totalPackageLabel || 'Total Package'}
                        </span>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className="text-xl font-extrabold font-mono text-white">
                            ₹{quotation.pricePerPerson?.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-white/70 font-normal">
                            / Per Pax
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Note Box Underneath */}
                    {quotation.priceNote && (
                      <div className="border-l-2 border-white/50 bg-white/[0.06] rounded-r p-2.5 mt-2.5 text-[11px] text-white/90 leading-relaxed font-normal">
                        {quotation.priceNote}
                      </div>
                    )}
                  </div>
                </div>
              );
            }

            // ==========================================
            // 4. THE EXPERIENCE (Day-Wise Itinerary Cards)
            // ==========================================
            case 'the_experience': {
              return (
                <div key="the_experience" className="mt-6 mb-4 space-y-4">
                  {renderCenteredHeading(s?.experienceTitle || 'THE EXPERIENCE')}

                  {/* Optional Day 00: Departure & Night Journey */}
                  {quotation.departureJourney?.enabled && (
                    <div
                      className="rounded-2xl p-4 sm:p-5 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg text-white"
                      style={{
                        background: 'rgba(255, 255, 255, 0.10)',
                        borderColor: 'rgba(255, 255, 255, 0.20)',
                      }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-7 h-7 rounded-full bg-white/20 border border-white/30 text-white text-xs font-extrabold flex items-center justify-center shrink-0 shadow">
                          {quotation.departureJourney.badge || '00'}
                        </div>
                        <div>
                          <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
                            {quotation.departureJourney.title || 'DEPARTURE & NIGHT JOURNEY'}
                          </h3>
                          {quotation.departureJourney.date && (
                            <div className="text-[10px] text-white/70 font-medium mt-0.5">
                              {quotation.departureJourney.date}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1.5 pl-10">
                        {quotation.departureJourney.timeline.map((act, i) => (
                          <div
                            key={i}
                            className="border-l-2 border-white/40 bg-white/[0.06] rounded-r px-3.5 py-1.5 text-[12px] text-white/95 font-normal leading-snug"
                          >
                            {(act || '').replace(/[{}]/g, '')}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Day-by-Day Itinerary Cards (01, 02, 03...) */}
                  {quotation.dayPackages?.map((dp, idx) => {
                    const dayNum = String(dp.dayNumber || idx + 1).padStart(2, '0');
                    const items = dp.customItems && dp.customItems.length > 0 ? dp.customItems : [];

                    return (
                      <div
                        key={idx}
                        className="rounded-2xl p-4 sm:p-5 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg text-white"
                        style={{
                          background: 'rgba(255, 255, 255, 0.10)',
                          borderColor: 'rgba(255, 255, 255, 0.20)',
                        }}
                      >
                        {/* Day Header with Numbered Circle */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-7 h-7 rounded-full bg-white/20 border border-white/30 text-white text-xs font-extrabold flex items-center justify-center shrink-0 shadow">
                            {dayNum}
                          </div>
                          <div>
                            <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
                              {(dp.customTitle || `DAY ${dayNum} SIGHTSEEING`).replace(/[{}]/g, '')}
                            </h3>
                            {dp.date && (
                              <div className="text-[10px] text-white/70 font-medium mt-0.5">
                                {dp.date}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Activities List */}
                        <div className="space-y-1.5 pl-10">
                          {items.map((item, itmIdx) => {
                            const trimmed = (item.text || '').replace(/[{}]/g, '').trim();
                            const isHeader =
                              trimmed.endsWith(':') ||
                              trimmed === 'Proceed to Sightseeing:' ||
                              trimmed === 'Indoor Activities:' ||
                              trimmed === 'Proceed to Water Activities:';
                            const isSubSpot = trimmed.startsWith('- ') || trimmed.startsWith('-');

                            if (isHeader) {
                              return (
                                <div
                                  key={itmIdx}
                                  className="text-[11.5px] font-bold text-white/90 pt-1 pb-0.5 pl-0.5"
                                >
                                  {trimmed}
                                </div>
                              );
                            }

                            if (isSubSpot) {
                              return (
                                <div
                                  key={itmIdx}
                                  className="border-l-2 border-white/30 bg-white/[0.04] rounded-r px-3 py-1 text-[11.5px] text-white/80 ml-3 font-normal leading-snug"
                                >
                                  {trimmed}
                                </div>
                              );
                            }

                            return (
                              <div
                                key={itmIdx}
                                className="border-l-2 border-white/40 bg-white/[0.06] rounded-r px-3.5 py-1.5 text-[12px] text-white/95 font-normal leading-snug"
                              >
                                {trimmed}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}

                  {/* Optional Return Journey */}
                  {quotation.returnJourney?.enabled && (
                    <div
                      className="rounded-2xl p-4 sm:p-5 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg text-white"
                      style={{
                        background: 'rgba(255, 255, 255, 0.10)',
                        borderColor: 'rgba(255, 255, 255, 0.20)',
                      }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-7 h-7 rounded-full bg-white/20 border border-white/30 text-white text-xs font-extrabold flex items-center justify-center shrink-0 shadow">
                          {quotation.returnJourney.badge || '04'}
                        </div>
                        <div>
                          <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
                            {quotation.returnJourney.title || 'RETURN JOURNEY'}
                          </h3>
                          {quotation.returnJourney.date && (
                            <div className="text-[10px] text-white/70 font-medium mt-0.5">
                              {quotation.returnJourney.date}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1.5 pl-10">
                        {quotation.returnJourney.timeline.map((act, i) => (
                          <div
                            key={i}
                            className="border-l-2 border-white/40 bg-white/[0.06] rounded-r px-3.5 py-1.5 text-[12px] text-white/95 font-normal leading-snug"
                          >
                            {(act || '').replace(/[{}]/g, '')}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            // ==========================================
            // 5. INCLUSIONS & EXCLUSIONS (Side-by-Side in 1 Card)
            // ==========================================
            case 'inclusions_exclusions': {
              const activeInclusions = quotation.inclusions?.filter((inc) => inc.enabled) || [];
              const activeExclusions = quotation.exclusions?.filter((exc) => exc.enabled) || [];

              return (
                <div key="inclusions_exclusions" className="mt-6 mb-4">
                  {renderLeftHeading(s?.inclusionsTitle || 'INCLUSIONS :')}

                  <div
                    className="rounded-2xl p-5 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg grid grid-cols-2 gap-5"
                    style={{
                      background: 'rgba(255, 255, 255, 0.10)',
                      borderColor: 'rgba(255, 255, 255, 0.20)',
                    }}
                  >
                    {/* Left Column: Inclusions with check icons */}
                    <div className="space-y-2.5">
                      <div className="text-xs font-bold uppercase tracking-wider text-white pb-1.5 border-b border-white/20">
                        {s?.inclusionsTitle || 'INCLUSIONS :'}
                      </div>
                      <div className="space-y-1.5 pt-1">
                        {activeInclusions.map((inc, i) => (
                          <div key={i} className="flex items-start gap-2 text-[11.5px] text-white/95 leading-snug">
                            <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0 stroke-[2.5]" />
                            <span>{(inc.text || '').replace(/[{}]/g, '')}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right Column: Exclusions with cross icons */}
                    <div className="space-y-2.5 border-l border-white/20 pl-5">
                      <div className="text-xs font-bold uppercase tracking-wider text-white pb-1.5 border-b border-white/20">
                        {s?.exclusionsTitle || 'EXCLUSIONS :'}
                      </div>
                      <div className="space-y-1.5 pt-1">
                        {activeExclusions.map((exc, i) => (
                          <div key={i} className="flex items-start gap-2 text-[11.5px] text-white/95 leading-snug">
                            <XIcon className="w-3.5 h-3.5 text-rose-400 mt-0.5 shrink-0 stroke-[2.5]" />
                            <span>{(exc.text || '').replace(/[{}]/g, '')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            // ==========================================
            // 6. NOTES
            // ==========================================
            case 'notes': {
              const activeNotes = quotation.notes?.filter((n) => n.enabled) || [];
              if (activeNotes.length === 0) return null;

              return (
                <div key="notes" className="mt-6 mb-4">
                  {renderLeftHeading(s?.notesTitle || 'NOTES :')}

                  <div
                    className="rounded-2xl p-4 sm:p-5 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg space-y-2.5"
                    style={{
                      background: 'rgba(255, 255, 255, 0.10)',
                      borderColor: 'rgba(255, 255, 255, 0.20)',
                    }}
                  >
                    {activeNotes.map((note, i) => (
                      <div
                        key={i}
                        className="border-l-2 border-white/40 bg-white/[0.06] rounded-r-lg px-3.5 py-2.5 text-[11.5px] text-white/95 leading-relaxed font-normal"
                      >
                        {(note.text || '').replace(/[{}]/g, '')}
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            // ==========================================
            // 7. TERMS & CONDITIONS
            // ==========================================
            case 'terms': {
              const activeTerms = quotation.terms?.filter((t) => t.enabled) || [];
              if (activeTerms.length === 0) return null;

              return (
                <div key="terms" className="mt-6 mb-4">
                  {renderLeftHeading(s?.termsTitle || 'TERMS & CONDITIONS')}

                  <div
                    className="rounded-2xl p-4 sm:p-5 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg space-y-2.5"
                    style={{
                      background: 'rgba(255, 255, 255, 0.10)',
                      borderColor: 'rgba(255, 255, 255, 0.20)',
                    }}
                  >
                    {activeTerms.map((term, i) => (
                      <div
                        key={i}
                        className="border-l-2 border-white/40 bg-white/[0.06] rounded-r-lg px-3.5 py-2.5 text-[11px] text-white/95 leading-relaxed font-normal"
                      >
                        {(term.text || '').replace(/[{}]/g, '')}
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            // ==========================================
            // 8. CANCELLATION POLICY
            // ==========================================
            case 'cancellation': {
              const activePolicies =
                quotation.cancellationPolicy?.filter((c) => c.enabled !== false) || [];
              const notes = quotation.cancellationNotes || [];

              return (
                <div key="cancellation" className="mt-6 mb-4">
                  {renderLeftHeading(s?.cancellationTitle || 'CANCELLATION POLICY')}

                  <div
                    className="rounded-2xl p-4 sm:p-5 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg space-y-2.5"
                    style={{
                      background: 'rgba(255, 255, 255, 0.10)',
                      borderColor: 'rgba(255, 255, 255, 0.20)',
                    }}
                  >
                    {activePolicies.map((pol, i) => (
                      <div
                        key={i}
                        className="border-l-2 border-white/40 bg-white/[0.06] rounded-r-lg px-3.5 py-2.5 text-[11px] text-white/95 leading-relaxed font-normal"
                      >
                        {(pol.period || '').replace(/[{}]/g, '')}, {(pol.charges || '').replace(/[{}]/g, '')}
                      </div>
                    ))}

                    {notes.map((note, idx) => (
                      <div
                        key={`note-${idx}`}
                        className="border-l-2 border-white/40 bg-white/[0.06] rounded-r-lg px-3.5 py-2.5 text-[11px] text-white/95 leading-relaxed font-normal"
                      >
                        {(note || '').replace(/[{}]/g, '')}
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            // ==========================================
            // 9. GOOGLE RATING STRIP
            // ==========================================
            case 'rating': {
              const val = s?.ratingValue || '4.8';
              const cap = s?.ratingCaption || 'Loved by 500+ travelers\nwho trusted us with their journeys';
              const capLines = cap.split('\n');

              return (
                <div key="rating" className="my-8 py-6 px-4 text-center">
                  {/* 5 Gold/Yellow Stars */}
                  <div className="flex items-center justify-center gap-1.5 mb-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400 drop-shadow-sm"
                        style={{ fill: '#FACC15', color: '#FACC15' }}
                      />
                    ))}
                  </div>

                  {/* Rating Number & GOOGLE RATING (Bold Yellow) */}
                  <div className="flex items-center justify-center gap-3">
                    <span
                      className="text-4xl font-black font-mono tracking-tight font-bold text-yellow-400"
                      style={{ color: '#FACC15' }}
                    >
                      {val}
                    </span>
                    <span
                      className="text-base font-extrabold uppercase tracking-widest font-sans font-bold text-yellow-400"
                      style={{ color: '#FACC15' }}
                    >
                      {s?.ratingLabel || 'GOOGLE RATING'}
                    </span>
                  </div>

                  {/* Two-Line White Caption */}
                  <div className="text-xs text-white/80 text-center mt-2 leading-relaxed">
                    {capLines.map((line, idx) => (
                      <div key={idx}>{line}</div>
                    ))}
                  </div>
                </div>
              );
            }

            // ==========================================
            // 10. ABOUT US & PHOTO GRID
            // ==========================================
            case 'about_us': {
              const aboutText = s?.aboutText;
              const photos = s?.aboutPhotos?.filter(Boolean) || [];

              return (
                <div key="about_us" className="mt-6 mb-4">
                  {renderLeftHeading(s?.aboutTitle || 'ABOUT US')}

                  {/* Dark Translucent Card */}
                  {aboutText && (
                    <div className="rounded-2xl p-4 bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs leading-relaxed font-normal shadow-md mb-4">
                      {aboutText}
                    </div>
                  )}

                  {/* 3-Column Photo Grid (6 photos in 2 rows of 3) */}
                  {photos.length > 0 && (
                    <div className="grid grid-cols-3 gap-3">
                      {photos.slice(0, 6).map((imgUrl, i) => (
                        <div
                          key={i}
                          className="rounded-xl overflow-hidden aspect-[4/3] border border-white/20 shadow-md bg-black/40"
                        >
                          <img
                            src={imgUrl}
                            alt={`Tour memory ${i + 1}`}
                            className="w-full h-full object-cover"
                            crossOrigin="anonymous"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            // ==========================================
            // 11. STATS ROW
            // ==========================================
            case 'stats': {
              const stats = s?.stats || [];
              if (stats.length === 0) return null;

              return (
                <div
                  key="stats"
                  className="my-8 rounded-2xl py-6 px-6 bg-white/10 backdrop-blur-md border border-white/20 grid grid-cols-2 shadow-lg"
                >
                  {stats.slice(0, 2).map((st, i) => (
                    <div
                      key={st.id || i}
                      className={`text-center px-4 ${i === 0 ? 'border-r border-white/20' : ''}`}
                    >
                      <div
                        className="text-3xl font-black font-mono font-bold tracking-tight text-yellow-400"
                        style={{ color: '#FACC15' }}
                      >
                        {st.value}
                      </div>
                      <div className="text-xs text-white/80 mt-1 leading-snug font-normal">
                        {st.caption || st.label}
                      </div>
                    </div>
                  ))}
                </div>
              );
            }

            // ==========================================
            // 12. WAYS TO REACH US (2x2 Glass Grid)
            // ==========================================
            case 'reach_us': {
              return (
                <div key="reach_us" className="mt-8 mb-6">
                  {/* Heading */}
                  <div className="text-center mb-1">
                    <h2 className="text-lg font-bold text-white tracking-wide">
                      Ways to <span style={{ color: accent }}>Reach us</span>
                    </h2>
                    {s?.reachUsSubtitle && (
                      <p className="text-[11px] text-white/70 max-w-md mx-auto mt-1 leading-relaxed">
                        {s.reachUsSubtitle}
                      </p>
                    )}
                  </div>

                  {/* 2x2 Glass Cards Grid */}
                  <div className="grid grid-cols-2 gap-3.5 mt-5">
                    {/* Card 1: Phone */}
                    <div
                      className="rounded-2xl p-4 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg flex items-start gap-3 text-white"
                      style={{
                        background: 'rgba(255, 255, 255, 0.10)',
                        borderColor: 'rgba(255, 255, 255, 0.20)',
                      }}
                    >
                      <div className="w-8 h-8 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-white shrink-0 mt-0.5">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-white/70 tracking-wider block">
                          Phone
                        </span>
                        <span className="text-xs font-bold text-white mt-0.5 block font-mono">
                          {s?.phone || '+91 7010933178'}
                        </span>
                      </div>
                    </div>

                    {/* Card 2: Email */}
                    <div
                      className="rounded-2xl p-4 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg flex items-start gap-3 text-white"
                      style={{
                        background: 'rgba(255, 255, 255, 0.10)',
                        borderColor: 'rgba(255, 255, 255, 0.20)',
                      }}
                    >
                      <div className="w-8 h-8 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-white shrink-0 mt-0.5">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-white/70 tracking-wider block">
                          Email
                        </span>
                        <span className="text-xs font-bold text-white mt-0.5 block break-all">
                          {s?.email || 'contact@adventureholidays.co'}
                        </span>
                      </div>
                    </div>

                    {/* Card 3: Location */}
                    <div
                      className="rounded-2xl p-4 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg flex items-start gap-3 text-white"
                      style={{
                        background: 'rgba(255, 255, 255, 0.10)',
                        borderColor: 'rgba(255, 255, 255, 0.20)',
                      }}
                    >
                      <div className="w-8 h-8 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-white shrink-0 mt-0.5">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-white/70 tracking-wider block">
                          Location
                        </span>
                        <span className="text-[11.5px] font-bold text-white mt-0.5 block leading-snug">
                          {s?.locationAddress ||
                            s?.officeAddress ||
                            '2nd Floor, Vishnu Complex, 1st Cross Street, Gandhipuram, Coimbatore - 641012'}
                        </span>
                      </div>
                    </div>

                    {/* Card 4: Website */}
                    <div
                      className="rounded-2xl p-4 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg flex items-start gap-3 text-white"
                      style={{
                        background: 'rgba(255, 255, 255, 0.10)',
                        borderColor: 'rgba(255, 255, 255, 0.20)',
                      }}
                    >
                      <div className="w-8 h-8 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-white shrink-0 mt-0.5">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-semibold text-white/70 tracking-wider block">
                          Website
                        </span>
                        <span className="text-xs font-bold text-white mt-0.5 block break-all">
                          {s?.website || 'www.adventureholidays.co'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            // ==========================================
            // 13. FOOTER
            // ==========================================
            case 'footer': {
              const footerLogoSrc = '/assets/aistudio/WhatsApp_Image_2026-10-25_at_11.56.53_AM_46aa4a9a_transparent.png';

              return (
                <div key="footer" className="pt-8 pb-3 text-center flex flex-col items-center justify-center">
                  {/* Company Logo above Copyrights (Transparent Background) */}
                  <div className="mb-3 max-w-[210px]">
                    <img
                      src={footerLogoSrc}
                      alt={companyName}
                      style={{
                        maxHeight: '44px',
                        maxWidth: '200px',
                        width: 'auto',
                        height: 'auto',
                        objectFit: 'contain',
                        display: 'block',
                        margin: '0 auto',
                      }}
                      crossOrigin="anonymous"
                    />
                  </div>

                  <span className="text-[11px] text-white/60 tracking-wider font-medium">
                    {s?.footerText || `© ${companyName}. All rights reserved.`}
                  </span>
                </div>
              );
            }

            default:
              return null;
          }
        })}
      </div>
    </div>
  );
};
