/** Datos de entrada de `PUT /api/contribuciones/:id` (reemplazo total). */
export interface UpdateContributionDto {
  amount: number;
  contribution_date: string;
  project_id: number;
  contributor_id: number;
  status: "active" | "inactive";
}
