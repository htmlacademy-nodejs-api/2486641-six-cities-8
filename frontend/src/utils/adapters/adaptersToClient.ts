import { UserType } from '../../const';
import { CommentDto } from '../../dto/comment/comment.dto';
import { OfferDto } from '../../dto/offer/offer.dto';
import UserWithTokenDto from '../../dto/user/user-with-token.dto';
import UserDto from '../../dto/user/user.dto';
import { Comment, Offer, User } from '../../types/types';

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
  city: offer.city,
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

export const adaptOffersToClient =
  (offers: OfferDto[]): Offer[] =>
    offers
      .map((offer: OfferDto) => adaptOfferToClient(offer));

export const adaptCommentToClient = (comment: CommentDto): Comment => ({
  id: comment.id,
  comment: comment.text,
  date: comment.postDate,
  rating: comment.rating,
  user: adaptUserToClient(comment.user)
});

export const adaptCommentsToClient = (comments: CommentDto[]): Comment[] =>
  comments
    .map((comment: CommentDto) => adaptCommentToClient(comment));

