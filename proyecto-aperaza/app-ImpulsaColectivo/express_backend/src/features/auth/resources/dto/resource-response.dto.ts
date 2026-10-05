import { Resource, ResourceI } from "../resource.model";

/**
 * Respuesta HTTP de un recurso. El DTO coincide con el modelo, pero se declara
 * igualmente para que la API quede desacoplada del modelo.
 */
export type ResourceResponseDto = ResourceI;

/** Mapper modelo -> DTO de respuesta (objeto plano). */
export function toResourceResponse(resource: Resource): ResourceResponseDto {
  return resource.toJSON() as ResourceI;
}
