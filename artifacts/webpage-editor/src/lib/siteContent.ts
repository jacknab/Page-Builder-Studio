export interface Review {
  name: string;
  text: string;
  rating: number;
}

export interface SiteContent {
  announcement: string;

  heroBadge: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  heroHint: string;
  heroTrust1: string;
  heroTrust2: string;
  heroTrust3: string;

  navbarSubtitle: string;
  navbarCta: string;

  servicesEyebrow: string;
  servicesTitle: string;
  servicesSubtitle: string;
  servicesCtaLabel: string;

  aboutEyebrow: string;
  aboutTitle: string;
  aboutSubtitle: string;
  aboutBodyExtra: string;

  feature1Title: string;
  feature1Desc: string;
  feature2Title: string;
  feature2Desc: string;
  feature3Title: string;
  feature3Desc: string;

  reviewsEyebrow: string;
  reviewsTitle: string;
  reviews: Review[];

  bookingCtaTitle: string;
  bookingCtaSubtitle: string;
  bookingCtaLabel: string;

  hoursEyebrow: string;
  hoursTitle: string;

  contactEyebrow: string;
  contactTitle: string;
  contactHoursTitle: string;
  contactWalkins: string;

  galleryTitle: string;
  gallerySubtitle: string;

  teamTitle: string;
  teamSubtitle: string;
}

export function defaultNailSalonContent(): SiteContent {
  return {
    announcement: "",

    heroBadge: "Walk-ins Welcome",
    heroCtaPrimary: "Book Your Appointment",
    heroCtaSecondary: "Our Services",
    heroHint: "",
    heroTrust1: "Walk-ins Welcome",
    heroTrust2: "Expert Team",
    heroTrust3: "5-Star Service",

    navbarSubtitle: "",
    navbarCta: "Get In Touch",

    servicesEyebrow: "Our Menu",
    servicesTitle: "Services & Pricing",
    servicesSubtitle: "",
    servicesCtaLabel: "View All",

    aboutEyebrow: "Our Story",
    aboutTitle: "About Us",
    aboutSubtitle: "",
    aboutBodyExtra: "",

    feature1Title: "Expert Nail Artists",
    feature1Desc: "Skilled professionals dedicated to delivering perfect results every visit.",
    feature2Title: "5-Star Rated",
    feature2Desc: "Hundreds of satisfied clients trust us. Real results, real reviews.",
    feature3Title: "Relaxing Atmosphere",
    feature3Desc: "A calm, welcoming environment where you can sit back and enjoy.",

    reviewsEyebrow: "Happy Clients",
    reviewsTitle: "What People Say",
    reviews: [
      { name: "Sophia M.", text: "Absolutely stunning work. My gel nails have never looked this good — they lasted over three weeks without a chip.", rating: 5 },
      { name: "Olivia R.", text: "The atmosphere is so relaxing and the technicians really take their time. I leave feeling pampered every visit.", rating: 5 },
      { name: "Isabella K.", text: "Best nail salon in the area. The nail art they do is incredible — I get compliments everywhere I go.", rating: 5 },
    ],

    bookingCtaTitle: "Book Your Visit",
    bookingCtaSubtitle: "Choose your service, pick a time, and we'll take care of the rest.",
    bookingCtaLabel: "Book Now",

    hoursEyebrow: "We're Open",
    hoursTitle: "Hours",

    contactEyebrow: "Find Us",
    contactTitle: "Get In Touch",
    contactHoursTitle: "",
    contactWalkins: "",

    galleryTitle: "Our Work",
    gallerySubtitle: "See the artistry we deliver every day.",

    teamTitle: "Meet Our Team",
    teamSubtitle: "Skilled artists dedicated to your style.",
  };
}

