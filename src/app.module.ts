import { Module } from '@nestjs/common';
import { ContractsModule } from './contracts/contracts.module';
import { ContractTypesModule } from './contract-types/contract-types.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ContractsModule, UsersModule, ContractTypesModule],
})
export class AppModule {}
