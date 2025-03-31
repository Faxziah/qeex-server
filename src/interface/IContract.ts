import { IUser } from './IUser';

export interface IContract {
  id: number;
  user_id: number;
  chain_id: number;
  block_number: number;
  status: ContractStatus;
  address: string;
  created_at: string;
  user: IUser;
}

export enum ContractStatus {
  NEW = 'new',
  PAID = 'paid',
  WAIT_DEPLOYMENT = 'wait_deployment',
  DEPLOYED = 'deployed',
}
