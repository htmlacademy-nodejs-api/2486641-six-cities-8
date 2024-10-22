import { DocumentType } from '@typegoose/typegoose';

import { CreateOfferDto } from './dto/create-offer.dto.js';
import { OfferEntity } from './offer.entity.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';

export interface OfferService {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  findAll(): Promise<DocumentType<OfferEntity>[]>;
  update(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  delete(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  findPremiumByCity(cityName: string): Promise<DocumentType<OfferEntity>[]>;
  findFavorite(userId: string): Promise<DocumentType<OfferEntity>[]>;
  changeFavorite(offerId: string): Promise<DocumentType<OfferEntity> | null>;
}
