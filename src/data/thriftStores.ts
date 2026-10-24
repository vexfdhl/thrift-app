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
    id: 'hope-deals',
    name: 'Hope Deals Thrift Store',
    address: '3835 Emerson St',
    city: 'Jacksonville',
    zip: '32207',
    lat: 30.2917,
    lng: -81.6321,
    phone: '(904) 399-4673',
    hours: {
      monday: '9:00 AM – 5:00 PM',
      tuesday: '9:00 AM – 5:00 PM',
      wednesday: '9:00 AM – 5:00 PM',
      thursday: '9:00 AM – 5:00 PM',
      friday: '9:00 AM – 5:00 PM',
      saturday: '9:00 AM – 4:00 PM',
      sunday: 'Closed'
    },
    priceTier: '$',
    priceRangeFormatted: '$2 – $8 average',
    priceNotes: 'Color tag discounts rotate weekly (up to 50% off marked clothing). Student-friendly $2 rack.',
    fittingRoomsCount: 2,
    fittingRoomsNote: '2 verified open fitting rooms with mirrors.',
    hasFormalwear: true,
    formalwearNotes: 'Great selection of donated homecoming dresses ($12–$25) and blazers.',
    categories: ['Vintage Denim', 'Graphic Tees', 'Formalwear', 'Jackets', 'Shoes', 'Accessories'],
    sustainableMaterials: ['100% Cotton', 'Linen', 'Wool Blends', 'Denim'],
    overallSummary: 'Non-profit thrift store supporting City Rescue Mission programs. Clean racks with heavy turnover.',
    isOpenNow: true,
    openNowText: 'Open Today · Closes 5:00 PM',
    isPublished: true,
    reviews: [
      {
        id: 'rev-hd-1',
        author: 'Maya S.',
        school: 'Douglas Anderson School of the Arts',
        rating: 5,
        date: '3 days ago',
        comment: 'Scored an authentic 90s oversized Levi denim jacket for only $6 on green tag day! The dressing rooms were super clean.',
        helpfulCount: 14,
        tags: ['Denim Finds', 'Open Fitting Rooms', 'Student Budget']
      },
      {
        id: 'rev-hd-2',
        author: 'Tyler K.',
        school: 'Englewood High School',
        rating: 4,
        date: '1 week ago',
        comment: 'Great T-shirt racks. Staff gave me an extra student nod. Try going Wednesday morning for fresh restocks.',
        helpfulCount: 8,
        tags: ['Weekly Restock', 'Streetwear']
      }
    ]
  },
  {
    id: 'st-vincent-de-paul',
    name: 'St. Vincent de Paul Thrift Store',
    address: '3512 San Jose Blvd',
    city: 'Jacksonville',
    zip: '32207',
    lat: 30.2974,
    lng: -81.6496,
    phone: '(904) 396-7473',
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
    priceRangeFormatted: '$3 – $10 average',
    priceNotes: 'Flat clothing rates. Friday $1 flash sales on select garment racks.',
    fittingRoomsCount: 3,
    fittingRoomsNote: '3 individual fitting stalls open during regular operating hours.',
    hasFormalwear: true,
    formalwearNotes: 'Dedicated formalwear section with men suits and prom dresses under $20.',
    categories: ['Suits & Formal', 'Dresses', 'Sweaters', 'Casual Wear', 'Shoes', 'Books'],
    sustainableMaterials: ['100% Cotton', 'Silk', 'Wool', 'Cashmere'],
    overallSummary: 'San Jose neighborhood favorite with proceeds directly funding emergency rent and utility relief for Duval families.',
    isOpenNow: true,
    openNowText: 'Open Today · Closes 4:00 PM',
    isPublished: true,
    reviews: [
      {
        id: 'rev-svdp-1',
        author: 'Elena R.',
        school: 'Bishop Kenny High School',
        rating: 5,
        date: '2 weeks ago',
        comment: 'Found my entire Homecoming dress here for $18. Tailored fit and real silk tag. Saved over $150 compared to St Johns Town Center!',
        helpfulCount: 22,
        tags: ['Homecoming Ready', 'High Quality', 'Fitting Rooms']
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
    priceRangeFormatted: '$4 – $14 average',
    priceNotes: 'Enormous inventory with 50% discount tags changing every Monday and Thursday.',
    fittingRoomsCount: 4,
    fittingRoomsNote: '4 stalls open in back right corner. Quick attendant checks.',
    hasFormalwear: true,
    formalwearNotes: 'Extensive tuxedo, blazer, and formal dress aisles.',
    categories: ['Streetwear', 'Athletic Fleece', 'Denim', 'Formalwear', 'Footwear', 'Outerwear'],
    sustainableMaterials: ['Heavy Cotton', 'Corduroy', 'Denim', 'Fleece'],
    overallSummary: 'Massive warehouse-style thrifting with over 10,000 hanging garments. Best spot in North Jax for vintage streetwear.',
    isOpenNow: true,
    openNowText: 'Open Today · Closes 8:00 PM',
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
        tags: ['Streetwear Heaven', 'Huge Inventory']
      }
    ]
  },
  {
    id: 'the-thrift-store',
    name: 'The Thrift Store',
    address: '3851 Emerson St',
    city: 'Jacksonville',
    zip: '32207',
    lat: 30.2915,
    lng: -81.6318,
    phone: '(904) 398-6000',
    hours: {
      monday: '9:00 AM – 8:00 PM',
      tuesday: '9:00 AM – 8:00 PM',
      wednesday: '9:00 AM – 8:00 PM',
      thursday: '9:00 AM – 8:00 PM',
      friday: '9:00 AM – 8:00 PM',
      saturday: '9:00 AM – 8:00 PM',
      sunday: '11:00 AM – 5:00 PM'
    },
    priceTier: '$',
    priceRangeFormatted: '$3 – $9 average',
    priceNotes: 'Daily color tag specials: 30%, 50%, and 75% off. Students love the weekly 99¢ color tag days.',
    fittingRoomsCount: 3,
    fittingRoomsNote: '3 fitting rooms open all day.',
    hasFormalwear: true,
    formalwearNotes: 'Prom and semi-formal dresses available on dedicated rotating racks.',
    categories: ['Y2K Racks', 'Denim', 'Dresses', 'Graphic Tees', 'Jackets'],
    sustainableMaterials: ['100% Cotton', 'Denim', 'Rayon'],
    overallSummary: 'Known simply as The Thrift Store on Emerson, this high-volume store restocks hundreds of garments daily.',
    isOpenNow: true,
    openNowText: 'Open Today · Closes 8:00 PM',
    isPublished: true,
    reviews: [
      {
        id: 'rev-tts-1',
        author: 'Brianna M.',
        school: 'Stanton College Preparatory',
        rating: 5,
        date: '1 week ago',
        comment: 'The Emerson thrifting strip is top tier. Walked between Hope Deals and this one in 2 minutes. Got 4 tees and a pleated skirt for $16!',
        helpfulCount: 12,
        tags: ['Walkable Strip', '99 Cent Specials']
      }
    ]
  },
  {
    id: 'beam-thrift-7th',
    name: 'BEAM Thrift 7th Avenue',
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
    priceRangeFormatted: '$5 – $18 average',
    priceNotes: 'Curated coastal brands and high-grade natural fabrics. Proceeds feed beach families in crisis.',
    fittingRoomsCount: 2,
    fittingRoomsNote: '2 clean changing rooms near the rear checkout.',
    hasFormalwear: false,
    formalwearNotes: 'Casual coastal, surf brands, and everyday school staples.',
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
    id: 'beam-thrift-shetter',
    name: 'BEAM Shetter Avenue Thrift',
    address: '850 6th Ave S',
    city: 'Jacksonville Beach',
    zip: '32250',
    lat: 30.2818,
    lng: -81.3962,
    phone: '(904) 241-7597',
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
    priceRangeFormatted: '$2 – $8 average',
    priceNotes: 'Bargain warehouse sister location to the 7th Ave boutique. Huge clearance bins.',
    fittingRoomsCount: 1,
    fittingRoomsNote: '1 single-occupancy fitting room available upon request.',
    hasFormalwear: false,
    formalwearNotes: 'Everyday casual wear and beach shorts.',
    categories: ['Clearance', 'Casual Tees', 'Denim', 'Hoodies'],
    sustainableMaterials: ['Cotton', 'Canvas'],
    overallSummary: 'High-volume clearance arm of BEAM. Outstanding pricing for students shopping on an allowance.',
    isOpenNow: true,
    openNowText: 'Open Today · Closes 4:00 PM',
    isPublished: true,
    reviews: []
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
    priceRangeFormatted: '$4 – $16 average',
    priceNotes: 'Organized boutique environment. 100% of proceeds fund emergency domestic violence shelter services in Duval.',
    fittingRoomsCount: 2,
    fittingRoomsNote: '2 spacious fitting rooms with full mirrors.',
    hasFormalwear: true,
    formalwearNotes: 'Seasonal prom and cocktail dress racks in spring.',
    categories: ['Boutique Vintage', 'Formal Dresses', 'Workwear', 'Shoes', 'Handbags'],
    sustainableMaterials: ['Silk', 'Wool', '100% Cotton', 'Leather'],
    overallSummary: 'Mission-driven boutique on Beach Blvd known for higher-end designer donations in pristine condition.',
    isOpenNow: true,
    openNowText: 'Open Today · Closes 6:00 PM',
    isPublished: true,
    reviews: [
      {
        id: 'rev-hh-1',
        author: 'Chloe L.',
        school: 'Atlantic Coast High School',
        rating: 5,
        date: '1 week ago',
        comment: 'Love supporting Hubbard House! Found a vintage wool pea coat and a Zara sweater for under $20 total.',
        helpfulCount: 11,
        tags: ['Mission Driven', 'High Quality']
      }
    ]
  },
  {
    id: 'goodwill-beach-blvd',
    name: 'Goodwill Industries - Beach Blvd',
    address: '11160 Beach Blvd',
    city: 'Jacksonville',
    zip: '32246',
    lat: 30.2882,
    lng: -81.5098,
    phone: '(904) 641-5511',
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
    priceRangeFormatted: '$4 – $12 average',
    priceNotes: 'Color tag discounts (25% and 50% off). Student discount days on Sundays.',
    fittingRoomsCount: 0,
    fittingRoomsNote: 'Fitting rooms currently closed at this location. 7-day clothing exchange policy.',
    hasFormalwear: true,
    formalwearNotes: 'Suit jackets and formal dresses available on endcap racks.',
    categories: ['Athletic Wear', 'Graphic Tees', 'Denim', 'Hoodies', 'Shoes'],
    sustainableMaterials: ['Cotton', 'Polyester Blends', 'Denim'],
    overallSummary: 'High-traffic retail store near Sandalwood and UNF corridor with large rotating men and women selections.',
    isOpenNow: true,
    openNowText: 'Open Today · Closes 8:00 PM',
    isPublished: true,
    reviews: []
  },
  {
    id: 'goodwill-san-jose',
    name: 'Goodwill Industries - San Jose Blvd',
    address: '10601 San Jose Blvd',
    city: 'Jacksonville',
    zip: '32257',
    lat: 30.1983,
    lng: -81.6289,
    phone: '(904) 268-2088',
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
    priceRangeFormatted: '$4 – $15 average',
    priceNotes: 'Higher percentage of Mandarin and San Jose residential donations. Excellent brand-name section.',
    fittingRoomsCount: 2,
    fittingRoomsNote: '2 dressing rooms open.',
    hasFormalwear: true,
    formalwearNotes: 'Homecoming and prom dresses rotated frequently.',
    categories: ['Name Brands', 'Preppy & Casual', 'Denim', 'Dresses', 'Jackets'],
    sustainableMaterials: ['100% Cotton', 'Linen', 'Merino Wool'],
    overallSummary: 'Consistently one of the cleanest and best-organized Goodwill locations in South Duval County.',
    isOpenNow: true,
    openNowText: 'Open Today · Closes 8:00 PM',
    isPublished: true,
    reviews: [
      {
        id: 'rev-gw-sj-1',
        author: 'Marcus P.',
        school: 'Mandarin High School',
        rating: 4,
        date: '6 days ago',
        comment: 'Only 7 minutes from Mandarin High. Great spot to hit after school. Scored Lulu shorts and an Oxford shirt.',
        helpfulCount: 9,
        tags: ['Close to School', 'Brand Names']
      }
    ]
  },
  {
    id: 'goodwill-mandarin',
    name: 'Goodwill Industries - Old St Augustine',
    address: '11111 San Jose Blvd',
    city: 'Jacksonville',
    zip: '32223',
    lat: 30.1872,
    lng: -81.6315,
    phone: '(904) 268-5544',
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
    priceRangeFormatted: '$4 – $14 average',
    priceNotes: 'Color tag discounts updated weekly.',
    fittingRoomsCount: 0,
    fittingRoomsNote: 'Dressing stalls closed; 7-day clothing exchange with tags attached.',
    hasFormalwear: false,
    formalwearNotes: 'Mostly everyday student clothing and jackets.',
    categories: ['Sweaters', 'Jeans', 'T-Shirts', 'Outerwear'],
    sustainableMaterials: ['Cotton', 'Flannel', 'Denim'],
    overallSummary: 'Quiet shopping center store with low crowd levels and fast checkout.',
    isOpenNow: true,
    openNowText: 'Open Today · Closes 8:00 PM',
    isPublished: true,
    reviews: []
  },
  {
    id: 'teen-challenge-super-thrift',
    name: 'Teen Challenge Super Thrift Store',
    address: '3333 University Blvd W',
    city: 'Jacksonville',
    zip: '32217',
    lat: 30.2647,
    lng: -81.6189,
    phone: '(904) 739-1667',
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
    priceRangeFormatted: '$2 – $8 average',
    priceNotes: 'Unbeatable bargain pricing. Large weekly discount rotation.',
    fittingRoomsCount: 2,
    fittingRoomsNote: '2 working dressing rooms open for students.',
    hasFormalwear: true,
    formalwearNotes: 'Suits, formal blazers, and long dresses under $15.',
    categories: ['Vintage', 'Suits', 'Denim', 'Flannels', 'Footwear'],
    sustainableMaterials: ['100% Cotton', 'Wool', 'Leather'],
    overallSummary: 'Spacious University Blvd location supporting youth addiction recovery and life skills training in Jacksonville.',
    isOpenNow: true,
    openNowText: 'Open Today · Closes 6:00 PM',
    isPublished: true,
    reviews: [
      {
        id: 'rev-tc-1',
        author: 'Derrick B.',
        school: 'Samuel Wolfson School for Advanced Studies',
        rating: 5,
        date: '2 weeks ago',
        comment: 'Wolfson students need to know about this place! 5 minutes from campus, verified open dressing rooms, and super cheap.',
        helpfulCount: 15,
        tags: ['Wolfson Route', 'Fitting Rooms Open']
      }
    ]
  },
  {
    id: 'platos-closet-southside',
    name: "Plato's Closet - Southside",
    address: '9802 Baymeadows Rd',
    city: 'Jacksonville',
    zip: '32256',
    lat: 30.2215,
    lng: -81.5542,
    phone: '(904) 642-1200',
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
    priceRangeFormatted: '$8 – $28 average',
    priceNotes: 'Teen and young adult curated consignment. Cash paid on the spot for gently-used student styles.',
    fittingRoomsCount: 4,
    fittingRoomsNote: '4 full private dressing stalls with three-way mirrors.',
    hasFormalwear: true,
    formalwearNotes: 'Contemporary prom, homecoming, and graduation dresses (Lulus, Windsor, Free People).',
    categories: ['Trendy Streetwear', 'Activewear', 'Crop Tops', 'Designer Denim', 'Sneakers'],
    sustainableMaterials: ['Cotton', 'Denim', 'Athletic Lycra'],
    overallSummary: 'High-energy resale store geared directly at high school and college shoppers looking for current season trends.',
    isOpenNow: true,
    openNowText: 'Open Today · Closes 9:00 PM',
    isPublished: true,
    reviews: [
      {
        id: 'rev-pc-1',
        author: 'Samantha T.',
        school: 'Atlantic Coast High School',
        rating: 5,
        date: '3 days ago',
        comment: 'Sold 5 old high school hoodies for $42 cash, then immediately bought a pair of pristine Levi 501s and an Aritzia top. Best cycle!',
        helpfulCount: 20,
        tags: ['Buy Sell Trade', 'Current Trends']
      }
    ]
  },
  {
    id: 'platos-closet-mandarin',
    name: "Plato's Closet - Mandarin",
    address: '10123 San Jose Blvd',
    city: 'Jacksonville',
    zip: '32257',
    lat: 30.2078,
    lng: -81.6274,
    phone: '(904) 268-5525',
    hours: {
      monday: '10:00 AM – 8:00 PM',
      tuesday: '10:00 AM – 8:00 PM',
      wednesday: '10:00 AM – 8:00 PM',
      thursday: '10:00 AM – 8:00 PM',
      friday: '10:00 AM – 8:00 PM',
      saturday: '10:00 AM – 8:00 PM',
      sunday: '12:00 PM – 6:00 PM'
    },
    priceTier: '$$$',
    priceRangeFormatted: '$8 – $25 average',
    priceNotes: 'Curated teen resale. 70% off retail mall prices for Nike, Lululemon, PacSun, and American Eagle.',
    fittingRoomsCount: 3,
    fittingRoomsNote: '3 dressing rooms open with staff assistance.',
    hasFormalwear: true,
    formalwearNotes: 'Seasonal formal dresses during fall Homecoming and spring Prom seasons.',
    categories: ['Trendy Styles', 'Sneakers', 'Hoodies', 'Designer Bags'],
    sustainableMaterials: ['Cotton', 'Fleece', 'Denim'],
    overallSummary: 'Mandarin outpost of the popular teen consignment chain. Super fast intake for trading in outgrown clothes.',
    isOpenNow: true,
    openNowText: 'Open Today · Closes 8:00 PM',
    isPublished: true,
    reviews: []
  },
  {
    id: 'community-hospice-thrift',
    name: 'Community Hospice Thrift Shop',
    address: '11173 Beach Blvd',
    city: 'Jacksonville',
    zip: '32246',
    lat: 30.2878,
    lng: -81.5092,
    phone: '(904) 998-1200',
    hours: {
      monday: '10:00 AM – 5:00 PM',
      tuesday: '10:00 AM – 5:00 PM',
      wednesday: '10:00 AM – 5:00 PM',
      thursday: '10:00 AM – 5:00 PM',
      friday: '10:00 AM – 5:00 PM',
      saturday: '10:00 AM – 5:00 PM',
      sunday: 'Closed'
    },
    priceTier: '$',
    priceRangeFormatted: '$3 – $10 average',
    priceNotes: 'Color tag discounts. Vintage glassware and accessories alongside retro clothing.',
    fittingRoomsCount: 2,
    fittingRoomsNote: '2 dressing rooms with clothing hooks and full mirrors.',
    hasFormalwear: true,
    formalwearNotes: 'Vintage formal wear, vintage blazers, and jewelry.',
    categories: ['Vintage Apparel', 'Retro Accessories', 'Blazers', 'Jackets'],
    sustainableMaterials: ['100% Wool', 'Silk', 'Cotton'],
    overallSummary: 'Charming Beach Blvd thrift shop where 100% of sales support uninsured patient care through Community Hospice of Northeast Florida.',
    isOpenNow: true,
    openNowText: 'Open Today · Closes 5:00 PM',
    isPublished: true,
    reviews: []
  },
  {
    id: 'salvation-army-beach',
    name: 'The Salvation Army Family Store',
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
    priceRangeFormatted: '$2 – $8 average',
    priceNotes: 'Wednesday is 50% off all clothing. Fantastic $1 and $2 bargain racks.',
    fittingRoomsCount: 2,
    fittingRoomsNote: '2 open fitting stalls.',
    hasFormalwear: true,
    formalwearNotes: 'Affordable suits and dresses starting at $8.',
    categories: ['Bargain Clothing', 'Suits', 'Outerwear', 'Denim', 'Shoes'],
    sustainableMaterials: ['Cotton', 'Denim', 'Wool'],
    overallSummary: 'High-volume community family store near Southside and Beach Blvd. Best 50% Wednesday clothing discount in Duval.',
    isOpenNow: true,
    openNowText: 'Open Today · Closes 6:00 PM',
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
  }
];
