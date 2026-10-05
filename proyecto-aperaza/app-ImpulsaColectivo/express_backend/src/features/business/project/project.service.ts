import { AppError } from "../../../shared/errors/app-error";
import { ProjectRepository } from "./project.repository";
import { PromoterRepository } from "../promoter/promoter.repository";
import { Project } from "./project.model";
import {
  CreateProjectDto,
  UpdateProjectDto,
  PatchProjectDto,
  ProjectResponseDto,
  toProjectResponse,
} from "./dto";

export class ProjectService {
  public constructor(
    private readonly repository: ProjectRepository = new ProjectRepository(),
    private readonly promoterRepository: PromoterRepository = new PromoterRepository()
  ) {}

  public async getAll(): Promise<ProjectResponseDto[]> {
    const projects = await this.repository.findAll();
    return projects.map(toProjectResponse);
  }

  public async getOne(id: number): Promise<ProjectResponseDto> {
    return toProjectResponse(await this.findOrFail(id));
  }

  public async create(body: CreateProjectDto): Promise<ProjectResponseDto> {
    await this.assertActivePromoter(body.promoter_id);

    const project = await this.repository.create({
      title: body.title,
      description: body.description,
      start_date: body.start_date,
      end_date: body.end_date,
      promoter_id: body.promoter_id,
      status: body.status ?? "inactive",
    });

    return toProjectResponse(project);
  }

  public async updatePut(id: number, body: UpdateProjectDto): Promise<ProjectResponseDto> {
    const project = await this.findOrFail(id);
    await this.assertActivePromoter(body.promoter_id);

    const updated = await this.repository.update(project, {
      title: body.title,
      description: body.description,
      start_date: body.start_date,
      end_date: body.end_date,
      promoter_id: body.promoter_id,
      status: body.status,
    });

    return toProjectResponse(updated);
  }

  public async updatePatch(id: number, body: PatchProjectDto): Promise<ProjectResponseDto> {
    const project = await this.findOrFail(id);

    if (body.promoter_id !== undefined) {
      await this.assertActivePromoter(body.promoter_id);
    }

    const updated = await this.repository.update(project, body);
    return toProjectResponse(updated);
  }

  public async deletePhysical(id: number): Promise<void> {
    const project = await this.findOrFail(id);
    await this.repository.delete(project);
  }

  public async deleteLogical(id: number): Promise<ProjectResponseDto> {
    const project = await this.findOrFail(id);
    const updated = await this.repository.update(project, { status: "inactive" });
    return toProjectResponse(updated);
  }

  // ================== HELPERS ==================
  private async findOrFail(id: number): Promise<Project> {
    const project = await this.repository.findById(id);
    if (!project) {
      throw new AppError(404, "Project not found");
    }
    return project;
  }

  private async assertActivePromoter(promoter_id: number): Promise<void> {
    const promoter = await this.promoterRepository.findById(promoter_id);
    if (!promoter) {
      throw new AppError(404, "El promoter_id indicado no existe");
    }
    if (promoter.get("status") !== "active") {
      throw new AppError(400, "El promotor indicado no está activo");
    }
  }
}
