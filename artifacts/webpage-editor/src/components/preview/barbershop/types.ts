export interface Service {
  name: string;
  price: string;
  description?: string;
  category?: string;
  popular?: boolean;
}

export interface Hours {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
}

export interface Barber {
  name: string;
  role: string;
  yearsExp?: number;
  bio?: string;
  photoUrl?: string;
  bookingUrl?: string;
}

export interface ClientData {
  themeId: string;
  businessName: string;
  tagline: string;
  description: string;
  phone: string;
  email?: string;
  address?: string;
  established?: number;
  numberOfBarbers?: number;
  bookingUrl?: string;
  services: Service[];
  barbers?: Barber[];
  galleryImages?: string[];
  hours: Hours;
  googleUrl?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  tiktokUrl?: string;
  yelpUrl?: string;
}
