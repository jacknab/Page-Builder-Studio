export interface Service {
  name: string;
  price: string;
  description?: string;
  category?: string;
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
  numberOfBarbers?: number;
  services: Service[];
  hours: Hours;
  googleUrl?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  tiktokUrl?: string;
  yelpUrl?: string;
}
