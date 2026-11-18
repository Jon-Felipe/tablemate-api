export class Restaurant {
  id: string;
  ownerId: string;

  // basic info
  name: string;
  slug: string;
  description: string;

  // classification
  cuisine: string;
  priceLevel: number;
  // location info
  address: string;
  city: string;
  postalCode: string;
  country: string;
  latitude: number;
  longitude: number;

  // contact info
  phoneNumber: string;
  email: string;
  websiteUrl: string;

  // metadata
  createdAt: Date;
  updatedAt: Date;
}
