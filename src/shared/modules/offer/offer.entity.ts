import { defaultClasses, getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { Good, HouseType, Location } from '../../types/index.js';
import { UserEntity } from '../user/user.entity.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
    timestamps: true,
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({
    trim: true,
    required: true
  })
  public title!: string;

  @prop({
    trim: true,
    required: true
  })
  public description!: string;

  @prop()
  public postDate!: Date;

  @prop()
  public cityName!: string;

  @prop()
  public previewImage!: string;

  @prop()
  public images!: string[];

  @prop()
  public isPremium!: boolean;

  @prop()
  public isFavorite!: boolean;

  @prop()
  public rating!: number;

  @prop({
    type: () => String,
    enum: HouseType
  })
  public type!: HouseType;

  @prop()
  public bedroomsCount!: number;

  @prop()
  public guestsCount!: number;

  @prop()
  public price!: number;

  @prop({
    type: () => [String],
    enum: Good
  })
  public goods: Good[];

  @prop({
    ref: UserEntity,
    required: true
  })
  public userId!: Ref<UserEntity>;

  @prop({ default: 0 })
  public commentsCount: number;

  @prop()
  public location!: Location;
}

export const OfferModel = getModelForClass(OfferEntity);
