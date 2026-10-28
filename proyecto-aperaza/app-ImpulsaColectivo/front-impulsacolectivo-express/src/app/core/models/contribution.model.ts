import { Money, Status, Timestamps } from './api.model';

/** Tabla `contributions` — un aporte de un contribuyente a un proyecto */
export interface Contribution extends Timestamps {
  id: number;
  amount: Money;
  contribution_date: string;
  project_id: number;
  contributor_id: number;
  status: Status;
}

export interface ContributionPayload {
  amount: number;
  contribution_date: string;
  project_id: number;
  contributor_id: number;
  status?: Status;
}
