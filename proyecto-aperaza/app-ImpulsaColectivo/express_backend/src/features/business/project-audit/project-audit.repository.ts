import { CreationAttributes, Transaction } from "sequelize";
import { ProjectAudit } from "./project-audit.model";

export class ProjectAuditRepository {
  async findAll(): Promise<ProjectAudit[]> {
    return ProjectAudit.findAll();
  }

  async findById(id: number, transaction?: Transaction): Promise<ProjectAudit | null> {
    return ProjectAudit.findByPk(id, { transaction });
  }

  async create(data: CreationAttributes<ProjectAudit>): Promise<ProjectAudit> {
    return ProjectAudit.create(data);
  }

  async update(projectAudit: ProjectAudit, data: Record<string, unknown>): Promise<ProjectAudit> {
    return projectAudit.update(data);
  }

  async delete(projectAudit: ProjectAudit): Promise<void> {
    await projectAudit.destroy();
  }
}
