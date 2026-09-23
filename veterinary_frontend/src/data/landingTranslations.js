export const LANGUAGES = [
  { id: 'usa', label: 'USA', nativeName: 'USA (English)', flag: '🇺🇸', currency: 'USD', symbol: '$' },
  { id: 'uk', label: 'UK', nativeName: 'UK (English)', flag: '🇬🇧', currency: 'GBP', symbol: '£' },
  { id: 'uae', label: 'UAE', nativeName: 'UAE (English)', flag: '🇦🇪', currency: 'AED', symbol: 'AED' },
  { id: 'au', label: 'Australia', nativeName: 'Australia (English)', flag: '🇦🇺', currency: 'AUD', symbol: 'A$' },
  { id: 'en', label: 'Global', nativeName: 'Global (English)', flag: '🌐', currency: 'INR', symbol: '₹' },
];

export const PLAN_PRICING = {
  USD: {
    symbol: '$',
    code: 'USD',
    'free-trial': { price: '0', unit: 'per week' },
    starter: { price: '7', unit: 'per month' },
    standard: { price: '9', unit: 'per month' },
    pro: { price: '15', unit: 'per month' },
    custom: { price: 'Custom', unit: '' }
  },
  GBP: {
    symbol: '£',
    code: 'GBP',
    'free-trial': { price: '0', unit: 'per week' },
    starter: { price: '5.50', unit: 'per month' },
    standard: { price: '7.50', unit: 'per month' },
    pro: { price: '12', unit: 'per month' },
    custom: { price: 'Custom', unit: '' }
  },
  AED: {
    symbol: 'AED ',
    code: 'AED',
    'free-trial': { price: '0', unit: 'per week' },
    starter: { price: '25', unit: 'per month' },
    standard: { price: '35', unit: 'per month' },
    pro: { price: '55', unit: 'per month' },
    custom: { price: 'Custom', unit: '' }
  },
  AUD: {
    symbol: 'A$',
    code: 'AUD',
    'free-trial': { price: '0', unit: 'per week' },
    starter: { price: '11', unit: 'per month' },
    standard: { price: '14', unit: 'per month' },
    pro: { price: '22', unit: 'per month' },
    custom: { price: 'Custom', unit: '' }
  },
  INR: {
    symbol: '₹',
    code: 'INR',
    'free-trial': { price: '0', unit: 'per week' },
    starter: { price: '999', unit: 'per month' },
    standard: { price: '1,299', unit: 'per month' },
    pro: { price: '1,499', unit: 'per month' },
    custom: { price: 'Custom', unit: '' }
  }
};

