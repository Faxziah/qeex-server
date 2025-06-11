import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  address: string;
}
