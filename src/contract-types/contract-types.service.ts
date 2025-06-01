import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContractType } from './entities/contract-type.entity';
import { CreateContractTypeDto } from './dto/create-contract-type.dto';
import { UpdateContractTypeDto } from './dto/update-contract-type.dto';

@Injectable()
export class ContractTypesService {
  constructor(
    @Inject('CONTRACT_TYPES_REPOSITORY')
    private contractTypeRepository: Repository<ContractType>,
  ) {}

  async findAll(): Promise<ContractType[]> {
    return await this.contractTypeRepository.find();
  }

  async findOne(id: number): Promise<ContractType> {
    const contractType = await this.contractTypeRepository.findOneBy({ id });
    if (!contractType) {
      throw new NotFoundException(`Contract type with ID ${id} not found`);
    }
    return contractType;
  }

  async create(
    createContractTypeDto: CreateContractTypeDto,
  ): Promise<ContractType> {
    const existingType = await this.contractTypeRepository.findOneBy({
      name: createContractTypeDto.name,
    });
    if (existingType) {
      throw new InternalServerErrorException(
        `Contract type ${createContractTypeDto.name} already exists`,
      );
    }

    const contractType = this.contractTypeRepository.create(
      createContractTypeDto,
    );
    return await this.contractTypeRepository.save(contractType);
  }

  async update(
    id: number,
    updateContractTypeDto: UpdateContractTypeDto,
  ): Promise<ContractType> {
    const contractType = await this.findOne(id);

    const existingType = await this.contractTypeRepository.findOneBy({
      name: updateContractTypeDto.name,
    });
    if (existingType && existingType.id !== id) {
      throw new InternalServerErrorException(
        `Contract type ${updateContractTypeDto.name} already exists`,
      );
    }

    Object.assign(contractType, updateContractTypeDto);
    return await this.contractTypeRepository.save(contractType);
  }

  async remove(id: number): Promise<void> {
    const contractType = await this.findOne(id);
    await this.contractTypeRepository.remove(contractType);
  }
}
