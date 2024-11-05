import { DocumentType } from '@typegoose/typegoose';

import { CreateOfferDto } from './dto/create-offer.dto.js';
import { OfferEntity } from './offer.entity.js';
import { DocumentExists } from '../../types/index.js';

export interface OfferService extends DocumentExists {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findById(offerId: string, userId: string): Promise<DocumentType<OfferEntity> | null>;
  findAll(userId?: string, count?: number): Promise<DocumentType<OfferEntity>[]>;
  update(offerId: string, dto: CreateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  delete(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  findPremiumByCity(cityName: string): Promise<DocumentType<OfferEntity>[]>;
  findFavorite(userId: string): Promise<DocumentType<OfferEntity>[]>;
  incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  addFavorite(userId: string, offerId: string): Promise<DocumentType<OfferEntity> | null>;
  deleteFavorite(userId: string, offerId: string): Promise<DocumentType<OfferEntity> | null>;
  getAvgRating(offerId: string): Promise<number>;
  checkOwner(offerId: string, userId: string): Promise<boolean>;
}
