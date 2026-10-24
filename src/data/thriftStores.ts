export interface ReviewItem {
  id: string;
  author: string;
  school?: string;
  rating: number;
  date: string;
  comment: string;
  helpfulCount: number;
  tags: string[];
}

export interface ThriftStoreItem {
  id: string;
  name: string;
  address: string;
  city: string;
  zip: string;
  lat: number;
  lng: number;
  phone: string;
  hours: { [day: string]: string };
  priceTier: '$' | '$$' | '$$$' | '$$$$';
  priceRangeFormatted: string;
  priceNotes: string;
  fittingRoomsCount: number;
  fittingRoomsNote: string;
  hasFormalwear: boolean;
  formalwearNotes: string;
  // Specific requirements from Mags's PDF:
  womensClothingAmount: string;
  mensClothingAmount: string;
  bonusInfo?: string;
  nearbySchoolIds?: string[];
  categories: string[];
  sustainableMaterials: string[];
  overallSummary: string;
  isOpenNow: boolean;
  openNowText: string;
  reviews: ReviewItem[];
  isPublished?: boolean;
}

export const INITIAL_THRIFT_STORES: ThriftStoreItem[] = [
  {
    id: 'st-vincent-de-paul',
    name: 'St. Vincent de Paul',
    address: '1249 Penman Rd',
    city: 'Jacksonville Beach',
    zip: '32250',
    lat: 30.2978,
    lng: -81.4056,
    phone: '(904) 246-5240',
    hours: {
      monday: '10:00 AM – 4:00 PM',
      tuesday: '10:00 AM – 4:00 PM',
      wednesday: '10:00 AM – 4:00 PM',
      thursday: '10:00 AM – 4:00 PM',
      friday: '10:00 AM – 4:00 PM',
      saturday: '10:00 AM – 4:00 PM',
      sunday: 'Closed'
    },
    priceTier: '$',
    priceRangeFormatted: '$5 – $20 ($)',
    priceNotes: 'In the 5-20 dollar range ($). Full suits for $25 and jackets and pants for about $10.',
    fittingRoomsCount: 1,
    fittingRoomsNote: '1 verified open fitting room.',
    hasFormalwear: true,
    formalwearNotes: 'Moderate semi formal and limited formal for women; Moderate semi formal and formal for men (full suits $25, jackets $10).',
    womensClothingAmount: 'Moderate semi formal and limited formal for women',
    mensClothingAmount: 'Moderate semi formal and formal for men (full suits $25, jackets and pants ~$10)',
    bonusInfo: 'Beachside staple heavily supported by Fletcher students; proceeds fund local emergency family assistance.',
    nearbySchoolIds: ['fletcher', 'sandalwood'],
    categories: ['Semi-Formal', 'Suits & Blazers', 'Casual Beachwear', 'Denim', 'Footwear'],
    sustainableMaterials: ['100% Cotton', 'Wool', 'Silk Blends'],
    overallSummary: 'Verified in Mags’s PDF audit: 1 fitting room, $ range ($5-20), moderate semi-formal for women and men with full suits for $25.',
    isOpenNow: true,
    openNowText: 'Open Today · 10:00 AM – 4:00 PM',
    isPublished: true,
    reviews: [
      {
        id: 'rev-svdp-1',
        author: 'Elena R.',
        school: 'Duncan U. Fletcher High School',
        rating: 5,
        date: '2 days ago',
        comment: 'Found my entire Homecoming dress here for $18! Real silk tag. Saved over $150 compared to St Johns Town Center.',
        helpfulCount: 24,
        tags: ['Homecoming Ready', 'Fitting Room Verified', 'Under $20']
      }
    ]
  },
  {
    id: 'goldyn-hour-style',
    name: 'Goldyn Hour Style',
    address: '1602 3rd St N',
    city: 'Jacksonville Beach',
    zip: '32250',
    lat: 30.3012,
    lng: -81.3938,
    phone: '(904) 372-4211',
    hours: {
      monday: '10:00 AM – 6:00 PM',
      tuesday: '10:00 AM – 6:00 PM',
      wednesday: '10:00 AM – 6:00 PM',
      thursday: '10:00 AM – 6:00 PM',
      friday: '10:00 AM – 6:00 PM',
      saturday: '10:00 AM – 5:00 PM',
      sunday: 'Closed'
    },
    priceTier: '$$$$',
    priceRangeFormatted: '$$$$ (Very Expensive)',
    priceNotes: '$$$$ high-end luxury consignment. Premium labels with personalized shopping attention.',
    fittingRoomsCount: 1,
    fittingRoomsNote: '1 luxury fitting room with full three-way mirror.',
    hasFormalwear: true,
    formalwearNotes: 'Moderate amounts of women’s formal and semi formal designer pieces.',
    womensClothingAmount: 'Moderate amounts of women’s formal and semi formal; high-end brands',
    mensClothingAmount: 'No men’s wear',
    bonusInfo: 'High end small consignment shop with personalized attention in Jacksonville Beach.',
    nearbySchoolIds: ['fletcher'],
    categories: ['High-End Designer', 'Women’s Formal', 'Semi-Formal Dresses', 'Handbags', 'Accessories'],
    sustainableMaterials: ['Mulberry Silk', 'Cashmere', 'Fine Wool', 'Italian Leather'],
    overallSummary: 'High-end small consignment boutique near Fletcher High School featuring curated women’s designer collections and formalwear.',
    isOpenNow: true,
    openNowText: 'Open Today · 10:00 AM – 6:00 PM',
    isPublished: true,
    reviews: [
      {
        id: 'rev-gh-1',
        author: 'Chloe M.',
        school: 'Duncan U. Fletcher High School',
        rating: 5,
        date: '5 days ago',
        comment: 'Very high end boutique with gorgeous dresses. No men’s section but the women’s formal racks are immaculate.',
        helpfulCount: 18,
        tags: ['Designer Labels', 'Personalized Attention']
      }
    ]
  },
  {
    id: 'bougie-basket',
    name: 'Bougie Basket',
    address: '1024 Edgewood Ave S',
    city: 'Jacksonville',
    zip: '32205',
    lat: 30.3065,
    lng: -81.7161,
    phone: '(904) 551-7890',
    hours: {
      monday: '11:00 AM – 6:00 PM',
      tuesday: '11:00 AM – 6:00 PM',
      wednesday: '11:00 AM – 6:00 PM',
      thursday: '11:00 AM – 6:00 PM',
      friday: '11:00 AM – 6:00 PM',
      saturday: '11:00 AM – 6:00 PM',
      sunday: '11:00 AM – 6:00 PM'
    },
    priceTier: '$$$',
    priceRangeFormatted: '$30 – $200s ($$$)',
    priceNotes: 'Large price range $30–$200s, but is $$$ at worst.',
    fittingRoomsCount: 1,
    fittingRoomsNote: '1 private fitting room.',
    hasFormalwear: true,
    formalwearNotes: 'Separate area for women’s formal with moderate to high amount of options.',
    womensClothingAmount: 'Moderate to high in women’s formal and semi formal amounts; dedicated formal room',
    mensClothingAmount: 'Only men’s casual; no men’s formal or semi-formal',
    bonusInfo: 'Very cool and unique items as well as some very friendly staff.',
    nearbySchoolIds: ['riverside', 'paxon', 'ed-white', 'stanton', 'westside'],
    categories: ['Unique Vintage', 'Women’s Formal Room', 'Men’s Casual', 'Statement Pieces', 'Accessories'],
    sustainableMaterials: ['Linen', '100% Cotton', 'Vintage Denim', 'Rayon'],
    overallSummary: 'Murray Hill gem serving Riverside, Paxon, Ed White, and Stanton students. Features a dedicated women’s formal showroom.',
    isOpenNow: true,
    openNowText: 'Open Today · 11:00 AM – 6:00 PM',
    isPublished: true,
    reviews: [
      {
        id: 'rev-bb-1',
        author: 'Maya S.',
        school: 'Riverside High School',
        rating: 5,
        date: '1 week ago',
        comment: 'Staff is so friendly! The separate women’s formal room had so many cool prom and homecoming options. Menswear is casual only.',
        helpfulCount: 21,
        tags: ['Friendly Staff', 'Formal Room', 'Unique Finds']
      }
    ]
  },
  {
    id: 'five-points-vintage',
    name: '5 Points Vintage',
    address: '1046 Park St',
    city: 'Jacksonville',
    zip: '32204',
    lat: 30.3155,
    lng: -81.6805,
    phone: '(904) 353-4080',
    hours: {
      monday: '10:00 AM – 6:00 PM',
      tuesday: '10:00 AM – 6:00 PM',
      wednesday: '10:00 AM – 6:00 PM',
      thursday: '10:00 AM – 6:00 PM',
      friday: '10:00 AM – 7:00 PM',
      saturday: '10:00 AM – 7:00 PM',
      sunday: '10:00 AM – 6:00 PM'
    },
    priceTier: '$$',
    priceRangeFormatted: '$20 – $70 ($$ mostly)',
    priceNotes: '$20–$70 mostly ($$). Antique and curated vintage merchant booths.',
    fittingRoomsCount: 0,
    fittingRoomsNote: 'No fitting rooms. Measure clothing before buying or ask booth vendors.',
    hasFormalwear: true,
    formalwearNotes: 'Limited formal, moderate semi formal options. Unique vintage jewelry.',
    womensClothingAmount: 'Limited women’s formal, moderate semi formal',
    mensClothingAmount: 'Limited to no men’s formal or semi-formal',
    bonusInfo: 'Can be a bit tough to park super close to anything in five points, and there are a good amount of fun and unique jewelry options.',
    nearbySchoolIds: ['ed-white', 'riverside', 'paxon', 'stanton', 'andrew-jackson'],
    categories: ['Vintage Jewelry', '70s & 80s Apparel', 'Retro Tees', 'Accessories', 'Collectibles'],
    sustainableMaterials: ['Sterling Silver', 'Vintage Leather', 'Cotton', 'Denim'],
    overallSummary: 'Iconic 5 Points hotspot. Limited fitting rooms and parking, but unbeatable vintage jewelry and curated clothing stalls.',
    isOpenNow: true,
    openNowText: 'Open Today · 10:00 AM – 6:00 PM',
    isPublished: true,
    reviews: [
      {
        id: 'rev-5pv-1',
        author: 'Liam C.',
        school: 'Stanton College Preparatory School',
        rating: 4,
        date: '4 days ago',
        comment: 'Super cool vintage vibe in 5 Points! Parking took a minute to find. No fitting room so know your measurements.',
        helpfulCount: 16,
        tags: ['Unique Jewelry', '5 Points Vibe', 'No Fitting Rooms']
      }
    ]
  },
  {
    id: 'fifis-san-marco',
    name: "Fifi's Fine Resale Apparel of San Marco",
    address: '1068 Hendricks Ave',
    city: 'Jacksonville',
    zip: '32207',
    lat: 30.3152,
    lng: -81.6558,
    phone: '(904) 399-5678',
    hours: {
      monday: '10:00 AM – 6:00 PM',
      tuesday: '10:00 AM – 6:00 PM',
      wednesday: '10:00 AM – 6:00 PM',
      thursday: '10:00 AM – 6:00 PM',
      friday: '10:00 AM – 6:00 PM',
      saturday: '10:00 AM – 5:00 PM',
      sunday: 'Closed'
    },
    priceTier: '$$$',
    priceRangeFormatted: '$30 – $600 ($$$)',
    priceNotes: 'Varied prices: $30–$600 ($$$). Formal wear ranges from $$ to $$$. Items often have original tags.',
    fittingRoomsCount: 1,
    fittingRoomsNote: '1 fitting room plus a customer bathroom.',
    hasFormalwear: true,
    formalwearNotes: 'Lots of options for formal and semi formal for men and women. Separate formal wear sections organized by size.',
    womensClothingAmount: 'Lots of options for formal and semi formal for women; separate sections for regular and designer',
    mensClothingAmount: 'Mens stuff too; lots of formal and semi formal for men',
    bonusInfo: 'There are whole sections separating regular and designer (for those with specific price needs) and whole separate sections for formal wear. Very easy to navigate with things organized by size as well.',
    nearbySchoolIds: ['stanton', 'andrew-jackson', 'riverside', 'douglas-anderson', 'palm-avenue'],
    categories: ['Formal Wear', 'Designer Racks', 'Men’s Suits', 'Evening Gowns', 'Branded Shoes'],
    sustainableMaterials: ['Silk', 'Wool', 'Cashmere', 'Fine Rayon'],
    overallSummary: 'San Marco’s premier resale store: meticulously organized by size with separate designer & formal sections for both men and women.',
    isOpenNow: true,
    openNowText: 'Open Today · 10:00 AM – 6:00 PM',
    isPublished: true,
    reviews: [
      {
        id: 'rev-fifi-1',
        author: 'Brianna M.',
        school: 'Stanton College Preparatory School',
        rating: 5,
        date: '3 days ago',
        comment: 'So organized! The formal wear section is sorted by size and has tags attached. Got a designer gown for half price.',
        helpfulCount: 28,
        tags: ['Organized by Size', 'Formal & Men’s Racks', 'Tags Attached']
      }
    ]
  },
  {
    id: 'spectrum-thrift',
    name: 'Spectrum Thrift Store',
    address: '616 FL-13',
    city: 'Fruit Cove',
    zip: '32259',
    lat: 30.1264,
    lng: -81.6372,
    phone: '(904) 287-2100',
    hours: {
      monday: '10:00 AM – 6:00 PM',
      tuesday: '10:00 AM – 6:00 PM',
      wednesday: '10:00 AM – 6:00 PM',
      thursday: '10:00 AM – 6:00 PM',
      friday: '10:00 AM – 6:00 PM',
      saturday: '10:00 AM – 6:00 PM',
      sunday: '12:00 PM – 5:00 PM'
    },
    priceTier: '$$',
    priceRangeFormatted: '$10 – $80 ($$)',
    priceNotes: '10-80 dollars ($$). Affordable student pricing with clean, well-maintained clothing rows.',
    fittingRoomsCount: 1,
    fittingRoomsNote: 'Bathroom that doubles as a fitting room.',
    hasFormalwear: true,
    formalwearNotes: 'Good amount of men’s semi formal, limited formal. Limited but still a few options for women’s formal and semi formal.',
    womensClothingAmount: 'Limited but still a few options for women’s formal and semi formal',
    mensClothingAmount: 'Good amount of men’s semi formal, limited formal',
    bonusInfo: 'Community thrift shop directly serving the Mandarin and Fruit Cove corridor.',
    nearbySchoolIds: ['mandarin'],
    categories: ['Men’s Semi-Formal', 'Women’s Casual', 'School Basics', 'Jackets', 'Shoes'],
    sustainableMaterials: ['100% Cotton', 'Denim', 'Flannel'],
    overallSummary: 'Serving Mandarin High School students with solid men’s semi-formal options and a bathroom that doubles as a dressing room.',
    isOpenNow: true,
    openNowText: 'Open Today · 10:00 AM – 6:00 PM',
    isPublished: true,
    reviews: [
      {
        id: 'rev-spec-1',
        author: 'Marcus P.',
        school: 'Mandarin High School',
        rating: 4,
        date: '6 days ago',
        comment: 'Great spot for Mandarin students. Good selection of men’s collared shirts and blazers for school events.',
        helpfulCount: 12,
        tags: ['Men’s Semi-Formal', 'Mandarin Route']
      }
    ]
  },
  {
    id: 'betty-griffin-thrift',
    name: 'Betty Griffin Center Thrift Shoppe',
    address: '445 FL-13',
    city: 'Fruit Cove',
    zip: '32259',
    lat: 30.1332,
    lng: -81.6365,
    phone: '(904) 230-0899',
    hours: {
      monday: '9:00 AM – 6:00 PM',
      tuesday: '9:00 AM – 6:00 PM',
      wednesday: '9:00 AM – 6:00 PM',
      thursday: '9:00 AM – 6:00 PM',
      friday: '9:00 AM – 6:00 PM',
      saturday: '9:00 AM – 6:00 PM',
      sunday: 'Closed'
    },
    priceTier: '$',
    priceRangeFormatted: '$4 – $50 ($)',
    priceNotes: '4-50 dollar range so $. Great affordable options supporting local domestic violence relief.',
    fittingRoomsCount: 0,
    fittingRoomsNote: 'No fitting rooms.',
    hasFormalwear: true,
    formalwearNotes: 'Moderate formal and semi formal for men and women.',
    womensClothingAmount: 'Moderate amount of formal and semi formal for women',
    mensClothingAmount: 'Moderate amount of formal and semi formal for men',
    bonusInfo: 'Can find good options for $ range. 100% of store profits support victims of domestic and sexual abuse.',
    nearbySchoolIds: ['mandarin'],
    categories: ['Moderate Formal', 'Semi-Formal', 'Casual Basics', 'Accessories', 'Shoes'],
    sustainableMaterials: ['Cotton', 'Wool Blends', 'Denim'],
    overallSummary: 'High-value thrift shop near Mandarin with moderate formal & semi-formal clothing for both men and women at $ budget prices.',
    isOpenNow: true,
    openNowText: 'Open Today · 9:00 AM – 6:00 PM',
    isPublished: true,
    reviews: [
      {
        id: 'rev-bg-1',
        author: 'Hannah K.',
        school: 'Mandarin High School',
        rating: 5,
        date: '1 week ago',
        comment: 'Everything was super reasonably priced under $10! Good formal dresses and suits even though there are no fitting rooms.',
        helpfulCount: 15,
        tags: ['Budget Friendly', 'Mission Support', 'Great Prices']
      }
    ]
  },
  {
    id: 'city-thrift',
    name: 'City Thrift',
    address: '728 Edgewood Ave W',
    city: 'Jacksonville',
    zip: '32208',
    lat: 30.3804,
    lng: -81.6961,
    phone: '(904) 764-7776',
    hours: {
      monday: '9:00 AM – 8:00 PM',
      tuesday: '9:00 AM – 8:00 PM',
      wednesday: '9:00 AM – 8:00 PM',
      thursday: '9:00 AM – 8:00 PM',
      friday: '9:00 AM – 8:00 PM',
      saturday: '9:00 AM – 8:00 PM',
      sunday: '10:00 AM – 6:00 PM'
    },
    priceTier: '$$',
    priceRangeFormatted: '$4 – $14 average ($$)',
    priceNotes: 'Enormous inventory with 50% discount tags rotating every Monday and Thursday. Color tag bargains.',
    fittingRoomsCount: 4,
    fittingRoomsNote: '4 stalls open in back right corner.',
    hasFormalwear: true,
    formalwearNotes: 'Extensive tuxedo, blazer, and formal dress aisles.',
    womensClothingAmount: 'Enormous selection of women’s casual, denim, hoodies, and rotating formal dresses',
    mensClothingAmount: 'Massive selection of men’s streetwear, graphic tees, jackets, suits, and blazers',
    bonusInfo: 'Listed in PDF for Ribault, Raines, Paxon, and Westside. Best spot in North Jax for vintage streetwear.',
    nearbySchoolIds: ['jean-ribault', 'william-raines', 'paxon', 'westside'],
    categories: ['Streetwear', 'Athletic Fleece', 'Denim', 'Formalwear', 'Footwear', 'Outerwear'],
    sustainableMaterials: ['Heavy Cotton', 'Corduroy', 'Denim', 'Fleece'],
    overallSummary: 'Massive warehouse-style thrifting with over 10,000 hanging garments. Nearest high-volume store for Raines, Ribault, and Paxon.',
    isOpenNow: true,
    openNowText: 'Open Today · 9:00 AM – 8:00 PM',
    isPublished: true,
    reviews: [
      {
        id: 'rev-ct-1',
        author: 'Jordan D.',
        school: 'William M. Raines High School',
        rating: 5,
        date: '5 days ago',
        comment: 'The streetwear aisles are unbeatable. Found vintage Starter jackets and carhartt pants. Give yourself at least an hour to browse.',
        helpfulCount: 19,
        tags: ['Streetwear Heaven', 'Huge Inventory', 'North Jax Pick']
      }
    ]
  },
  {
    id: 'luxxe-bazaar',
    name: 'Luxxe Bazaar Thrift',
    address: '1010 N Davis St',
    city: 'Jacksonville',
    zip: '32209',
    lat: 30.3412,
    lng: -81.6708,
    phone: '(904) 438-9921',
    hours: {
      monday: 'Closed',
      tuesday: '11:00 AM – 7:00 PM',
      wednesday: '11:00 AM – 7:00 PM',
      thursday: '11:00 AM – 7:00 PM',
      friday: '11:00 AM – 7:00 PM',
      saturday: '11:00 AM – 7:00 PM',
      sunday: 'Closed'
    },
    priceTier: '$$',
    priceRangeFormatted: '$8 – $35 ($$)',
    priceNotes: 'Curated streetwear and vintage Y2K racks. Under 10 minutes from Andrew Jackson and Stanton.',
    fittingRoomsCount: 2,
    fittingRoomsNote: '2 fitting rooms with full-length mirrors.',
    hasFormalwear: true,
    formalwearNotes: 'Curated semi-formal streetwear, stylish dresses, and retro jackets.',
    womensClothingAmount: 'Curated Y2K tops, slip dresses, streetwear hoodies, and skirts',
    mensClothingAmount: 'Vintage sports tees, jackets, throwback jerseys, and casual pants',
    bonusInfo: 'Listed in PDF as only one under 10 min from Andrew Jackson High School; also serves Stanton and Raines.',
    nearbySchoolIds: ['andrew-jackson', 'stanton', 'william-raines', 'jean-ribault', 'darnell-cookman'],
    categories: ['Y2K Vintage', 'Graphic Tees', 'Retro Jackets', 'Streetwear', 'Sneakers'],
    sustainableMaterials: ['Cotton', 'Nylon', 'Denim'],
    overallSummary: 'Urban vintage boutique directly serving downtown and northside Duval schools including Andrew Jackson and Stanton.',
    isOpenNow: true,
    openNowText: 'Open Today · 11:00 AM – 7:00 PM',
    isPublished: true,
    reviews: [
      {
        id: 'rev-lb-1',
        author: 'Darius W.',
        school: 'Andrew Jackson High School',
        rating: 5,
        date: '1 week ago',
        comment: 'Literally under 10 mins from Jackson! Best throwback graphic tees and jackets in the neighborhood.',
        helpfulCount: 17,
        tags: ['Close to Jackson', 'Y2K Streetwear']
      }
    ]
  },
  {
    id: 'vintage-exchange',
    name: 'Vintage Exchange',
    address: '1012 Margaret St',
    city: 'Jacksonville',
    zip: '32204',
    lat: 30.3168,
    lng: -81.6812,
    phone: '(904) 384-0091',
    hours: {
      monday: 'Closed',
      tuesday: 'Closed',
      wednesday: '11:00 AM – 6:00 PM',
      thursday: '11:00 AM – 6:00 PM',
      friday: '11:00 AM – 6:00 PM',
      saturday: '11:00 AM – 6:00 PM',
      sunday: '12:00 PM – 5:00 PM'
    },
    priceTier: '$$',
    priceRangeFormatted: '$15 – $65 ($$)',
    priceNotes: 'Authentic 70s, 80s, and 90s curated vintage. About 9 min from Stanton and Riverside.',
    fittingRoomsCount: 2,
    fittingRoomsNote: '2 spacious fitting stalls.',
    hasFormalwear: true,
    formalwearNotes: 'Authentic vintage prom and formal dresses, tuxedo jackets, and silk ties.',
    womensClothingAmount: 'Authentic 70s-90s vintage dresses, blouses, denim jackets, and skirts',
    mensClothingAmount: 'Retro workwear, vintage flannels, band tees, and blazers',
    bonusInfo: 'Listed in PDF for Riverside, Stanton, Paxon, Ed White, and Westside. 9 min from Stanton.',
    nearbySchoolIds: ['riverside', 'stanton', 'paxon', 'ed-white', 'westside'],
    categories: ['Authentic Vintage', 'Band Tees', 'Retro Denim', 'Formalwear', 'Leather Jackets'],
    sustainableMaterials: ['100% Wool', 'Silk', 'Heavy Cotton', 'Leather'],
    overallSummary: 'Historic Riverside vintage boutique featuring hand-picked garments from the 1970s to 2000s.',
    isOpenNow: true,
    openNowText: 'Open Today · 11:00 AM – 6:00 PM',
    isPublished: true,
    reviews: [
      {
        id: 'rev-ve-1',
        author: 'Sadie L.',
        school: 'Riverside High School',
        rating: 5,
        date: '3 days ago',
        comment: 'Found the most incredible 80s velvet blazer for school presentations. 2 dressing rooms open and nice staff.',
        helpfulCount: 14,
        tags: ['Vintage Gold', 'Fitting Rooms Open']
      }
    ]
  },
  {
    id: 'murray-hill-thrift',
    name: 'Murray Hill Thrift and Gift',
    address: '939 Edgewood Ave S',
    city: 'Jacksonville',
    zip: '32205',
    lat: 30.3079,
    lng: -81.7169,
    phone: '(904) 388-7800',
    hours: {
      monday: 'Closed',
      tuesday: '10:00 AM – 5:00 PM',
      wednesday: '10:00 AM – 5:00 PM',
      thursday: '10:00 AM – 5:00 PM',
      friday: '10:00 AM – 5:00 PM',
      saturday: '10:00 AM – 5:00 PM',
      sunday: 'Closed'
    },
    priceTier: '$',
    priceRangeFormatted: '$3 – $15 ($)',
    priceNotes: 'Neighborhood charity thrift shop with ultra-affordable $3-$10 clothing tags.',
    fittingRoomsCount: 1,
    fittingRoomsNote: '1 verified changing stall.',
    hasFormalwear: false,
    formalwearNotes: 'Casual school clothes, vintage sweaters, and light jackets.',
    womensClothingAmount: 'Cozy sweaters, casual tops, skirts, and dresses',
    mensClothingAmount: 'Flannels, denim jeans, work shirts, and jackets',
    bonusInfo: 'Highlighted in PDF for Riverside and Westside high schools. Great neighborhood vibe.',
    nearbySchoolIds: ['riverside', 'westside', 'ed-white'],
    categories: ['Casual Sweaters', 'Flannels', 'Denim', 'Local Gifts', 'Books'],
    sustainableMaterials: ['Cotton', 'Wool Blends', 'Denim'],
    overallSummary: 'Charming neighborhood charity store on Edgewood Ave S. Minutes from Riverside and Westside campuses.',
    isOpenNow: true,
    openNowText: 'Open Today · 10:00 AM – 5:00 PM',
    isPublished: true,
    reviews: [
      {
        id: 'rev-mht-1',
        author: 'Cameron T.',
        school: 'Riverside High School',
        rating: 5,
        date: '1 week ago',
        comment: 'So close to Riverside High! Super chill vibe, cheap flannels, and 1 dressing room to try stuff on.',
        helpfulCount: 11,
        tags: ['Near Campus', 'Affordable Sweaters']
      }
    ]
  },
  {
    id: 'final-lap-thrift',
    name: 'Final Lap Thrift',
    address: '1125 Edgewood Ave S',
    city: 'Jacksonville',
    zip: '32205',
    lat: 30.3051,
    lng: -81.7158,
    phone: '(904) 389-1110',
    hours: {
      monday: '10:00 AM – 6:00 PM',
      tuesday: '10:00 AM – 6:00 PM',
      wednesday: '10:00 AM – 6:00 PM',
      thursday: '10:00 AM – 6:00 PM',
      friday: '10:00 AM – 6:00 PM',
      saturday: '10:00 AM – 6:00 PM',
      sunday: 'Closed'
    },
    priceTier: '$',
    priceRangeFormatted: '$2 – $12 ($)',
    priceNotes: 'Ultra budget friendly $2-$12 prices. Note in PDF: "NOT CANADA".',
    fittingRoomsCount: 1,
    fittingRoomsNote: '1 dressing room.',
    hasFormalwear: false,
    formalwearNotes: 'Everyday student streetwear, basic pants, and hoodies.',
    womensClothingAmount: 'Everyday budget tees, athletic leggings, sweaters, and denim',
    mensClothingAmount: 'Casual tees, shorts, workwear, and jackets',
    bonusInfo: 'PDF explicitly highlights Final Lap Thrift ("NOT CANADA") for Andrew Jackson, Riverside, and Westside.',
    nearbySchoolIds: ['andrew-jackson', 'riverside', 'westside'],
    categories: ['Everyday Basics', 'Graphic Tees', 'Hoodies', 'Workwear', 'Bargain Bins'],
    sustainableMaterials: ['Cotton', 'Fleece', 'Denim'],
    overallSummary: 'High-turnover discount thrift on Edgewood Ave S noted specifically in Mags’s PDF audit.',
    isOpenNow: true,
    openNowText: 'Open Today · 10:00 AM – 6:00 PM',
    isPublished: true,
    reviews: [
      {
        id: 'rev-flt-1',
        author: 'Marcus J.',
        school: 'Westside High School',
        rating: 5,
        date: '2 weeks ago',
        comment: 'Great budget store. Got 3 oversized hoodies for $15 total.',
        helpfulCount: 8,
        tags: ['Budget Racks', 'Hoodies']
      }
    ]
  },
  {
    id: 'platos-closet-philips',
    name: "Plato's Closet - Philips Highway",
    address: '11035 Philips Hwy',
    city: 'Jacksonville',
    zip: '32256',
    lat: 30.1798,
    lng: -81.5621,
    phone: '(904) 260-0080',
    hours: {
      monday: '10:00 AM – 9:00 PM',
      tuesday: '10:00 AM – 9:00 PM',
      wednesday: '10:00 AM – 9:00 PM',
      thursday: '10:00 AM – 9:00 PM',
      friday: '10:00 AM – 9:00 PM',
      saturday: '10:00 AM – 9:00 PM',
      sunday: '12:00 PM – 6:00 PM'
    },
    priceTier: '$$$',
    priceRangeFormatted: '$8 – $28 ($$$)',
    priceNotes: 'Teen and young adult curated consignment. Highlighted in PDF for Mandarin and Atlantic Coast.',
    fittingRoomsCount: 4,
    fittingRoomsNote: '4 full private dressing stalls with three-way mirrors.',
    hasFormalwear: true,
    formalwearNotes: 'Contemporary prom, homecoming, and graduation dresses (Lulus, Windsor, Free People).',
    womensClothingAmount: 'High volume trendy teen clothing, Lululemon, American Eagle, dresses, and activewear',
    mensClothingAmount: 'Nike, streetwear hoodies, athletic shorts, cargo pants, and sneakers',
    bonusInfo: 'PDF explicitly identifies the Philips Hwy location (11035) for Mandarin and Atlantic Coast students.',
    nearbySchoolIds: ['mandarin', 'atlantic-coast'],
    categories: ['Trendy Streetwear', 'Activewear', 'Crop Tops', 'Designer Denim', 'Sneakers'],
    sustainableMaterials: ['Cotton', 'Denim', 'Athletic Lycra'],
    overallSummary: 'High-energy resale store geared directly at high schoolers looking for current season brands at 70% off retail.',
    isOpenNow: true,
    openNowText: 'Open Today · 10:00 AM – 9:00 PM',
    isPublished: true,
    reviews: [
      {
        id: 'rev-pc-1',
        author: 'Samantha T.',
        school: 'Atlantic Coast High School',
        rating: 5,
        date: '3 days ago',
        comment: 'Sold old hoodies for cash, then bought Levi 501s and an Aritzia top. 4 dressing rooms with great lighting.',
        helpfulCount: 20,
        tags: ['Buy Sell Trade', 'Current Trends', 'Dressing Rooms Open']
      }
    ]
  },
  {
    id: 'hubbard-house-thrift',
    name: 'Hubbard House Thrift Store',
    address: '6629 Beach Blvd',
    city: 'Jacksonville',
    zip: '32216',
    lat: 30.2991,
    lng: -81.5956,
    phone: '(904) 400-6333',
    hours: {
      monday: '10:00 AM – 6:00 PM',
      tuesday: '10:00 AM – 6:00 PM',
      wednesday: '10:00 AM – 6:00 PM',
      thursday: '10:00 AM – 6:00 PM',
      friday: '10:00 AM – 6:00 PM',
      saturday: '10:00 AM – 5:00 PM',
      sunday: 'Closed'
    },
    priceTier: '$$',
    priceRangeFormatted: '$4 – $16 ($$)',
    priceNotes: 'Organized boutique environment. 100% of proceeds fund emergency domestic violence shelter services in Duval.',
    fittingRoomsCount: 2,
    fittingRoomsNote: '2 spacious fitting rooms with full mirrors.',
    hasFormalwear: true,
    formalwearNotes: 'Seasonal prom and cocktail dress racks in spring and fall.',
    womensClothingAmount: 'Boutique designer donations, formal dresses, blouses, and handbags',
    mensClothingAmount: 'Dress shirts, slacks, blazers, and clean sweaters',
    bonusInfo: 'Listed in PDF for Sandalwood High School on Beach Blvd.',
    nearbySchoolIds: ['sandalwood', 'englewood', 'wolfson'],
    categories: ['Boutique Vintage', 'Formal Dresses', 'Workwear', 'Shoes', 'Handbags'],
    sustainableMaterials: ['Silk', 'Wool', '100% Cotton', 'Leather'],
    overallSummary: 'Mission-driven boutique on Beach Blvd known for higher-end designer donations in pristine condition.',
    isOpenNow: true,
    openNowText: 'Open Today · 10:00 AM – 6:00 PM',
    isPublished: true,
    reviews: [
      {
        id: 'rev-hh-1',
        author: 'Chloe L.',
        school: 'Sandalwood High School',
        rating: 5,
        date: '1 week ago',
        comment: 'Love supporting Hubbard House! Found a vintage wool pea coat and a Zara sweater for under $20 total.',
        helpfulCount: 11,
        tags: ['Mission Driven', 'High Quality']
      }
    ]
  },
  {
    id: 'salvation-army-beach',
    name: 'The Salvation Army Thrift Store & Donation Center',
    address: '10940 Beach Blvd',
    city: 'Jacksonville',
    zip: '32246',
    lat: 30.2889,
    lng: -81.5162,
    phone: '(904) 641-2122',
    hours: {
      monday: '9:00 AM – 6:00 PM',
      tuesday: '9:00 AM – 6:00 PM',
      wednesday: '9:00 AM – 6:00 PM',
      thursday: '9:00 AM – 6:00 PM',
      friday: '9:00 AM – 6:00 PM',
      saturday: '9:00 AM – 6:00 PM',
      sunday: 'Closed'
    },
    priceTier: '$',
    priceRangeFormatted: '$2 – $8 ($)',
    priceNotes: 'Wednesday is 50% off all clothing. Fantastic $1 and $2 bargain racks.',
    fittingRoomsCount: 2,
    fittingRoomsNote: '2 open fitting stalls.',
    hasFormalwear: true,
    formalwearNotes: 'Affordable suits and dresses starting at $8.',
    womensClothingAmount: 'Massive racks of women’s casual, denim, dresses, and coats',
    mensClothingAmount: 'Suit jackets, work shirts, jeans, and coats',
    bonusInfo: 'Listed in PDF for Atlantic Coast and Sandalwood high schools. Wednesday 50% off day is legendary.',
    nearbySchoolIds: ['atlantic-coast', 'sandalwood'],
    categories: ['Bargain Clothing', 'Suits', 'Outerwear', 'Denim', 'Shoes'],
    sustainableMaterials: ['Cotton', 'Denim', 'Wool'],
    overallSummary: 'High-volume community family store near Southside and Beach Blvd. Best 50% Wednesday clothing discount in Duval.',
    isOpenNow: true,
    openNowText: 'Open Today · 9:00 AM – 6:00 PM',
    isPublished: true,
    reviews: [
      {
        id: 'rev-sa-1',
        author: 'Andre V.',
        school: 'Sandalwood High School',
        rating: 5,
        date: '2 weeks ago',
        comment: 'Wednesday 50% off day is legendary. Walked out with 3 pairs of jeans and 2 sweaters for $11.50.',
        helpfulCount: 25,
        tags: ['Half Price Wednesday', 'Huge Savings']
      }
    ]
  },
  {
    id: 'bargains-and-blessings',
    name: 'Bargains and Blessings',
    address: '215 US-90',
    city: 'Baldwin',
    zip: '32234',
    lat: 30.3047,
    lng: -81.9775,
    phone: '(904) 266-4100',
    hours: {
      monday: 'Closed',
      tuesday: '9:30 AM – 4:30 PM',
      wednesday: '9:30 AM – 4:30 PM',
      thursday: '9:30 AM – 4:30 PM',
      friday: '9:30 AM – 4:30 PM',
      saturday: '9:30 AM – 4:30 PM',
      sunday: 'Closed'
    },
    priceTier: '$',
    priceRangeFormatted: '$2 – $10 ($)',
    priceNotes: 'Ultra affordable community store. In the PDF: "literally across the street" from Baldwin school!',
    fittingRoomsCount: 1,
    fittingRoomsNote: '1 dressing stall.',
    hasFormalwear: false,
    formalwearNotes: 'Everyday school clothes and affordable casual options.',
    womensClothingAmount: 'Community donations, casual tops, skirts, and dresses',
    mensClothingAmount: 'Work pants, casual shirts, jackets, and tees',
    bonusInfo: 'Directly from Mags’s PDF: "literally across the street" from Baldwin Middle-High School!',
    nearbySchoolIds: ['baldwin'],
    categories: ['Community Bargains', 'Casual Clothing', 'Workwear', 'Shoes', 'Books'],
    sustainableMaterials: ['Cotton', 'Denim', 'Polyester Blends'],
    overallSummary: 'Baldwin staple situated directly across the street from Baldwin Middle-High School with super friendly volunteer staff.',
    isOpenNow: true,
    openNowText: 'Open Today · 9:30 AM – 4:30 PM',
    isPublished: true,
    reviews: [
      {
        id: 'rev-bb-bal-1',
        author: 'Cody N.',
        school: 'Baldwin Middle-High School',
        rating: 5,
        date: '4 days ago',
        comment: 'Literally walked across the street after school! Spent $8 on two flannels and a jacket.',
        helpfulCount: 19,
        tags: ['Across From School', 'Baldwin Staple']
      }
    ]
  },
  {
    id: 'andys-attic',
    name: "Andy's Attic Thrift Store",
    address: '12216 New Berlin Rd',
    city: 'Jacksonville',
    zip: '32226',
    lat: 30.4355,
    lng: -81.5658,
    phone: '(904) 757-0104',
    hours: {
      monday: 'Closed',
      tuesday: 'Closed',
      wednesday: '10:00 AM – 4:00 PM',
      thursday: '10:00 AM – 4:00 PM',
      friday: '10:00 AM – 4:00 PM',
      saturday: '10:00 AM – 4:00 PM',
      sunday: 'Closed'
    },
    priceTier: '$',
    priceRangeFormatted: '$3 – $12 ($)',
    priceNotes: 'North Jacksonville hidden gem with $3-$12 prices.',
    fittingRoomsCount: 1,
    fittingRoomsNote: '1 dressing room.',
    hasFormalwear: true,
    formalwearNotes: 'Good selection of donated dresses and semi-formal wear.',
    womensClothingAmount: 'Hidden gem bargains, casual & semi-formal dresses, and blouses',
    mensClothingAmount: 'T-shirts, outerwear, jackets, and denim',
    bonusInfo: 'Listed at the top of the PDF for First Coast High School (32218).',
    nearbySchoolIds: ['first-coast'],
    categories: ['North Jax Finds', 'Casual Tops', 'Dresses', 'Outerwear', 'Books'],
    sustainableMaterials: ['Cotton', 'Wool Blends', 'Denim'],
    overallSummary: 'First Coast high schoolers’ local favorite in North Duval, featuring verified dressing rooms and low prices.',
    isOpenNow: true,
    openNowText: 'Open Today · 10:00 AM – 4:00 PM',
    isPublished: true,
    reviews: [
      {
        id: 'rev-andy-1',
        author: 'Travis B.',
        school: 'First Coast High School',
        rating: 5,
        date: '1 week ago',
        comment: 'Closest thrift to First Coast High. Great deals on jackets and shirts.',
        helpfulCount: 13,
        tags: ['First Coast Pick', 'North Jax Deals']
      }
    ]
  },
  {
    id: 'beam-thrift',
    name: 'BEAM Thrift',
    address: '318 7th Ave N',
    city: 'Jacksonville Beach',
    zip: '32250',
    lat: 30.2921,
    lng: -81.3934,
    phone: '(904) 241-7597',
    hours: {
      monday: '10:00 AM – 5:00 PM',
      tuesday: '10:00 AM – 5:00 PM',
      wednesday: '10:00 AM – 5:00 PM',
      thursday: '10:00 AM – 5:00 PM',
      friday: '10:00 AM – 5:00 PM',
      saturday: '10:00 AM – 5:00 PM',
      sunday: 'Closed'
    },
    priceTier: '$$',
    priceRangeFormatted: '$5 – $18 ($$)',
    priceNotes: 'Curated coastal brands and high-grade natural fabrics. Proceeds feed beach families in crisis. Closes 5 pm.',
    fittingRoomsCount: 2,
    fittingRoomsNote: '2 clean changing rooms near the rear checkout.',
    hasFormalwear: false,
    formalwearNotes: 'Casual coastal, surf brands, and everyday school staples.',
    womensClothingAmount: 'Coastal vintage, sun dresses, beachwear, and denim shorts',
    mensClothingAmount: 'Surf brand tees, hoodies, boardshorts, and linen button-downs',
    bonusInfo: 'Explicitly noted in PDF for Fletcher: "BEAM thrift (closes 5 pm)".',
    nearbySchoolIds: ['fletcher'],
    categories: ['Coastal Vintage', 'Swim & Surf', 'Linen', 'Denim Shorts', 'Sweatshirts'],
    sustainableMaterials: ['100% Linen', 'Organic Cotton', 'Bamboo'],
    overallSummary: 'Beaches Emergency Assistance Ministry (BEAM) thrift boutique. High ratio of name-brand surf and coastal apparel.',
    isOpenNow: true,
    openNowText: 'Open Today · Closes 5:00 PM',
    isPublished: true,
    reviews: [
      {
        id: 'rev-beam-1',
        author: 'Kai W.',
        school: 'Duncan U. Fletcher High School',
        rating: 5,
        date: '4 days ago',
        comment: 'Fletcher students are here all the time. Patagonia, Billabong, and Roxy racks for under $10. Staff is super sweet.',
        helpfulCount: 17,
        tags: ['Beaches Staple', 'Surf Brands']
      }
    ]
  },
  {
    id: 'hopes-closet-beaches',
    name: "Hope's Closet - Jacksonville Beach",
    address: '14286 Beach Blvd Ste 44',
    city: 'Jacksonville Beach',
    zip: '32250',
    lat: 30.2872,
    lng: -81.4328,
    phone: '(904) 438-5673',
    hours: {
      monday: '10:00 AM – 6:00 PM',
      tuesday: '10:00 AM – 6:00 PM',
      wednesday: '10:00 AM – 6:00 PM',
      thursday: '10:00 AM – 6:00 PM',
      friday: '10:00 AM – 6:00 PM',
      saturday: '10:00 AM – 6:00 PM',
      sunday: 'Closed'
    },
    priceTier: '$$',
    priceRangeFormatted: '$5 – $18 ($$)',
    priceNotes: 'Curated boutique thrift on Beach Blvd. All sales support Church of Eleven22 outreach ministries.',
    fittingRoomsCount: 2,
    fittingRoomsNote: '2 clean, private dressing rooms.',
    hasFormalwear: true,
    formalwearNotes: 'Seasonal prom and homecoming dress racks alongside business-casual clothing.',
    womensClothingAmount: 'Coastal styles, designer dresses, blouses, and denim',
    mensClothingAmount: 'Polos, button-downs, casual shorts, and jackets',
    bonusInfo: 'Listed in PDF for Fletcher: "Hopes Closet 14286 Beach Blvd Ste 44".',
    nearbySchoolIds: ['fletcher', 'sandalwood'],
    categories: ['Boutique Apparel', 'Prom Dresses', 'Men’s Polos', 'Footwear', 'Home Décor'],
    sustainableMaterials: ['Cotton', 'Linen', 'Denim'],
    overallSummary: 'High-end thrift boutique on Beach Blvd serving coastal Duval County students with pristine quality inventory.',
    isOpenNow: true,
    openNowText: 'Open Today · 10:00 AM – 6:00 PM',
    isPublished: true,
    reviews: [
      {
        id: 'rev-hc-1',
        author: 'Brooke A.',
        school: 'Duncan U. Fletcher High School',
        rating: 5,
        date: '5 days ago',
        comment: 'Super clean and organized. Found a brand-new dress with original tags for $12.',
        helpfulCount: 15,
        tags: ['Clean Racks', 'Tags Attached']
      }
    ]
  },
  {
    id: 'goodwill-new-berlin',
    name: 'Goodwill - New Berlin',
    address: '11101 McCormick Rd',
    city: 'Jacksonville',
    zip: '32225',
    lat: 30.3541,
    lng: -81.5124,
    phone: '(904) 646-4444',
    hours: {
      monday: '9:00 AM – 8:00 PM',
      tuesday: '9:00 AM – 8:00 PM',
      wednesday: '9:00 AM – 8:00 PM',
      thursday: '9:00 AM – 8:00 PM',
      friday: '9:00 AM – 8:00 PM',
      saturday: '9:00 AM – 8:00 PM',
      sunday: '10:00 AM – 6:00 PM'
    },
    priceTier: '$$',
    priceRangeFormatted: '$4 – $14 ($$)',
    priceNotes: 'Color tag discounts rotating weekly with huge inventory.',
    fittingRoomsCount: 0,
    fittingRoomsNote: 'Fitting stalls closed; exchange policy applies.',
    hasFormalwear: false,
    formalwearNotes: 'Everyday school clothing, sweaters, and light jackets.',
    womensClothingAmount: 'Everyday essentials, jeans, graphic tees, and jackets',
    mensClothingAmount: 'Tees, button-downs, hoodies, and athletic shorts',
    bonusInfo: 'Listed in PDF for First Coast High School under 32218.',
    nearbySchoolIds: ['first-coast', 'terry-parker'],
    categories: ['School Staples', 'Denim', 'Hoodies', 'Graphic Tees'],
    sustainableMaterials: ['Cotton', 'Fleece', 'Denim'],
    overallSummary: 'Convenient eastside store identified in Mags’s PDF audit for First Coast and Terry Parker high schools.',
    isOpenNow: true,
    openNowText: 'Open Today · 9:00 AM – 8:00 PM',
    isPublished: true,
    reviews: []
  }
];
