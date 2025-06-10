import {
  Inject,
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Contract } from './entities/contract.entity';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ContractsService {
  constructor(
    @Inject('CONTRACT_REPOSITORY')
    private contractsRepository: Repository<Contract>,
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  async create(createContractDto: CreateContractDto) {
    try {
      if (!createContractDto.paymentTransactionHash) {
        throw new BadRequestException('Transaction hash is required');
      }

      if (
        !createContractDto.paymentTransactionHash.match(/^0x[a-fA-F0-9]{64}$/)
      ) {
        throw new BadRequestException('Invalid transaction hash format');
      }

      let user = await this.userRepository.findOneBy({
        address: createContractDto.walletAddress,
        chain_id: createContractDto.chainId,
      });

      if (!user) {
        user = this.userRepository.create({
          address: createContractDto.walletAddress,
          chain_id: createContractDto.chainId,
          created_at: new Date(),
        });
        user = await this.userRepository.save(user);
      }

      const contract = this.contractsRepository.create({
        address: createContractDto.contractAddress,
        user_id: user.id,
        chain_id: createContractDto.chainId,
        block_number: createContractDto.blockNumber,
        status: createContractDto.status,
        created_at: new Date(),
        payment_transaction_hash: createContractDto.paymentTransactionHash,
        contract_type_id: createContractDto.contractTypeId,
      });

      return await this.contractsRepository.save(contract);
    } catch (e) {
      if (e instanceof BadRequestException) {
        throw e;
      }
      throw new InternalServerErrorException(
        `Error creating contract: ${e.message}`,
      );
    }
  }

  async findAll(walletAddress?: string, chainId?: string) {
    const queryBuilder = this.contractsRepository.createQueryBuilder('contract')
      .leftJoinAndSelect('contract.user', 'user')
      .leftJoinAndSelect('contract.contractType', 'contractType');

    if (walletAddress) {
      queryBuilder.andWhere('user.address = :walletAddress', { walletAddress });
    }

    if (chainId) {
      queryBuilder.andWhere('user.chain_id = :chainId', { chainId });
    }

    return await queryBuilder.getMany();
  }

  findOne(id: number) {
    return this.contractsRepository.findOne({
      where: { id },
      relations: ['user', 'contractType'],
    });
  }

  async update(id: number, updateContractDto: UpdateContractDto) {
    await this.contractsRepository.update(id, updateContractDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const contract = await this.findOne(id);
    return this.contractsRepository.remove(contract);
  }
}
