export interface CreateCommissionDto {
  percentage: number;
  amount: number;
  calculation_date: string;
  payment_transaction_id: number;
  status?: "active" | "inactive";
}
