import { PaginatedResult } from '../../../../../common/interfaces/pagination.interface';
import { Promoter } from '../entities/promoter.entity';

export const PROMOTER_REPOSITORY = 'PROMOTER_REPOSITORY';

export interface PromoterFindAllParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface IPromoterRepository {
  create(promoter: Promoter): Promise<Promoter>;
  update(promoter: Promoter): Promise<Promoter>;
  delete(id: number): Promise<void>;
  findById(id: number): Promise<Promoter | null>;
  findAll(params: PromoterFindAllParams): Promise<PaginatedResult<Promoter>>;
}
