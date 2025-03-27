import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContractsModule } from './contracts/contracts.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ContractsModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
