import { Reward, RewardI } from "../reward.model";

/** Forma de un `Reward` tal como sale por la API. */
export type RewardResponseDto = RewardI;

/** Mapea el modelo Sequelize a su DTO de respuesta. */
export function toRewardResponse(reward: Reward): RewardResponseDto {
  return reward.toJSON() as RewardResponseDto;
}
