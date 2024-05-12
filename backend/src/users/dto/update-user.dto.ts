import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  Length,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @Length(2, 30)
  username: string;

  @IsOptional()
  @Length(2, 200)
  about: string;

  @IsOptional()
  @IsUrl()
  avatar: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsNotEmpty()
  password: string;
}
