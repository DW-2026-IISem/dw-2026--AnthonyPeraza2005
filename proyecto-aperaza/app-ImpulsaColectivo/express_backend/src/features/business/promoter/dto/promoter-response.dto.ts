import { Promoter, PromoterI } from "../promoter.model";

/** Forma de un `Promoter` tal como sale por la API. */
export type PromoterResponseDto = PromoterI;

/** Mapea el modelo Sequelize a su DTO de respuesta. */
export function toPromoterResponse(promoter: Promoter): PromoterResponseDto {
  return promoter.toJSON() as PromoterResponseDto;
}
