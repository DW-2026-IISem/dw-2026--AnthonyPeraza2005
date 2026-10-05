import { Resource } from "../resources/resource.model";
import { Role } from "../roles/role.model";
import {
  CONTRIBUTOR_RESOURCES,
  PROMOTER_RESOURCES,
  RESOURCE_CATALOG,
} from "../resources/resource-catalog";
import { ResourceRolesService } from "./resource-roles.service";

/**
 * Seeder de las concesiones rol ↔ recurso (`resource_roles`).
 * ES EL QUE CONSTRUYE LA MATRIZ DE PERMISOS de ImpulsaColectivo:
 *
 *  - ADMIN       -> los 110 recursos (administración total).
 *  - PROMOTER    -> 23 recursos (gestiona proyectos, metas y recompensas;
 *                   consulta aportes, desembolsos y auditorías).
 *  - CONTRIBUTOR -> 15 recursos (explora proyectos, aporta, paga y solicita
 *                   reembolsos).
 *
 * Como `reconcileRole` es determinista, reejecutar el seeder reconcilia la
 * matriz: concede lo que falte, reactiva lo inactivo y retira lo que sobre.
 */
export async function seedResourceRoles(): Promise<number> {
  const service = new ResourceRolesService();

  const resources = await Resource.findAll({ where: { status: "active" } });
  const idByOperation = new Map(
    resources.map((resource) => [`${resource.method} ${resource.path}`, resource.id] as const)
  );

  /** Traduce el catálogo en código a los `resource_id` reales de la base. */
  const idsFor = (catalog: ReadonlyArray<{ method: string; path: string }>): number[] =>
    catalog
      .map((item) => idByOperation.get(`${item.method} ${item.path}`))
      .filter((id): id is number => typeof id === "number");

  const matrix = [
    { roleName: "ADMIN", catalog: RESOURCE_CATALOG },
    { roleName: "PROMOTER", catalog: PROMOTER_RESOURCES },
    { roleName: "CONTRIBUTOR", catalog: CONTRIBUTOR_RESOURCES },
  ] as const;

  let total = 0;

  for (const item of matrix) {
    const role = await Role.findOne({ where: { name: item.roleName } });
    if (!role) {
      console.log(`ResourceRoles: falta el rol ${item.roleName}, se omite.`);
      continue;
    }
    const result = await service.reconcileRole(role.id, idsFor(item.catalog));
    console.log(
      `ResourceRoles: ${item.roleName} -> ${result.total_active} recursos ` +
        `(${result.activated} altas, ${result.deactivated} bajas).`
    );
    total += result.total_active;
  }

  return total;
}
