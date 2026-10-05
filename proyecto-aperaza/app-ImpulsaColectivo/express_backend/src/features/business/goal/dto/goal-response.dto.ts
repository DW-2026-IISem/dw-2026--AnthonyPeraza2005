import { Goal, GoalI } from "../goal.model";

/** Forma de un `Goal` tal como sale por la API. */
export type GoalResponseDto = GoalI;

/** Mapea el modelo Sequelize a su DTO de respuesta. */
export function toGoalResponse(goal: Goal): GoalResponseDto {
  return goal.toJSON() as GoalResponseDto;
}
