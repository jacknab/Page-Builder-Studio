export interface Service {
  name: string;
  price: string;
  duration?: string;
  category?: string;
}

export interface Review {
  name: string;
  text: string;
  rating: number;
  date?: string;
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

export interface ClientData {
  themeId: string;
  businessName: string;
  tagline: string;
  description: string;
  phone: string;
  email?: string;
  address?: string;
  established?: number;
  bookingUrl?: string;
  services: Service[];
  reviews?: Review[];
  hours: Hours;
  instagramUrl?: string;
  facebookUrl?: string;
  googleUrl?: string;
}
