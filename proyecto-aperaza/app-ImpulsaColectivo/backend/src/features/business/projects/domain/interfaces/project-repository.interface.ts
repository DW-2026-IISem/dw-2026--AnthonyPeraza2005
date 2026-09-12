import { PaginatedResult } from '../../../../../common/interfaces/pagination.interface';
import { Project } from '../entities/project.entity';

export const PROJECT_REPOSITORY = 'PROJECT_REPOSITORY';

export interface ProjectFindAllParams {
  page?: number;
  limit?: number;
  search?: string;
  promoterId?: number;
}

export interface IProjectRepository {
  create(project: Project): Promise<Project>;
  update(project: Project): Promise<Project>;
  delete(id: number): Promise<void>;
  findById(id: number): Promise<Project | null>;
  findAll(params: ProjectFindAllParams): Promise<PaginatedResult<Project>>;
}
