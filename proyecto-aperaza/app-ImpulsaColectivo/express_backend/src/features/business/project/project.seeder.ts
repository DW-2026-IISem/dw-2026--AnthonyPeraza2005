import { faker } from "@faker-js/faker";
import { Project } from "./project.model";
import { Promoter } from "../promoter/promoter.model";

/**
 * Seeder del feature Project (datos falsos con @faker-js/faker).
 * Se invoca desde `src/database/seeders` (SeedersRunner), no desde la App.
 *
 * Requiere promotores activos. Idempotente: si ya hay filas, no inserta.
 */
export async function seedProjects(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  projects: count=0, se omite");
    return 0;
  }

  const existing = await Project.count();
  if (existing > 0) {
    console.log(`⏭️  projects: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const promoters = await Promoter.findAll({ where: { status: "active" } });
  if (promoters.length === 0) {
    console.log("⏭️  projects: no hay promotores activos, se omite seeder");
    return 0;
  }

  const rows = Array.from({ length: count }, () => {
    const promoter = promoters[Math.floor(Math.random() * promoters.length)];
    const start = faker.date.soon({ days: 10 });
    const end = faker.date.soon({ days: 90, refDate: start });
    return {
      title: faker.company.catchPhrase(),
      description: faker.lorem.paragraph(),
      start_date: start,
      end_date: end,
      promoter_id: promoter.id,
      status: "active" as const,
    };
  });

  await Project.bulkCreate(rows);
  console.log(`✅ projects: insertados ${count} registro(s) falsos`);
  return count;
}
