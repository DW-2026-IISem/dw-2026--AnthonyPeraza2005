import { Commission, CommissionI } from "../commission.model";

export type CommissionResponseDto = CommissionI;

export const toCommissionResponse = (commission: Commission): CommissionResponseDto =>
  commission.toJSON() as CommissionResponseDto;
