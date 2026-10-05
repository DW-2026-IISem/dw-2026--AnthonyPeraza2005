/** Datos de entrada de `POST /api/contribuciones`. */
export interface CreateContributionDto {
  amount: number;
  contribution_date: string;
  project_id: number;
  contributor_id: number;
  status?: "active" | "inactive";
}
