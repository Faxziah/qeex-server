import { Module } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { ContractsController } from './contracts.controller';
import { contractsProviders } from './contracts.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ContractsController],
  providers: [...contractsProviders, ContractsService],
})
export class ContractsModule {}
