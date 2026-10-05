import { Contributor, ContributorI } from "../contributor.model";

/** Forma de un `Contributor` tal como sale por la API. */
export type ContributorResponseDto = ContributorI;

/** Mapea el modelo Sequelize a su DTO de respuesta. */
export function toContributorResponse(contributor: Contributor): ContributorResponseDto {
  return contributor.toJSON() as ContributorResponseDto;
}
