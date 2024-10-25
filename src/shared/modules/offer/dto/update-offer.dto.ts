import { MinLength, MaxLength, ArrayMinSize, ArrayMaxSize, IsBoolean, IsNumber, Min, Max, IsEnum, IsInt, ArrayUnique } from 'class-validator';
import { Good, HouseType, Location } from '../../../types/index.js';
import { CreateOfferValidationMessage } from './create-offer.messages.js';

export class UpdateOfferDto {
  @MinLength(10, { message: CreateOfferValidationMessage.title.minLength })
  @MaxLength(100, { message: CreateOfferValidationMessage.title.maxLength })
  public title: string;

  @MinLength(20, { message: CreateOfferValidationMessage.description.minLength })
  @MaxLength(1024, { message: CreateOfferValidationMessage.description.maxLength })
  public description: string;

  public cityName: string;
  public previewImage: string;

  @ArrayMinSize(6, { message: CreateOfferValidationMessage.images.count })
  @ArrayMaxSize(6, { message: CreateOfferValidationMessage.images.count })
  public images: string[];

  @IsBoolean()
  public isPremium: boolean;

  @IsBoolean()
  public isFavorite: boolean;

  @IsNumber({ maxDecimalPlaces: 1}, { message: CreateOfferValidationMessage.rating.invalidFormat })
  @Min(1, { message: CreateOfferValidationMessage.rating.minValue })
  @Max(5, { message: CreateOfferValidationMessage.rating.maxValue })
  public rating: number;

  @IsEnum(HouseType, { message: CreateOfferValidationMessage.type.invalid })
  public type: HouseType;

  @IsInt({ message: CreateOfferValidationMessage.roomsCount.invalidFormat })
  @Min(1, { message: CreateOfferValidationMessage.roomsCount.minValue })
  @Max(8, { message: CreateOfferValidationMessage.roomsCount.maxValue })
  public bedroomsCount: number;

  @IsInt({ message: CreateOfferValidationMessage.guestsCount.invalidFormat })
  @Min(1, { message: CreateOfferValidationMessage.guestsCount.minValue })
  @Max(10, { message: CreateOfferValidationMessage.guestsCount.maxValue })
  public guestsCount: number;

  @IsInt({ message: CreateOfferValidationMessage.price.invalidFormat })
  @Min(100, { message: CreateOfferValidationMessage.price.minValue })
  @Max(100000, { message: CreateOfferValidationMessage.price.maxValue })
  public price: number;

  @IsEnum(Good, { each: true, message: CreateOfferValidationMessage.goods.invalid })
  @ArrayUnique({ message: CreateOfferValidationMessage.goods.unique })
  @ArrayMinSize(1, { message: CreateOfferValidationMessage.goods.minValue })
  public goods: Good[];

  public location: Location;
}
