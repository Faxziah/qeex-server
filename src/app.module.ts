import { Module } from '@nestjs/common';
import { ContractsModule } from './contracts/contracts.module';
import { ContractTypesModule } from './contract-types/contract-types.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ContractsModule, UsersModule, ContractTypesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
