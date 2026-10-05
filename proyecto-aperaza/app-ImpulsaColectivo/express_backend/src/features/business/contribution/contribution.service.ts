import { AppError } from "../../../shared/errors/app-error";
import { ContributionRepository } from "./contribution.repository";
import { ProjectRepository } from "../project/project.repository";
import { ContributorRepository } from "../contributor/contributor.repository";
import { Contribution } from "./contribution.model";
import {
  CreateContributionDto,
  UpdateContributionDto,
  PatchContributionDto,
  ContributionResponseDto,
  toContributionResponse,
} from "./dto";

export class ContributionService {
  public constructor(
    private readonly repository: ContributionRepository = new ContributionRepository(),
    private readonly projectRepository: ProjectRepository = new ProjectRepository(),
    private readonly contributorRepository: ContributorRepository = new ContributorRepository()
  ) {}

  public async getAll(): Promise<ContributionResponseDto[]> {
    const contributions = await this.repository.findAll();
    return contributions.map(toContributionResponse);
  }

  public async getOne(id: number): Promise<ContributionResponseDto> {
    return toContributionResponse(await this.findOrFail(id));
  }

  public async create(body: CreateContributionDto): Promise<ContributionResponseDto> {
    await this.assertActiveProject(body.project_id);
    await this.assertActiveContributor(body.contributor_id);

    const contribution = await this.repository.create({
      amount: body.amount,
      contribution_date: body.contribution_date,
      project_id: body.project_id,
      contributor_id: body.contributor_id,
      status: body.status ?? "inactive",
    });

    return toContributionResponse(contribution);
  }

  public async updatePut(id: number, body: UpdateContributionDto): Promise<ContributionResponseDto> {
    const contribution = await this.findOrFail(id);
    await this.assertActiveProject(body.project_id);
    await this.assertActiveContributor(body.contributor_id);

    const updated = await this.repository.update(contribution, {
      amount: body.amount,
      contribution_date: body.contribution_date,
      project_id: body.project_id,
      contributor_id: body.contributor_id,
      status: body.status,
    });

    return toContributionResponse(updated);
  }

  public async updatePatch(id: number, body: PatchContributionDto): Promise<ContributionResponseDto> {
    const contribution = await this.findOrFail(id);

    if (body.project_id !== undefined) {
      await this.assertActiveProject(body.project_id);
    }
    if (body.contributor_id !== undefined) {
      await this.assertActiveContributor(body.contributor_id);
    }

    const updated = await this.repository.update(contribution, body);
    return toContributionResponse(updated);
  }

  public async deletePhysical(id: number): Promise<void> {
    const contribution = await this.findOrFail(id);
    await this.repository.delete(contribution);
  }

  public async deleteLogical(id: number): Promise<ContributionResponseDto> {
    const contribution = await this.findOrFail(id);
    const updated = await this.repository.update(contribution, { status: "inactive" });
    return toContributionResponse(updated);
  }

  // ================== HELPERS ==================
  private async findOrFail(id: number): Promise<Contribution> {
    const contribution = await this.repository.findById(id);
    if (!contribution) {
      throw new AppError(404, "Contribution not found");
    }
    return contribution;
  }

  private async assertActiveProject(project_id: number): Promise<void> {
    const project = await this.projectRepository.findById(project_id);
    if (!project) {
      throw new AppError(404, "El project_id indicado no existe");
    }
    if (project.get("status") !== "active") {
      throw new AppError(400, "El proyecto indicado no está activo");
    }
  }

  private async assertActiveContributor(contributor_id: number): Promise<void> {
    const contributor = await this.contributorRepository.findById(contributor_id);
    if (!contributor) {
      throw new AppError(404, "El contributor_id indicado no existe");
    }
    if (contributor.get("status") !== "active") {
      throw new AppError(400, "El contribuyente indicado no está activo");
    }
  }
}
