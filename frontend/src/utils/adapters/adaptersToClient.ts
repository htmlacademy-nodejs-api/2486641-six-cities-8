import { UserType } from '../../const';
import { OfferDto } from '../../dto/offer/offer.dto';
import UserWithTokenDto from '../../dto/user/user-with-token.dto';
import UserDto from '../../dto/user/user.dto';
import { Offer, User } from '../../types/types';

export const adaptUserToClient =
  (user: UserDto): User => ({
    name: user.name,
    avatarUrl: user.avatarUrl,
    email: user.email,
    type: user.isPro ? UserType.Pro : UserType.Regular
  });

export const adaptLoginToClient =
  (user: UserWithTokenDto): User & { token: string } => ({
    name: user.name,
    avatarUrl: user.avatarUrl,
    email: user.email,
    type: user.isPro ? UserType.Pro : UserType.Regular,
    token: user.token,
  });

export const adaptOfferToClient = (offer: OfferDto): Offer => ({
  id: offer.id,
  price: offer.price,
  rating: offer.rating,
  title: offer.title,
  isPremium: offer.isPremium,
  isFavorite: offer.isFavorite,
  city: {
    name: '',
    location: {
      latitude: 0,
      longitude: 0
    }
  },
  location: offer.location,
  previewImage: offer.previewImage,
  type: offer.type,
  bedrooms: offer.bedroomsCount,
  description: offer.description,
  goods: offer.goods,
  host: adaptUserToClient(offer.user),
  images: offer.images,
  maxAdults: offer.guestsCount
});
