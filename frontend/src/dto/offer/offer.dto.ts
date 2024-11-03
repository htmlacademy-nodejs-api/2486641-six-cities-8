import { Type } from '../../types/types';
import UserDto from '../user/user.dto';
import { Location } from './create-offer.dto';

export class OfferDto {
  id!: string;

  title!: string;

  description!: string;

  postDate!: string;

  cityName!: string;

  previewImage!: string;

  images!: string[];

  isPremium!: boolean;

  isFavorite!: boolean;

  rating!: number;

  type!: Type;

  bedroomsCount!: number;

  guestsCount!: number;

  price!: number;

  goods!: string[];

  user!: UserDto;

  commentsCount!: number;

  location!: Location;
}
