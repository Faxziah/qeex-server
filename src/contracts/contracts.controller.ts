import { Controller, Body, Post, Get } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { Contract } from './contract.entity';

@Controller('api/contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Get('/')
  async index(@Body() body: any): Promise<Contract[]> {
    const data = {
      walletAddress: body.walletAddress,
    };

    return this.contractsService.index(data);
  }

  @Post('create')
  async create(@Body() body: any): Promise<Contract> {
    const data = {
      walletAddress: body.walletAddress,
      contractAddress: body.contractAddress,
    };

    return this.contractsService.create(data);
  }
}
