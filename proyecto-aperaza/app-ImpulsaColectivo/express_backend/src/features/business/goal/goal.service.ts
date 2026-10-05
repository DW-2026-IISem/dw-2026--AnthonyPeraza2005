import { AppError } from "../../../shared/errors/app-error";
import { GoalRepository } from "./goal.repository";
import { ProjectRepository } from "../project/project.repository";
import { Goal } from "./goal.model";
import {
  CreateGoalDto,
  UpdateGoalDto,
  PatchGoalDto,
  GoalResponseDto,
  toGoalResponse,
} from "./dto";

export class GoalService {
  public constructor(
    private readonly repository: GoalRepository = new GoalRepository(),
    private readonly projectRepository: ProjectRepository = new ProjectRepository()
  ) {}

  public async getAll(): Promise<GoalResponseDto[]> {
    const goals = await this.repository.findAll();
    return goals.map(toGoalResponse);
  }

  public async getOne(id: number): Promise<GoalResponseDto> {
    return toGoalResponse(await this.findOrFail(id));
  }

  public async create(body: CreateGoalDto): Promise<GoalResponseDto> {
    await this.assertActiveProject(body.project_id);

    const goal = await this.repository.create({
      description: body.description,
      target_amount: body.target_amount,
      project_id: body.project_id,
      status: body.status ?? "inactive",
    });

    return toGoalResponse(goal);
  }

  public async updatePut(id: number, body: UpdateGoalDto): Promise<GoalResponseDto> {
    const goal = await this.findOrFail(id);
    await this.assertActiveProject(body.project_id);

    const updated = await this.repository.update(goal, {
      description: body.description,
      target_amount: body.target_amount,
      project_id: body.project_id,
      status: body.status,
    });

    return toGoalResponse(updated);
  }

  public async updatePatch(id: number, body: PatchGoalDto): Promise<GoalResponseDto> {
    const goal = await this.findOrFail(id);

    if (body.project_id !== undefined) {
      await this.assertActiveProject(body.project_id);
    }

    const updated = await this.repository.update(goal, body);
    return toGoalResponse(updated);
  }

  public async deletePhysical(id: number): Promise<void> {
    const goal = await this.findOrFail(id);
    await this.repository.delete(goal);
  }

  public async deleteLogical(id: number): Promise<GoalResponseDto> {
    const goal = await this.findOrFail(id);
    const updated = await this.repository.update(goal, { status: "inactive" });
    return toGoalResponse(updated);
  }

  // ================== HELPERS ==================
  private async findOrFail(id: number): Promise<Goal> {
    const goal = await this.repository.findById(id);
    if (!goal) {
      throw new AppError(404, "Goal not found");
    }
    return goal;
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
