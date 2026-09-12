import { PaginatedResult } from '../../../../../common/interfaces/pagination.interface';
import { Contribution } from '../entities/contribution.entity';

export const CONTRIBUTION_REPOSITORY = 'CONTRIBUTION_REPOSITORY';

export interface ContributionFindAllParams {
  page?: number;
  limit?: number;
  search?: string;
  projectId?: number;
  contributorId?: number;
}

export interface IContributionRepository {
  create(contribution: Contribution): Promise<Contribution>;
  update(contribution: Contribution): Promise<Contribution>;
  delete(id: number): Promise<void>;
  findById(id: number): Promise<Contribution | null>;
  findAll(params: ContributionFindAllParams): Promise<PaginatedResult<Contribution>>;
}
