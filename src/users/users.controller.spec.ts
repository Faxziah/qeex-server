import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
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

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createDto: CreateUserDto = { address: '0x123', chain_id: 1 };
      const result: User = { id: 1, ...createDto, created_at: new Date(), contracts: [] };
      (service.create as jest.Mock).mockResolvedValue(result);
      expect(await controller.create(createDto)).toEqual(result);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result: User[] = [
        { id: 1, address: '0x123', chain_id: 1, created_at: new Date(), contracts: [] },
      ];
      (service.findAll as jest.Mock).mockResolvedValue(result);
      expect(await controller.findAll()).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const result: User = { id: 1, address: '0x123', chain_id: 1, created_at: new Date(), contracts: [] };
      (service.findOne as jest.Mock).mockResolvedValue(result);
      expect(await controller.findOne(1)).toEqual(result);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateDto: UpdateUserDto = { address: '0xabc' };
      const result: User = { id: 1, address: '0xabc', chain_id: 1, created_at: new Date(), contracts: [] };
      (service.update as jest.Mock).mockResolvedValue(result);
      expect(await controller.update(1, updateDto)).toEqual(result);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      (service.remove as jest.Mock).mockResolvedValue(undefined);
      expect(await controller.remove(1)).toBeUndefined();
    });
  });
});
