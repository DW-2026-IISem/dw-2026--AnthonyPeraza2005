import { PaginatedResult } from '../../../../../common/interfaces/pagination.interface';
import { ProjectAudit } from '../entities/project-audit.entity';

export const PROJECT_AUDIT_REPOSITORY = 'PROJECT_AUDIT_REPOSITORY';

export interface ProjectAuditFindAllParams {
  page?: number;
  limit?: number;
  search?: string;
  projectId?: number;
}

export interface IProjectAuditRepository {
  create(projectAudit: ProjectAudit): Promise<ProjectAudit>;
  update(projectAudit: ProjectAudit): Promise<ProjectAudit>;
  delete(id: number): Promise<void>;
  findById(id: number): Promise<ProjectAudit | null>;
  findAll(params: ProjectAuditFindAllParams): Promise<PaginatedResult<ProjectAudit>>;
}
