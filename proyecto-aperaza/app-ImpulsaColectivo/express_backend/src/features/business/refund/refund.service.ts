import { AppError } from "../../../shared/errors/app-error";
import { ContributionRepository } from "../contribution/contribution.repository";
import { RefundRepository } from "./refund.repository";
import { CreateRefundDto, UpdateRefundDto, PatchRefundDto } from "./dto";

export class RefundService {
  constructor(
    private readonly repository: RefundRepository = new RefundRepository(),
    private readonly contributionRepository: ContributionRepository = new ContributionRepository(),
  ) {}

  async getAll() {
    return this.repository.findAll();
  }

  async getOne(id: number) {
    return this.findOrFail(id);
  }

  async create(dto: CreateRefundDto) {
    await this.assertActiveContribution(dto.contribution_id);
    return this.repository.create({
      ...dto,
      status: dto.status ?? "inactive",
    });
  }

  async updatePut(id: number, dto: UpdateRefundDto) {
    const refund = await this.findOrFail(id);
    await this.assertActiveContribution(dto.contribution_id);
    return this.repository.update(refund, { ...dto });
  }

  async updatePatch(id: number, dto: PatchRefundDto) {
    const refund = await this.findOrFail(id);
    if (dto.contribution_id !== undefined) {
      await this.assertActiveContribution(dto.contribution_id);
    }
    return this.repository.update(refund, { ...dto });
  }

  async deletePhysical(id: number): Promise<void> {
    const refund = await this.findOrFail(id);
    await this.repository.delete(refund);
  }

  async deleteLogical(id: number): Promise<void> {
    const refund = await this.findOrFail(id);
    await this.repository.update(refund, { status: "inactive" });
  }

  private async findOrFail(id: number) {
    const refund = await this.repository.findById(id);
    if (!refund) {
      throw new AppError(404, "Refund no encontrado");
    }
    return refund;
  }

  private async assertActiveContribution(contributionId: number): Promise<void> {
    const contribution = await this.contributionRepository.findById(contributionId);
    if (!contribution) {
      throw new AppError(404, "El contribution_id indicado no existe");
    }
    if (contribution.status !== "active") {
      throw new AppError(400, "La contribución indicada no está activa");
    }
  }
}
