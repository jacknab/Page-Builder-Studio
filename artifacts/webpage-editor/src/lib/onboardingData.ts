export type BusinessType = "nail-salon" | "hair-salon" | "haircut-studio" | "barbershop";

export interface ServiceItem {
  id: string;
  name: string;
  price: string;
}

export interface BarberItem {
  id: string;
  name: string;
  bio: string;
  photoUrl: string;
}

export interface LocationItem {
  id: string;
  name: string;
  address: string;
  phone: string;
}

export interface BusinessHours {
  day: string;
  open: boolean;
  openTime: string;
  closeTime: string;
}

export interface SocialLinks {
  instagram: string;
  facebook: string;
  tiktok: string;
  yelp: string;
  other: string;
}

export interface GalleryPhoto {
  id: string;
  url: string;
  caption: string;
}

export interface OnboardingData {
  templateId: string;
  templateSource: "blocks" | "html" | "launchsite";
  businessType: BusinessType | null;
  businessName: string;
  tagline: string;
  description: string;
  established: number | null;
  teamSize: number | null;
  services: ServiceItem[];
  hours: BusinessHours[];
  locations: LocationItem[];
  includeCheckIn: boolean;
  includeTeam: boolean;
  teamMembers: BarberItem[];
  includeGallery: boolean;
  galleryPhotos: GalleryPhoto[];
  googleListingUrl: string;
  social: SocialLinks;
}

export const BUSINESS_TYPES = [
  {
    id: "nail-salon" as BusinessType,
    label: "Nail Salon",
    emoji: "💅",
    description: "Manicures, pedicures, nail art & more",
  },
  {
    id: "hair-salon" as BusinessType,
    label: "Hair Salon",
    emoji: "✂️",
    description: "Cuts, colour, styling & treatments",
  },
  {
    id: "haircut-studio" as BusinessType,
    label: "Haircut Studio",
    emoji: "🪒",
    description: "Walk-in cuts, quick & affordable",
  },
  {
    id: "barbershop" as BusinessType,
    label: "Barbershop",
    emoji: "💈",
    description: "Fades, shaves, beard trims & more",
  },
];

const id = () => Math.random().toString(36).slice(2, 9);

export const PRESET_SERVICES: Record<BusinessType, ServiceItem[]> = {
  "nail-salon": [
    { id: id(), name: "Regular Manicure", price: "" },
    { id: id(), name: "Gel Manicure", price: "" },
    { id: id(), name: "Acrylic Full Set", price: "" },
    { id: id(), name: "Acrylic Fill", price: "" },
    { id: id(), name: "Regular Pedicure", price: "" },
    { id: id(), name: "Gel Pedicure", price: "" },
    { id: id(), name: "Spa Pedicure", price: "" },
    { id: id(), name: "French Tips", price: "" },
    { id: id(), name: "Nail Art (per nail)", price: "" },
    { id: id(), name: "Nail Repair", price: "" },
  ],
  "hair-salon": [
    { id: id(), name: "Women's Haircut & Style", price: "" },
    { id: id(), name: "Men's Haircut", price: "" },
    { id: id(), name: "Children's Haircut", price: "" },
    { id: id(), name: "Blowout", price: "" },
    { id: id(), name: "Full Colour", price: "" },
    { id: id(), name: "Highlights", price: "" },
    { id: id(), name: "Balayage", price: "" },
    { id: id(), name: "Keratin Treatment", price: "" },
    { id: id(), name: "Perm", price: "" },
    { id: id(), name: "Deep Conditioning Treatment", price: "" },
  ],
  "haircut-studio": [
    { id: id(), name: "Adult Haircut", price: "" },
    { id: id(), name: "Kids Haircut", price: "" },
    { id: id(), name: "Senior Haircut", price: "" },
    { id: id(), name: "Buzz Cut", price: "" },
    { id: id(), name: "Bang Trim", price: "" },
    { id: id(), name: "Shampoo Add-on", price: "" },
    { id: id(), name: "Style Finish", price: "" },
  ],
  "barbershop": [
    { id: id(), name: "Haircut", price: "" },
    { id: id(), name: "Fade", price: "" },
    { id: id(), name: "Kids Haircut", price: "" },
    { id: id(), name: "Buzz Cut", price: "" },
    { id: id(), name: "Line Up / Edge Up", price: "" },
    { id: id(), name: "Beard Trim", price: "" },
    { id: id(), name: "Beard Shape & Style", price: "" },
    { id: id(), name: "Hot Towel Shave", price: "" },
    { id: id(), name: "Haircut & Beard Combo", price: "" },
  ],
};

export const DEFAULT_HOURS: BusinessHours[] = [
  { day: "Monday", open: true, openTime: "09:00", closeTime: "18:00" },
  { day: "Tuesday", open: true, openTime: "09:00", closeTime: "18:00" },
  { day: "Wednesday", open: true, openTime: "09:00", closeTime: "18:00" },
  { day: "Thursday", open: true, openTime: "09:00", closeTime: "18:00" },
  { day: "Friday", open: true, openTime: "09:00", closeTime: "18:00" },
  { day: "Saturday", open: true, openTime: "10:00", closeTime: "16:00" },
  { day: "Sunday", open: false, openTime: "10:00", closeTime: "15:00" },
];

export const EMPTY_SOCIAL: SocialLinks = {
  instagram: "",
  facebook: "",
  tiktok: "",
  yelp: "",
  other: "",
};

export const DEFAULT_DESCRIPTIONS: Record<BusinessType, string> = {
  "barbershop":
    "Welcome to our barbershop. We offer precision cuts and a great experience for every client. Our experienced barbers are dedicated to making you look and feel your best.",
  "nail-salon":
    "Welcome to our nail studio, where every detail matters. Our talented nail artists combine artistry and precision to give you flawless, long-lasting nails that you'll love. From classic manicures to intricate nail art, we offer a full range of services in a relaxing, elegant atmosphere.",
  "hair-salon":
    "Welcome to our salon. Our experienced stylists are passionate about helping you look and feel your best. Whether you're after a fresh cut, a bold colour, or a complete style transformation, we've got you covered.",
  "haircut-studio":
    "Welcome to our haircut studio. We keep it simple — great cuts, fair prices, no appointment needed. Walk in and walk out looking sharp.",
};

export const ONBOARDING_KEY = "launchsite-onboarding-v1";

export function saveOnboarding(data: OnboardingData): void {
  localStorage.setItem(ONBOARDING_KEY, JSON.stringify(data));
}

export function loadOnboarding(): OnboardingData | null {
  try {
    const raw = localStorage.getItem(ONBOARDING_KEY);
    return raw ? (JSON.parse(raw) as OnboardingData) : null;
  } catch {
    return null;
  }
}
