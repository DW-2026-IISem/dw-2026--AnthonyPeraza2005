/** Datos de entrada de `PUT /api/promotores/:id` (reemplazo total). */
export interface UpdatePromoterDto {
  name: string;
  description: string;
  contact_email: string;
  contact_phone: string;
  status: "active" | "inactive";
}
