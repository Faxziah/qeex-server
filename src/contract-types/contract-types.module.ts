import { Module } from '@nestjs/common';
import { ContractTypesService } from './contract-types.service';
import { DatabaseModule } from '../database/database.module';
import { contractTypesProviders } from './contracts.providers';

@Module({
  imports: [DatabaseModule],
  providers: [...contractTypesProviders, ContractTypesService],
  exports: [ContractTypesService],
})
export class ContractTypesModule {}
