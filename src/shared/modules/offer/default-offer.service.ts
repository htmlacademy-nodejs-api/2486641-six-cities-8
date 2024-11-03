import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';

import { OfferService } from './offer-service.interface.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';

const DEFAULT_OFFER_COUNT = 60;
@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel
      .exists({_id: documentId})) !== null;
  }

  public async incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    console.log('offerId=', offerId);
    return this.offerModel
      .findByIdAndUpdate(offerId, {'$inc': {
        commentsCount: 1,
      }}).exec();
  }

  public async update(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
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
    return await this.offerModel.find({isFavorite: true, userId: userId});
  }

  public async changeFavorite(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    const offer = await this.findById(offerId);
    return this.offerModel.findByIdAndUpdate(offerId, {isFavorite: !offer?.isFavorite});
  }

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);

    return result;
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return await this.offerModel.findById(offerId).populate(['userId']).exec();
  }

  public async findAll(count?: number): Promise<DocumentType<OfferEntity>[]> {
    const limit = count ?? DEFAULT_OFFER_COUNT;
    return this.offerModel
      .find()
      .sort({ postDate: 'desc' })
      .limit(limit)
      .populate(['userId'])
      .exec();
  }
}
