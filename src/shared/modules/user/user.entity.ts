import { defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { User } from '../../types/index.js';
import { createSHA256 } from '../../helpers/hash.js';
import { Types } from 'mongoose';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true,
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({required: true, minlength: [1, 'Min length for name is 3'], maxlength: [15, 'Max length for name is 15']})
  public name: string;

  @prop({unique: true})
  public email: string;

  @prop()
  public avatarUrl: string;

  @prop({ required: true, default: '' })
  private password?: string;

  @prop()
  public isPro: boolean;

  @prop({ type: Types.ObjectId, required: true, default: [] })
  public favoriteOffers: Types.Array<Types.ObjectId>;

  constructor(userData: User) {
    super();

    this.email = userData.email;
    this.avatarUrl = userData.avatarUrl;
    this.name = userData.name;
    this.isPro = userData.isPro;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }

  public verifyPassword(password: string, salt: string) {
    const hashPassword = createSHA256(password, salt);
    return hashPassword === this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
