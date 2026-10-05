import { ProjectAudit, ProjectAuditI } from "../project-audit.model";

export type ProjectAuditResponseDto = ProjectAuditI;

export const toProjectAuditResponse = (projectAudit: ProjectAudit): ProjectAuditResponseDto =>
  projectAudit.toJSON() as ProjectAuditResponseDto;
