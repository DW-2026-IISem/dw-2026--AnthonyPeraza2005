/** Datos de entrada de `PUT /api/metas/:id` (reemplazo total). */
export interface UpdateGoalDto {
  description: string;
  target_amount: number;
  project_id: number;
  status: "active" | "inactive";
}
