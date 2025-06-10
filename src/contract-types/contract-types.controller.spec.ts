import { Test, TestingModule } from '@nestjs/testing';
import { ContractTypesController } from './contract-types.controller';
import { ContractTypesService } from './contract-types.service';
import { CreateContractTypeDto } from './dto/create-contract-type.dto';
import { UpdateContractTypeDto } from './dto/update-contract-type.dto';
import { ContractType } from './entities/contract-type.entity';

describe('ContractTypesController', () => {
  let controller: ContractTypesController;
  let service: ContractTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContractTypesController],
      providers: [
        {
          provide: ContractTypesService,
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

    controller = module.get<ContractTypesController>(ContractTypesController);
    service = module.get<ContractTypesService>(ContractTypesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of contract types', async () => {
      const result: ContractType[] = [{ id: 1, name: 'ERC-20' }];
      (service.findAll as jest.Mock).mockResolvedValue(result);
      expect(await controller.findAll()).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a single contract type', async () => {
      const result: ContractType = { id: 1, name: 'ERC-20' };
      (service.findOne as jest.Mock).mockResolvedValue(result);
      expect(await controller.findOne('1')).toEqual(result);
    });
  });

  describe('create', () => {
    it('should create a contract type', async () => {
      const createDto: CreateContractTypeDto = { name: 'ERC-1155' };
      const result: ContractType = { id: 1, ...createDto };
      (service.create as jest.Mock).mockResolvedValue(result);
      expect(await controller.create(createDto)).toEqual(result);
    });
  });

  describe('update', () => {
    it('should update a contract type', async () => {
      const updateDto: UpdateContractTypeDto = { name: 'Updated-ERC-20' };
      const result: ContractType = { id: 1, name: 'Updated-ERC-20' };
      (service.update as jest.Mock).mockResolvedValue(result);
      expect(await controller.update('1', updateDto)).toEqual(result);
    });
  });

  describe('remove', () => {
    it('should remove a contract type', async () => {
      (service.remove as jest.Mock).mockResolvedValue(undefined);
      expect(await controller.remove('1')).toBeUndefined();
    });
  });
});
