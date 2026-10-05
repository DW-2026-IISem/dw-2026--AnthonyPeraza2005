import { AppError } from "../../../shared/errors/app-error";
import { ProjectRepository } from "../project/project.repository";
import { ProjectAuditRepository } from "./project-audit.repository";
import {
  CreateProjectAuditDto,
  UpdateProjectAuditDto,
  PatchProjectAuditDto,
} from "./dto";

export class ProjectAuditService {
  constructor(
    private readonly repository: ProjectAuditRepository = new ProjectAuditRepository(),
    private readonly projectRepository: ProjectRepository = new ProjectRepository(),
  ) {}

  async getAll() {
    return this.repository.findAll();
  }

  async getOne(id: number) {
    return this.findOrFail(id);
  }

  async create(dto: CreateProjectAuditDto) {
    await this.assertActiveProject(dto.project_id);
    return this.repository.create({
      ...dto,
      status: dto.status ?? "inactive",
    });
  }

  async updatePut(id: number, dto: UpdateProjectAuditDto) {
    const projectAudit = await this.findOrFail(id);
    await this.assertActiveProject(dto.project_id);
    return this.repository.update(projectAudit, { ...dto });
  }

  async updatePatch(id: number, dto: PatchProjectAuditDto) {
    const projectAudit = await this.findOrFail(id);
    if (dto.project_id !== undefined) {
      await this.assertActiveProject(dto.project_id);
    }
    return this.repository.update(projectAudit, { ...dto });
  }

  async deletePhysical(id: number): Promise<void> {
    const projectAudit = await this.findOrFail(id);
    await this.repository.delete(projectAudit);
  }

  async deleteLogical(id: number): Promise<void> {
    const projectAudit = await this.findOrFail(id);
    await this.repository.update(projectAudit, { status: "inactive" });
  }

  private async findOrFail(id: number) {
    const projectAudit = await this.repository.findById(id);
    if (!projectAudit) {
      throw new AppError(404, "ProjectAudit no encontrada");
    }
    return projectAudit;
  }

  private async assertActiveProject(projectId: number): Promise<void> {
    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      throw new AppError(404, "El project_id indicado no existe");
    }
    if (project.status !== "active") {
      throw new AppError(400, "El proyecto indicado no está activo");
    }
  }
}
