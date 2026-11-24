import { Resource } from '../../../core/models/resource.model';

/** Columnas de la matriz. Cada casilla puede agrupar varios recursos HTTP. */
export type MatrixOperation = 'create' | 'read' | 'update' | 'state' | 'delete';

export interface MatrixColumn {
  key: MatrixOperation;
  label: string;
  /** Qué rutas agrupa; se muestra como ayuda en el encabezado. */
  hint: string;
}

export const MATRIX_COLUMNS: MatrixColumn[] = [
  { key: 'create', label: 'Crear', hint: 'POST' },
  { key: 'read', label: 'Leer', hint: 'GET: listado y detalle' },
  { key: 'update', label: 'Actualizar', hint: 'PUT y PATCH' },
  { key: 'state', label: 'Estado', hint: 'Baja y reactivación (deactivate / reactivate)' },
  { key: 'delete', label: 'Eliminar', hint: 'DELETE' },
];

export interface MatrixRow {
  /** Segmento de la ruta: `proyectos`. */
  entity: string;
  /** Nombre que ve el administrador: `Proyectos`. */
  label: string;
  /** Recursos de cada columna; vacío = «No disponible». */
  operations: Record<MatrixOperation, Resource[]>;
}

export type CellState = 'none' | 'some' | 'all';

/** Entidades conocidas: define el orden de las filas y su nombre en pantalla. */
const ENTITIES: Record<string, string> = {
  promotores: 'Promotores',
  contribuyentes: 'Contribuyentes',
  proyectos: 'Proyectos',
  contribuciones: 'Contribuciones',
  'transacciones-pago': 'Pagos',
  recompensas: 'Recompensas',
  metas: 'Metas',
  desembolsos: 'Desembolsos',
  reembolsos: 'Reembolsos',
  comisiones: 'Comisiones',
  'auditorias-proyecto': 'Auditorías',
  usuarios: 'Usuarios',
  roles: 'Roles',
  recursos: 'Recursos',
  'asignaciones-rol': 'Asignaciones',
  'concesiones-rol': 'Permisos',
};
const ENTITY_ORDER = Object.keys(ENTITIES);

/** `/api/proyectos/:id/deactivate` → `proyectos`. */
export function entityOf(path: string): string {
  const parts = path.split('/').filter(Boolean);
  return parts[1] ?? parts[0] ?? path;
}

/** `transacciones-pago` → `Pagos`; una entidad desconocida se capitaliza. */
export function entityLabel(entity: string): string {
  const known = ENTITIES[entity];
  if (known) {
    return known;
  }
  const spaced = entity.replace(/-/g, ' ');
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/**
 * Columna de un recurso. La baja y la reactivación (`/deactivate`, `/reactivate`) van
 * aparte de Actualizar: dar permiso para editar no debe dar permiso para dar de baja.
 * El resto se clasifica por método.
 */
export function operationOf(method: string, path: string): MatrixOperation {
  const last = path.split('/').filter(Boolean).pop() ?? '';
  if (last === 'deactivate' || last === 'reactivate') {
    return 'state';
  }
  switch (method.toUpperCase()) {
    case 'POST':
      return 'create';
    case 'PUT':
    case 'PATCH':
      return 'update';
    case 'DELETE':
      return 'delete';
    default:
      return 'read';
  }
}

/** Agrupa el catálogo activo por entidad y operación. Los recursos inactivos no aparecen. */
export function buildPermissionMatrix(resources: readonly Resource[]): MatrixRow[] {
  const rows = new Map<string, MatrixRow>();

  for (const resource of resources) {
    if (resource.status !== 'active') {
      continue;
    }
    const entity = entityOf(resource.path);
    let row = rows.get(entity);
    if (!row) {
      row = {
        entity,
        label: entityLabel(entity),
        operations: { create: [], read: [], update: [], state: [], delete: [] },
      };
      rows.set(entity, row);
    }
    row.operations[operationOf(resource.method, resource.path)].push(resource);
  }

  for (const row of rows.values()) {
    for (const column of MATRIX_COLUMNS) {
      row.operations[column.key].sort(byPathThenMethod);
    }
  }

  return [...rows.values()].sort(byEntityOrder);
}

/** Cuántos recursos hay en total en la matriz. */
export function countResources(rows: readonly MatrixRow[]): number {
  return rows.reduce(
    (total, row) =>
      total + MATRIX_COLUMNS.reduce((sum, column) => sum + row.operations[column.key].length, 0),
    0,
  );
}

/** Marcada (todos seleccionados), vacía (ninguno) o parcial (algunos). */
export function cellState(cell: readonly Resource[], selected: ReadonlySet<number>): CellState {
  const marked = cell.filter((resource) => selected.has(resource.id)).length;
  if (marked === 0) {
    return 'none';
  }
  return marked === cell.length ? 'all' : 'some';
}

/** Selección nueva con todos los recursos de la casilla añadidos o quitados. */
export function withCell(
  cell: readonly Resource[],
  selected: ReadonlySet<number>,
  checked: boolean,
): Set<number> {
  const next = new Set(selected);
  for (const resource of cell) {
    if (checked) {
      next.add(resource.id);
    } else {
      next.delete(resource.id);
    }
  }
  return next;
}

export function sameSet(a: ReadonlySet<number>, b: ReadonlySet<number>): boolean {
  return a.size === b.size && [...a].every((id) => b.has(id));
}

function rank(entity: string): number {
  const index = ENTITY_ORDER.indexOf(entity);
  return index === -1 ? ENTITY_ORDER.length : index;
}

function byEntityOrder(a: MatrixRow, b: MatrixRow): number {
  return rank(a.entity) - rank(b.entity) || a.label.localeCompare(b.label);
}

function byPathThenMethod(a: Resource, b: Resource): number {
  return a.path.localeCompare(b.path) || a.method.localeCompare(b.method);
}
