import { Module } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { ContractsController } from './contracts.controller';
import { ContractTypesModule } from '../contract-types/contract-types.module';
import { DatabaseModule } from '../database/database.module';
import { contractsProviders } from './contracts.providers';
import { UsersModule } from '../users/users.module';
import { usersProviders } from '../users/users.providers';
import { UsersService } from '../users/users.service';

@Module({
  imports: [ContractTypesModule, UsersModule, DatabaseModule],
  controllers: [ContractsController],
  providers: [
    ...contractsProviders,
    ContractsService,
    ...usersProviders,
    UsersService,
  ],
  exports: [ContractsService],
})
export class ContractsModule {}
