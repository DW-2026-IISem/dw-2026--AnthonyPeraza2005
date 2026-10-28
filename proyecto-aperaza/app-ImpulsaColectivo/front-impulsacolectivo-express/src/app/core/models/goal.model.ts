import { Money, Status, Timestamps } from './api.model';

/** Tabla `goals` — metas económicas de un proyecto */
export interface Goal extends Timestamps {
  id: number;
  description: string;
  target_amount: Money; // DECIMAL → puede llegar como string
  project_id: number;
  status: Status;
}

export interface GoalPayload {
  description: string;
  target_amount: number; // al escribir siempre es number
  project_id: number;
  status?: Status;
}
