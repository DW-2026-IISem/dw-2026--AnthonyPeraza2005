import { Status, Timestamps } from './api.model';

/** Tabla `project_audits` — bitácora de acciones sobre un proyecto */
export interface ProjectAudit extends Timestamps {
  id: number;
  action: string;
  detail: string;
  audit_date: string;
  project_id: number;
  status: Status;
}

export interface ProjectAuditPayload {
  action: string;
  detail: string;
  audit_date: string;
  project_id: number;
  status?: Status;
}
