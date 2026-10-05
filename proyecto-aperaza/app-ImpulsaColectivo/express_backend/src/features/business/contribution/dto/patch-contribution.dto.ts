import { UpdateContributionDto } from "./update-contribution.dto";

/** Datos de entrada de `PATCH /api/contribuciones/:id` (actualización parcial). */
export type PatchContributionDto = Partial<UpdateContributionDto>;
