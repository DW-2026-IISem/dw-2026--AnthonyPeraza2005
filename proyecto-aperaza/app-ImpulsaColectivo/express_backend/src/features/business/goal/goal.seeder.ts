import { faker } from "@faker-js/faker";
import { Goal } from "./goal.model";
import { Project } from "../project/project.model";

/**
 * Seeder del feature Goal (datos falsos con @faker-js/faker).
 * Se invoca desde `src/database/seeders` (SeedersRunner), no desde la App.
 *
 * Requiere proyectos activos. Idempotente: si ya hay filas, no inserta.
 */
export async function seedGoals(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  goals: count=0, se omite");
    return 0;
  }

  const existing = await Goal.count();
  if (existing > 0) {
    console.log(`⏭️  goals: ya hay ${existing} registro(s), se omite seeder`);
    return 0;
  }

  const projects = await Project.findAll({ where: { status: "active" } });
  if (projects.length === 0) {
    console.log("⏭️  goals: no hay proyectos activos, se omite seeder");
    return 0;
  }

  const rows = Array.from({ length: count }, () => {
    const project = projects[Math.floor(Math.random() * projects.length)];
    return {
      description: faker.lorem.sentence(),
      target_amount: Number(faker.commerce.price({ min: 500000, max: 20000000, dec: 0 })),
      project_id: project.id,
      status: "active" as const,
    };
  });

  await Goal.bulkCreate(rows);
  console.log(`✅ goals: insertados ${count} registro(s) falsos`);
  return count;
}
