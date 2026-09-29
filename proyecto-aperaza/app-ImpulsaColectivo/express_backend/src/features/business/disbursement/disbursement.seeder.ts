import { faker } from "@faker-js/faker";
import { Disbursement } from "./disbursement.model";
import { Project } from "../project/project.model";

/**
 * Seeder del feature Disbursement (tabla `disbursements`).
 * Requiere proyectos activos ya sembrados.
 */
export async function seedDisbursements(count: number): Promise<number> {
  const existing = await Disbursement.count();
  if (existing > 0) {
    console.log(`Disbursement: ya existen ${existing} registros, se omite el seed.`);
    return 0;
  }

  const activeProjects = await Project.findAll({ where: { status: "active" } });

  if (activeProjects.length === 0) {
    console.log("Disbursement: no hay proyectos activos, se omite el seed.");
    return 0;
  }

  const methods = ["transferencia_bancaria", "nequi", "daviplata", "cheque"];

  let created = 0;
  for (let i = 0; i < count; i++) {
    const project = faker.helpers.arrayElement(activeProjects);

    await Disbursement.create({
      amount: Number(faker.finance.amount({ min: 50000, max: 1000000, dec: 2 })),
      disbursement_date: faker.date.recent({ days: 60 }).toISOString().slice(0, 10),
      method: faker.helpers.arrayElement(methods),
      project_id: project.get("id") as number,
      status: "active",
    });
    created++;
  }

  console.log(`Disbursement: ${created} registros creados.`);
  return created;
}
