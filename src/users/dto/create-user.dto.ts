import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsNumber()
  chain_id: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  address: string;
}
