/** Datos de entrada de `POST /api/proyectos`. */
export interface CreateProjectDto {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  promoter_id: number;
  status?: "active" | "inactive";
}
