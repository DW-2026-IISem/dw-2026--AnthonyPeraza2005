/** Datos de entrada de `POST /api/promotores`. */
export interface CreatePromoterDto {
  name: string;
  description: string;
  contact_email: string;
  contact_phone: string;
  status?: "active" | "inactive";
}