export function defaultBarbershopContent(): SiteContent {
  return {
    announcement: "Walk-ins Welcome · Online Check-In Available",

    heroBadge: "Walk-ins Welcome",
    heroCtaPrimary: "Check In Now",
    heroCtaSecondary: "Call Now",
    heroHint: "⚡ Join the queue online – skip the wait",
    heroTrust1: "Walk-ins Welcome",
    heroTrust2: "Expert Barbers",
    heroTrust3: "Easy Booking",

    navbarSubtitle: "Barbershop",
    navbarCta: "Check In",

    servicesEyebrow: "What We Offer",
    servicesTitle: "Popular Services",
    servicesSubtitle: "Our most requested cuts and grooming services.",
    servicesCtaLabel: "View All Prices",

    aboutEyebrow: "Why Choose Us",
    aboutTitle: "Why Choose Us",
    aboutSubtitle: "More than a haircut. An experience built on skill, attention, and respect for the craft.",
    aboutBodyExtra: "",

    feature1Title: "Expert Barbers",
    feature1Desc: "Skilled professionals dedicated to delivering the perfect cut every visit — from clean fades to classic cuts.",
    feature2Title: "5-Star Rated",
    feature2Desc: "Hundreds of satisfied clients trust us in our community. Real results, real reviews, real satisfaction.",
    feature3Title: "In & Out, Looking Sharp",
    feature3Desc: "Join our online queue from anywhere. We'll text you when it's almost your turn — no long waits.",

    reviewsEyebrow: "Client Reviews",
    reviewsTitle: "What Clients Say",
    reviews: [
      { name: "James T.", text: "Best fade I've ever had. These guys know what they're doing.", rating: 5 },
      { name: "Marcus R.", text: "Walk in, walk out looking sharp. Every single time. My go-to shop.", rating: 5 },
      { name: "Derek W.", text: "Professional, fast, and the atmosphere is great. Highly recommend.", rating: 5 },
    ],

    bookingCtaTitle: "Skip the wait. Check in online.",
    bookingCtaSubtitle: "Join our queue from anywhere — we'll text you when it's your turn.",
    bookingCtaLabel: "Check In Now",

    hoursEyebrow: "Hours",
    hoursTitle: "When We're Open",

    contactEyebrow: "Visit Us",
    contactTitle: "Find Us",
    contactHoursTitle: "",
    contactWalkins: "Welcome during business hours",

    galleryTitle: "Our Work",
    gallerySubtitle: "See the craft and transformations we deliver every day.",

    teamTitle: "Meet Your Barbers",
    teamSubtitle: "Expert barbers dedicated to finding your perfect style.",
  };
}

export function defaultBarbershop2Content(): SiteContent {
  return {
    announcement: "",

    heroBadge: "Est.",
    heroCtaPrimary: "Check In Now",
    heroCtaSecondary: "",
    heroHint: "",
    heroTrust1: "",
    heroTrust2: "",
    heroTrust3: "",

    navbarSubtitle: "",
    navbarCta: "Check In",

    servicesEyebrow: "What we offer",
    servicesTitle: "Our Services",
    servicesSubtitle: "",
    servicesCtaLabel: "Check in online",

    aboutEyebrow: "Our story",
    aboutTitle: "More than just a haircut",
    aboutSubtitle: "",
    aboutBodyExtra: "We believe every client deserves a great experience — from the moment you walk in to the moment you leave looking your best.",

    feature1Title: "",
    feature1Desc: "",
    feature2Title: "",
    feature2Desc: "",
    feature3Title: "",
    feature3Desc: "",

    reviewsEyebrow: "What clients say",
    reviewsTitle: "Reviews",
    reviews: [
      { name: "James T.", text: "Best fade I've ever had. These guys know what they're doing.", rating: 5 },
      { name: "Marcus R.", text: "Walk in, walk out looking sharp. Every single time. My go-to shop.", rating: 5 },
      { name: "Derek W.", text: "Professional, fast, and the atmosphere is great. Highly recommend.", rating: 5 },
    ],

    bookingCtaTitle: "Skip the wait. Check in online.",
    bookingCtaSubtitle: "Join our queue from anywhere — we'll text you when it's your turn.",
    bookingCtaLabel: "Check In Now",

    hoursEyebrow: "Hours",
    hoursTitle: "When we're open",

    contactEyebrow: "Contact",
    contactTitle: "Find us",
    contactHoursTitle: "When we're open",
    contactWalkins: "Welcome during business hours",

    galleryTitle: "Our Work",
    gallerySubtitle: "",

    teamTitle: "Meet Your Barbers",
    teamSubtitle: "Expert barbers dedicated to finding your perfect style.",
  };
}
