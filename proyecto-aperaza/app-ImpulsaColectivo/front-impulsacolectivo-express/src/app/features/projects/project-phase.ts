import { Project } from '../../core/models/project.model';

export type ProjectPhase = 'upcoming' | 'running' | 'finished';

export const PHASE_LABEL: Record<ProjectPhase, string> = {
  upcoming: 'Próximo',
  running: 'En curso',
  finished: 'Finalizado',
};

export const PHASE_SEVERITY: Record<ProjectPhase, 'info' | 'success' | 'secondary'> = {
  upcoming: 'info',
  running: 'success',
  finished: 'secondary',
};

/**
 * Fase de un proyecto según sus fechas.
 *
 * `today` y las fechas son 'YYYY-MM-DD': el orden alfabético coincide con el
 * cronológico, así que se comparan como texto, sin crear `Date` ni zonas horarias.
 * Los dos extremos son inclusivos: el último día el proyecto sigue en curso.
 */
export function projectPhase(
  project: Pick<Project, 'start_date' | 'end_date'>,
  today: string,
): ProjectPhase {
  if (today < project.start_date.slice(0, 10)) {
    return 'upcoming';
  }
  if (today > project.end_date.slice(0, 10)) {
    return 'finished';
  }
  return 'running';
}
