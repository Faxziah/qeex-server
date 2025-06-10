import { Test, TestingModule } from '@nestjs/testing';
import { ContractsController } from './contracts.controller';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { Contract } from './entities/contract.entity';
import { ContractStatus } from './enums/contract-status.enum';

describe('ContractsController', () => {
  let controller: ContractsController;
  let service: ContractsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContractsController],
      providers: [
        {
          provide: ContractsService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ContractsController>(ContractsController);
    service = module.get<ContractsService>(ContractsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a contract', async () => {
      const createDto: CreateContractDto = {
        paymentTransactionHash: '0x1234567890123456789012345678901234567890123456789012345678901234',
        walletAddress: '0xabc',
        chainId: 1,
        contractAddress: '0xdef',
        blockNumber: 123,
        status: ContractStatus.DEPLOYED,
        contractTypeId: 1,
      };
      const result: Contract = { id: 1, user_id: 1, address: '0xdef', chain_id: 1, block_number: 123, status: ContractStatus.DEPLOYED, created_at: new Date(), payment_transaction_hash: '0x1234567890123456789012345678901234567890123456789012345678901234', contract_type_id: 1, user: null, contractType: null };
      (service.create as jest.Mock).mockResolvedValue(result);
      expect(await controller.create(createDto)).toEqual(result);
    });
  });

  describe('findAll', () => {
    it('should return an array of contracts', async () => {
      const result: Contract[] = [
        { id: 1, user_id: 1, address: '0x1', chain_id: 1, block_number: 1, status: ContractStatus.DEPLOYED, created_at: new Date(), payment_transaction_hash: '0x1', contract_type_id: 1, user: null, contractType: null },
        { id: 2, user_id: 2, address: '0x2', chain_id: 1, block_number: 2, status: ContractStatus.DEPLOYED, created_at: new Date(), payment_transaction_hash: '0x2', contract_type_id: 1, user: null, contractType: null },
      ];
      (service.findAll as jest.Mock).mockResolvedValue(result);
      expect(await controller.findAll('0xabc', '1')).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a single contract', async () => {
      const result: Contract = { id: 1, user_id: 1, address: '0x1', chain_id: 1, block_number: 1, status: ContractStatus.DEPLOYED, created_at: new Date(), payment_transaction_hash: '0x1', contract_type_id: 1, user: null, contractType: null };
      (service.findOne as jest.Mock).mockResolvedValue(result);
      expect(await controller.findOne('1')).toEqual(result);
    });
  });

  describe('update', () => {
    it('should update a contract', async () => {
      const updateDto: UpdateContractDto = { status: ContractStatus.PAID };
      const result: Contract = { id: 1, user_id: 1, address: '0x1', chain_id: 1, block_number: 1, status: ContractStatus.PAID, created_at: new Date(), payment_transaction_hash: '0x1', contract_type_id: 1, user: null, contractType: null };
      (service.update as jest.Mock).mockResolvedValue(result);
      expect(await controller.update('1', updateDto)).toEqual(result);
    });
  });

  describe('remove', () => {
    it('should remove a contract', async () => {
      (service.remove as jest.Mock).mockResolvedValue(undefined);
      expect(await controller.remove('1')).toBeUndefined();
    });
  });
});
