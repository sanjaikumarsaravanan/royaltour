import { Consultant, DayKeywordPreset, Itinerary } from '../types/itinerary';

/**
 * Clean slate initial dataset for ROYAL TOURS launch.
 * Starting from first with zero mock/dummy records.
 */
export const INITIAL_CONSULTANTS: Consultant[] = [];

export const INITIAL_KEYWORD_PRESETS: DayKeywordPreset[] = [
  {
    id: 'kw-andaman-bio',
    keyword: 'Andaman/Bioluminescence',
    title: 'Havelock Island Private Night Kayaking & Luminescence Lagoon',
    defaultActivities: 'After sunset, embark on bespoke fiberglass sea kayaks guided by certified marine naturalists into the pitch-dark mangrove channels of Havelock. Witness undisturbed blue bioluminescent dinoflagellates lighting the ocean wake with each stroke. Conclude with a chilled glass of premier champagne on a secluded sandbank.',
    defaultNotes: 'Dry bags, waterproof headlamps, and thermal reef rashguards provided. Best experienced under low lunar illumination.',
    region: 'INTL',
    suggestedHighlight: 'Starlit Bioluminescent Lagoon',
  },
  {
    id: 'kw-andaman-yacht',
    keyword: 'Andaman/PrivateCatamaran',
    title: 'Neil & Havelock Coral Atoll Private Yacht Expedition',
    defaultActivities: 'Board a private 54ft Fontaine Pajot catamaran from Port Blair. Sail past pristine uninhabited coral reefs with private snorkel tenders and sea scooters. Gourmet lunch prepared by on-board chef with freshly caught Andaman red snapper. Evening anchorage off Neil Island for private sundowner cocktails on deck.',
    defaultNotes: 'Private divemaster aboard with Nitrox certification capabilities.',
    region: 'INTL',
    suggestedHighlight: 'Private Catamaran Reef Anchor',
  },
  {
    id: 'kw-rishikesh-heli',
    keyword: 'Rishikesh/CliffCamp',
    title: 'Ganges Canyon Heli-Rafting & Private Sanctuary Cliff Camp',
    defaultActivities: 'Helicopter transfer from Dehradun to the upper Himalayan river corridor. Complete a thrilling Class IV-V descent past secluded canyon gorges under the guidance of elite river masters. Land at a discreet cliffside luxury tented sanctuary with private bonfire sitar performance and wood-fired organic cuisine.',
    defaultNotes: 'Helicopter departure depends on morning valley wind corridors. High-grade neoprene dry suits provided.',
    region: 'DOM',
    suggestedHighlight: 'Class V Rapid Descent & Cliffside Camp',
  },
  {
    id: 'kw-coorg-plantation',
    keyword: 'Coorg/CloudForest',
    title: 'Western Ghats Private Rainforest Sanctuary & Heritage Cupping',
    defaultActivities: 'Private 4x4 Land Cruiser transfer into an 800-acre private coffee and spice biosphere. Guided canopy trek through sacred shola groves with a resident botanist. Sunset artisanal cupping session sampling rare micro-lot Arabica beans paired with Kodava smoked delicacy tasting.',
    defaultNotes: 'Leech guards and custom walking canes provided at lodge departure.',
    region: 'DOM',
    suggestedHighlight: 'Canopy Walk & Private Reserve Cupping',
  },
  {
    id: 'kw-patagonia-glacier',
    keyword: 'Patagonia/HeliHike',
    title: 'Torres del Paine Glacial Traverse & Ice Cave Penetration',
    defaultActivities: 'Private helicopter transfer to the base of Glacier Grey. Equip with technical crampons and harnesses for a deep crevasses exploration with UIAGM mountain guides. Savor single-malt scotch chilled over 10,000-year-old blue glacial ice, followed by a panoramic flight over the Cuernos.',
    defaultNotes: 'Technical mountaineering boots and crampons custom-fitted the prior evening.',
    region: 'INTL',
    suggestedHighlight: 'Deep Glacial Crevasse Navigation',
  },
  {
    id: 'kw-arctic-aurora',
    keyword: 'Lofoten/AuroraLodge',
    title: 'Nordic Fjord Sea Kayak & Aurora Borealis Architectural Watch',
    defaultActivities: 'Midday sea safari past rugged arctic peaks, observing white-tailed sea eagles and porpoises. Return to the heated private glass-fronted fjord lodge. Evening fireside dinner with cured reindeer and arctic char, followed by midnight stargazing under the dancing Aurora Borealis from private outdoor cedar thermal tubs.',
    defaultNotes: 'Northern Lights alert concierge active throughout the night.',
    region: 'INTL',
    suggestedHighlight: 'Architectural Aurora Watch',
  },
];

export const INITIAL_ITINERARIES: Itinerary[] = [];
