import dotenv from "dotenv";
import { sequelize, testConnection } from "../db";
import "../../features/business/promoter/promoter.model";
import { seedPromoters } from "../../features/business/promoter/promoter.seeder";
import { seedContributors } from "../../features/business/contributor/contributor.seeder";
import { seedProjects } from "../../features/business/project/project.seeder";
import { seedGoals } from "../../features/business/goal/goal.seeder";
import { seedRewards } from "../../features/business/reward/reward.seeder";
import { seedContributions } from "../../features/business/contribution/contribution.seeder";
import { seedPaymentTransactions } from "../../features/business/payment-transaction/payment-transaction.seeder";
import { seedCommissions } from "../../features/business/commission/commission.seeder";
import { seedDisbursements } from "../../features/business/disbursement/disbursement.seeder";
import { seedRefunds } from "../../features/business/refund/refund.seeder";
import { seedProjectAudits } from "../../features/business/project-audit/project-audit.seeder";
import { seedUsers } from "../../features/auth/users/users.seeder";
// Fase II — Auth con RBAC: primero los seis modelos, después las asociaciones.
// Los seeders de Auth se añaden en ISS posteriores.
import "../../features/auth/users/user.model";
import "../../features/auth/roles/role.model";
import "../../features/auth/resources/resource.model";
import "../../features/auth/role-users/role-user.model";
import "../../features/auth/resource-roles/resource-role.model";
import "../../features/auth/refresh-tokens/refresh-token.model";
import "../../features/auth/rbac.associations";
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
            await seedPaymentTransactions(counts.payment_transactions);
              await seedCommissions(counts.commissions);
                await seedDisbursements(counts.disbursements);
                  await seedRefunds(counts.refunds);
                    await seedProjectAudits(counts.project_audits);
                      await seedUsers(counts.users);
        

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
