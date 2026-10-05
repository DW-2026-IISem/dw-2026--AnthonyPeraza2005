import { Refund, RefundI } from "../refund.model";

export type RefundResponseDto = RefundI;

export const toRefundResponse = (refund: Refund): RefundResponseDto =>
  refund.toJSON() as RefundResponseDto;
