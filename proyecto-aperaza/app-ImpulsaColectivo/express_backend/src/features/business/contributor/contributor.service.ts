import { AppError } from "../../../shared/errors/app-error";
import { ContributorRepository } from "./contributor.repository";
import { Contributor } from "./contributor.model";
import {
  CreateContributorDto,
  UpdateContributorDto,
  PatchContributorDto,
  ContributorResponseDto,
  toContributorResponse,
} from "./dto";

export class ContributorService {
  public constructor(
    private readonly repository: ContributorRepository = new ContributorRepository()
  ) {}

  public async getAll(): Promise<ContributorResponseDto[]> {
    const contributors = await this.repository.findAll();
    return contributors.map(toContributorResponse);
  }

  public async getOne(id: number): Promise<ContributorResponseDto> {
    return toContributorResponse(await this.findOrFail(id));
  }

  public async create(body: CreateContributorDto): Promise<ContributorResponseDto> {
    await this.assertEmailAvailable(body.email);

    const contributor = await this.repository.create({
      name: body.name,
      email: body.email,
      phone: body.phone,
      status: body.status ?? "inactive",
    });

    return toContributorResponse(contributor);
  }

  public async updatePut(id: number, body: UpdateContributorDto): Promise<ContributorResponseDto> {
    const contributor = await this.findOrFail(id);
    await this.assertEmailAvailable(body.email, id);

    const updated = await this.repository.update(contributor, {
      name: body.name,
      email: body.email,
      phone: body.phone,
      status: body.status,
    });

    return toContributorResponse(updated);
  }

  public async updatePatch(id: number, body: PatchContributorDto): Promise<ContributorResponseDto> {
    const contributor = await this.findOrFail(id);

    if (body.email !== undefined) {
      await this.assertEmailAvailable(body.email, id);
    }

    const updated = await this.repository.update(contributor, body);
    return toContributorResponse(updated);
  }

  public async deletePhysical(id: number): Promise<void> {
    const contributor = await this.findOrFail(id);
    await this.repository.delete(contributor);
  }

  public async deleteLogical(id: number): Promise<ContributorResponseDto> {
    const contributor = await this.findOrFail(id);
    const updated = await this.repository.update(contributor, { status: "inactive" });
    return toContributorResponse(updated);
  }

  // ================== HELPERS ==================
  private async findOrFail(id: number): Promise<Contributor> {
    const contributor = await this.repository.findById(id);
    if (!contributor) {
      throw new AppError(404, "Contributor not found");
    }
    return contributor;
  }

  private async assertEmailAvailable(email: string, excludeId?: number): Promise<void> {
    const existing = await this.repository.findByEmail(email);
    if (existing && existing.get("id") !== excludeId) {
      throw new AppError(409, "email is already in use");
    }
  }
}
