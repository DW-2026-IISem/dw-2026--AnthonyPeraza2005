import { UpdateRewardDto } from "./update-reward.dto";

/** Datos de entrada de `PATCH /api/recompensas/:id` (actualización parcial). */
export type PatchRewardDto = Partial<UpdateRewardDto>;
