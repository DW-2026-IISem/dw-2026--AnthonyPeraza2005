/** Datos de entrada de `POST /api/recompensas`. */
export interface CreateRewardDto {
  title: string;
  description: string;
  min_amount: number;
  project_id: number;
  status?: "active" | "inactive";
}
