import { DataSource } from 'typeorm';
import { Contract } from './contract.entity';
import { Repository } from 'typeorm';

export const contractsProviders = [
  {
    provide: 'CONTRACT_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Contract),
    inject: ['DATA_SOURCE'],
  },
];
