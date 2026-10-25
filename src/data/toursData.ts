import { Tour, ExpeditionLeader, AlumniReview } from '../types/tour';

export const TOURS_DATA: Tour[] = [
  {
    id: 'patagonia-icefield',
    slug: 'southern-patagonian-icefield-traverse',
    title: 'Southern Patagonian Icefield Traverse',
    tagline: 'Glacial lagoons, sheer granite spires, and remote sub-polar wilderness.',
    region: 'South America',
    country: 'Chile & Argentina',
    category: 'Alpine & Glacial',
    durationDays: 11,
    groupSizeMax: 10,
    difficulty: 'Demanding',
    startingPrice: 6450,
    image: '/src/assets/images/hero_patagonia_expedition_1792906260978.jpg',
    summary: 'Traverse the wild backcountry borders of Los Glaciares and Torres del Paine National Parks on foot and zodiac.',
    description: 'An expedition designed for spirited trekkers seeking the edge of the inhabited world. From the turquoise waters of Lago Grey to the imposing granite amphitheater of Mount Fitz Roy, this journey pairs backcountry traverses with sustainable geodesic eco-domes and private field naturalist guidance.',
    highlights: [
      'Navigate the southern ice tongue of Grey Glacier on private RIB boats',
      'Exclusive sunrise trek to Mirador Las Torres ahead of standard trail traffic',
      'Remote basecamp stays in heated geodesic domes overlooking Lago Nordenskjöld',
      'Private crossing of the French Valley with certified IFMGA alpine guides'
    ],
    inclusions: [
      '10 nights accommodation in boutique eco-domes and wilderness lodges',
      'All chef-crafted meals featuring regional Patagonian produce and wine pairings',
      'Dedicated lead expedition guide and mountain safety lead (1:5 ratio)',
      'All national park entry permits, zodiac boat transfers, and internal chartered vans',
      'Technical trekking poles, crampons, and expedition dry-bags'
    ],
    exclusions: [
      'International flights to Santiago / Buenos Aires',
      'Personal comprehensive travel medical evacuation insurance (mandatory)',
      'Personal hiking boots and technical shell jacket'
    ],
    packingEssentials: [
      'GORE-TEX or equivalent 3-layer weatherproof shell jacket',
      'Sturdy waterproof mountain boots broken-in with high ankle support',
      'Merino wool thermal base layers (minimum 2 sets)',
      'Category 3 or 4 UV polarized glacier sunglasses',
      'Packable 650+ fill down jacket for high-wind alpine passes'
    ],
    departures: [
      {
        id: 'pat-2026-11-04',
        startDate: 'Nov 4, 2026',
        endDate: 'Nov 14, 2026',
        season: 'Spring',
        pricePerPerson: 6450,
        availableSpots: 4,
        totalSpots: 10,
        status: 'Guaranteed'
      },
      {
        id: 'pat-2026-12-02',
        startDate: 'Dec 2, 2026',
        endDate: 'Dec 12, 2026',
        season: 'Summer',
        pricePerPerson: 6850,
        availableSpots: 2,
        totalSpots: 10,
        status: 'Few Spots Left'
      },
      {
        id: 'pat-2027-01-14',
        startDate: 'Jan 14, 2027',
        endDate: 'Jan 24, 2027',
        season: 'Summer',
        pricePerPerson: 6950,
        availableSpots: 6,
        totalSpots: 10,
        status: 'Guaranteed'
      }
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Punta Arenas & Transfer to Puerto Natales',
        location: 'Magellan Strait, Chile',
        description: 'Meet the expedition director at Punta Arenas. Scenic overland transfer along the steppe of the Magellan Strait to our coastal lodge in Puerto Natales. Evening expedition briefing and welcome dinner.',
        highlights: ['Scenic coastal drive', 'Gear inspection & fitting', 'Welcome Patagonian lamb asado dinner'],
        accommodation: 'Singular Patagonia Heritage Lodge',
        mealsIncluded: 'Dinner'
      },
      {
        day: 2,
        title: 'Entry to Torres del Paine & Pehoe Sanctuary',
        location: 'Torres del Paine National Park',
        description: 'Enter the national park via the Laguna Amarga gateway. Catamaran voyage across Lake Pehoe surrounded by 2,000-meter sheer horn formations.',
        highlights: ['Catamaran cruise on Lake Pehoe', 'Guanaco herds and Andean condor spotting', 'Settling into sustainable eco-camp'],
        accommodation: 'EcoCamp Patagonia Geodesic Domes',
        mealsIncluded: 'Breakfast, Lunch, Dinner'
      },
      {
        day: 3,
        title: 'The Granite Towers Ascendance',
        location: 'Ascencio Valley',
        description: 'Early dawn departure up the Ascencio Valley, passing ancient lenga beech forests and terminal moraines to reach the base of the iconic three granite spires.',
        highlights: ['Sunrise light hitting Las Torres', 'Glacial tarn exploration', 'Field geology briefing by Dr. Rostova'],
        accommodation: 'EcoCamp Patagonia Geodesic Domes',
        mealsIncluded: 'Breakfast, Boxed Trail Lunch, Dinner'
      },
      {
        day: 4,
        title: 'French Valley Natural Amphitheater',
        location: 'Valle del Francés',
        description: 'Trek along the skirts of Mount Paine Grande. Experience thunderous calving events from hanging glaciers perched high on the cliffs above.',
        highlights: ['Hanging glacier acoustics', 'Panoramic views of Cuernos del Paine', 'Sub-alpine native flora documentation'],
        accommodation: 'Refugio Los Cuernos Private Cabins',
        mealsIncluded: 'Breakfast, Trail Lunch, Dinner'
      },
      {
        day: 5,
        title: 'Grey Glacier Ice Field Traverse',
        location: 'Lake Grey',
        description: 'Hike into the Southern Icefield boundary. Don crampons for a guided 3-hour walk directly atop the blue crevasses of Grey Glacier with glaciology leads.',
        highlights: ['Guided glacier ice walk', 'Blue ice caves exploration', 'Zodiac cruise amongst floating cobalt icebergs'],
        accommodation: 'Hotel Lago Grey Wilderness Suite',
        mealsIncluded: 'Breakfast, Lunch, Dinner'
      },
      {
        day: 6,
        title: 'Trans-Andean Crossing to El Chaltén',
        location: 'Argentine Frontier & El Chaltén',
        description: 'Cross the dramatic steppe into Argentine Patagonia. Arrive at the foot of Mount Fitz Roy and Cerro Torre in the world trekking capital.',
        highlights: ['High-plateau frontier crossing', 'Panoramic vistas of Viedma Lake', 'Artisanal micro-brewery tasting in El Chaltén'],
        accommodation: 'Destino Sur Alpine Lodge',
        mealsIncluded: 'Breakfast, Lunch, Dinner'
      },
      {
        day: 7,
        title: 'Laguna de los Tres & Mount Fitz Roy',
        location: 'Los Glaciares National Park',
        description: 'Ascend the classic trail to Laguna de los Tres for an uninhibited close-up view of the sheer eastern wall of Fitz Roy.',
        highlights: ['Mirador del Fitz Roy', 'Turquoise glacial tarn', 'Alps-style backcountry trail meal'],
        accommodation: 'Destino Sur Alpine Lodge',
        mealsIncluded: 'Breakfast, Boxed Trail Lunch, Dinner'
      },
      {
        day: 8,
        title: 'Cerro Torre & Glaciar Grande',
        location: 'Laguna Torre',
        description: 'Follow the river canyon to the glacial lagoon at the base of the needle-sharp spire of Cerro Torre.',
        highlights: ['Wind-carved iceberg shorelines', 'Climbing history session at De Agostini', 'Birdwatching for Magellanic woodpeckers'],
        accommodation: 'Destino Sur Alpine Lodge',
        mealsIncluded: 'Breakfast, Lunch, Dinner'
      },
      {
        day: 9,
        title: 'Perito Moreno Glacier Exploration',
        location: 'El Calafate',
        description: 'Private morning transfer to the advancing face of Perito Moreno Glacier. Walk dedicated elevated catwalks and board private safari boat.',
        highlights: ['Continuous ice calving observation', 'Private boat along south wall', 'Glacial whiskey tasting on the ice edge'],
        accommodation: 'Eolo Spirit of Patagonia Lodge',
        mealsIncluded: 'Breakfast, Lunch, Dinner'
      },
      {
        day: 10,
        title: 'Estancia Heritage & Guanaco Conservation',
        location: 'Argentine Steppe',
        description: 'Spend an afternoon with third-generation gauchos on a 20,000-acre conservation ranch learning habitat restoration practices.',
        highlights: ['Traditional sheep-shearing & wool spinning demo', 'Horseback ride across the steppe ridge', 'Farewell gala dinner'],
        accommodation: 'Eolo Spirit of Patagonia Lodge',
        mealsIncluded: 'Breakfast, Lunch, Dinner'
      },
      {
        day: 11,
        title: 'El Calafate Departure',
        location: 'El Calafate Airport',
        description: 'Morning breakfast overlooking the steppe horizon before private airport transfer for onward international connections.',
        highlights: ['Sunrise wildlife panorama', 'Airport transfer included', 'Digital expedition photo collection dispatch'],
        accommodation: 'Departure Day',
        mealsIncluded: 'Breakfast'
      }
    ],
    featured: true
  },
  {
    id: 'nordic-fjords-charter',
    slug: 'norwegian-fjords-arctic-sound-expedition',
    title: 'Norwegian Fjords & Arctic Sound Expedition',
    tagline: 'Deep emerald waterways, remote fishing hamlets, and sheer sea-cliff navigation.',
    region: 'Northern Europe',
    country: 'Norway',
    category: 'Marine & Fjords',
    durationDays: 9,
    groupSizeMax: 12,
    difficulty: 'Moderate',
    startingPrice: 5800,
    image: '/src/assets/images/tour_nordic_fjords_1792906261860.jpg',
    summary: 'Sail narrow UNESCO fjords aboard an intimate ice-strengthened expedition ship with daily sea-kayaking excursions.',
    description: 'Experience western Norway from the water. Cruise the serene, vertical corridors of Geirangerfjord, Nærøyfjord, and the Sunnmøre Alps. Small vessel agility allows anchoring in isolated coves unreachable by commercial liners, offering daily Zodiac landings and sea kayak expeditions under thundering waterfalls.',
    highlights: [
      'Navigate steep glacial corridors of UNESCO-listed Nærøyfjord and Hjørundfjord',
      'Daily guided sea kayaking beneath 1,000-meter sheer coastal cliffs',
      'Foraging and wild seafood culinary experiences with a Nordic private chef',
      'Private rib-boat excursion to offshore puffin and white-tailed sea eagle colonies'
    ],
    inclusions: [
      '8 nights aboard our luxury expedition vessel in ocean-view staterooms',
      'All meals prepared on board with locally sourced line-caught fish and game',
      'Certified marine biologist and Arctic sea kayaking master guides',
      'All Zodiac excursions, kayak gear, and drysuits provided',
      'Internal transfers between Bergen and Ålesund'
    ],
    exclusions: [
      'International flights to Bergen / from Ålesund',
      'Personal alcohol beyond curated dinner pairings',
      'Gratuities for ship crew'
    ],
    packingEssentials: [
      'Thermal base layers (merino wool 200g/m²)',
      'Waterproof seam-sealed trousers and waterproof daypack',
      'Sturdy deck shoes with non-marking rubber soles',
      'Binoculars (8x42 recommended for bird and seal colonies)'
    ],
    departures: [
      {
        id: 'nor-2026-06-12',
        startDate: 'Jun 12, 2026',
        endDate: 'Jun 20, 2026',
        season: 'Summer',
        pricePerPerson: 5800,
        availableSpots: 3,
        totalSpots: 12,
        status: 'Few Spots Left'
      },
      {
        id: 'nor-2026-07-18',
        startDate: 'Jul 18, 2026',
        endDate: 'Jul 26, 2026',
        season: 'Summer',
        pricePerPerson: 6200,
        availableSpots: 5,
        totalSpots: 12,
        status: 'Guaranteed'
      },
      {
        id: 'nor-2026-08-22',
        startDate: 'Aug 22, 2026',
        endDate: 'Aug 30, 2026',
        season: 'Summer',
        pricePerPerson: 5900,
        availableSpots: 8,
        totalSpots: 12,
        status: 'Guaranteed'
      }
    ],
    itinerary: [
      {
        day: 1,
        title: 'Embarkation in Hanseatic Bergen',
        location: 'Bergen Harbor',
        description: 'Board our expedition vessel at the historical Bryggen wharf. Welcome champagne reception on deck as we slip past coastal archipelago islands into the open fjord sound.',
        highlights: ['Hanseatic wharf boarding', 'Captain welcome address', 'First sunset sail through the outer skerries'],
        accommodation: 'Expedition Vessel M/V Solstice',
        mealsIncluded: 'Dinner'
      },
      {
        day: 2,
        title: 'Nærøyfjord Passage & Waterfalls',
        location: 'Gudvangen & Flåm',
        description: 'Enter the narrowest fjord in Europe, where cliff walls close to just 250 meters apart. Launch kayaks directly from the ship stern platform.',
        highlights: ['Kayak glide past the Kjelfossen falls', 'Quiet electric cruise mode through silent waters', 'Traditional goat cheese tasting in Undredal'],
        accommodation: 'Expedition Vessel M/V Solstice',
        mealsIncluded: 'Breakfast, Lunch, Dinner'
      },
      {
        day: 3,
        title: 'Glacial Tongue of Nigardsbreen',
        location: 'Jostedalsbreen Region',
        description: 'Tender ashore to travel up the valley to Nigardsbreen, an electric-blue glacial arm tumbling from continental Europe’s largest ice cap.',
        highlights: ['Guided ice exploration', 'Fjord geology presentation', 'Fireside cider reception on shore'],
        accommodation: 'Expedition Vessel M/V Solstice',
        mealsIncluded: 'Breakfast, Lunch, Dinner'
      },
      {
        day: 4,
        title: 'Nordfjord Coastal Villages & Viking Heritage',
        location: 'Olden & Loen',
        description: 'Anchor in picturesque Olden. Take the skylift to Mount Hoven for a 360-degree panorama over fjords, lakes, and snowpack.',
        highlights: ['Loen Skylift ascent', 'Subalpine ridge hike', 'Viking longship reconstruction site visit'],
        accommodation: 'Expedition Vessel M/V Solstice',
        mealsIncluded: 'Breakfast, Lunch, Dinner'
      },
      {
        day: 5,
        title: 'Hjørundfjord & Sunnmøre Alps',
        location: 'Trandal & Øye',
        description: 'Enter the dramatic, untamed Hjørundfjord. Visit the roadless hamlet of Trandal accessible only by sea, followed by high-tea at historic Union Øye.',
        highlights: ['Secluded fjord hamlet visit', 'High-tea at Union Øye', 'Evening acoustic fjord cello performance on deck'],
        accommodation: 'Expedition Vessel M/V Solstice',
        mealsIncluded: 'Breakfast, Lunch, Dinner'
      },
      {
        day: 6,
        title: 'Geirangerfjord & Seven Sisters',
        location: 'Geiranger',
        description: 'Cruise the world-famous Seven Sisters and Suitor waterfalls. Zodiac cruise to abandoned historic cliff-ledge farmsteads.',
        highlights: ['Zodiac landing at Skageflå cliff trail', 'Cliff farm restoration briefing', 'Dinner featuring line-caught Arctic char'],
        accommodation: 'Expedition Vessel M/V Solstice',
        mealsIncluded: 'Breakfast, Lunch, Dinner'
      },
      {
        day: 7,
        title: 'Runde Island Sea Bird Sanctuary',
        location: 'Runde Bird Island',
        description: 'Sail to Runde island, home to over 500,000 seabirds. Zodiac exploration into sea caves and puffin nesting ledges.',
        highlights: ['Atlantic puffin colony photography', 'Sea cave Zodiac maneuvers', 'Marine biologist field lecture on North Sea ecology'],
        accommodation: 'Expedition Vessel M/V Solstice',
        mealsIncluded: 'Breakfast, Lunch, Dinner'
      },
      {
        day: 8,
        title: 'Art Nouveau Archipelago of Ålesund',
        location: 'Ålesund',
        description: 'Dock in Ålesund, famous for its unique Art Nouveau architecture. Evening hike up Mount Aksla for golden hour views over the town and islands.',
        highlights: ['Art Nouveau walking architectural tour', 'Mount Aksla panorama', 'Captain farewell multi-course tasting menu'],
        accommodation: 'Expedition Vessel M/V Solstice',
        mealsIncluded: 'Breakfast, Lunch, Dinner'
      },
      {
        day: 9,
        title: 'Ålesund Disembarkation',
        location: 'Ålesund Airport',
        description: 'Final breakfast on board before morning transfer to Ålesund Vigra Airport for homeward flights.',
        highlights: ['Morning harbor farewell', 'Luggage transfer support', 'High-res expedition voyage digital log'],
        accommodation: 'Departure Day',
        mealsIncluded: 'Breakfast'
      }
    ],
    featured: true
  },
  {
    id: 'japan-alps-nakasendo',
    slug: 'japanese-alps-sacred-forest-trails',
    title: 'Japanese Alps & Ancient Forest Trails',
    tagline: 'Feudal post towns, moss-carpeted cedar paths, and secluded thermal onsen.',
    region: 'East Asia',
    country: 'Japan',
    category: 'Cultural Trails',
    durationDays: 10,
    groupSizeMax: 8,
    difficulty: 'Moderate',
    startingPrice: 5200,
    image: '/src/assets/images/tour_japan_alps_1792906261977.jpg',
    summary: 'Hike the legendary Nakasendo postal trail and sacred Kiso Valley into deep cedar mountain shrines with private tea masters.',
    description: 'Walk in the footsteps of samurai, poets, and pilgrims. This cultural walking expedition traverses stone-paved highways through ancient cypress forests, connecting preserved Edo-period villages like Magome, Tsumago, and Narai. Nights are spent in historic family-run ryokans featuring seasonal kaiseki banquets and mineral hot springs.',
    highlights: [
      'Trek preserved sections of the 400-year-old Nakasendo Trail across Kiso Valley',
      'Exclusive private stays in multi-generational wooden ryokan onsen inns',
      'Private tea ceremony and Zen meditation session with temple abbots in Kyoto & Takayama',
      'High-altitude alpine crossing through the Kamikochi glacier valley in Northern Alps'
    ],
    inclusions: [
      '9 nights in hand-selected traditional ryokans and luxury heritage hotels',
      'Multi-course seasonal Kaiseki evening dinners and traditional breakfasts',
      'Licensed bilingual cultural anthropologist & trail historian',
      'Private luggage transfers between post towns so you only hike with daypacks',
      'First-class Shinkansen bullet train and chartered private vans'
    ],
    exclusions: [
      'International flights to Tokyo / from Osaka',
      'Discretionary temple donations',
      'Personal sake purchases at private tastings'
    ],
    packingEssentials: [
      'Comfortable lightweight hiking shoes with good rock grip',
      'Slip-on footwear for frequent ryokan entry transitions',
      'Breathable moisture-wicking layers for forest trails',
      'Compact travel umbrella or lightweight rain shell'
    ],
    departures: [
      {
        id: 'jap-2026-10-08',
        startDate: 'Oct 8, 2026',
        endDate: 'Oct 17, 2026',
        season: 'Autumn',
        pricePerPerson: 5200,
        availableSpots: 2,
        totalSpots: 8,
        status: 'Few Spots Left'
      },
      {
        id: 'jap-2026-11-03',
        startDate: 'Nov 3, 2026',
        endDate: 'Nov 12, 2026',
        season: 'Autumn',
        pricePerPerson: 5400,
        availableSpots: 4,
        totalSpots: 8,
        status: 'Guaranteed'
      },
      {
        id: 'jap-2027-04-12',
        startDate: 'Apr 12, 2027',
        endDate: 'Apr 21, 2027',
        season: 'Spring',
        pricePerPerson: 5600,
        availableSpots: 6,
        totalSpots: 8,
        status: 'Guaranteed'
      }
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Tokyo & High-Speed Transit to Kiso Valley',
        location: 'Tokyo & Kiso Valley',
        description: 'Meet in Tokyo and board the bullet train skirting Mount Fuji into the green Kiso mountain valley. Settle into our first hillside wooden inn.',
        highlights: ['Shinkansen bullet train transit', 'Traditional yukata introduction', 'Seasonal welcoming kaiseki dinner'],
        accommodation: 'Kisoji Ryokan Sanctuary',
        mealsIncluded: 'Dinner'
      },
      {
        day: 2,
        title: 'Magome to Tsumago Post Town Traverse',
        location: 'Magome-juku & Tsumago-juku',
        description: 'Hike 8.5 km across the Magome Pass. Walk over cobblestone stone paths bordered by bamboo groves and watermills into the vehicle-free village of Tsumago.',
        highlights: ['Magome mountain pass vista', 'Historic wood preservation architecture', 'Matcha tea stop at Tateba Tea House'],
        accommodation: 'Tsumago Heritage Minshuku',
        mealsIncluded: 'Breakfast, Lunch, Dinner'
      },
      {
        day: 3,
        title: 'Yabuhara to Narai-juku via Torii Pass',
        location: 'Torii Pass',
        description: 'Conquer the 1,197m Torii Pass lined with ancient stone Jizo statues and shinto torii gates. Descend into Narai, nicknamed "Narai of a Thousand Houses".',
        highlights: ['Shinto forest shrine meditation', 'Centuries-old lacquerware artisan workshop visit', 'Thermal onsen mineral soak'],
        accommodation: 'Oyado Narai Historic Inn',
        mealsIncluded: 'Breakfast, Lunch, Dinner'
      },
      {
        day: 4,
        title: 'Kamikochi Alpine Valley in Northern Alps',
        location: 'Kamikochi National Park',
        description: 'Enter the protected alpine sanctuary of Kamikochi. Stroll along the crystal Azusa River beneath the snow-dusted peaks of Mount Hotaka.',
        highlights: ['Kappabashi suspension bridge view', 'Alpine larch forests reflection in Taisho Pond', 'Private nature ecology walk'],
        accommodation: 'Kamikochi Imperial Alpine Retreat',
        mealsIncluded: 'Breakfast, Lunch, Dinner'
      },
      {
        day: 5,
        title: 'Takayama Edo Merchant Quarter',
        location: 'Takayama Historic District',
        description: 'Explore the preserved merchant streets of Sanmachi Suji. Meet a 9th-generation sake brewmaster for an exclusive tasting in private cellars.',
        highlights: ['Historic wooden morning markets', 'Rare Junmai Daiginjo sake tasting', 'Hida wagyu beef stone grill dinner'],
        accommodation: 'Honoki Onsen Resort',
        mealsIncluded: 'Breakfast, Lunch, Dinner'
      },
      {
        day: 6,
        title: 'Shirakawa-go Gassho Farmhouses',
        location: 'UNESCO Shirakawa-go',
        description: 'Visit the thatch-roofed farmhouses engineered to withstand heavy mountain snowfalls. Learn traditional hemp weaving from local elders.',
        highlights: ['Private entrance to 250-year-old Wada House', 'Rooftop steep-pitch construction tour', 'Forest herbal culinary tasting'],
        accommodation: 'Gassho Wilderness Lodge',
        mealsIncluded: 'Breakfast, Lunch, Dinner'
      },
      {
        day: 7,
        title: 'Sacred Cedar Forests of Mount Hiei',
        location: 'Kyoto Hinterlands',
        description: 'Transit to the quiet forested ridges of Mount Hiei, the cradle of Tendai Buddhism overlooking Lake Biwa and Kyoto valley.',
        highlights: ['Enryaku-ji monastic complex', 'Sound bowl meditation session', 'Temple vegetarian Shojin Ryori banquet'],
        accommodation: 'Hiei Monastic Garden Retreat',
        mealsIncluded: 'Breakfast, Lunch, Dinner'
      },
      {
        day: 8,
        title: 'Kyoto Zen Gardens & Bamboo Shrines',
        location: 'Arashiyama & Northern Kyoto',
        description: 'Morning private entry into secluded moss gardens before public gates open. Walk the quiet bamboo trails and study dry stone garden philosophy.',
        highlights: ['Pre-opening private temple entry', 'Master tea bowl craftsmanship studio', 'Evening geiko cultural conversation'],
        accommodation: 'The Celestine Gion Kyoto',
        mealsIncluded: 'Breakfast, Lunch, Dinner'
      },
      {
        day: 9,
        title: 'Kamo River & Artisanal Culinary Farewell',
        location: 'Kyoto',
        description: 'A relaxed exploration of traditional textile workshops, knife-smiths, and incense houses along the Kamo River. Grand farewell 10-course banquet.',
        highlights: ['Master knife-sharpening demonstration', 'Traditional incense blending workshop', 'Farewell seasonal Kaiseki feast'],
        accommodation: 'The Celestine Gion Kyoto',
        mealsIncluded: 'Breakfast, Lunch, Dinner'
      },
      {
        day: 10,
        title: 'Kyoto Departure',
        location: 'Kansai International Airport (KIX)',
        description: 'Final breakfast overlooking the rock garden followed by express Haruka train transfer to Kansai Airport.',
        highlights: ['Morning garden contemplative stroll', 'Airport express transit pass', 'Personal calligraphy voyage certificate'],
        accommodation: 'Departure Day',
        mealsIncluded: 'Breakfast'
      }
    ],
    featured: true
  },
  {
    id: 'serengeti-great-migration',
    slug: 'serengeti-crater-great-migration-safari',
    title: 'Serengeti & Ngorongoro Great Migration Safari',
    tagline: 'Endless golden savannah, predator tracking, and intimate mobile tented camps.',
    region: 'East Africa',
    country: 'Tanzania',
    category: 'Wildlife Safari',
    durationDays: 8,
    groupSizeMax: 6,
    difficulty: 'Gentle',
    startingPrice: 7200,
    image: '/src/assets/images/tour_serengeti_safari_1792906263631.jpg',
    summary: 'Follow millions of wildebeest and apex predators across the Serengeti in custom 4x4 open-roof vehicles with senior tracking biologists.',
    description: 'An intimate, high-impact wildlife expedition operating strictly in private conservancies and mobile eco-camps that shift with the migration herds. Accompanied by Maasai conservation scouts and senior wildlife biologists, enjoy low-density off-road tracking and dawn hot-air balloon flights across the savannah.',
    highlights: [
      'Strictly limited to 6 guests per vehicle (everyone gets an unobstructed window seat)',
      'Sunrise hot-air balloon flight over the Seronera river valley with champagne breakfast',
      'Full-day private descent into the UNESCO Ngorongoro Crater volcanic caldera',
      'Night game drives tracking nocturnal predators (leopards, hyenas, and servals)'
    ],
    inclusions: [
      '7 nights in luxury semi-permanent tented camps with en-suite solar hot showers',
      'All meals and premium safari sundowner beverages included',
      'Senior Tanzanian wildlife guide & private tracker',
      'Exclusive 4x4 Land Cruiser with camera beanbags and charging stations',
      'All TANAPA conservation fees and flight charter from Arusha to Serengeti'
    ],
    exclusions: [
      'International flights to Kilimanjaro (JRO)',
      'Tanzania tourist entry visa',
      'Personal safari apparel'
    ],
    packingEssentials: [
      'Neutral-toned safari clothing (khaki, olive, beige; avoid dark blue and black)',
      'High-zoom camera body or high-grade 10x42 binoculars',
      'Wide-brimmed safari hat with chin cord',
      'Fleece or windbreaker for crisp dawn and evening open-air drives'
    ],
    departures: [
      {
        id: 'ser-2026-07-10',
        startDate: 'Jul 10, 2026',
        endDate: 'Jul 17, 2026',
        season: 'Summer',
        pricePerPerson: 7200,
        availableSpots: 2,
        totalSpots: 6,
        status: 'Few Spots Left'
      },
      {
        id: 'ser-2026-08-15',
        startDate: 'Aug 15, 2026',
        endDate: 'Aug 22, 2026',
        season: 'Summer',
        pricePerPerson: 7400,
        availableSpots: 3,
        totalSpots: 6,
        status: 'Guaranteed'
      },
      {
        id: 'ser-2026-09-18',
        startDate: 'Sep 18, 2026',
        endDate: 'Sep 25, 2026',
        season: 'Autumn',
        pricePerPerson: 7100,
        availableSpots: 4,
        totalSpots: 6,
        status: 'Guaranteed'
      }
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arusha Arrival & Coffee Estate Welcome',
        location: 'Arusha Hinterlands',
        description: 'Arrive at Kilimanjaro International Airport. Private transfer to our heritage colonial coffee estate beneath Mount Meru for an orientation dinner.',
        highlights: ['Colonial coffee farm walk', 'Safari tracker team introduction', 'Welcome sundowners on the verandah'],
        accommodation: 'Arusha Coffee Lodge',
        mealsIncluded: 'Dinner'
      },
      {
        day: 2,
        title: 'Bush Flight to Central Serengeti & Afternoon Tracking',
        location: 'Central Serengeti',
        description: 'Board our private Cessna bush charter flight straight onto the Seronera dirt airstrip. Immediate game drive tracking resident lion prides.',
        highlights: ['Aerial views of the Great Rift Valley', 'First lion pride and cheetah sightings', 'Campfire gathering beneath Southern Cross stars'],
        accommodation: 'Solstice Nomad Explorer Camp',
        mealsIncluded: 'Breakfast, Lunch, Dinner'
      },
      {
        day: 3,
        title: 'Sunrise Hot-Air Balloon & Mara River Traverse',
        location: 'Northern Serengeti',
        description: 'Rise before dawn to float silently over the acacia canopy as thousands of wildebeest and zebras move beneath. English bush breakfast in the wild.',
        highlights: ['Dawn hot-air balloon flight', 'Wild bush champagne breakfast', 'Tracking the migration vanguard along the riverbanks'],
        accommodation: 'Solstice Nomad Explorer Camp',
        mealsIncluded: 'Breakfast, Bush Breakfast, Dinner'
      },
      {
        day: 4,
        title: 'Mara River Crossing Watch',
        location: 'Mara River Corridor',
        description: 'Position our vehicle near known crossing points. Witness the raw natural spectacle of herds braving crocodile-inhabited waters.',
        highlights: ['Nile crocodile and hippo pods', 'Predator dynamics along riverbanks', 'Maasai botany and tracking demonstration'],
        accommodation: 'Solstice Nomad Explorer Camp',
        mealsIncluded: 'Breakfast, Picnic Lunch, Dinner'
      },
      {
        day: 5,
        title: 'Ngorongoro Conservation Area Highlands',
        location: 'Ngorongoro Crater Rim',
        description: 'Journey southward up through ancient volcanic highlands. Arrive at our timber lodge nestled directly along the crater rim forest.',
        highlights: ['Highland cloud forest drive', 'Maasai boma cultural exchange', 'Rim-side sunset viewing over the 20km caldera'],
        accommodation: 'Ngorongoro Crater Safari Lodge',
        mealsIncluded: 'Breakfast, Lunch, Dinner'
      },
      {
        day: 6,
        title: 'Crater Floor Descent & Black Rhino Tracking',
        location: 'Ngorongoro Caldera Floor',
        description: 'Descend 600 meters into the fertile caldera basin. Track critically endangered black rhinos and giant tusker elephants around Lake Magadi.',
        highlights: ['Black rhino spotting', 'Pink flamingo flocks on Lake Magadi', 'Crater floor private picnic near hippo pools'],
        accommodation: 'Ngorongoro Crater Safari Lodge',
        mealsIncluded: 'Breakfast, Crater Picnic, Dinner'
      },
      {
        day: 7,
        title: 'Lake Manyara & Baobab Forest Walk',
        location: 'Lake Manyara Basin',
        description: 'Morning guided walking safari along the edge of Lake Manyara with an armed ranger. Observe tree-climbing lions and vast baboon troops.',
        highlights: ['Guided foot safari', 'Baobab forest conservation talk', 'Final evening banquet under lantern light'],
        accommodation: 'Manyara Treehouse Suites',
        mealsIncluded: 'Breakfast, Lunch, Dinner'
      },
      {
        day: 8,
        title: 'Charter to Kilimanjaro & Homeward Departure',
        location: 'Kilimanjaro Airport',
        description: 'Scenic charter flight back to Arusha/Kilimanjaro for onward flights, with dayroom access provided before evening long-haul connections.',
        highlights: ['Scenic flight past Mount Kilimanjaro', 'Private lounge dayroom use', 'Expedition wildlife log and photos dispatch'],
        accommodation: 'Departure Day',
        mealsIncluded: 'Breakfast'
      }
    ],
    featured: true
  },
  {
    id: 'amalfi-heritage-sea',
    slug: 'amalfi-capri-private-wooden-charter',
    title: 'Amalfi Coastline & Capri Maritime Sanctuary',
    tagline: 'Terraced lemon orchards, sheer sea cliffs, and private heritage yacht navigation.',
    region: 'Southern Europe',
    country: 'Italy',
    category: 'Marine & Fjords',
    durationDays: 7,
    groupSizeMax: 8,
    difficulty: 'Gentle',
    startingPrice: 4950,
    image: '/src/assets/images/tour_amalfi_coastal_1792906263365.jpg',
    summary: 'Explore Positano, Ravello, and secluded secret coves aboard a classic 45-foot handmade wooden Fratelli Aprea Gozzo boat.',
    description: 'An ode to authentic Mediterranean maritime culture. Sidestep overcrowded tourist ferries by navigating coastal cliffs, hidden sea grottoes, and private anchorages aboard a handcrafted Italian wooden yacht. Stroll cliffside villages with local historians and dine in cliffside sea-cave restaurants accessible only by boat.',
    highlights: [
      'Daily cruising aboard private 45ft handmade mahogany wooden Italian Gozzo vessel',
      'Private after-hours entry into the gardens of Villa Cimbrone in Ravello',
      'Secluded swim stops in the Faraglioni sea arches and secluded Li Galli islands',
      'Exclusive hands-on pasta and limoncello masterclass in a multi-generational cliffside lemon grove'
    ],
    inclusions: [
      '6 nights in clifftop boutique heritage villas overlooking the sea',
      'Daily private charter vessel with skipper, deckhand, and continuous prosecco service',
      'Curated private dinners at Michelin-starred and traditional sea-cave restaurants',
      'Private vintage Alfa Romeo and Mercedes transfers along the coastal highway',
      'All harbor mooring and maritime park permits'
    ],
    exclusions: [
      'International flights to Naples (NAP) or Rome (FCO)',
      'Personal shopping in Positano & Capri',
      'Travel cancellation insurance'
    ],
    packingEssentials: [
      'Non-marking deck boat shoes or soft-soled espadrilles',
      'Linen shirts and lightweight evening resort attire',
      'Polarized sunglasses and broad-spectrum reef-safe sunscreen',
      'Light cashmere sweater or wrap for twilight coastal breezes'
    ],
    departures: [
      {
        id: 'ama-2026-05-16',
        startDate: 'May 16, 2026',
        endDate: 'May 22, 2026',
        season: 'Spring',
        pricePerPerson: 4950,
        availableSpots: 3,
        totalSpots: 8,
        status: 'Few Spots Left'
      },
      {
        id: 'ama-2026-06-20',
        startDate: 'Jun 20, 2026',
        endDate: 'Jun 26, 2026',
        season: 'Summer',
        pricePerPerson: 5400,
        availableSpots: 4,
        totalSpots: 8,
        status: 'Guaranteed'
      },
      {
        id: 'ama-2026-09-12',
        startDate: 'Sep 12, 2026',
        endDate: 'Sep 18, 2026',
        season: 'Autumn',
        pricePerPerson: 5100,
        availableSpots: 6,
        totalSpots: 8,
        status: 'Guaranteed'
      }
    ],
    itinerary: [
      {
        day: 1,
        title: 'Naples Arrival & Transfer to Clifftop Villa',
        location: 'Naples & Praiano',
        description: 'Private chauffeur collection at Naples and panoramic coastal drive along the bends of the Divine Coast to our private cliffside villa in Praiano.',
        highlights: ['Panoramic coastal arrival', 'Terrace welcome cocktails with limoncello spritz', 'Seafood crudo dinner with regional Furore wines'],
        accommodation: 'Casa Angelina Clifftop Sanctuary',
        mealsIncluded: 'Dinner'
      },
      {
        day: 2,
        title: 'Positano by Sea & Li Galli Sirenusa Archipelago',
        location: 'Positano & Li Galli',
        description: 'Board our mahogany Gozzo boat. Anchor off Positano beach before cruising out to the mythical Li Galli islands for solitary swimming and snorkeling in emerald waters.',
        highlights: ['Private boat cruise along Positano cliffs', 'Snorkeling the Li Galli sea grottoes', 'Lunch at Lo Scoglio accessible only by water'],
        accommodation: 'Casa Angelina Clifftop Sanctuary',
        mealsIncluded: 'Breakfast, Lunch, Dinner'
      },
      {
        day: 3,
        title: 'Sentiero degli Dei (Path of the Gods) High Trail',
        location: 'Agerola to Nocelle',
        description: 'An exhilarating morning hike high along the mountain ridge 600m above the sea with unobstructed panoramas of the entire Sorrentine Peninsula.',
        highlights: ['High ridge hiking with private mountain guide', 'Rest stop with fresh mountain goat cheese and figs', 'Descent into scenic Nocelle'],
        accommodation: 'Casa Angelina Clifftop Sanctuary',
        mealsIncluded: 'Breakfast, Trail Lunch, Dinner'
      },
      {
        day: 4,
        title: 'Capri & The Faraglioni Stacks',
        location: 'Isle of Capri',
        description: 'Cruise across the Bay of Naples to Capri. Circle the island, navigating directly through the monumental archway of the Faraglioni limestone stacks.',
        highlights: ['Cruising through Faraglioni rock arch', 'Swimming in the Green and White Grottoes', 'Quiet afternoon walk in Anacapri villa gardens'],
        accommodation: 'Capri Palace Jumeirah',
        mealsIncluded: 'Breakfast, Lunch, Dinner'
      },
      {
        day: 5,
        title: 'Ravello Cliff Gardens & Classical Concert',
        location: 'Ravello',
        description: 'Head into the clouds above Amalfi to the historic town of Ravello. Stroll the gardens of Villa Rufolo and Villa Cimbrone’s Infinity Terrace.',
        highlights: ['Terrace of Infinity marble bust vistas', 'Private historic garden tour', 'Evening chamber music concert perched over the cliff'],
        accommodation: 'Palazzo Avino Historical Estate',
        mealsIncluded: 'Breakfast, Lunch, Dinner'
      },
      {
        day: 6,
        title: 'Historic Amalfi & Secret Lemon Orchard Kitchen',
        location: 'Valle dei Mulini & Amalfi',
        description: 'Visit the 9th-century maritime Republic of Amalfi and the dramatic cathedral. Ascend into terraced lemon groves for a hands-on culinary masterclass.',
        highlights: ['Duomo di Sant’Andrea private viewing', 'Centuries-old paper mill museum visit', 'Farewell pasta & sfogliatella gala dinner on the terrace'],
        accommodation: 'Palazzo Avino Historical Estate',
        mealsIncluded: 'Breakfast, Lunch, Dinner'
      },
      {
        day: 7,
        title: 'Naples Airport Departure',
        location: 'Naples Capodichino Airport',
        description: 'Final breakfast on the terrace overlooking the azure waters before private transfer back to Naples for onward flights.',
        highlights: ['Morning coastal coffee farewell', 'Private airport chauffeur service', 'Bespoke bottle of estate-bottled reserve limoncello gift'],
        accommodation: 'Departure Day',
        mealsIncluded: 'Breakfast'
      }
    ],
    featured: false
  }
];

