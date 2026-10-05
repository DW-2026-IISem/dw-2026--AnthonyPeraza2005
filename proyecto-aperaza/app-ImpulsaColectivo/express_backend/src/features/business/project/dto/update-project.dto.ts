/** Datos de entrada de `PUT /api/proyectos/:id` (reemplazo total). */
export interface UpdateProjectDto {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  promoter_id: number;
  status: "active" | "inactive";
}
