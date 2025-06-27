import React from 'react';

export interface Service {
  id: string;
  name: string;
  tagline: string;
  description: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  image: string;
}

export enum City {
  ENAKIEVO = "Енакиево",
  KIROVSKOE = "Кировское",
  SHAKHTERSK = "Шахтерск",
}

export interface Studio {
  id: string;
  name: string;
  city: City;
  description: string; // Brief description for cards
  detailedDescription?: string; // Longer description for detail page
  hourlyRate: number;
  imageUrls: string[]; // For multiple images, first one can be thumbnail
  amenities: string[];
}

export interface BookingSlot {
  date: string;
  time: string;
  studioId: string;
  isBooked: boolean;
}

export interface FlowerProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number; // For strikethrough price
  imageUrls: string[]; 
  description: string; 
  detailedDescription?: string; 
  category: string; // E.g., 'Букеты', 'Композиции', 'Розы', 'Подарки'
  rating?: number; // Average rating, e.g., 4.89
  reviewsCount?: number; // Number of reviews, e.g., 354000 for "354 тыс."
  isNew?: boolean;
  isPopular?: boolean;
  deliveryTime?: number; // in minutes, e.g., 90 for "Доставка до 90 минут"
  isReadyMade?: boolean; // For "Уже собран" filter
  occasionTags?: string[]; // For "Ищу подарок" filters like "Маме", "Любимой девушке"
  flowerTypesIncluded?: string[]; // For "Цветы в составе" filter, e.g., ["Розы", "Эустомы"]
  storeIds?: string[]; // IDs of stores where this product is available
}

export interface CartItem extends FlowerProduct {
  quantity: number;
}

export interface PhotoBookFormat {
  id:string;
  name: string;
  price: number;
  description: string; 
  imageUrl?: string; 
  features?: string[]; 
  detailedFeatures?: string[]; 
  bestSuitedFor?: string[]; 
  exampleGalleryImages?: string[]; 
}

export interface MasterClassEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string; 
  detailedDescription?: string; 
  price: number;
  image: string; 
  imageUrls?: string[]; 
  location: string;
  instructorName?: string;
  instructorBio?: string;
  instructorImage?: string; 
  program?: Array<{ 
    timeSlot: string; 
    activity: string; 
    description?: string; 
  }>;
}

export interface HallRentalInfo {
  id: string;
  name: string;
  capacity: number;
  pricePerHour: number;
  amenities: string[];
  imageUrls: string[]; // Changed from image: string
  description?: string; // Brief description for cards or general use
  detailedDescription?: string; // For the detail page
}

export interface Store {
  id: string;
  name: string;
  city: City;
  address: string;
  operatingHours?: string; // e.g., "9:00 - 21:00"
  imageUrl?: string;
}