export const EXPEDITION_LEADERS: ExpeditionLeader[] = [
  {
    id: 'elena-rostova',
    name: 'Dr. Elena Rostova',
    role: 'Chief Alpine & Glaciology Director',
    specialty: 'High-Altitude Geomorphology & Polar Ice',
    yearsExperience: 16,
    bio: 'PhD from Cambridge and veteran of 34 polar and Andean expeditions. Elena leads our Patagonia and Nordic fjord field traverses with an infectious passion for geological storytelling.',
    avatarText: 'ER'
  },
  {
    id: 'samuel-ochieng',
    name: 'Samuel Ochieng',
    role: 'Senior African Wildlife Biologist',
    specialty: 'Apex Carnivore Ecology & Migration Dynamics',
    yearsExperience: 19,
    bio: 'Born on the Mara plateau, Samuel has spent two decades tracking lion prides and black rhinos. He advises international conservation boards and is a master of non-invasive field tracking.',
    avatarText: 'SO'
  },
  {
    id: 'kai-tanaka',
    name: 'Kai Tanaka',
    role: 'Cultural Anthropologist & Trail Historian',
    specialty: 'Edo-Period Post Highways & Shinto Sacred Sites',
    yearsExperience: 14,
    bio: 'Raised in Nagano, Kai translates classical pilgrimage poetry and maintains deep ties with traditional woodworking artisans and mountain Buddhist monasteries across the Kiso Valley.',
    avatarText: 'KT'
  },
  {
    id: 'matteo-bellini',
    name: 'Capt. Matteo Bellini',
    role: 'Master Maritime Navigator',
    specialty: 'Traditional Wooden Hull Craft & Mediterranean Coastal Navigation',
    yearsExperience: 22,
    bio: 'Third-generation Sorrentine sailor who restored classical wooden Gozzo boats. Matteo knows every hidden sea cave, prevailing wind current, and secluded cove along the Tyrrhenian coast.',
    avatarText: 'MB'
  }
];

