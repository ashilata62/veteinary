// Rich mock data for Veterinary Clinic Management System (VetCare Pro)

export const USERS = [
  { id: 'usr-1', name: 'Dr. Sarah Connor', role: 'Doctor', email: 'sarah.connor@vetcare.com', avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150' },
  { id: 'usr-2', name: 'Dr. Alex Mercer', role: 'Doctor', email: 'alex.mercer@vetcare.com', avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150' },
  { id: 'usr-3', name: 'Diana Prince', role: 'Admin', email: 'diana.prince@vetcare.com', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150' },
  { id: 'usr-4', name: 'Barry Allen', role: 'Receptionist', email: 'barry.allen@vetcare.com', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150' },
  { id: 'usr-5', name: 'Kara Danvers', role: 'Vet Assistant', email: 'kara.danvers@vetcare.com', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150' },
];

export const PET_OWNERS = [
  {
    id: 'own-101',
    name: 'Robert Downey Jr.',
    nic: '840192384V',
    email: 'robert@tony.com',
    telephone: '+94 11 234 5678',
    mobile: '+94 77 123 4567',
    address: '10880 Malibu Point, California',
    petsCount: 2
  },
  {
    id: 'own-102',
    name: 'Emma Watson',
    nic: '905182390V',
    email: 'emma@granger.com',
    telephone: '+94 11 987 6543',
    mobile: '+94 76 890 1234',
    address: 'Flat 4, Baker Street, London',
    petsCount: 1
  },
  {
    id: 'own-103',
    name: 'Keanu Reeves',
    nic: '741289382V',
    email: 'johnwick@continental.com',
    telephone: '+94 11 555 4321',
    mobile: '+94 77 999 8888',
    address: 'Continental Hotel, New York',
    petsCount: 1
  },
  {
    id: 'own-104',
    name: 'Scarlett Johansson',
    nic: '883294829V',
    email: 'scarlett@widow.com',
    telephone: '+94 11 444 8888',
    mobile: '+94 75 444 5555',
    address: 'S.H.I.E.L.D. Headquarters, Washington DC',
    petsCount: 2
  },
  {
    id: 'own-105',
    name: 'Chris Evans',
    nic: '810613290V',
    email: 'cap@brooklyn.com',
    telephone: '+94 11 777 9999',
    mobile: '+94 77 666 7777',
    address: '569 Brooklyn Heights, New York',
    petsCount: 1
  }
];

export const PETS = [
  {
    id: 'PET-2026-01',
    microchip: '981022300481293',
    name: 'Jarvis',
    ownerId: 'own-101',
    ownerName: 'Robert Downey Jr.',
    age: '3 Years 2 Months',
    weight: '32.5 kg',
    gender: 'Male',
    breed: 'Golden Retriever',
    photo: null,
    lastVaccination: '2026-02-15',
    lastDeworming: '2026-04-10',
    previousHistory: 'Mild skin allergy treated in 2025. Right leg fracture completely healed in 2024.',
    history: [
      {
        date: '2026-05-18',
        complaint: 'Routine Vaccination & General Health Checkup',
        duration: '1 Day',
        symptoms: 'None',
        diagnosis: 'Healthy adult dog. Perfect vitals.',
        doctor: 'Dr. Sarah Connor',
        treatment: 'Administered annual DHPP vaccination booster.',
        prescriptions: 'Vitamins (A/D/E) - 1 tab daily for 30 days',
        bloodTest: 'CBC - Normal range',
        ultrasound: 'N/A',
        xray: 'N/A',
        followUp: 'Deworming in 3 months'
      },
      {
        date: '2026-04-10',
        complaint: 'Mild scratching & hotspots around tail',
        duration: '3 Days',
        symptoms: 'Pruritus, localized redness, hair thinning near tail base',
        diagnosis: 'Flea Allergy Dermatitis (FAD)',
        doctor: 'Dr. Alex Mercer',
        treatment: 'Cleaned hotspots, applied topical anti-inflammatory ointment.',
        prescriptions: 'Apoquel 16mg - 1/2 tab daily for 10 days; Nexgard Chewable - 1 tablet',
        bloodTest: 'N/A',
        ultrasound: 'N/A',
        xray: 'N/A',
        followUp: 'Review in 2 weeks if scratching persists'
      }
    ],
    prescriptions: [
      { id: 'rx-201', date: '2026-05-18', items: 'Vitamins (A/D/E) - 1 tab daily (30 days)', doctor: 'Dr. Sarah Connor' },
      { id: 'rx-202', date: '2026-04-10', items: 'Apoquel 16mg - 1/2 tab daily (10 days)', doctor: 'Dr. Alex Mercer' }
    ],
    reports: [
      { id: 'rep-301', date: '2026-05-18', name: 'Annual Complete Blood Count (CBC)', type: 'Blood Test', url: '#' },
    ],
    vaccinations: [
      { id: 'vac-401', date: '2026-05-18', vaccine: 'DHPP Booster', batch: 'DH9082A', nextDue: '2027-05-18' },
      { id: 'vac-402', date: '2025-05-15', vaccine: 'Rabies Vaccine', batch: 'RB7721C', nextDue: '2028-05-15' }
    ],
    billingHistory: [
      { id: 'INV-8821', date: '2026-05-18', amount: 5600, status: 'Paid' },
      { id: 'INV-8710', date: '2026-04-10', amount: 12450, status: 'Paid' }
    ]
  },
  {
    id: 'PET-2026-02',
    microchip: '981022300481254',
    name: 'Pepper',
    ownerId: 'own-101',
    ownerName: 'Robert Downey Jr.',
    age: '1 Year 6 Months',
    weight: '4.2 kg',
    gender: 'Female',
    breed: 'Persian Cat',
    photo: null,
    lastVaccination: '2026-01-20',
    lastDeworming: '2026-05-02',
    previousHistory: 'Vaccinated for FVRCP. Occasional hairballs.',
    history: [
      {
        date: '2026-05-02',
        complaint: 'Vomiting and loss of appetite',
        duration: '2 Days',
        symptoms: 'Lethargy, vomiting food & bile, hiding',
        diagnosis: 'Mild Gastric Hairball Obstruction',
        doctor: 'Dr. Sarah Connor',
        treatment: 'Rehydration therapy (Subcutaneous Fluids 100ml), Hairball paste administration.',
        prescriptions: 'Laxatone Paste - 1 inch daily for 5 days; Cerenia 10mg - 1/2 tab for 3 days',
        bloodTest: 'N/A',
        ultrasound: 'Abdominal Scan - Normal gastrointestinal track except minor blockage in stomach.',
        xray: 'N/A',
        followUp: 'Monitor appetite. Introduce high-fiber diet.'
      }
    ],
    prescriptions: [
      { id: 'rx-203', date: '2026-05-02', items: 'Laxatone Paste (5 days), Cerenia 10mg (3 days)', doctor: 'Dr. Sarah Connor' }
    ],
    reports: [
      { id: 'rep-302', date: '2026-05-02', name: 'Abdominal Ultrasound - GI Track', type: 'Ultrasound', url: '#' }
    ],
    vaccinations: [
      { id: 'vac-403', date: '2026-01-20', vaccine: 'FVRCP Booster', batch: 'FV6529Z', nextDue: '2027-01-20' }
    ],
    billingHistory: [
      { id: 'INV-8798', date: '2026-05-02', amount: 8900, status: 'Paid' }
    ]
  },
  {
    id: 'PET-2026-03',
    microchip: '981022300487721',
    name: 'Crookshanks',
    ownerId: 'own-102',
    ownerName: 'Emma Watson',
    age: '5 Years',
    weight: '6.1 kg',
    gender: 'Male',
    breed: 'Himalayan Mixed Cat',
    photo: null,
    lastVaccination: '2025-11-12',
    lastDeworming: '2026-03-22',
    previousHistory: 'Neutered in 2021. Otherwise very healthy, regular checkups.',
    history: [],
    prescriptions: [],
    reports: [],
    vaccinations: [
      { id: 'vac-404', date: '2025-11-12', vaccine: 'Rabies & FVRCP Combo', batch: 'CM3341P', nextDue: '2026-11-12' }
    ],
    billingHistory: [
      { id: 'INV-8501', date: '2025-11-12', amount: 4500, status: 'Paid' }
    ]
  },
  {
    id: 'PET-2026-04',
    microchip: '981022300481109',
    name: 'Daisy',
    ownerId: 'own-103',
    ownerName: 'Keanu Reeves',
    age: '8 Months',
    weight: '11.2 kg',
    gender: 'Female',
    breed: 'Beagle',
    photo: null,
    lastVaccination: '2026-05-10',
    lastDeworming: '2026-05-10',
    previousHistory: 'Adopted recently. Full puppy vaccination series completed.',
    history: [
      {
        date: '2026-05-10',
        complaint: 'Final Puppy Vaccination Session & Microchipping',
        duration: '1 Day',
        symptoms: 'Healthy Beagle pup, highly active.',
        diagnosis: 'Perfect clinical health.',
        doctor: 'Dr. Alex Mercer',
        treatment: 'Injected standard microchip under shoulder skin. Administered final FVRCP & Rabies doses.',
        prescriptions: 'NexGard Spectra (Beagle) - 1 Chewable monthly',
        bloodTest: 'N/A',
        ultrasound: 'N/A',
        xray: 'N/A',
        followUp: 'Annual vaccination due in May 2027'
      }
    ],
    prescriptions: [
      { id: 'rx-204', date: '2026-05-10', items: 'NexGard Spectra monthly preventative', doctor: 'Dr. Alex Mercer' }
    ],
    reports: [],
    vaccinations: [
      { id: 'vac-405', date: '2026-05-10', vaccine: 'Microchip Implanted', batch: 'MC-98102', nextDue: 'Lifetime' },
      { id: 'vac-406', date: '2026-05-10', vaccine: 'Rabies 1-Year', batch: 'RB9920K', nextDue: '2027-05-10' }
    ],
    billingHistory: [
      { id: 'INV-8805', date: '2026-05-10', amount: 15400, status: 'Paid' }
    ]
  },
  {
    id: 'PET-2026-05',
    microchip: '981022300489932',
    name: 'Bucky',
    ownerId: 'own-104',
    ownerName: 'Scarlett Johansson',
    age: '2 Years',
    weight: '28.0 kg',
    gender: 'Male',
    breed: 'Siberian Husky',
    photo: null,
    lastVaccination: '2026-03-01',
    lastDeworming: '2026-04-18',
    previousHistory: 'Excitable puppy hood. Undergone basic behavioral training.',
    history: [],
    prescriptions: [],
    reports: [],
    vaccinations: [
      { id: 'vac-407', date: '2026-03-01', vaccine: 'DHPP Booster', batch: 'DH2011P', nextDue: '2027-03-01' }
    ],
    billingHistory: []
  }
];

export const APPOINTMENTS = [
  {
    id: 'apt-301',
    ownerId: 'own-101',
    ownerName: 'Robert Downey Jr.',
    petId: 'PET-2026-01',
    petName: 'Jarvis',
    breed: 'Golden Retriever',
    doctorName: 'Dr. Sarah Connor',
    date: '2026-05-21',
    time: '09:30 AM',
    reason: 'Follow-up for Deworming',
    status: 'Upcoming', // Completed, Pending, Cancelled, Upcoming
  },
  {
    id: 'apt-302',
    ownerId: 'own-102',
    ownerName: 'Emma Watson',
    petId: 'PET-2026-03',
    petName: 'Crookshanks',
    breed: 'Himalayan Mixed Cat',
    doctorName: 'Dr. Alex Mercer',
    date: '2026-05-21',
    time: '11:15 AM',
    reason: 'Routine health assessment & vaccination',
    status: 'Pending',
  },
  {
    id: 'apt-303',
    ownerId: 'own-103',
    ownerName: 'Keanu Reeves',
    petId: 'PET-2026-04',
    petName: 'Daisy',
    breed: 'Beagle',
    doctorName: 'Dr. Sarah Connor',
    date: '2026-05-21',
    time: '02:00 PM',
    reason: 'Mild limping on rear-left leg after park run',
    status: 'Upcoming',
  },
  {
    id: 'apt-304',
    ownerId: 'own-104',
    ownerName: 'Scarlett Johansson',
    petId: 'PET-2026-05',
    petName: 'Bucky',
    breed: 'Siberian Husky',
    doctorName: 'Dr. Alex Mercer',
    date: '2026-05-20',
    time: '10:00 AM',
    reason: 'General checkup & Ear cleaning',
    status: 'Completed',
  },
  {
    id: 'apt-305',
    ownerId: 'own-105',
    ownerName: 'Chris Evans',
    petId: 'PET-2026-05', // Linked dummy
    petName: 'Dodger',
    breed: 'Boxer Mix',
    doctorName: 'Dr. Sarah Connor',
    date: '2026-05-20',
    time: '04:30 PM',
    reason: 'Stomach upset',
    status: 'Cancelled',
  },
  {
    id: 'apt-306',
    ownerId: 'own-101',
    ownerName: 'Robert Downey Jr.',
    petId: 'PET-2026-02',
    petName: 'Pepper',
    breed: 'Persian Cat',
    doctorName: 'Dr. Sarah Connor',
    date: '2026-05-22',
    time: '09:00 AM',
    reason: 'Checkup on Gastric Hairball Recovery',
    status: 'Upcoming'
  }
];

export const INVENTORY = [
  { id: 'inv-001', name: 'Antibiotic Syrup', category: 'Medicine', batchNumber: 'AB-2026-X1', qty: 45, lowStockLimit: 10, unit: 'Bottles', price: 1200, expiry: '2027-08-15', supplier: 'Pharma Vet', status: 'In Stock' },
  { id: 'inv-002', name: 'Deworming Tablets', category: 'Parasiticide', batchNumber: 'DT-2025-Y2', qty: 0, lowStockLimit: 20, unit: 'Strips', price: 800, expiry: '2026-11-20', supplier: 'Zoetis Sri Lanka', status: 'Out of Stock' },
  { id: 'inv-003', name: 'Rabies Vaccine', category: 'Vaccine', batchNumber: 'RB-9920K', qty: 5, lowStockLimit: 15, unit: 'Vials', price: 1500, expiry: '2027-10-05', supplier: 'Virbac Lanka', status: 'Low Stock' },
  { id: 'inv-004', name: 'Pain Relief Injection', category: 'Medicine', batchNumber: 'PR-8812A', qty: 12, lowStockLimit: 10, unit: 'Ampoules', price: 650, expiry: '2026-06-10', supplier: 'Boehringer Ingelheim', status: 'Expiring Soon' },
  { id: 'inv-005', name: 'Multivitamin Supplements', category: 'Vitamins', batchNumber: 'VS-7711B', qty: 85, lowStockLimit: 20, unit: 'Bottles', price: 2100, expiry: '2028-01-15', supplier: 'Vetoquinol', status: 'In Stock' },
  { id: 'inv-006', name: 'Anti-Allergy Medicine', category: 'Medicine', batchNumber: 'AA-6610C', qty: 50, lowStockLimit: 15, unit: 'Tablets', price: 450, expiry: '2027-05-12', supplier: 'Zoetis Sri Lanka', status: 'In Stock' },
  { id: 'inv-007', name: 'Chew Rope Toy (Large)', category: 'Accessories & Toys', batchNumber: 'TOY-101', qty: 25, lowStockLimit: 5, unit: 'Items', price: 950, expiry: '2030-12-31', supplier: 'PetJoy', status: 'In Stock' },
  { id: 'inv-008', name: 'Oatmeal Pet Shampoo', category: 'Hygiene Items', batchNumber: 'SH-881', qty: 18, lowStockLimit: 8, unit: 'Bottles', price: 1450, expiry: '2026-12-01', supplier: 'CleanCoat', status: 'In Stock' },
  { id: 'inv-009', name: 'Premium Dog Kibble (5kg)', category: 'Food & Snacks', batchNumber: 'FD-22A', qty: 3, lowStockLimit: 10, unit: 'Bags', price: 4500, expiry: '2026-10-15', supplier: 'Royal Canin', status: 'Low Stock' },
  { id: 'inv-010', name: 'Salmon Cat Treats', category: 'Food & Snacks', batchNumber: 'TR-092', qty: 40, lowStockLimit: 15, unit: 'Packets', price: 600, expiry: '2027-04-20', supplier: 'Purina', status: 'In Stock' },
  { id: 'inv-011', name: 'Reflective Safety Collar', category: 'Accessories & Toys', batchNumber: 'COL-X', qty: 0, lowStockLimit: 5, unit: 'Items', price: 1200, expiry: '2030-12-31', supplier: 'PetJoy', status: 'Out of Stock' }
];

export const INVENTORY_ACTIVITY = [
  { id: 'act-01', date: '2026-05-21 14:30', action: 'Used in Billing', medicine: 'Rabies Vaccine', qtyChange: -2, user: 'Barry Allen', notes: 'Stock updated after billing' },
  { id: 'act-02', date: '2026-05-21 11:15', action: 'Manual Refill', medicine: 'Antibiotic Syrup', qtyChange: +20, user: 'Diana Prince', notes: 'Inventory adjusted manually' },
  { id: 'act-03', date: '2026-05-20 09:00', action: 'Used in Billing', medicine: 'Deworming Tablets', qtyChange: -5, user: 'Kara Danvers', notes: 'Stock updated after billing' },
];

export const ANALYTICS_INVENTORY = [
  { month: 'Jan', consumption: 120, refill: 150 },
  { month: 'Feb', consumption: 140, refill: 100 },
  { month: 'Mar', consumption: 160, refill: 200 },
  { month: 'Apr', consumption: 130, refill: 110 },
  { month: 'May', consumption: 180, refill: 80 }
];

export const INVOICES = [
  {
    id: 'INV-8821',
    date: '2026-05-18',
    ownerId: 'own-101',
    ownerName: 'Robert Downey Jr.',
    petId: 'PET-2026-01',
    petName: 'Jarvis',
    treatmentCharges: 2500, // Clinic consultation + injection fee
    medicines: [
      { name: 'Canigen DHPPi Vaccine Injection', qty: 1, price: 1500, total: 1500 },
      { name: 'Vitamins (A/D/E) 30 Tablets', qty: 30, price: 50, total: 1500 }
    ],
    tax: 100, // GST/NBT/VAT
    discount: 0,
    grandTotal: 5600,
    paymentMethod: 'Credit Card',
    status: 'Paid'
  },
  {
    id: 'INV-8798',
    date: '2026-05-02',
    ownerId: 'own-101',
    ownerName: 'Robert Downey Jr.',
    petId: 'PET-2026-02',
    petName: 'Pepper',
    treatmentCharges: 4500, // SC Fluid therapy + ultrasound scan
    medicines: [
      { name: 'Laxatone Paste Tube 70g', qty: 1, price: 1200, total: 1200 },
      { name: 'Cerenia 10mg 6 Tablets', qty: 1, price: 3000, total: 3000 }
    ],
    tax: 200,
    discount: 0,
    grandTotal: 8900,
    paymentMethod: 'Cash',
    status: 'Paid'
  },
  {
    id: 'INV-8805',
    date: '2026-05-10',
    ownerId: 'own-103',
    ownerName: 'Keanu Reeves',
    petId: 'PET-2026-04',
    petName: 'Daisy',
    treatmentCharges: 8000, // Consultation + Microchip Implantation + Vaccination fee
    medicines: [
      { name: 'NexGard Spectra (Beagle Pack)', qty: 1, price: 3800, total: 3800 },
      { name: 'Rabies 1-Year Vaccine Vials', qty: 1, price: 1200, total: 1200 },
      { name: 'Microchip Transponder (Zoetis)', qty: 1, price: 2000, total: 2000 }
    ],
    tax: 400,
    discount: 0,
    grandTotal: 15400,
    paymentMethod: 'Bank Transfer',
    status: 'Paid'
  }
];

export const ANALYTICS_REVENUE = [
  { month: 'Jan', revenue: 145000 },
  { month: 'Feb', revenue: 189000 },
  { month: 'Mar', revenue: 232000 },
  { month: 'Apr', revenue: 195000 },
  { month: 'May', revenue: 278000 } // Current month active
];

export const ANALYTICS_APPOINTMENTS = [
  { day: 'Mon', completed: 18, cancelled: 2, upcoming: 0 },
  { day: 'Tue', completed: 22, cancelled: 1, upcoming: 0 },
  { day: 'Wed', completed: 15, cancelled: 4, upcoming: 5 },
  { day: 'Thu', completed: 25, cancelled: 0, upcoming: 12 },
  { day: 'Fri', completed: 0, cancelled: 0, upcoming: 28 },
  { day: 'Sat', completed: 0, cancelled: 0, upcoming: 15 }
];

export const ANALYTICS_PET_TYPES = [
  { name: 'Dogs', value: 45, color: '#14b8a6' },
  { name: 'Cats', value: 35, color: '#3b82f6' },
  { name: 'Birds', value: 12, color: '#22c55e' },
  { name: 'Rabbits/Others', value: 8, color: '#f59e0b' }
];

export const ANALYTICS_DOCTOR_PERFORMANCE = [
  { name: 'Dr. Sarah Connor', patients: 142, rating: 4.9, hours: 160 },
  { name: 'Dr. Alex Mercer', patients: 118, rating: 4.8, hours: 145 }
];

export const CLINIC_SETTINGS = {
  name: 'VetCare Pro Animal Hospital',
  email: 'info@vetcarepro.com',
  phone: '+94 11 234 5678',
  address: 'No. 45, Temple Road, Colombo 07, Sri Lanka',
  vatNo: 'VAT-99201928-82',
  logo: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=150', // placeholder
  primaryThemeColor: '#14b8a6'
};
