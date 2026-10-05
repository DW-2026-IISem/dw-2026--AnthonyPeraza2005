import { AppError } from "../../../shared/errors/app-error";
import { ProjectRepository } from "../project/project.repository";
import { DisbursementRepository } from "./disbursement.repository";
import {
  CreateDisbursementDto,
  UpdateDisbursementDto,
  PatchDisbursementDto,
} from "./dto";

export class DisbursementService {
  constructor(
    private readonly repository: DisbursementRepository = new DisbursementRepository(),
    private readonly projectRepository: ProjectRepository = new ProjectRepository(),
  ) {}

  async getAll() {
    return this.repository.findAll();
  }

  async getOne(id: number) {
    return this.findOrFail(id);
  }

  async create(dto: CreateDisbursementDto) {
    await this.assertActiveProject(dto.project_id);
    return this.repository.create({
      ...dto,
      status: dto.status ?? "inactive",
    });
  }

  async updatePut(id: number, dto: UpdateDisbursementDto) {
    const disbursement = await this.findOrFail(id);
    await this.assertActiveProject(dto.project_id);
    return this.repository.update(disbursement, { ...dto });
  }

  async updatePatch(id: number, dto: PatchDisbursementDto) {
    const disbursement = await this.findOrFail(id);
    if (dto.project_id !== undefined) {
      await this.assertActiveProject(dto.project_id);
    }
    return this.repository.update(disbursement, { ...dto });
  }

  async deletePhysical(id: number): Promise<void> {
    const disbursement = await this.findOrFail(id);
    await this.repository.delete(disbursement);
  }

  async deleteLogical(id: number): Promise<void> {
    const disbursement = await this.findOrFail(id);
    await this.repository.update(disbursement, { status: "inactive" });
  }

  private async findOrFail(id: number) {
    const disbursement = await this.repository.findById(id);
    if (!disbursement) {
      throw new AppError(404, "Disbursement no encontrado");
    }
    return disbursement;
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
