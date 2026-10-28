import { Money, Status, Timestamps } from './api.model';

/** Tabla `rewards` — /api/recompensas */
export interface Reward extends Timestamps {
  id: number;
  title: string;
  description: string;
  min_amount: Money;
  project_id: number;
  status: Status;
}

export interface RewardPayload {
  title: string;
  description: string;
  min_amount: number;
  project_id: number;
  status?: Status;
}
