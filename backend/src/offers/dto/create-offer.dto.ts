import { IsBoolean, IsNumber, Min } from 'class-validator';

export class CreateOfferDto {
  @IsNumber()
  itemId: number;

  @IsNumber()
  @Min(1)
  amount: number;

  @IsBoolean()
  hidden: boolean;
}
