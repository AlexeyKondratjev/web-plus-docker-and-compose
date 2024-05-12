import { IsArray, IsNumber, IsOptional, IsUrl, Length } from 'class-validator';

export class UpdateWishlistDto {
  @IsOptional()
  @Length(1, 250)
  name: string;

  /*   @IsOptional()
  @Length(0, 1500)
  description: string; */

  @IsOptional()
  @IsUrl()
  image: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  itemsId: number[];
}
