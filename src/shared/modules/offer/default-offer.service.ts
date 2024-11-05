import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';

import { OfferService } from './offer-service.interface.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UserService } from '../user/user-service.interface.js';
import { Types } from 'mongoose';
import { CommentEntity } from '../comment/comment.entity.js';

const DEFAULT_OFFER_COUNT = 60;
@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
  ) {}

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel
      .exists({_id: documentId})) !== null;
  }

  public async incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, {'$inc': {
        commentsCount: 1,
      }}).exec();
  }

  public async update(offerId: string, dto: CreateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, dto, {new: true})
      .populate(['userId'])
      .exec();
  }

  public async delete(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    const offer = this.offerModel
      .findByIdAndDelete(offerId)
      .exec();
    this.logger.info(`Delete offer: ${offerId}`);
    return offer;
  }

  public async findPremiumByCity(cityName: string): Promise<DocumentType<OfferEntity>[]> {
    return await this.offerModel.find({isPremium: true, cityName: cityName});
  }

  public async findFavorite(userId: string): Promise<DocumentType<OfferEntity>[]> {
    const user = await this.userService.getById(userId);
    if (!user) {
      return [];
    }

    const favorites = await this.offerModel.find({ _id: { $in: user.favoriteOffers } });
    favorites.forEach((offer) => {
      offer.isFavorite = true;
    });
    return favorites;
  }

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);

    return result;
  }

  public async findById(offerId: string, userId: string): Promise<DocumentType<OfferEntity> | null> {
    const offer = await this.offerModel.findById(offerId).populate(['userId']).exec();

    if (!offer) {
      return null;
    }
    offer.rating = await this.getAvgRating(offerId);

    const user = await this.userService.getById(userId);
    if (user && user.favoriteOffers) {
      offer.isFavorite = user.favoriteOffers.includes(new Types.ObjectId(offerId));
    } else {
      offer.isFavorite = false;
    }
    return offer;
  }

  public async findAll(userId?: string, count?: number): Promise<DocumentType<OfferEntity>[]> {
    const limit = count ?? DEFAULT_OFFER_COUNT;
    const offers = await this.offerModel
      .find()
      .sort({ postDate: 'desc' })
      .limit(limit)
      .populate(['userId'])
      .exec();

    const user = userId ? await this.userService.getById(userId) : undefined;
    for (const offer of offers){
      offer.isFavorite = !!(user && user.favoriteOffers.includes(offer.id));
      offer.rating = await this.getAvgRating(offer.id);
    }
    return offers;
  }

  public async addFavorite(userId: string, offerId: string): Promise<DocumentType<OfferEntity> | null> {
    const user = await this.userService.getById(userId);
    if (!user) {
      return null;
    }
    user.favoriteOffers.push(new Types.ObjectId(offerId));
    await user.save();
    return this.findById(offerId, userId);
  }

  public async deleteFavorite(userId: string, offerId: string): Promise<DocumentType<OfferEntity> | null> {
    const user = await this.userService.getById(userId);
    if (!user) {
      return null;
    }
    user.favoriteOffers.pull(new Types.ObjectId(offerId));
    await user.save();
    return this.findById(offerId, userId);
  }


  public async getAvgRating(offerId: string): Promise<number> {
    const data = await this.commentModel.aggregate([
      { $match: { offerId: new Types.ObjectId(offerId) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
        },
      },
      { $unset: '_id' },
    ]);
    if (data.length === 0) {
      return 0;
    }
    const averageRating = parseFloat(data[0].averageRating.toFixed(1));
    return averageRating;
  }

  public async checkOwner(offerId: string, userId: string): Promise<boolean> {
    const offer = await this.findById(offerId, userId);
    return (offer?.userId._id.equals(new Types.ObjectId(userId))) ?? false;
  }

}
