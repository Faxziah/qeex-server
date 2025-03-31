import { Controller, Body, Post, Get, Query } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { Contract } from './contract.entity';

@Controller('api/contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Get('/')
  async index(
    @Query('walletAddress') walletAddress: string,
  ): Promise<Contract[]> {
    const data = { walletAddress };

    return this.contractsService.index(data);
  }

  @Post('create')
  async create(@Body() body: any): Promise<Contract> {
    const data = {
      walletAddress: body.walletAddress,
      contractAddress: body.contractAddress,
      chainId: body.chainId,
      blockNumber: body.blockNumber,
      status: body.status,
    };

    return this.contractsService.create(data);
  }
}
