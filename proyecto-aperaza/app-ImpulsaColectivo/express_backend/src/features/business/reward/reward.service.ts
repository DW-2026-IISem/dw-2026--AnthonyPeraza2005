import { AppError } from "../../../shared/errors/app-error";
import { RewardRepository } from "./reward.repository";
import { ProjectRepository } from "../project/project.repository";
import { Reward } from "./reward.model";
import {
  CreateRewardDto,
  UpdateRewardDto,
  PatchRewardDto,
  RewardResponseDto,
  toRewardResponse,
} from "./dto";

export class RewardService {
  public constructor(
    private readonly repository: RewardRepository = new RewardRepository(),
    private readonly projectRepository: ProjectRepository = new ProjectRepository()
  ) {}

  public async getAll(): Promise<RewardResponseDto[]> {
    const rewards = await this.repository.findAll();
    return rewards.map(toRewardResponse);
  }

  public async getOne(id: number): Promise<RewardResponseDto> {
    return toRewardResponse(await this.findOrFail(id));
  }

  public async create(body: CreateRewardDto): Promise<RewardResponseDto> {
    await this.assertActiveProject(body.project_id);

    const reward = await this.repository.create({
      title: body.title,
      description: body.description,
      min_amount: body.min_amount,
      project_id: body.project_id,
      status: body.status ?? "inactive",
    });

    return toRewardResponse(reward);
  }

  public async updatePut(id: number, body: UpdateRewardDto): Promise<RewardResponseDto> {
    const reward = await this.findOrFail(id);
    await this.assertActiveProject(body.project_id);

    const updated = await this.repository.update(reward, {
      title: body.title,
      description: body.description,
      min_amount: body.min_amount,
      project_id: body.project_id,
      status: body.status,
    });

    return toRewardResponse(updated);
  }

  public async updatePatch(id: number, body: PatchRewardDto): Promise<RewardResponseDto> {
    const reward = await this.findOrFail(id);

    if (body.project_id !== undefined) {
      await this.assertActiveProject(body.project_id);
    }

    const updated = await this.repository.update(reward, body);
    return toRewardResponse(updated);
  }

  public async deletePhysical(id: number): Promise<void> {
    const reward = await this.findOrFail(id);
    await this.repository.delete(reward);
  }

  public async deleteLogical(id: number): Promise<RewardResponseDto> {
    const reward = await this.findOrFail(id);
    const updated = await this.repository.update(reward, { status: "inactive" });
    return toRewardResponse(updated);
  }

  // ================== HELPERS ==================
  private async findOrFail(id: number): Promise<Reward> {
    const reward = await this.repository.findById(id);
    if (!reward) {
      throw new AppError(404, "Reward not found");
    }
    return reward;
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
}
