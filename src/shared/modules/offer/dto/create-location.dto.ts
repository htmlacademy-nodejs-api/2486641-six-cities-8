import { IsLatitude, IsLongitude } from 'class-validator';

export class CreateLocationDto {
  @IsLatitude({message: 'It is not a latitude'})
  public latitude!: number;

  @IsLongitude({message: 'It is not a longitude'})
  public longitude!: number;
}
