export type TourDifficulty = 'Gentle' | 'Moderate' | 'Demanding' | 'Challenging';

export type TourCategory = 'Alpine & Glacial' | 'Marine & Fjords' | 'Cultural Trails' | 'Wildlife Safari';

export interface DepartureDate {
  id: string;
  startDate: string;
  endDate: string;
  season: string;
  pricePerPerson: number;
  availableSpots: number;
  totalSpots: number;
  status: 'Guaranteed' | 'Filling Fast' | 'Few Spots Left';
}

export interface ItineraryDay {
  day: number;
  title: string;
  location: string;
  description: string;
  highlights: string[];
  accommodation: string;
  mealsIncluded: string;
}

export interface Tour {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  region: string;
  country: string;
  category: TourCategory;
  durationDays: number;
  groupSizeMax: number;
  difficulty: TourDifficulty;
  startingPrice: number;
  image: string;
  summary: string;
  description: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  packingEssentials: string[];
  departures: DepartureDate[];
  itinerary: ItineraryDay[];
  featured?: boolean;
}

export interface ExpeditionLeader {
  id: string;
  name: string;
  role: string;
  specialty: string;
  yearsExperience: number;
  bio: string;
  avatarText: string;
}

export interface AlumniReview {
  id: string;
  travelerName: string;
  travelerCity: string;
  expeditionTitle: string;
  travelDate: string;
  rating: number;
  quote: string;
  outcome: string;
}

export interface BookingSubmission {
  bookingId: string;
  tourId: string;
  tourTitle: string;
  departureDate: DepartureDate;
  guestsCount: number;
  guestNames: string[];
  primaryContact: {
    fullName: string;
    email: string;
    phone: string;
    dietaryNotes?: string;
    emergencyContact?: string;
  };
  singleSupplement: boolean;
  addOnGearRental: boolean;
  addOnScenicFlight: boolean;
  depositAmount: number;
  totalAmount: number;
  timestamp: string;
}
