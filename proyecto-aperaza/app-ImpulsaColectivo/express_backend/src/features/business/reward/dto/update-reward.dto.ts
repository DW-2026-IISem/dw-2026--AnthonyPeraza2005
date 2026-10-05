/** Datos de entrada de `PUT /api/recompensas/:id` (reemplazo total). */
export interface UpdateRewardDto {
  title: string;
  description: string;
  min_amount: number;
  project_id: number;
  status: "active" | "inactive";
}
