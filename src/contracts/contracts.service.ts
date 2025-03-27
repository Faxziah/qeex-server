import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Contract } from './contract.entity';
import { User } from '../users/user.entity';

@Injectable()
export class ContractsService {
  constructor(
    @Inject('CONTRACT_REPOSITORY')
    private contractRepository: Repository<Contract>,

    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  async index(data: { walletAddress: string }): Promise<Contract[]> {
    return this.contractRepository.find({
      where: { address: data.walletAddress },
    });
  }

  async create(data: {
    walletAddress: string;
    contractAddress: string;
  }): Promise<Contract> {
    try {
      let user = await this.userRepository.findOne({
        where: { address: data.walletAddress },
      });

      if (!user) {
        user = this.userRepository.create({ address: data.walletAddress });
        user = await this.userRepository.save(user);
      }

      const contract = this.contractRepository.create({
        address: data.contractAddress,
        user_id: user.id,
      });

      return await this.contractRepository.save(contract);
    } catch (e) {
      throw new InternalServerErrorException(
        `Error creating contract: ${e.message}`,
      );
    }
  }
}
