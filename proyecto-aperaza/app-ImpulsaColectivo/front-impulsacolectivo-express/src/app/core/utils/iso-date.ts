/**
 * Fechas del backend ('YYYY-MM-DD') ↔ `Date` del calendario, siempre en hora LOCAL.
 *
 * `new Date('2026-11-01')` se interpreta como UTC: en Colombia (UTC-5) el
 * calendario mostraría el 31 de octubre. Aquí se construye con año, mes y día,
 * y el resultado es medianoche local.
 */
export function fromIsoDate(value: string): Date {
  const [year, month, day] = value.slice(0, 10).split('-').map(Number);
  return new Date(year, month - 1, day);
}

/** `Date` local → 'YYYY-MM-DD'. No usa `toISOString()`: ese convierte a UTC. */
export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Hoy, en hora local, como 'YYYY-MM-DD'. */
export function todayIso(): string {
  return toIsoDate(new Date());
}
