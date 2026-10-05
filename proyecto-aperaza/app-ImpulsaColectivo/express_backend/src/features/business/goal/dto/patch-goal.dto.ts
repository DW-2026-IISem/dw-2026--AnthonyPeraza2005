import { UpdateGoalDto } from "./update-goal.dto";

/** Datos de entrada de `PATCH /api/metas/:id` (actualización parcial). */
export type PatchGoalDto = Partial<UpdateGoalDto>;
