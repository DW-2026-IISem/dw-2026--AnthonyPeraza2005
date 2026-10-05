import { Disbursement, DisbursementI } from "../disbursement.model";

export type DisbursementResponseDto = DisbursementI;

export const toDisbursementResponse = (disbursement: Disbursement): DisbursementResponseDto =>
  disbursement.toJSON() as DisbursementResponseDto;
