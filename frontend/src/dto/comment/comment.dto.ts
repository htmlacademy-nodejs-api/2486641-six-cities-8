import UserDto from '../user/user.dto';

export class CommentDto {
  id!: string;
  text!: string;
  postDate!: string;
  rating!: number;
  user!: UserDto;
}
