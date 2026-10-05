export interface CreateProjectAuditDto {
  action: string;
  detail: string;
  audit_date: string;
  project_id: number;
  status?: "active" | "inactive";
}
