import { Contribution, ContributionI } from "../contribution.model";

/** Forma de un `Contribution` tal como sale por la API. */
export type ContributionResponseDto = ContributionI;

/** Mapea el modelo Sequelize a su DTO de respuesta. */
export function toContributionResponse(contribution: Contribution): ContributionResponseDto {
  return contribution.toJSON() as ContributionResponseDto;
}
