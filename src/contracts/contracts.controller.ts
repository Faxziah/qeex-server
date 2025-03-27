import { Controller, Body, Post } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { Contract } from './contract.entity';

@Controller('api/contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Post('create')
  async create(@Body() body: any): Promise<Contract> {
    const data = {
      walletAddress: body.walletAddress,
      contractAddress: body.contractAddress,
    };

    return this.contractsService.create(data);
  }
}
