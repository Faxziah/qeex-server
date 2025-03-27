import { Controller, Body, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('api/users')
export class UsersController {
  constructor(private readonly contractsService: UsersService) {}

  @Post('create')
  async create(@Body() body: any): Promise<User> {
    return this.contractsService.create(body);
  }
}
