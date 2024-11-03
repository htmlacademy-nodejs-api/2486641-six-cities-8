import { UserType } from '../../const';
import { CreateOfferDto } from '../../dto/offer/create-offer.dto';
import CreateUserDto from '../../dto/user/create-user.dto';
import { NewOffer, UserRegister } from '../../types/types';

export const adaptSignupToServer =
  (user: UserRegister): CreateUserDto => ({
    email: user.email,
    password: user.password,
    isPro: (user.type === UserType.Pro),
    avatarUrl: '',
    name: user.name
  });

export const adaptPostOfferToServer = (offer: NewOffer): CreateOfferDto => ({
  title: offer.title,
  description: offer.description,
  cityName: offer.city.name,
  previewImage: offer.previewImage,
  images: offer.images,
  isPremium: offer.isPremium,
  isFavorite: false,
  rating: 0,
  type: offer.type,
  bedroomsCount: offer.bedrooms,
  guestsCount: offer.maxAdults,
  price: offer.price,
  goods: offer.goods,
  location: offer.location
});
