import { Status, Timestamps } from './api.model';

/** Tabla `projects` — /api/proyectos. Las fechas llegan como 'YYYY-MM-DD'. */
export interface Project extends Timestamps {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  promoter_id: number;
  status: Status;
}

export interface ProjectPayload {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  promoter_id: number;
  status?: Status;
}
