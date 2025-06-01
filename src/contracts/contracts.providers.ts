import { DataSource } from 'typeorm';
import { Contract } from './entities/contract.entity';

export const contractsProviders = [
  {
    provide: 'CONTRACT_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Contract),
    inject: ['DATA_SOURCE'],
  },
];
