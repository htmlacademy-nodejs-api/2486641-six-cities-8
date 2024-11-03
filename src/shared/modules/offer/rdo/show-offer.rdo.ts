import { Expose, Type } from 'class-transformer';

import { UserRdo } from '../../user/rdo/user.rdo.js';
import { Location } from '../../../types/location.type.js';

export class ShowOfferRdo {
  // constructor(partial: Partial<ShowOfferRdo>) {
  //   Object.assign(this, partial);
  //   this.city = getCity(this.cityName);
  // }

  @Expose()
  public id: string;

  @Expose()
  public title: string;

  @Expose()
  public description: string;

  @Expose()
  public postDate: string;

  @Expose()
  // @Transform((value) => ({
  //   name: value,
  //   id: 1
  // }))
  public cityName: string;

  // @Expose()
  // @Transform(() => 'Gorod')
  // public city: City;

  @Expose()
  public previewImage: string;

  @Expose()
  public images: string[];

  @Expose()
  public isPremium: boolean;

  @Expose()
  public isFavorite: boolean;

  @Expose()
  public rating: number;

  @Expose()
  public type: string;

  @Expose()
  public bedroomsCount: number;

  @Expose()
  public guestsCount: number;

  @Expose()
  public price: number;

  @Expose()
  public goods: string[];

  @Expose({ name: 'userId'})
  @Type(() => UserRdo)
  public user: UserRdo;

  @Expose()
  public commentsCount: number;

  @Expose()
  public location: Location;
}
