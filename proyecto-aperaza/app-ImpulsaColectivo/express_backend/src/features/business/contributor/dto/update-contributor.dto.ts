/** Datos de entrada de `PUT /api/contribuyentes/:id` (reemplazo total). */
export interface UpdateContributorDto {
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
}