export const ALUMNI_REVIEWS: AlumniReview[] = [
  {
    id: 'rev-1',
    travelerName: 'Marcus & Claire Vance',
    travelerCity: 'Vancouver, Canada',
    expeditionTitle: 'Southern Patagonian Icefield Traverse',
    travelDate: 'December 2025',
    rating: 5,
    quote: 'Standing at the base of Torres del Paine at sunrise with Dr. Rostova was transcendent. The logistics were flawless, the eco-domes were delightfully warm, and there was never a moment where we felt like tourists — we felt like true expedition companions.',
    outcome: 'Completed 68 miles of backcountry terrain with zero delays and pristine safety.'
  },
  {
    id: 'rev-2',
    travelerName: 'Dr. Julian Thorne',
    travelerCity: 'Oxford, United Kingdom',
    expeditionTitle: 'Norwegian Fjords & Arctic Sound',
    travelDate: 'July 2025',
    rating: 5,
    quote: 'The small vessel advantage cannot be overstated. While 4,000-passenger mega-liners were stuck in commercial channels, our expedition ship anchored in silent coves where we kayaked directly under hanging glacial waterfalls.',
    outcome: 'Encountered 4 separate orca pods and paddled 28 nautical miles of UNESCO fjords.'
  },
  {
    id: 'rev-3',
    travelerName: 'Sarah Lin & David Chen',
    travelerCity: 'San Francisco, USA',
    expeditionTitle: 'Japanese Alps & Ancient Forest Trails',
    travelDate: 'November 2025',
    rating: 5,
    quote: 'Walking the mossy cobblestone steps of the Nakasendo trail between Magome and Tsumago in peak autumn foliage was a lifelong dream. The private ryokan onsen soaks and multi-course kaiseki meals were extraordinary.',
    outcome: 'Walked the historic feudal highway across 5 ancient post towns with private luggage transfers.'
  }
];
