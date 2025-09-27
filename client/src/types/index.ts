export interface Listing {
  id: number;
  image: string;
  images: string[];
  price: number;
  address: string;
  beds: number;
  baths: number;
  matchScore: number;
  isPrivate: boolean;
  description: string;
  amenities: string[];
  coordinates?: { lat: number; lng: number };
}
