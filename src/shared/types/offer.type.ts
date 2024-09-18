import { City } from './city.type.js';
import { Good } from './good.enum.js';
import { HouseType } from './house-type.enum.js';
import { Location } from './location.type.js';

export type Offer = {
  title: string;
  description: string;
  postDate: Date;
  city: City;
  previewImage: string;
  images: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  type: HouseType;
  bedroomsCount: number;
  guestsCount: number;
  price: number;
  goods: Good[];
  authorEmail: string;
  commentsCount: number;
  location: Location;
}
