import { UserType } from '../../const';
import UserWithTokenDto from '../../dto/user/user-with-token.dto';
import UserDto from '../../dto/user/user.dto';
import { User } from '../../types/types';

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
