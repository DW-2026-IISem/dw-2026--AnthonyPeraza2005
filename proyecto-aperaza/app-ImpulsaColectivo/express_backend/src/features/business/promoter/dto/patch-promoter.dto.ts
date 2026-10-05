import { UpdatePromoterDto } from "./update-promoter.dto";

/** Datos de entrada de `PATCH /api/promotores/:id` (actualización parcial). */
export type PatchPromoterDto = Partial<UpdatePromoterDto>;
