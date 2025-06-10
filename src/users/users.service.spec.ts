import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'USER_REPOSITORY',
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<User>>('USER_REPOSITORY');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto = { address: '0x123', chain_id: 1 };
      const createdUser = { id: 1, ...createUserDto, created_at: new Date() };
      (usersRepository.create as jest.Mock).mockReturnValue(createdUser);
      (usersRepository.save as jest.Mock).mockResolvedValue(createdUser);

      expect(await service.create(createUserDto as any)).toEqual(createdUser);
      expect(usersRepository.create).toHaveBeenCalledWith(expect.objectContaining(createUserDto));
      expect(usersRepository.save).toHaveBeenCalledWith(createdUser);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result: User[] = [
        { id: 1, address: '0x123', chain_id: 1, created_at: new Date(), contracts: [] },
        { id: 2, address: '0x456', chain_id: 1, created_at: new Date(), contracts: [] },
      ];
      (usersRepository.find as jest.Mock).mockResolvedValue(result);

      expect(await service.findAll()).toEqual(result);
      expect(usersRepository.find).toHaveBeenCalledWith({ relations: ['contracts'] });
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const result: User = { id: 1, address: '0x123', chain_id: 1, created_at: new Date(), contracts: [] };
      (usersRepository.findOne as jest.Mock).mockResolvedValue(result);

      expect(await service.findOne(1)).toEqual(result);
      expect(usersRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['contracts'] });
    });

    it('should throw NotFoundException if user is not found', async () => {
      (usersRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
      expect(usersRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['contracts'] });
    });
  });

  describe('update', () => {
    it('should update an existing user', async () => {
      const existingUser: User = { id: 1, address: '0x123', chain_id: 1, created_at: new Date(), contracts: [] };
      const updatedUserDto = { address: '0xabc' };
      const updatedExistingUser = { ...existingUser, ...updatedUserDto };

      (usersRepository.update as jest.Mock).mockResolvedValue(undefined);
      (usersRepository.findOne as jest.Mock).mockResolvedValue(updatedExistingUser);

      expect(await service.update(1, updatedUserDto as any)).toEqual(updatedExistingUser);
      expect(usersRepository.update).toHaveBeenCalledWith(1, updatedUserDto);
    });

    it('should throw NotFoundException if user to update is not found', async () => {
      (usersRepository.findOne as jest.Mock).mockResolvedValue(null);
      (usersRepository.update as jest.Mock).mockResolvedValue({ affected: 0 });

      await expect(service.update(1, { address: '0xabc' } as any)).rejects.toThrow(NotFoundException);
      expect(usersRepository.update).toHaveBeenCalledWith(1, { address: '0xabc' });
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const userToRemove: User = { id: 1, address: '0x123', chain_id: 1, created_at: new Date(), contracts: [] };
      (usersRepository.findOne as jest.Mock).mockResolvedValue(userToRemove);
      (usersRepository.remove as jest.Mock).mockResolvedValue(undefined);

      await expect(service.remove(1)).resolves.toBeUndefined();
      expect(usersRepository.remove).toHaveBeenCalledWith(userToRemove);
    });

    it('should throw NotFoundException if user to remove is not found', async () => {
      (usersRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
      expect(usersRepository.remove).not.toHaveBeenCalled();
    });
  });
});
