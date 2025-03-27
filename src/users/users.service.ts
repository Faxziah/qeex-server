import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  async create(body: any): Promise<User> {
    const newContract: User[] = this.userRepository.create(body);

    try {
      const result: User[] = await this.userRepository.save(newContract);
      return result[0];
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
