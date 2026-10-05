import { Role } from "./role.model";

/**
 * Seeder del catálogo de roles (`roles`).
 *
 * Crea los tres roles de referencia de ImpulsaColectivo. Es determinista (sin
 * datos aleatorios) e idempotente: `findOrCreate` por nombre y reactivación si
 * ya existía inactivo.
 *
 * Los roles nacen SIN permisos: las concesiones las crea el seeder de
 * `resource_roles` (ISS-20): ADMIN recibe todos los recursos, PROMOTER los de
 * gestión de proyectos y CONTRIBUTOR los de aportes.
 */
export const SEED_ROLES = [
  {
    name: "ADMIN",
    description: "Administración de la plataforma: gestiona usuarios, roles, permisos y todo el catálogo",
  },
  {
    name: "PROMOTER",
    description:
      "Promotor de proyectos: crea y gestiona proyectos, metas y recompensas, y consulta aportes y desembolsos",
  },
  {
    name: "CONTRIBUTOR",
    description: "Contribuyente: explora proyectos y recompensas, realiza aportes y solicita reembolsos",
  },
] as const;

export async function seedRoles(): Promise<number> {
  let created = 0;

  for (const item of SEED_ROLES) {
    const [role, wasCreated] = await Role.findOrCreate({
      where: { name: item.name },
      defaults: { name: item.name, description: item.description, status: "active" },
    });

    if (wasCreated) {
      created++;
      continue;
    }
    if (role.status !== "active") {
      await role.update({ status: "active" });
    }
  }

  console.log(`Roles: catálogo reconciliado (${SEED_ROLES.length} roles, ${created} nuevos).`);
  return created;
}
