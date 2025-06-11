import { Test, TestingModule } from '@nestjs/testing';
import { ContractsService } from './contracts.service';
import { Contract } from './entities/contract.entity';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ContractStatus } from './enums/contract-status.enum';

describe('ContractsService', () => {
  let service: ContractsService;
  let contractsRepository: Repository<Contract>;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContractsService,
        {
          provide: 'CONTRACT_REPOSITORY',
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getMany: jest.fn().mockResolvedValue([]),
            })),
          },
        },
        {
          provide: 'USER_REPOSITORY',
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ContractsService>(ContractsService);
    contractsRepository = module.get<Repository<Contract>>('CONTRACT_REPOSITORY');
    userRepository = module.get<Repository<User>>('USER_REPOSITORY');

    (contractsRepository.createQueryBuilder as jest.Mock).mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createContractDto = {
      paymentTransactionHash: '0x1234567890123456789012345678901234567890123456789012345678901234',
      walletAddress: '0xabc',
      chainId: 1,
      contractAddress: '0xdef',
      blockNumber: 123,
      status: ContractStatus.DEPLOYED,
      contractTypeId: 1,
    };

    it('should create a new contract with existing user', async () => {
      const existingUser: User = { id: 1, address: '0xabc', created_at: new Date(), contracts: [] };
      const createdContract: Contract = { id: 1, user_id: 1, address: '0xdef', chain_id: 1, block_number: 123, status: ContractStatus.DEPLOYED, created_at: new Date(), payment_transaction_hash: '0x1234567890123456789012345678901234567890123456789012345678901234', contract_type_id: 1, user: existingUser, contractType: null };

      (userRepository.findOneBy as jest.Mock).mockResolvedValue(existingUser);
      (contractsRepository.create as jest.Mock).mockReturnValue(createdContract);
      (contractsRepository.save as jest.Mock).mockResolvedValue(createdContract);

      expect(await service.create(createContractDto as any)).toEqual(createdContract);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ address: createContractDto.walletAddress });
      expect(userRepository.create).not.toHaveBeenCalled();
      expect(userRepository.save).not.toHaveBeenCalled();
      expect(contractsRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        address: createContractDto.contractAddress,
        user_id: existingUser.id,
      }));
      expect(contractsRepository.save).toHaveBeenCalledWith(createdContract);
    });

    it('should create a new contract and a new user', async () => {
      const newUser: User = { id: 1, address: '0xabc', created_at: new Date(), contracts: [] };
      const createdContract: Contract = { id: 1, user_id: 1, address: '0xdef', chain_id: 1, block_number: 123, status: ContractStatus.DEPLOYED, created_at: new Date(), payment_transaction_hash: '0x1234567890123456789012345678901234567890123456789012345678901234', contract_type_id: 1, user: newUser, contractType: null };

      (userRepository.findOneBy as jest.Mock).mockResolvedValue(null);
      (userRepository.create as jest.Mock).mockReturnValue(newUser);
      (userRepository.save as jest.Mock).mockResolvedValue(newUser);
      (contractsRepository.create as jest.Mock).mockReturnValue(createdContract);
      (contractsRepository.save as jest.Mock).mockResolvedValue(createdContract);

      expect(await service.create(createContractDto as any)).toEqual(createdContract);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ address: createContractDto.walletAddress });
      expect(userRepository.create).toHaveBeenCalledWith(expect.objectContaining({ address: createContractDto.walletAddress }));
      expect(userRepository.save).toHaveBeenCalledWith(newUser);
      expect(contractsRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        address: createContractDto.contractAddress,
        user_id: newUser.id,
      }));
      expect(contractsRepository.save).toHaveBeenCalledWith(createdContract);
    });

    it('should throw BadRequestException if paymentTransactionHash is missing', async () => {
      const dto = { ...createContractDto, paymentTransactionHash: undefined };
      await expect(service.create(dto as any)).rejects.toThrow(BadRequestException);
      await expect(service.create(dto as any)).rejects.toThrow('Transaction hash is required');
    });

    it('should throw BadRequestException if paymentTransactionHash is invalid', async () => {
      const dto = { ...createContractDto, paymentTransactionHash: 'invalid_hash' };
      await expect(service.create(dto as any)).rejects.toThrow(BadRequestException);
      await expect(service.create(dto as any)).rejects.toThrow('Invalid transaction hash format');
    });

    it('should throw InternalServerErrorException for other errors during creation', async () => {
      (userRepository.findOneBy as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(service.create(createContractDto as any)).rejects.toThrow(InternalServerErrorException);
      await expect(service.create(createContractDto as any)).rejects.toThrow('Error creating contract: Database error');
    });
  });

  describe('findAll', () => {
    const mockQueryBuilder = {
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
    };

    beforeEach(() => {
      (contractsRepository.createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);
    });

    it('should return all contracts if no filters are provided', async () => {
      const mockContracts: Contract[] = [
        { id: 1, user_id: 1, address: '0x1', chain_id: 1, block_number: 1, status: ContractStatus.DEPLOYED, created_at: new Date(), payment_transaction_hash: '0x1', contract_type_id: 1, user: null, contractType: null },
        { id: 2, user_id: 2, address: '0x2', chain_id: 1, block_number: 2, status: ContractStatus.DEPLOYED, created_at: new Date(), payment_transaction_hash: '0x2', contract_type_id: 1, user: null, contractType: null },
      ];
      mockQueryBuilder.getMany.mockResolvedValue(mockContracts);

      expect(await service.findAll()).toEqual(mockContracts);
      expect(contractsRepository.createQueryBuilder).toHaveBeenCalledWith('contract');
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('contract.user', 'user');
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('contract.contractType', 'contractType');
      expect(mockQueryBuilder.andWhere).not.toHaveBeenCalled();
    });

    it('should return contracts filtered by walletAddress', async () => {
      const mockContracts: Contract[] = [{ id: 1, user_id: 1, address: '0x1', chain_id: 1, block_number: 1, status: ContractStatus.DEPLOYED, created_at: new Date(), payment_transaction_hash: '0x1', contract_type_id: 1, user: null, contractType: null }];
      mockQueryBuilder.getMany.mockResolvedValue(mockContracts);

      const walletAddress = '0xabc';
      expect(await service.findAll(walletAddress)).toEqual(mockContracts);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('user.address = :walletAddress', { walletAddress });
    });

    it('should return contracts filtered by chainId', async () => {
      const mockContracts: Contract[] = [{ id: 1, user_id: 1, address: '0x1', chain_id: 1, block_number: 1, status: ContractStatus.DEPLOYED, created_at: new Date(), payment_transaction_hash: '0x1', contract_type_id: 1, user: null, contractType: null }];
      mockQueryBuilder.getMany.mockResolvedValue(mockContracts);

      const chainId = '1';
      expect(await service.findAll(undefined, chainId)).toEqual(mockContracts);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('contract.chain_id = :chainId', { chainId });
    });

    it('should return contracts filtered by both walletAddress and chainId', async () => {
      const mockContracts: Contract[] = [{ id: 1, user_id: 1, address: '0x1', chain_id: 1, block_number: 1, status: ContractStatus.DEPLOYED, created_at: new Date(), payment_transaction_hash: '0x1', contract_type_id: 1, user: null, contractType: null }];
      mockQueryBuilder.getMany.mockResolvedValue(mockContracts);

      const walletAddress = '0xabc';
      const chainId = '1';
      expect(await service.findAll(walletAddress, chainId)).toEqual(mockContracts);
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('user.address = :walletAddress', { walletAddress });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('contract.chain_id = :chainId', { chainId });
    });
  });

  describe('findOne', () => {
    it('should return a single contract', async () => {
      const result: Contract = { id: 1, user_id: 1, address: '0x1', chain_id: 1, block_number: 1, status: ContractStatus.DEPLOYED, created_at: new Date(), payment_transaction_hash: '0x1', contract_type_id: 1, user: null, contractType: null };
      (contractsRepository.findOne as jest.Mock).mockResolvedValue(result);

      expect(await service.findOne(1)).toEqual(result);
      expect(contractsRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['user', 'contractType'] });
    });

    it('should return null if contract is not found', async () => {
      (contractsRepository.findOne as jest.Mock).mockResolvedValue(null);

      expect(await service.findOne(1)).toBeNull();
      expect(contractsRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['user', 'contractType'] });
    });
  });

  describe('update', () => {
    const updateContractDto = { status: ContractStatus.DEPLOYED };
    const existingContract: Contract = { id: 1, user_id: 1, address: '0x1', chain_id: 1, block_number: 1, status: ContractStatus.DEPLOYED, created_at: new Date(), payment_transaction_hash: '0x1', contract_type_id: 1, user: null, contractType: null };
    const updatedContract: Contract = { ...existingContract, ...updateContractDto };

    it('should update an existing contract', async () => {
      (contractsRepository.update as jest.Mock).mockResolvedValue(undefined);
      (contractsRepository.findOne as jest.Mock).mockResolvedValue(updatedContract);

      expect(await service.update(1, updateContractDto as any)).toEqual(updatedContract);
      expect(contractsRepository.update).toHaveBeenCalledWith(1, updateContractDto);
      expect(contractsRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['user', 'contractType'] });
    });
  });

  describe('remove', () => {
    const contractToRemove: Contract = { id: 1, user_id: 1, address: '0x1', chain_id: 1, block_number: 1, status: ContractStatus.DEPLOYED, created_at: new Date(), payment_transaction_hash: '0x1', contract_type_id: 1, user: null, contractType: null };

    it('should remove a contract', async () => {
      (contractsRepository.findOne as jest.Mock).mockResolvedValue(contractToRemove);
      (contractsRepository.remove as jest.Mock).mockResolvedValue(undefined);

      await expect(service.remove(1)).resolves.toBeUndefined();
      expect(contractsRepository.remove).toHaveBeenCalledWith(contractToRemove);
    });

    it('should throw NotFoundException if contract to remove is not found', async () => {
      (contractsRepository.findOne as jest.Mock).mockImplementation(() => {
        throw new NotFoundException('Contract not found');
      });

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
      expect(contractsRepository.remove).not.toHaveBeenCalled();
    });
  });
});
