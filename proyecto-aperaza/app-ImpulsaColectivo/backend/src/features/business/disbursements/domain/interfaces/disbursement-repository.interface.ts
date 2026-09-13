import { PaginatedResult } from '../../../../../common/interfaces/pagination.interface';
import { Disbursement } from '../entities/disbursement.entity';

export const DISBURSEMENT_REPOSITORY = 'DISBURSEMENT_REPOSITORY';

export interface DisbursementFindAllParams {
  page?: number;
  limit?: number;
  search?: string;
  projectId?: number;
}

export interface IDisbursementRepository {
  create(disbursement: Disbursement): Promise<Disbursement>;
  update(disbursement: Disbursement): Promise<Disbursement>;
  delete(id: number): Promise<void>;
  findById(id: number): Promise<Disbursement | null>;
  findAll(params: DisbursementFindAllParams): Promise<PaginatedResult<Disbursement>>;
}
