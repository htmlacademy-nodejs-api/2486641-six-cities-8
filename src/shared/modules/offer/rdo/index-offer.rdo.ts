import { Expose, Transform } from 'class-transformer';
import { getCity } from '../../../types/cities.js';
import { City } from '../../../types/city.type.js';

export class IndexOfferRdo {
  @Expose()
  public id: number;

  @Expose()
  public price: number;

  @Expose()
  public title: string;

  @Expose()
  public type: string;

  @Expose()
  public isFavorite: boolean;

  @Expose()
  public postDate: string;

  @Expose({ name: 'cityName' })
  @Transform(({ value }) => getCity(value))
  public city: City;

  @Expose()
  public previewImage: string;

  @Expose()
  public isPremium: boolean;

  @Expose()
  public rating: number;

  @Expose()
  public commentsCount: number;
}
