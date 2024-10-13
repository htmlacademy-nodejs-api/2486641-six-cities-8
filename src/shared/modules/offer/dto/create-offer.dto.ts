import { Good, HouseType, Location } from '../../../types/index.js';

export class CreateOfferDto {
  public title: string;
  public description: string;
  public postDate: Date;
  public cityName: string;
  public previewImage: string;
  public images: string[];
  public isPremium: boolean;
  public isFavorite: boolean;
  public rating: number;
  public type: HouseType;
  public bedroomsCount: number;
  public guestsCount: number;
  public price: number;
  public goods: Good[];
  public userId: string;
  public commentsCount: number;
  public location: Location;
}
