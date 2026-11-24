import { Resource } from '../../../core/models/resource.model';
import {
  buildPermissionMatrix,
  cellState,
  countResources,
  entityLabel,
  entityOf,
  operationOf,
  sameSet,
  withCell,
} from './permission-matrix';

function recurso(id: number, method: string, path: string, status = 'active'): Resource {
  return { id, method, path, description: null, status } as Resource;
}

describe('operationOf', () => {
  it.each([
    ['GET', '/api/proyectos', 'read'],
    ['GET', '/api/proyectos/:id', 'read'],
    ['POST', '/api/proyectos', 'create'],
    ['PUT', '/api/proyectos/:id', 'update'],
    ['PATCH', '/api/proyectos/:id', 'update'],
    ['DELETE', '/api/proyectos/:id', 'delete'],
    ['PATCH', '/api/proyectos/:id/deactivate', 'state'],
    ['PATCH', '/api/asignaciones-rol/:id/reactivate', 'state'],
    ['PATCH', '/api/usuarios/:id/password', 'update'],
    ['GET', '/api/usuarios/:id/permisos', 'read'],
  ])('should classify %s %s as %s', (method, path, esperado) => {
    expect(operationOf(method, path)).toBe(esperado);
  });
});

describe('entityOf y entityLabel', () => {
  it('should take the segment after /api', () => {
    expect(entityOf('/api/proyectos')).toBe('proyectos');
    expect(entityOf('/api/auditorias-proyecto/:id/deactivate')).toBe('auditorias-proyecto');
  });

  it('should use the menu names and capitalise unknown entities', () => {
    expect(entityLabel('transacciones-pago')).toBe('Pagos');
    expect(entityLabel('concesiones-rol')).toBe('Permisos');
    expect(entityLabel('campanas-especiales')).toBe('Campanas especiales');
  });
});

describe('buildPermissionMatrix', () => {
  const RECURSOS = [
    recurso(1, 'GET', '/api/proyectos'),
    recurso(2, 'GET', '/api/proyectos/:id'),
    recurso(3, 'POST', '/api/proyectos'),
    recurso(4, 'PUT', '/api/proyectos/:id'),
    recurso(5, 'PATCH', '/api/proyectos/:id'),
    recurso(6, 'PATCH', '/api/proyectos/:id/deactivate'),
    recurso(7, 'DELETE', '/api/proyectos/:id'),
    recurso(8, 'GET', '/api/metas'),
    recurso(9, 'POST', '/api/metas'),
    recurso(10, 'GET', '/api/recompensas', 'inactive'),
  ];

  it('should group the resources of an entity by operation', () => {
    const [proyectos] = buildPermissionMatrix(RECURSOS);

    expect(proyectos.entity).toBe('proyectos');
    expect(proyectos.operations.read.map((r) => r.id)).toEqual([1, 2]);
    expect(proyectos.operations.create.map((r) => r.id)).toEqual([3]);
    expect(proyectos.operations.delete.map((r) => r.id)).toEqual([7]);
  });

  it('should put PUT and PATCH in Actualizar and the deactivate route in Estado', () => {
    const [proyectos] = buildPermissionMatrix(RECURSOS);

    expect(proyectos.operations.update.map((r) => r.method)).toEqual(['PATCH', 'PUT']);
    expect(proyectos.operations.state.map((r) => r.id)).toEqual([6]);
  });

  it('should leave empty the operations an entity does not have', () => {
    const metas = buildPermissionMatrix(RECURSOS)[1];

    expect(metas.entity).toBe('metas');
    expect(metas.operations.update).toEqual([]);
    expect(metas.operations.state).toEqual([]);
    expect(metas.operations.delete).toEqual([]);
  });

  it('should leave out the inactive resources', () => {
    const entidades = buildPermissionMatrix(RECURSOS).map((row) => row.entity);

    expect(entidades).not.toContain('recompensas');
  });

  it('should order the rows like the menu and leave unknown entities last', () => {
    const filas = buildPermissionMatrix([
      recurso(1, 'GET', '/api/metas'),
      recurso(2, 'GET', '/api/campanas-especiales'),
      recurso(3, 'GET', '/api/proyectos'),
      recurso(4, 'GET', '/api/promotores'),
    ]);

    expect(filas.map((row) => row.entity)).toEqual([
      'promotores',
      'proyectos',
      'metas',
      'campanas-especiales',
    ]);
  });

  it('should count every resource shown in the matrix', () => {
    expect(countResources(buildPermissionMatrix(RECURSOS))).toBe(9);
  });
});

describe('cellState, withCell y sameSet', () => {
  const CELDA = [recurso(1, 'GET', '/api/proyectos'), recurso(2, 'GET', '/api/proyectos/:id')];

  it('should tell none, some and all', () => {
    expect(cellState(CELDA, new Set())).toBe('none');
    expect(cellState(CELDA, new Set([1]))).toBe('some');
    expect(cellState(CELDA, new Set([1, 2, 9]))).toBe('all');
  });

  it('should add or remove every resource of the cell without touching the original', () => {
    const original = new Set([9]);

    const marcada = withCell(CELDA, original, true);
    expect([...marcada].sort()).toEqual([1, 2, 9]);
    expect([...withCell(CELDA, marcada, false)]).toEqual([9]);
    expect([...original]).toEqual([9]);
  });

  it('should compare sets by content', () => {
    expect(sameSet(new Set([1, 2]), new Set([2, 1]))).toBe(true);
    expect(sameSet(new Set([1]), new Set([1, 2]))).toBe(false);
    expect(sameSet(new Set([1, 2]), new Set([1, 3]))).toBe(false);
  });
});
