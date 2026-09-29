import { faker } from "@faker-js/faker";
import { Contribution } from "./contribution.model";
import { Project } from "../project/project.model";
import { Contributor } from "../contributor/contributor.model";

/**
 * Seeder del feature Contribution (tabla `contributions`).
 * Requiere proyectos y contribuyentes activos ya sembrados.
 */
export async function seedContributions(count: number): Promise<number> {
  const existing = await Contribution.count();
  if (existing > 0) {
    console.log(`Contribution: ya existen ${existing} registros, se omite el seed.`);
    return 0;
  }

  const activeProjects = await Project.findAll({ where: { status: "active" } });
  const activeContributors = await Contributor.findAll({ where: { status: "active" } });

  if (activeProjects.length === 0 || activeContributors.length === 0) {
    console.log("Contribution: no hay proyectos o contribuyentes activos, se omite el seed.");
    return 0;
  }

  let created = 0;
  for (let i = 0; i < count; i++) {
    const project = faker.helpers.arrayElement(activeProjects);
    const contributor = faker.helpers.arrayElement(activeContributors);

    await Contribution.create({
      amount: Number(faker.finance.amount({ min: 10000, max: 500000, dec: 2 })),
      contribution_date: faker.date.recent({ days: 60 }).toISOString().slice(0, 10),
      project_id: project.get("id") as number,
      contributor_id: contributor.get("id") as number,
      status: "active",
    });
    created++;
  }

  console.log(`Contribution: ${created} registros creados.`);
  return created;
}
