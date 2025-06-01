import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsEnum,
  IsOptional,
  Matches,
} from 'class-validator';
import { ContractStatus } from '../../interface/IContract';

export class CreateContractDto {
  @IsNumber()
  @IsOptional()
  userId?: number;

  @IsNumber()
  @IsNotEmpty()
  contractTypeId: number;

  @IsNumber()
  @IsNotEmpty()
  chainId: number;

  @IsNumber()
  @IsNotEmpty()
  blockNumber: number;

  @IsEnum(ContractStatus)
  @IsNotEmpty()
  status: ContractStatus;

  @IsString()
  @IsNotEmpty()
  walletAddress: string;

  @IsString()
  @IsNotEmpty()
  contractAddress: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^0x[a-fA-F0-9]{64}$/, {
    message: 'Transaction hash must be a valid 32-byte hex string starting with 0x',
  })
  paymentTransactionHash: string;
}
