import { IsNotEmpty, IsNumber, IsUrl, Length } from 'class-validator';

export class CreateWishDto {
  @Length(1, 250)
  name: string;

  @IsUrl()
  link: string;

  @IsUrl()
  image: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @Length(1, 1024)
  description: string;
}