const baseEnglish = {
  nav: {
    home: 'Home',
    features: 'Features',
    benefits: 'Benefits',
    testimonials: 'Testimonials',
    pricing: 'Pricing',
    contact: 'Contact',
    brochure: 'Brochure',
    adminLogin: 'Admin Login',
    startTrial: 'Start Free Trial'
  },
  hero: {
    badge: 'Veterinary SaaS Platform 2026',
    title1: 'Empowering Veterinary Clinics with',
    titleGradient: 'Smart Management',
    subtitle: 'Complete all-in-one software for pet records, appointment scheduling, billing & POS, pharmacy inventory, and automated client alerts.',
    explorePricing: 'Explore Plans & Pricing',
    getStarted: 'Get Started Free',
    stats: {
      pets: 'Pets Managed',
      clinics: 'Active Clinics',
      satisfaction: 'Client Satisfaction',
      support: 'Priority Support'
    }
  },
  features: {
    badge: 'Powerful Core Modules',
    title: 'Everything Your Clinic Needs in',
    titleGradient: 'One Intelligent Platform',
    subtitle: 'Streamline clinical workflows, reduce administrative overhead, and elevate pet care quality.',
    f1_title: 'Appointment Scheduling',
    f1_desc: 'Smart calendar management, color-coded doctor slots, walk-ins, and automated SMS/WhatsApp reminders.',
    f2_title: 'Digital Medical Records (EMR)',
    f2_desc: 'Comprehensive pet history, vaccination logs, weight tracking, diagnostics uploads, and treatment timelines.',
    f3_title: 'Billing & Point of Sale (POS)',
    f3_desc: 'Instant invoice generation, multi-item line billing, split payments, and payment links.',
    f4_title: 'Pharmacy & Stock Inventory',
    f4_desc: 'Real-time medicine stock tracking, batch numbers, low-stock threshold alerts, and expiry notifications.',
    f5_title: 'Client Communication & Alerts',
    f5_desc: 'Automated vaccination alerts, follow-up schedules, health checks, and promotional broadcast messages.',
    f6_title: 'Reports & Revenue Analytics',
    f6_desc: 'Daily sales summaries, doctor revenue performance, patient demographics, and audit tracking.'
  },
  benefits: {
    badge: 'Proven Practice Growth',
    title: 'Why Top Veterinary Practices',
    titleGradient: 'Choose PetCare Pro',
    subtitle: 'Designed to save hours every week, boost clinic revenue, and provide exceptional patient care.',
    b1: 'Increase clinic efficiency by up to 40%',
    b2: 'Save 15+ hours per week on manual paperwork and billing',
    b3: 'Eliminate patient no-shows with automated appointment alerts',
    b4: 'Optimize pharmacy profit margins with low-stock tracking',
    b5: 'Delight pet parents with digital prescription receipts',
    b6: 'Make confident data-driven decisions with executive reports',
    btn: 'See All Benefits',
    metrics: {
      faster: 'Faster Check-ins',
      saved: 'Hours Saved Weekly',
      uptime: 'System Uptime'
    },
    quote: '"PetCare Pro transformed how we run our clinic! Automated vaccination reminders and instant digital billing increased our repeat visits by 40%."',
    author: 'Dr. Rahul Sharma',
    authorRole: 'Owner, City Vet Clinic'
  },
  testimonials: {
    badge: 'Client Testimonials',
    title: 'Trusted by Veterinarians',
    titleGradient: 'Across the Globe',
    subtitle: 'Join hundreds of forward-thinking clinics delivering outstanding animal healthcare.'
  },
  pricing: {
    badge: 'Transparent Pricing Plans',
    title: 'Choose Your',
    titleGradient: 'Perfect Plan',
    subtitle: 'Simple, transparent pricing tailored for veterinary clinics of all sizes. Cancel anytime.',
    trialName: '7-Day Free Trial',
    trialFeature1: 'Full access to all platform features',
    trialFeature2: 'Duration: 7 Days with instant setup',
    starterName: 'Starter',
    starterFeature1: 'Essential clinic management features',
    starterFeature2: 'Up to 100 active pet records',
    standardName: 'Standard',
    standardBadge: 'Most Popular',
    standardFeature1: 'Complete suite for growing practices',
    standardFeature2: 'Up to 500 active pet records',
    standardFeature3: 'WhatsApp & Email automated reminders',
    proName: 'Pro',
    proBadge: 'Unlimited',
    proFeature1: '🤖 Kiaan AI Assistant & Advanced Automation',
    proFeature2: 'Unlimited patients & multi-doctor access',
    proFeature3: 'Dedicated account manager & 24/7 priority support',
    customName: 'Custom Enterprise',
    customSub: 'Tailored for hospitals & networks',
    customFeature1: 'Custom white-label branding & domain',
    customFeature2: 'Multi-branch chain management',
    customFeature3: 'Dedicated cloud server & SLA guarantee',
    btnGetStarted: 'Get Started',
    btnContactSales: 'Contact Sales'
  },
  footer: {
    tagline: 'Leading next-generation veterinary clinic management and clinical health record software.',
    quickLinks: 'Quick Links',
    services: 'Modules',
    contact: 'Get in Touch',
    address: 'Global Tech Park, Silicon Valley / London / Dubai / Sydney',
    rights: 'All rights reserved. PetCare Pro SaaS Platform.'
  }
};

export const TRANSLATIONS = {
  usa: { ...baseEnglish },
  uk: {
    ...baseEnglish,
    footer: {
      ...baseEnglish.footer,
      address: 'Central Tech Hub, London, United Kingdom'
    }
  },
  uae: {
    ...baseEnglish,
    footer: {
      ...baseEnglish.footer,
      address: 'Business Bay & Internet City, Dubai, United Arab Emirates'
    }
  },
  au: {
    ...baseEnglish,
    footer: {
      ...baseEnglish.footer,
      address: 'Innovation Precinct, Sydney, NSW, Australia'
    }
  },
  en: { ...baseEnglish }
};
