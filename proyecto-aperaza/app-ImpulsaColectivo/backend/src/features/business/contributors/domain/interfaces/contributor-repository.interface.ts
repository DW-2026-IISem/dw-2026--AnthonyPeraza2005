import { PaginatedResult } from '../../../../../common/interfaces/pagination.interface';
import { Contributor } from '../entities/contributor.entity';

export const CONTRIBUTOR_REPOSITORY = 'CONTRIBUTOR_REPOSITORY';

export interface ContributorFindAllParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface IContributorRepository {
  create(contributor: Contributor): Promise<Contributor>;
  update(contributor: Contributor): Promise<Contributor>;
  delete(id: number): Promise<void>;
  findById(id: number): Promise<Contributor | null>;
  findAll(params: ContributorFindAllParams): Promise<PaginatedResult<Contributor>>;
}
