import { User } from "./user.model";

/**
 * Seeder de usuarios (`users`).
 *
 * Crea tres usuarios canónicos que sostienen la demostración de RBAC:
 *
 * | username    | password         | rol (ISS-20) |
 * |-------------|------------------|--------------|
 * | admin       | Admin123!        | ADMIN        |
 * | promoter    | Promoter123!     | PROMOTER     |
 * | contributor | Contributor123!  | CONTRIBUTOR  |
 *
 * Si `count` > 3, añade usuarios de relleno sin rol (`usuario1`, `usuario2`, ...),
 * útiles para comprobar que estar autenticado no basta para tener permisos.
 *
 * Las contraseñas se guardan hasheadas (hook `beforeCreate` del modelo).
 * Idempotente por `username`.
 */
export const CANONICAL_USERS = [
  { username: "admin", email: "admin@impulsacolectivo.local", password: "Admin123!" },
  { username: "promoter", email: "promoter@impulsacolectivo.local", password: "Promoter123!" },
  { username: "contributor", email: "contributor@impulsacolectivo.local", password: "Contributor123!" },
] as const;

export async function seedUsers(count: number): Promise<number> {
  if (count <= 0) {
    console.log("Users: count=0, se omite el seed.");
    return 0;
  }

  let created = 0;

  for (const item of CANONICAL_USERS) {
    const [user, wasCreated] = await User.findOrCreate({
      where: { username: item.username },
      defaults: {
        username: item.username,
        email: item.email,
        password: item.password,
        avatar: null,
        status: "active",
      },
    });
    if (wasCreated) {
      created++;
      continue;
    }
    // Reactiva los canónicos si quedaron inactivos: `npm run db:seed` deja
    // siempre el proyecto en un estado operable.
    if (user.status !== "active") {
      await user.update({ status: "active" });
    }
  }

  const extras = Math.max(0, count - CANONICAL_USERS.length);
  for (let i = 1; i <= extras; i++) {
    const username = `usuario${i}`;
    const [, wasCreated] = await User.findOrCreate({
      where: { username },
      defaults: {
        username,
        email: `${username}@example.com`,
        password: "Password123!",
        avatar: null,
        status: "active",
      },
    });
    if (wasCreated) created++;
  }

  console.log(`Users: ${created} registros creados (${CANONICAL_USERS.length} canónicos + ${extras} de relleno).`);
  return created;
}
