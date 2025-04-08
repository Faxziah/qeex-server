import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Contract } from './contract.entity';
import { User } from '../users/user.entity';
import { ContractStatus } from '../interface/IContract';

@Injectable()
export class ContractsService {
  constructor(
    @Inject('CONTRACT_REPOSITORY')
    private contractRepository: Repository<Contract>,

    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  async index(data: { walletAddress: string }): Promise<Contract[]> {
    const user = await this.userRepository.findOneBy({
      address: data.walletAddress,
    });

    if (!user) {
      throw new InternalServerErrorException(`Пользователь не найден`);
    }

    return await this.contractRepository.find({
      where: { user_id: user.id },
      relations: ['user'],
    });
  }

  async create(data: {
    walletAddress: string;
    contractAddress: string;
    chainId: number;
    blockNumber: number;
    status: ContractStatus;
    payTxHash: string;
  }): Promise<Contract> {
    try {
      let user = await this.userRepository.findOneBy({
        address: data.walletAddress,
        chain_id: data.chainId,
      });

      if (!user) {
        user = this.userRepository.create({
          address: data.walletAddress,
          chain_id: data.chainId,
          created_at: Date(),
        });
        user = await this.userRepository.save(user);
      }

      const contract = this.contractRepository.create({
        address: data.contractAddress,
        user_id: user.id,
        chain_id: data.chainId,
        block_number: data.blockNumber,
        status: data.status,
        created_at: Date(),
        pay_tx_hash: data.payTxHash,
      });

      return await this.contractRepository.save(contract);
    } catch (e) {
      throw new InternalServerErrorException(
        `Error creating contract: ${e.message}`,
      );
    }
  }
}
