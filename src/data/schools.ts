export interface SchoolItem {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  mascot?: string;
  colors?: string;
}

export const DUVAL_SCHOOLS: SchoolItem[] = [
  { id: 'riverside', name: 'Riverside High School', address: '1200 McDuff Ave S, Jacksonville, FL 32205', lat: 30.3094, lng: -81.7107, mascot: 'Generals' },
  { id: 'stanton', name: 'Stanton College Preparatory', address: '1149 W 13th St, Jacksonville, FL 32209', lat: 30.3475, lng: -81.6789, mascot: 'Blue Devils' },
  { id: 'fletcher', name: 'Duncan U. Fletcher High School', address: '700 Seagate Ave, Neptune Beach, FL 32266', lat: 30.3168, lng: -81.4052, mascot: 'Senators' },
  { id: 'atlantic-coast', name: 'Atlantic Coast High School', address: '9735 R. G. Skinner Pkwy, Jacksonville, FL 32256', lat: 30.2238, lng: -81.5205, mascot: 'Stingrays' },
  { id: 'paxon', name: 'Paxon School for Advanced Studies', address: '3239 Norman E Thagard Blvd, Jacksonville, FL 32254', lat: 30.3478, lng: -81.7242, mascot: 'Golden Eagles' },
  { id: 'sandalwood', name: 'Sandalwood High School', address: '2750 John Prom Blvd, Jacksonville, FL 32246', lat: 30.3061, lng: -81.5165, mascot: 'Saints' },
  { id: 'douglas-anderson', name: 'Douglas Anderson School of the Arts', address: '2445 San Diego Rd, Jacksonville, FL 32207', lat: 30.3019, lng: -81.6444, mascot: 'Penguins' },
  { id: 'mandarin', name: 'Mandarin High School', address: '4831 Greenland Rd, Jacksonville, FL 32258', lat: 30.1557, lng: -81.5839, mascot: 'Mustangs' },
  { id: 'raines', name: 'William M. Raines High School', address: '3663 Clarkson Ave, Jacksonville, FL 32209', lat: 30.3802, lng: -81.6917, mascot: 'Vikings' },
  { id: 'ribault', name: 'Jean Ribault High School', address: '3701 Winton Dr, Jacksonville, FL 32208', lat: 30.3846, lng: -81.7143, mascot: 'Trojans' },
  { id: 'wolfson', name: 'Samuel Wolfson School for Advanced Studies', address: '7000 Powers Ave, Jacksonville, FL 32217', lat: 30.2478, lng: -81.6267, mascot: 'Wolfpack' },
  { id: 'terry-parker', name: 'Terry Parker High School', address: '7301 Parker School Rd, Jacksonville, FL 32211', lat: 30.3474, lng: -81.5815, mascot: 'Braves' },
  { id: 'first-coast', name: 'First Coast High School', address: '590 Duval Station Rd, Jacksonville, FL 32218', lat: 30.4578, lng: -81.6375, mascot: 'Buccaneers' },
  { id: 'ed-white', name: 'Edward H. White High School', address: '1700 Old Middleburg Rd N, Jacksonville, FL 32210', lat: 30.2982, lng: -81.7694, mascot: 'Commanders' },
  { id: 'westside', name: 'Westside High School', address: '5530 Firestone Rd, Jacksonville, FL 32244', lat: 30.2642, lng: -81.7588, mascot: 'Wolverines' },
  { id: 'englewood', name: 'Englewood High School', address: '4412 Barnes Rd, Jacksonville, FL 32207', lat: 30.2748, lng: -81.6192, mascot: 'Rams' },
  { id: 'baldwin', name: 'Baldwin Middle-Senior High School', address: '291 Mill St W, Baldwin, FL 32234', lat: 30.3045, lng: -81.9782, mascot: 'Indians' },
  { id: 'andrew-jackson', name: 'Andrew Jackson High School', address: '3816 N Main St, Jacksonville, FL 32206', lat: 30.3662, lng: -81.6542, mascot: 'Tigers' },
  { id: 'darnell-cookman', name: 'Darnell-Cookman School of the Medical Arts', address: '1701 N Davis St, Jacksonville, FL 32209', lat: 30.3481, lng: -81.6705, mascot: 'Vikings' },
  { id: 'lavilla', name: 'LaVilla School of the Arts', address: '501 N Davis St, Jacksonville, FL 32204', lat: 30.3346, lng: -81.6701, mascot: 'Artists' },
  { id: 'peterson', name: 'Frank H. Peterson Academies of Technology', address: '7450 Wilson Blvd, Jacksonville, FL 32210', lat: 30.2685, lng: -81.7779, mascot: 'Eagles' },
  { id: 'bishop-kenny', name: 'Bishop Kenny High School', address: '1055 Kingman Ave, Jacksonville, FL 32207', lat: 30.3129, lng: -81.6469, mascot: 'Crusaders' },
  { id: 'bolles', name: 'The Bolles School', address: '7400 San Jose Blvd, Jacksonville, FL 32217', lat: 30.2458, lng: -81.6288, mascot: 'Bulldogs' },
  { id: 'episcopal', name: 'Episcopal School of Jacksonville', address: '4455 Atlantic Blvd, Jacksonville, FL 32207', lat: 30.3122, lng: -81.6174, mascot: 'Eagles' }
];
