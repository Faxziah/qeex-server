import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateContractTypeDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;
} 