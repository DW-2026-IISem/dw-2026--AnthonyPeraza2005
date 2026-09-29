import { faker } from "@faker-js/faker";
import { ProjectAudit } from "./project-audit.model";
import { Project } from "../project/project.model";

/**
 * Seeder del feature ProjectAudit (tabla `project_audits`).
 * Requiere proyectos activos ya sembrados.
 */
export async function seedProjectAudits(count: number): Promise<number> {
  const existing = await ProjectAudit.count();
  if (existing > 0) {
    console.log(`ProjectAudit: ya existen ${existing} registros, se omite el seed.`);
    return 0;
  }

  const activeProjects = await Project.findAll({ where: { status: "active" } });

  if (activeProjects.length === 0) {
    console.log("ProjectAudit: no hay proyectos activos, se omite el seed.");
    return 0;
  }

  const actions = ["creacion", "cambio_estado", "edicion_meta", "edicion_descripcion", "cierre"];

  let created = 0;
  for (let i = 0; i < count; i++) {
    const project = faker.helpers.arrayElement(activeProjects);
    const action = faker.helpers.arrayElement(actions);

    await ProjectAudit.create({
      action,
      detail: faker.lorem.sentence(),
      audit_date: faker.date.recent({ days: 90 }).toISOString().slice(0, 10),
      project_id: project.get("id") as number,
      status: "active",
    });
    created++;
  }

  console.log(`ProjectAudit: ${created} registros creados.`);
  return created;
}
