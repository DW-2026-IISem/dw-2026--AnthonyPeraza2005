import { faker } from "@faker-js/faker";
import { Reward } from "./reward.model";
import { Project } from "../project/project.model";

/**
 * Seeder del feature Reward (datos falsos con @faker-js/faker).
 * Se invoca desde `src/database/seeders` (SeedersRunner), no desde la App.
 *
 * Requiere proyectos activos. Idempotente: si ya hay filas, no inserta.
 */
export async function seedRewards(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  rewards: count=0, se omite");
    return 0;
  }

  const existing = await Reward.count();
  if (existing > 0) {
    console.log(`⏭️  rewards: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const projects = await Project.findAll({ where: { status: "active" } });
  if (projects.length === 0) {
    console.log("⏭️  rewards: no hay proyectos activos, se omite seeder");
    return 0;
  }

  const rows = Array.from({ length: count }, () => {
    const project = projects[Math.floor(Math.random() * projects.length)];
    return {
      title: faker.commerce.productName(),
      description: faker.lorem.sentence(),
      min_amount: Number(faker.commerce.price({ min: 10000, max: 500000, dec: 0 })),
      project_id: project.id,
      status: "active" as const,
    };
  });

  await Reward.bulkCreate(rows);
  console.log(`✅ rewards: insertados ${count} registro(s) falsos`);
  return count;
}
