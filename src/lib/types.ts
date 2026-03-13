export type UserRole = 'landlord' | 'agent' | 'seeker';

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  password: string;
  createdAt: string;
}

export interface Town {
  id: string;
  name: string;
  lga: string;
  lat: number;
  lng: number;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  type: 'rent' | 'sale';
  propertyType: 'apartment' | 'house' | 'duplex' | 'bungalow' | 'land' | 'commercial';
  bedrooms: number;
  bathrooms: number;
  town: string;
  address: string;
  lat: number;
  lng: number;
  images: string[];
  videos: string[];
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  createdAt: string;
  featured: boolean;
}

export interface PropertyFilters {
  town?: string;
  type?: 'rent' | 'sale' | 'all';
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  searchQuery?: string;
}
