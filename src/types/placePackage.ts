export type IndianState = 'Kerala' | 'Karnataka' | string;

export interface PackageItem {
  id: string;
  text: string;
  highlight: boolean; // renders in accent color (#0070C0)
}

export interface PlacePackage {
  id: string;
  name: string;
  state: IndianState;
  backgroundImage?: string;
  items: PackageItem[];
}

export interface Consultant {
  id: string;
  name: string;
  phone: string;
  email: string;
  photoUrl?: string;
}

export interface CancellationPolicyRow {
  period: string;
  charges: string;
  enabled?: boolean;
}

export interface JourneyCard {
  enabled: boolean;
  badge?: string; // e.g. "00"
  title: string;
  date?: string;
  timeline: string[];
}

export interface StatsItem {
  id: string;
  value: string;
  label: string;
  caption?: string;
}

export interface TripTypeItem {
  id: string;
  name: string;
}

export type SectionId =
  | 'header'
  | 'greeting'
  | 'journey_overview'
  | 'the_experience'
  | 'inclusions_exclusions'
  | 'notes'
  | 'terms'
  | 'cancellation'
  | 'rating'
  | 'about_us'
  | 'stats'
  | 'reach_us'
  | 'footer';

export interface SectionLayoutItem {
  id: SectionId;
  name: string;
  enabled: boolean;
  order: number;
}

export interface PdfThemeSettings {
  accentColor: string; // e.g. #0070C0 or #FACC15
  headingColor: string; // e.g. #FFFFFF
  backgroundColor: string; // e.g. #080E24 (reference midnight navy)
  cardBackground: string; // e.g. #0C1433 or frosted white
  borderColor: string; // e.g. #1E2958
  textColor: string; // e.g. #FFFFFF
  secondaryTextColor: string; // e.g. #94A3B8
  fontFamily: string; // e.g. "'Poppins', sans-serif"
  useBackgroundImage?: boolean; // toggle for background image
  backgroundImageUrl?: string; // base64 or URL
  backgroundOverlayOpacity?: number; // 0 to 0.60
}

export interface AppSettings {
  // 1. Company & Branding
  companyName: string;
  tagline: string;
  logoUrl?: string;
  accentColor: string; // default #FACC15
  footerText: string;
  website: string;

  // 2. Contact & Ways to Reach
  phone: string;
  phoneSecondary?: string;
  email: string;
  officeAddress: string;
  locationAddress?: string;
  socialInstagram?: string;
  socialFacebook?: string;

  // 3. Consultants
  consultants: Consultant[];

  // 4. Quotation Content
  greetingHeading: string;
  greetingIntro: string;
  greetingSuffix: string;
  journeyOverviewTitle: string;
  experienceTitle: string;
  costingTitle: string;
  totalPackageLabel: string;
  defaultPriceNote: string;
  inclusionsTitle: string;
  exclusionsTitle: string;
  notesTitle: string;
  termsTitle: string;
  cancellationTitle: string;
  ratingLabel: string;
  ratingCaption: string;
  aboutTitle: string;
  reachUsTitle: string;
  reachUsSubtitle: string;

  defaultInclusions: string[];
  defaultExclusions: string[];
  defaultNotes: string[];
  defaultTerms: string[];
  defaultCancellationPolicy: CancellationPolicyRow[];
  defaultCancellationNotes: string[];
  defaultDepartureJourney: JourneyCard;
  defaultReturnJourney: JourneyCard;

  // 5. Trust & About
  ratingValue: string; // e.g. "4.8"
  aboutText: string;
  aboutPhotos: string[];
  stats: StatsItem[];

  // 6. Layout Settings
  sectionLayout: SectionLayoutItem[];

  // 7. Trip Types
  tripTypes: TripTypeItem[];

  // 8. PDF Theme Settings
  pdfTheme: PdfThemeSettings;
}

export interface QuotationDayPlan {
  dayNumber: number;
  packageIds: string[];
  customTitle?: string;
  date?: string;
  customItems?: PackageItem[];
}

export interface Quotation {
  id: string;
  code: string;
  createdAt: string;
  updatedAt: string;
  
  // Step 1: Trip type, consultant, client or institution name
  tripType: string;
  customTripType?: string;
  consultantId: string;
  consultantSnapshot?: Consultant;
  clientName: string; // e.g. "KPR Institute of Engineering and Technology"

  // Step 2: Group and daily plan
  destination: string; // e.g. "Udupi - Gokarna - Dandeli - Murdeshwar"
  duration: string; // e.g. "2N3D"
  travelers: number;
  staffFocCount: string; // e.g. "2 Staffs (FOC)"
  departureDate: string; // e.g. "01 Oct 2026"
  returnDate: string; // e.g. "03 Oct 2026"
  travelDates: string;
  vehicle: string; // e.g. "53 Seater Bus (Non - Ac)"
  pickupDropPoint: string; // e.g. "Pickup and Drop at College Campus"
  days: number;
  dayPackages: QuotationDayPlan[];

  // Journey Cards
  departureJourney: JourneyCard;
  returnJourney: JourneyCard;

  // Step 3: Costing & Price details
  pricePerPerson: number;
  totalAmount: number;
  isTotalManualOverride: boolean;
  advance: number;
  balance: number;
  priceNote: string;

  // Step 4: Instructions and details (per-quotation toggles)
  inclusions: { text: string; enabled: boolean }[];
  exclusions: { text: string; enabled: boolean }[];
  notes: { text: string; enabled: boolean }[];
  terms: { text: string; enabled: boolean }[];
  cancellationPolicy: { period: string; charges: string; enabled?: boolean }[];
  cancellationNotes: string[];
  specialInstructions?: string;

  status: 'Draft' | 'Confirmed' | 'Presented';

  // Snapshot of settings at creation time
  settingsSnapshot?: AppSettings;
}
