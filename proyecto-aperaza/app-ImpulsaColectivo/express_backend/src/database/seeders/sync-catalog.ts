import dotenv from "dotenv";
import { sequelize, testConnection } from "../db";
import "../../features/auth/resources/resource.model";
import { seedResources } from "../../features/auth/resources/resources.seeder";

dotenv.config();

/**
 * Sincroniza SOLO el catálogo de recursos (`resources`).
 *
 * A diferencia de `npm run db:seed`, NO reconcilia las concesiones de los roles
 * (`resource_roles`): los permisos guardados desde la matriz se conservan.
 * Un recurso nuevo queda activo en el catálogo, pero sin concesión para ningún
 * rol hasta que un administrador se la dé desde la matriz.
 */
export async function syncCatalog(): Promise<void> {
  const ok = await testConnection();
  if (!ok) {
    throw new Error("No hay conexión a la base de datos");
  }
  await seedResources();
}

if (require.main === module) {
  syncCatalog()
    .then(async () => {
      await sequelize.close();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error("❌ Error al sincronizar el catálogo:", err);
      await sequelize.close();
      process.exit(1);
    });
}
