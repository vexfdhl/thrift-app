export interface SchoolItem {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  mascot?: string;
  colors?: string;
  notes?: string;
}

// Complete list of 24 Duval County schools directly matching Mags's PDF (Pages 2 & 3)
export const DUVAL_SCHOOLS: SchoolItem[] = [
  {
    id: 'philip-randolph',
    name: 'A. Philip Randolph Career Academies',
    address: '1157 Golfair Blvd, Jacksonville, FL 32209',
    lat: 30.3688,
    lng: -81.6738,
    mascot: 'Marauders'
  },
  {
    id: 'andrew-jackson',
    name: 'Andrew Jackson High School',
    address: '3816 N Main St, Jacksonville, FL 32206',
    lat: 30.3662,
    lng: -81.6542,
    mascot: 'Tigers'
  },
  {
    id: 'atlantic-coast',
    name: 'Atlantic Coast High School',
    address: '9735 R G Skinner Pkwy, Jacksonville, FL 32256',
    lat: 30.2238,
    lng: -81.5205,
    mascot: 'Stingrays'
  },
  {
    id: 'baldwin',
    name: 'Baldwin Middle-High School',
    address: '291 Mill St W, Baldwin, FL 32234',
    lat: 30.3045,
    lng: -81.9782,
    mascot: 'Indians'
  },
  {
    id: 'darnell-cookman',
    name: 'Darnell-Cookman School of the Medical Arts',
    address: '1701 N Davis St, Jacksonville, FL 32209',
    lat: 30.3481,
    lng: -81.6705,
    mascot: 'Vikings'
  },
  {
    id: 'douglas-anderson',
    name: 'Douglas Anderson School of the Arts',
    address: '2445 San Diego Rd, Jacksonville, FL 32207',
    lat: 30.3019,
    lng: -81.6444,
    mascot: 'Penguins'
  },
  {
    id: 'fletcher',
    name: 'Duncan U. Fletcher High School',
    address: '700 Seagate Ave, Neptune Beach, FL 32266',
    lat: 30.3168,
    lng: -81.4052,
    mascot: 'Senators'
  },
  {
    id: 'ed-white',
    name: 'Edward H. White High School',
    address: '1700 Old Middleburg Rd N, Jacksonville, FL 32210',
    lat: 30.2982,
    lng: -81.7694,
    mascot: 'Commanders'
  },
  {
    id: 'englewood',
    name: 'Englewood High School',
    address: '4412 Barnes Rd, Jacksonville, FL 32207',
    lat: 30.2748,
    lng: -81.6192,
    mascot: 'Rams'
  },
  {
    id: 'first-coast',
    name: 'First Coast High School',
    address: '590 Ovation Dr, Jacksonville, FL 32218',
    lat: 30.4578,
    lng: -81.6375,
    mascot: 'Buccaneers'
  },
  {
    id: 'frank-peterson',
    name: 'Frank H. Peterson Academies',
    address: '7450 Wilson Blvd, Jacksonville, FL 32210',
    lat: 30.2685,
    lng: -81.7779,
    mascot: 'Eagles'
  },
  {
    id: 'jean-ribault',
    name: 'Jean Ribault High School',
    address: '3701 Winton Dr, Jacksonville, FL 32208',
    lat: 30.3846,
    lng: -81.7143,
    mascot: 'Trojans'
  },
  {
    id: 'mandarin',
    name: 'Mandarin High School',
    address: '4831 Greenland Rd, Jacksonville, FL 32258',
    lat: 30.1557,
    lng: -81.5839,
    mascot: 'Mustangs'
  },
  {
    id: 'paxon',
    name: 'Paxon School for Advanced Studies',
    address: '3239 Norman E Thagard Blvd, Jacksonville, FL 32254',
    lat: 30.3478,
    lng: -81.7242,
    mascot: 'Golden Eagles'
  },
  {
    id: 'riverside',
    name: 'Riverside High School (Formerly Robert E. Lee High)',
    address: '1200 McDuff Ave S, Jacksonville, FL 32205',
    lat: 30.3094,
    lng: -81.7107,
    mascot: 'Generals'
  },
  {
    id: 'wolfson',
    name: 'Samuel W. Wolfson High School',
    address: '7000 Powers Ave, Jacksonville, FL 32217',
    lat: 30.2478,
    lng: -81.6267,
    mascot: 'Wolfpack'
  },
  {
    id: 'sandalwood',
    name: 'Sandalwood High School',
    address: '2750 John Promenade Blvd, Jacksonville, FL 32246',
    lat: 30.3061,
    lng: -81.5165,
    mascot: 'Saints'
  },
  {
    id: 'stanton',
    name: 'Stanton College Preparatory School',
    address: '1149 W 13th St, Jacksonville, FL 32209',
    lat: 30.3475,
    lng: -81.6789,
    mascot: 'Blue Devils'
  },
  {
    id: 'terry-parker',
    name: 'Terry Parker High School',
    address: '7301 Parker School Rd, Jacksonville, FL 32211',
    lat: 30.3474,
    lng: -81.5815,
    mascot: 'Braves'
  },
  {
    id: 'westside',
    name: 'Westside High School',
    address: '5530 Firestone Rd, Jacksonville, FL 32244',
    lat: 30.2642,
    lng: -81.7588,
    mascot: 'Wolverines'
  },
  {
    id: 'william-raines',
    name: 'William M. Raines High School',
    address: '3663 Raines Rd, Jacksonville, FL 32209',
    lat: 30.3802,
    lng: -81.6917,
    mascot: 'Vikings'
  },
  {
    id: 'alden-road',
    name: 'Alden Road Exceptional Student Center',
    address: '11780 Alden Rd, Jacksonville, FL 32246',
    lat: 30.3064,
    lng: -81.5037,
    mascot: 'Dolphins'
  },
  {
    id: 'bridge-to-success',
    name: 'Bridge to Success Academy at West Jacksonville',
    address: '2115 Commonwealth Ave, Jacksonville, FL 32209',
    lat: 30.3394,
    lng: -81.7061,
    mascot: 'Navigators'
  },
  {
    id: 'palm-avenue',
    name: 'Palm Avenue Exceptional Student Center',
    address: '1301 Palm Ave, Jacksonville, FL 32207',
    lat: 30.3117,
    lng: -81.6582,
    mascot: 'Stars'
  }
];
