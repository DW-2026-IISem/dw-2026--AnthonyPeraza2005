import { fromIsoDate, todayIso, toIsoDate } from './iso-date';

describe('iso-date', () => {
  it('should build a local date, not a UTC one', () => {
    const fecha = fromIsoDate('2026-11-01');

    expect(fecha.getFullYear()).toBe(2026);
    expect(fecha.getMonth()).toBe(10); // noviembre
    expect(fecha.getDate()).toBe(1); // no 31 de octubre
    expect(fecha.getHours()).toBe(0);
  });

  it('should format a local date with zero padding', () => {
    expect(toIsoDate(new Date(2027, 0, 5))).toBe('2027-01-05');
  });

  it('should round-trip a backend date', () => {
    expect(toIsoDate(fromIsoDate('2026-12-31'))).toBe('2026-12-31');
  });

  it('should return today as YYYY-MM-DD', () => {
    expect(todayIso()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
