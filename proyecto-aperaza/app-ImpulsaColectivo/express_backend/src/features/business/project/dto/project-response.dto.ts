import { Project, ProjectI } from "../project.model";

/** Forma de un `Project` tal como sale por la API. */
export type ProjectResponseDto = ProjectI;

/** Mapea el modelo Sequelize a su DTO de respuesta. */
export function toProjectResponse(project: Project): ProjectResponseDto {
  return project.toJSON() as ProjectResponseDto;
}
