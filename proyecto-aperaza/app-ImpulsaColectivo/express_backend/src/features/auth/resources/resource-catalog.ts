/**
 * Catálogo de los 110 recursos de ImpulsaColectivo (fuente única).
 *
 * Un recurso es un par `(method, path)`; un permiso es la concesión de un
 * recurso a un rol. Este archivo puebla el seeder de `resources` y de él se
 * derivan las concesiones de los roles (ISS-20):
 *
 *  - ADMIN       -> los 110 recursos.
 *  - PROMOTER    -> 23 recursos (marca `promoter`).
 *  - CONTRIBUTOR -> 15 recursos (marca `contributor`).
 *
 * | Grupo                                              | Recursos |
 * |----------------------------------------------------|---------:|
 * | Promotores, Contribuyentes, Proyectos, Metas,      |          |
 * | Recompensas, Contribuciones, Transacciones de      |          |
 * | pago, Comisiones, Desembolsos, Reembolsos y        |          |
 * | Auditorías de proyecto (11 entidades x 7)          |       77 |
 * | Usuarios (+ cambio de contraseña + permisos)       |        9 |
 * | Roles                                              |        7 |
 * | Recursos                                           |        7 |
 * | Asignaciones usuario-rol                           |        5 |
 * | Concesiones rol-recurso                            |        5 |
 * | **Total**                                          |  **110** |
 *
 * Las operaciones de sesión (`/api/sesion/*`) NO son recursos RBAC: son las
 * modalidades OPEN y JWT y no dependen de la matriz de permisos.
 */
export interface CatalogResource {
  method: string;
  path: string;
  description: string;
  /** `true` si el rol PROMOTER recibe esta concesión. */
  promoter?: boolean;
  /** `true` si el rol CONTRIBUTOR recibe esta concesión. */
  contributor?: boolean;
}

type CrudOp = "list" | "one" | "create" | "put" | "patch" | "delete" | "deactivate";

interface RoleAccess {
  promoter?: readonly CrudOp[];
  contributor?: readonly CrudOp[];
}

/** Genera las 7 operaciones estándar de una entidad y marca el acceso por rol. */
function crud(
  base: string,
  singular: string,
  plural: string,
  access: RoleAccess = {}
): CatalogResource[] {
  const defs: Array<{ op: CrudOp; method: string; path: string; description: string }> = [
    { op: "list", method: "GET", path: base, description: `Listar ${plural}` },
    { op: "one", method: "GET", path: `${base}/:id`, description: `Consultar ${singular}` },
    { op: "create", method: "POST", path: base, description: `Crear ${singular}` },
    { op: "put", method: "PUT", path: `${base}/:id`, description: `Reemplazar ${singular}` },
    { op: "patch", method: "PATCH", path: `${base}/:id`, description: `Modificar ${singular}` },
    { op: "delete", method: "DELETE", path: `${base}/:id`, description: `Eliminar ${singular}` },
    {
      op: "deactivate",
      method: "PATCH",
      path: `${base}/:id/deactivate`,
      description: `Desactivar ${singular}`,
    },
  ];

  return defs.map(({ op, ...resource }) => ({
    ...resource,
    ...(access.promoter?.includes(op) ? { promoter: true } : {}),
    ...(access.contributor?.includes(op) ? { contributor: true } : {}),
  }));
}

export const RESOURCE_CATALOG: readonly CatalogResource[] = [
  // ── Negocio (77 = 11 x 7) ─────────────────────────────────────
  ...crud("/api/promotores", "promotor", "promotores", { promoter: ["list", "one"] }),
  ...crud("/api/contribuyentes", "contribuyente", "contribuyentes"),
  ...crud("/api/proyectos", "proyecto", "proyectos", {
    promoter: ["list", "one", "create", "put", "patch"],
    contributor: ["list", "one"],
  }),
  ...crud("/api/metas", "meta", "metas", {
    promoter: ["list", "one", "create", "put", "patch"],
    contributor: ["list", "one"],
  }),
  ...crud("/api/recompensas", "recompensa", "recompensas", {
    promoter: ["list", "one", "create", "put", "patch"],
    contributor: ["list", "one"],
  }),
  ...crud("/api/contribuciones", "contribución", "contribuciones", {
    promoter: ["list", "one"],
    contributor: ["list", "one", "create"],
  }),
  ...crud("/api/transacciones-pago", "transacción de pago", "transacciones de pago", {
    contributor: ["list", "one", "create"],
  }),
  ...crud("/api/comisiones", "comisión", "comisiones"),
  ...crud("/api/desembolsos", "desembolso", "desembolsos", { promoter: ["list", "one"] }),
  ...crud("/api/reembolsos", "reembolso", "reembolsos", {
    contributor: ["list", "one", "create"],
  }),
  ...crud("/api/auditorias-proyecto", "auditoría de proyecto", "auditorías de proyecto", {
    promoter: ["list", "one"],
  }),

  // ── Usuarios (9) ──────────────────────────────────────────────
  ...crud("/api/usuarios", "usuario", "usuarios"),
  {
    method: "PATCH",
    path: "/api/usuarios/:id/password",
    description: "Cambiar contraseña de usuario",
  },
  {
    method: "GET",
    path: "/api/usuarios/:id/permisos",
    description: "Consultar permisos efectivos del usuario",
  },

  // ── Roles (7) y Recursos (7) ──────────────────────────────────
  ...crud("/api/roles", "rol", "roles"),
  ...crud("/api/recursos", "recurso", "recursos"),

  // ── Asignaciones usuario ↔ rol (5) ────────────────────────────
  { method: "GET", path: "/api/asignaciones-rol", description: "Listar asignaciones usuario-rol" },
  { method: "GET", path: "/api/asignaciones-rol/:id", description: "Consultar asignación usuario-rol" },
  { method: "POST", path: "/api/asignaciones-rol", description: "Asignar rol a usuario" },
  { method: "PATCH", path: "/api/asignaciones-rol/:id/deactivate", description: "Retirar rol a usuario" },
  { method: "PATCH", path: "/api/asignaciones-rol/:id/reactivate", description: "Reactivar rol a usuario" },

  // ── Concesiones rol ↔ recurso (5) ─────────────────────────────
  { method: "GET", path: "/api/concesiones-rol", description: "Listar concesiones rol-recurso" },
  { method: "GET", path: "/api/concesiones-rol/:id", description: "Consultar concesión rol-recurso" },
  { method: "POST", path: "/api/concesiones-rol", description: "Conceder recurso a rol" },
  { method: "PATCH", path: "/api/concesiones-rol/:id/deactivate", description: "Retirar recurso a rol" },
  { method: "PATCH", path: "/api/concesiones-rol/:id/reactivate", description: "Reactivar recurso a rol" },
];

/** Recursos que recibe el rol PROMOTER (23). Derivado del catálogo, no duplicado. */
export const PROMOTER_RESOURCES: readonly CatalogResource[] = RESOURCE_CATALOG.filter(
  (resource) => resource.promoter === true
);

/** Recursos que recibe el rol CONTRIBUTOR (15). Derivado del catálogo, no duplicado. */
export const CONTRIBUTOR_RESOURCES: readonly CatalogResource[] = RESOURCE_CATALOG.filter(
  (resource) => resource.contributor === true
);
