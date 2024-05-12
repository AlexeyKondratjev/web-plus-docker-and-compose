import { IsNumber, IsOptional, IsUrl, Length } from 'class-validator';

export class UpdateWishDto {
  @IsOptional()
  @Length(1, 250)
  name: string;

  @IsOptional()
  @IsUrl()
  link: string;

  @IsOptional()
  @IsUrl()
  image: string;

  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @Length(1, 1024)
  description: string;

  @IsOptional()
  @IsNumber()
  raised: number;
}
