import { MinLength } from 'class-validator';

export class FindUsersDto {
  @MinLength(2)
  query: string;
}
