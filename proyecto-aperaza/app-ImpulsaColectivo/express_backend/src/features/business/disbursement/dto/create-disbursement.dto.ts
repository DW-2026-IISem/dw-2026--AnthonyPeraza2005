export interface CreateDisbursementDto {
  amount: number;
  disbursement_date: string;
  method: string;
  project_id: number;
  status?: "active" | "inactive";
}
