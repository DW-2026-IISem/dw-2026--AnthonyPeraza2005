import { filterRows } from './filter-rows';

interface Fila {
  nombre: string;
  correo: string | null;
}

const FILAS: Fila[] = [
  { nombre: 'Fundación Semillas del Caribe', correo: 'contacto@semillas.org' },
  { nombre: 'Cooperativa Mar y Sol', correo: null },
  { nombre: 'Colectivo Huerta Viva', correo: 'hola@huertaviva.org' },
];

const campos = (fila: Fila) => [fila.nombre, fila.correo];

describe('filterRows', () => {
  it('should return a copy, not the same array, when there is no term', () => {
    const resultado = filterRows(FILAS, '   ', campos);

    expect(resultado).toEqual(FILAS);
    expect(resultado).not.toBe(FILAS);
  });

  it('should ignore case', () => {
    expect(filterRows(FILAS, 'SEMILLAS', campos).map((f) => f.nombre)).toEqual([
      'Fundación Semillas del Caribe',
    ]);
  });

  it('should tolerate null fields', () => {
    expect(filterRows(FILAS, 'mar', campos).map((f) => f.nombre)).toEqual(['Cooperativa Mar y Sol']);
  });

  it('should return an empty array when nothing matches', () => {
    expect(filterRows(FILAS, 'zzz', campos)).toEqual([]);
  });

  it('should search in any of the picked fields', () => {
    expect(filterRows(FILAS, 'huertaviva', campos).map((f) => f.nombre)).toEqual([
      'Colectivo Huerta Viva',
    ]);
  });
});
