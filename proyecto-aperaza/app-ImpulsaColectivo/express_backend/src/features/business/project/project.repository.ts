import { CreationAttributes, Transaction } from "sequelize";
import { Project } from "./project.model";

/**
 * Único punto del feature que habla con Sequelize.
 * El service nunca importa el modelo directamente.
 */
export class ProjectRepository {
  public async findAll(): Promise<Project[]> {
    return Project.findAll();
  }

  public async findById(id: number, transaction?: Transaction): Promise<Project | null> {
    return Project.findByPk(id, { transaction });
  }

  public async create(data: CreationAttributes<Project>): Promise<Project> {
    return Project.create(data);
  }

  public async update(project: Project, data: Record<string, unknown>): Promise<Project> {
    return project.update(data);
  }

  public async delete(project: Project): Promise<void> {
    await project.destroy();
  }
}
