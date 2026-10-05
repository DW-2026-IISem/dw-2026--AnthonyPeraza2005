/** Datos de entrada de `POST /api/contribuyentes`. */
export interface CreateContributorDto {
  name: string;
  email: string;
  phone: string;
  status?: "active" | "inactive";
}
