/** Datos de entrada de `POST /api/metas`. */
export interface CreateGoalDto {
  description: string;
  target_amount: number;
  project_id: number;
  status?: "active" | "inactive";
}
