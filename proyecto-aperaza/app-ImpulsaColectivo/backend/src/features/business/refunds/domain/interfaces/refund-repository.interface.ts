import { PaginatedResult } from '../../../../../common/interfaces/pagination.interface';
import { Refund } from '../entities/refund.entity';
import { TransactionStatus } from '../../../../../common/enums/transaction-status.enum';

export const REFUND_REPOSITORY = 'REFUND_REPOSITORY';

export interface RefundFindAllParams {
  page?: number;
  limit?: number;
  referenceId?: number;
  status?: TransactionStatus;
}

export interface IRefundRepository {
  create(refund: Refund): Promise<Refund>;
  update(refund: Refund): Promise<Refund>;
  delete(id: number): Promise<void>;
  findById(id: number): Promise<Refund | null>;
  findAll(params: RefundFindAllParams): Promise<PaginatedResult<Refund>>;
}
