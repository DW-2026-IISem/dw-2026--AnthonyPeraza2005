import dotenv from "dotenv";
import { sequelize, testConnection } from "../db";
import "../../features/business/promoter/promoter.model";
import { seedPromoters } from "../../features/business/promoter/promoter.seeder";
import { seedContributors } from "../../features/business/contributor/contributor.seeder";
import { seedProjects } from "../../features/business/project/project.seeder";
import { seedGoals } from "../../features/business/goal/goal.seeder";
import { seedRewards } from "../../features/business/reward/reward.seeder";
import { seedContributions } from "../../features/business/contribution/contribution.seeder";
import { resolveSeedCounts } from "./counts";

dotenv.config();

/**
 * SeedersRunner — ejecuta TODOS los seeders de features.
 *
 * Ubicación: `src/database/seeders/` (orquestación fuera de cada feature).
 * Cada feature exporta su seeder (ej. `features/business/promoter/promoter.seeder.ts`).
 *
 * Uso:
 *   npm run db:seed
 *   npm run db:seed -- --promoters=20
 *   SEED_PROMOTERS=5 npm run db:seed
 */
export async function runAllSeeders(): Promise<void> {
  const counts = resolveSeedCounts();
  console.log("🌱 Iniciando SeedersRunner...");
  console.log("📊 Conteos:", counts);

  const ok = await testConnection();
  if (!ok) {
    throw new Error("No hay conexión a la base de datos");
  }

  await sequelize.sync({ force: false, alter: true });

  // Orden: business (padres → hijos)
  await seedPromoters(counts.promoters);
    await seedContributors(counts.contributors);
      await seedProjects(counts.projects);
        await seedGoals(counts.goals);
          await seedRewards(counts.rewards);
          await seedContributions(counts.contributions);
        

  console.log("🌱 SeedersRunner finalizado");
}

if (require.main === module) {
  runAllSeeders()
    .then(async () => {
      await sequelize.close();
      process.exit(0);
    })
    .catch(async (err) => {
      console.error("❌ Error en seeders:", err);
      await sequelize.close();
      process.exit(1);
    });
}
