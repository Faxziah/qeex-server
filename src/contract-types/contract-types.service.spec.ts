import { Test, TestingModule } from '@nestjs/testing';
import { ContractTypesService } from './contract-types.service';
import { ContractType } from './entities/contract-type.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';

describe('ContractTypesService', () => {
  let service: ContractTypesService;
  let contractTypeRepository: Repository<ContractType>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContractTypesService,
        {
          provide: 'CONTRACT_TYPES_REPOSITORY',
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ContractTypesService>(ContractTypesService);
    contractTypeRepository = module.get<Repository<ContractType>>('CONTRACT_TYPES_REPOSITORY');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of contract types', async () => {
      const result: ContractType[] = [{ id: 1, name: 'ERC-20' }, { id: 2, name: 'ERC-721' }];
      (contractTypeRepository.find as jest.Mock).mockResolvedValue(result);

      expect(await service.findAll()).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a single contract type', async () => {
      const result: ContractType = { id: 1, name: 'ERC-20' };
      (contractTypeRepository.findOneBy as jest.Mock).mockResolvedValue(result);

      expect(await service.findOne(1)).toEqual(result);
    });

    it('should throw NotFoundException if contract type is not found', async () => {
      (contractTypeRepository.findOneBy as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new contract type', async () => {
      const newContractType = { name: 'ERC-1155' };
      const createdContractType = { id: 3, ...newContractType };
      (contractTypeRepository.findOneBy as jest.Mock).mockResolvedValue(null);
      (contractTypeRepository.create as jest.Mock).mockReturnValue(newContractType);
      (contractTypeRepository.save as jest.Mock).mockResolvedValue(createdContractType);

      expect(await service.create(newContractType as any)).toEqual(createdContractType);
    });

    it('should throw InternalServerErrorException if contract type already exists', async () => {
      const existingContractType = { id: 1, name: 'ERC-20' };
      (contractTypeRepository.findOneBy as jest.Mock).mockResolvedValue(existingContractType);

      await expect(service.create(existingContractType as any)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('update', () => {
    it('should update an existing contract type', async () => {
      const existingContractType = { id: 1, name: 'ERC-20' };
      const updatedContractType = { id: 1, name: 'Updated-ERC-20' };
      (contractTypeRepository.findOneBy as jest.Mock)
        .mockResolvedValueOnce(existingContractType)
        .mockResolvedValueOnce(null);

      (contractTypeRepository.save as jest.Mock).mockResolvedValue(updatedContractType);

      expect(await service.update(1, { name: 'Updated-ERC-20' } as any)).toEqual(updatedContractType);
    });

    it('should throw NotFoundException if contract type to update is not found', async () => {
      (contractTypeRepository.findOneBy as jest.Mock).mockResolvedValue(null);

      await expect(service.update(1, { name: 'Updated-ERC-20' } as any)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException if updated name already exists for another type', async () => {
      const existingContractType = { id: 1, name: 'ERC-20' };
      const conflictingContractType = { id: 2, name: 'Conflicting-ERC-20' };
      (contractTypeRepository.findOneBy as jest.Mock)
        .mockResolvedValueOnce(existingContractType)
        .mockResolvedValueOnce(conflictingContractType);

      await expect(service.update(1, { name: 'Conflicting-ERC-20' } as any)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('remove', () => {
    it('should remove a contract type', async () => {
      const contractTypeToRemove = { id: 1, name: 'ERC-20' };
      (contractTypeRepository.findOneBy as jest.Mock).mockResolvedValue(contractTypeToRemove);
      (contractTypeRepository.remove as jest.Mock).mockResolvedValue(undefined);

      await expect(service.remove(1)).resolves.toBeUndefined();
      expect(contractTypeRepository.remove).toHaveBeenCalledWith(contractTypeToRemove);
    });

    it('should throw NotFoundException if contract type to remove is not found', async () => {
      (contractTypeRepository.findOneBy as jest.Mock).mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
