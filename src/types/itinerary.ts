export type TripRegion = 'DOM' | 'INTL';

export type GroupType = 'FIT' | 'SCH' | 'CLG' | 'COR' | 'CPL' | 'GD';

export interface Consultant {
  id: string;
  name: string;
  phone: string;
  role: string;
  count: number;
  email: string;
  avatar?: string;
}

export type PricingUnit = 'Per Pax' | 'Per Couple' | 'Total Package' | 'Per Suite' | 'Per Villa';

export interface PricingSlot {
  id: string;
  label: string;
  price: number;
  unit: PricingUnit;
}

export interface ItineraryDay {
  id: string;
  dayNumber: number; // 0 for arrival/pre-trip, 1..N for standard days
  title: string;
  date: string;
  activities: string;
  enableNotes: boolean;
  notes?: string;
  highlight?: string;
  imageUrl?: string;
}

export interface Itinerary {
  id: string;
  code: string; // e.g. AH26-INTL-CPL-349
  quotationDate: string;
  validUntil: string;
  region: TripRegion;
  groupType: GroupType;
  
  // Client details
  clientName: string;
  clientNumber: string;
  clientEmail?: string;

  // Consultant
  consultant: Consultant;

  // Trip details
  destination: string;
  duration: string; // e.g. 4N5D
  dateOfTravel: string;
  transportDetails: string;
  groupSizePax: string; // e.g. 2 Adults, 10 Adults 2 Infants

  // Costing
  pricingSlots: PricingSlot[];
  costingNote: string;
  currency: '₹' | '$' | '€';

  // Days
  hasDay0: boolean;
  day0?: ItineraryDay;
  days: ItineraryDay[];

  // Details
  enableNotes: boolean;
  generalNotes?: string;
  inclusions: string[];
  exclusions: string[];

  // Policies
  cancellationPolicy: string;
  paymentTerms: string;
  expeditionSafetyTerms: string;

  // Visuals & Status
  coverImage?: string;
  status: 'Draft' | 'Presented' | 'Confirmed' | 'Approved' | 'Archived';
  createdAt: string;
}

export interface DayKeywordPreset {
  id: string;
  keyword: string;
  title: string;
  defaultActivities: string;
  defaultNotes?: string;
  region: TripRegion;
  suggestedHighlight?: string;
}
