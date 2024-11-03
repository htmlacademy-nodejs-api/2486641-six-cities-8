import { MinLength, MaxLength, ArrayMinSize, ArrayMaxSize, IsBoolean, IsNumber, Min, Max, IsEnum, IsInt, ArrayUnique } from 'class-validator';
import { Good, HouseType, Location } from '../../../types/index.js';
import { CreateUpdateOfferValidationMessage } from './create-update-offer.messages.js';
import { Type } from 'class-transformer';
import { CreateLocationDto } from './create-location.dto.js';
import { CityName } from '../../../types/city-name.enum.js';

export class UpdateOfferDto {
  @MinLength(10, { message: CreateUpdateOfferValidationMessage.title.minLength })
  @MaxLength(100, { message: CreateUpdateOfferValidationMessage.title.maxLength })
  public title: string;

  @MinLength(20, { message: CreateUpdateOfferValidationMessage.description.minLength })
  @MaxLength(1024, { message: CreateUpdateOfferValidationMessage.description.maxLength })
  public description: string;

  @IsEnum(CityName, { message: CreateUpdateOfferValidationMessage.cityName.invalid })
  public cityName: string;

  public previewImage: string;

  @ArrayMinSize(6, { message: CreateUpdateOfferValidationMessage.images.count })
  @ArrayMaxSize(6, { message: CreateUpdateOfferValidationMessage.images.count })
  public images: string[];

  @IsBoolean({message: CreateUpdateOfferValidationMessage.isPremium.invalidFormat})
  public isPremium: boolean;

  @IsBoolean({message: CreateUpdateOfferValidationMessage.isFavorite.invalidFormat})
  public isFavorite: boolean;

  @IsNumber({ maxDecimalPlaces: 1}, { message: CreateUpdateOfferValidationMessage.rating.invalidFormat })
  @Min(1, { message: CreateUpdateOfferValidationMessage.rating.minValue })
  @Max(5, { message: CreateUpdateOfferValidationMessage.rating.maxValue })
  public rating: number;

  @IsEnum(HouseType, { message: CreateUpdateOfferValidationMessage.type.invalid })
  public type: HouseType;

  @IsInt({ message: CreateUpdateOfferValidationMessage.roomsCount.invalidFormat })
  @Min(1, { message: CreateUpdateOfferValidationMessage.roomsCount.minValue })
  @Max(8, { message: CreateUpdateOfferValidationMessage.roomsCount.maxValue })
  public bedroomsCount: number;

  @IsInt({ message: CreateUpdateOfferValidationMessage.guestsCount.invalidFormat })
  @Min(1, { message: CreateUpdateOfferValidationMessage.guestsCount.minValue })
  @Max(10, { message: CreateUpdateOfferValidationMessage.guestsCount.maxValue })
  public guestsCount: number;

  @IsInt({ message: CreateUpdateOfferValidationMessage.price.invalidFormat })
  @Min(100, { message: CreateUpdateOfferValidationMessage.price.minValue })
  @Max(100000, { message: CreateUpdateOfferValidationMessage.price.maxValue })
  public price: number;

  @IsEnum(Good, { each: true, message: CreateUpdateOfferValidationMessage.goods.invalid })
  @ArrayUnique({ message: CreateUpdateOfferValidationMessage.goods.unique })
  @ArrayMinSize(1, { message: CreateUpdateOfferValidationMessage.goods.minValue })
  public goods: Good[];

  @Type(() => CreateLocationDto)
  public location: Location;
}
