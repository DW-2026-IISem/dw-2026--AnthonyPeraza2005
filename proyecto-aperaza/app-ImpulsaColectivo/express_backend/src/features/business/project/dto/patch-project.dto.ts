import { UpdateProjectDto } from "./update-project.dto";

/** Datos de entrada de `PATCH /api/proyectos/:id` (actualización parcial). */
export type PatchProjectDto = Partial<UpdateProjectDto>;
