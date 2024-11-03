import { UserType } from '../../const';
import CreateUserDto from '../../dto/user/create-user.dto';
import { UserRegister } from '../../types/types';

export const adaptSignupToServer =
  (user: UserRegister): CreateUserDto => ({
    email: user.email,
    password: user.password,
    isPro: (user.type === UserType.Pro),
    avatarUrl: '',
    name: user.name
  });
