import { DataSource } from 'typeorm';
import { ContractType } from './entities/contract-type.entity';

export const contractTypesProviders = [
  {
    provide: 'CONTRACT_TYPES_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ContractType),
    inject: ['DATA_SOURCE'],
  },
];
