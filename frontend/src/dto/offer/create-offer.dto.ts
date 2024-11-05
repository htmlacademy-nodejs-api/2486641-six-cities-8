export type Location = {
  latitude: number;
  longitude: number;
}

export class CreateOfferDto {
  public title!: string;

  public description!: string;

  public cityName!: string;

  public previewImage!: string;

  public images!: string[];

  public isPremium!: boolean;

  public rating!: number;

  public type!: string;

  public bedroomsCount!: number;

  public guestsCount!: number;

  public price!: number;

  public goods!: string[];

  public location!: Location;
}
