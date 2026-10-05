import { UpdateContributorDto } from "./update-contributor.dto";

/** Datos de entrada de `PATCH /api/contribuyentes/:id` (actualización parcial). */
export type PatchContributorDto = Partial<UpdateContributorDto>;
