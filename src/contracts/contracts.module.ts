import { Module } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { ContractsController } from './contracts.controller';
import { contractsProviders } from './contracts.providers';
import { DatabaseModule } from '../database/database.module';
import { UsersModule } from '../users/users.module';
import { usersProviders } from '../users/users.providers';
import { UsersService } from '../users/users.service';

@Module({
  imports: [DatabaseModule, UsersModule],
  controllers: [ContractsController],
  providers: [
    ...contractsProviders,
    ContractsService,
    ...usersProviders,
    UsersService,
  ],
})
export class ContractsModule {}
