import { projectPhase } from './project-phase';

const PROYECTO = { start_date: '2026-11-01', end_date: '2026-11-30' };

describe('projectPhase', () => {
  it('should be upcoming before the start date', () => {
    expect(projectPhase(PROYECTO, '2026-10-31')).toBe('upcoming');
  });

  it('should be running on the first day and on the last day', () => {
    expect(projectPhase(PROYECTO, '2026-11-01')).toBe('running');
    expect(projectPhase(PROYECTO, '2026-11-30')).toBe('running');
  });

  it('should be running in the middle of the period', () => {
    expect(projectPhase(PROYECTO, '2026-11-15')).toBe('running');
  });

  it('should be finished after the end date', () => {
    expect(projectPhase(PROYECTO, '2026-12-01')).toBe('finished');
  });
});
