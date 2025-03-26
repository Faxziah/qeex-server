import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Contract } from './contract.entity';

@Injectable()
export class ContractsService {
  constructor(
    @Inject('CONTRACT_REPOSITORY')
    private contractRepository: Repository<Contract>,
  ) {}

  async create(body: any): Promise<Contract[]> {
    const newContract = this.contractRepository.create(body);
    return await this.contractRepository.save(newContract);
  }
}
