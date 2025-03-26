import { Controller, Body, Post } from '@nestjs/common';
import { ContractsService } from './contracts.service';

@Controller('api/contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Post('create')
  async create(@Body() body: any) {
    return this.contractsService.create(body);
  }
}
