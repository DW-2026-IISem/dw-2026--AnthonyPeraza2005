import { PaginatedResult } from '../../../../../common/interfaces/pagination.interface';
import { Commission } from '../entities/commission.entity';
import { TransactionStatus } from '../../../../../common/enums/transaction-status.enum';

export const COMMISSION_REPOSITORY = 'COMMISSION_REPOSITORY';

export interface CommissionFindAllParams {
  page?: number;
  limit?: number;
  referenceId?: number;
  status?: TransactionStatus;
}

export interface ICommissionRepository {
  create(commission: Commission): Promise<Commission>;
  update(commission: Commission): Promise<Commission>;
  delete(id: number): Promise<void>;
  findById(id: number): Promise<Commission | null>;
  findAll(params: CommissionFindAllParams): Promise<PaginatedResult<Commission>>;
}
