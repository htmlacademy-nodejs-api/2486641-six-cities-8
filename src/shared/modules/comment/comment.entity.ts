import { getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { UserEntity } from '../user/index.js';

@modelOptions({
  schemaOptions: {
    collection: 'comments',
    timestamps: true,
  }
})
export class CommentEntity {
  @prop()
  public text: string;

  @prop()
  public postDate: Date;

  @prop()
  public rating: number;

  @prop({
    ref: UserEntity,
    required: true
  })
  public userId!: Ref<UserEntity>;
}

export const CommentModel = getModelForClass(CommentEntity);
