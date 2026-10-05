export interface UpdateRefundDto {
  amount: number;
  reason: string;
  refund_date: string;
  contribution_id: number;
  status: "active" | "inactive";
}
