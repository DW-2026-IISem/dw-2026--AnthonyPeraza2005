import { AppError } from "../../../shared/errors/app-error";
import { PromoterRepository } from "./promoter.repository";
import { Promoter } from "./promoter.model";
import {
  CreatePromoterDto,
  UpdatePromoterDto,
  PatchPromoterDto,
  PromoterResponseDto,
  toPromoterResponse,
} from "./dto";

export class PromoterService {
  public constructor(
    private readonly repository: PromoterRepository = new PromoterRepository()
  ) {}

  public async getAll(): Promise<PromoterResponseDto[]> {
    const promoters = await this.repository.findAll();
    return promoters.map(toPromoterResponse);
  }

  public async getOne(id: number): Promise<PromoterResponseDto> {
    return toPromoterResponse(await this.findOrFail(id));
  }

  public async create(body: CreatePromoterDto): Promise<PromoterResponseDto> {
    await this.assertEmailAvailable(body.contact_email);

    const promoter = await this.repository.create({
      name: body.name,
      description: body.description,
      contact_email: body.contact_email,
      contact_phone: body.contact_phone,
      status: body.status ?? "inactive",
    });

    return toPromoterResponse(promoter);
  }

  public async updatePut(id: number, body: UpdatePromoterDto): Promise<PromoterResponseDto> {
    const promoter = await this.findOrFail(id);
    await this.assertEmailAvailable(body.contact_email, id);

    const updated = await this.repository.update(promoter, {
      name: body.name,
      description: body.description,
      contact_email: body.contact_email,
      contact_phone: body.contact_phone,
      status: body.status,
    });

    return toPromoterResponse(updated);
  }

  public async updatePatch(id: number, body: PatchPromoterDto): Promise<PromoterResponseDto> {
    const promoter = await this.findOrFail(id);

    if (body.contact_email !== undefined) {
      await this.assertEmailAvailable(body.contact_email, id);
    }

    const updated = await this.repository.update(promoter, body);
    return toPromoterResponse(updated);
  }

  public async deletePhysical(id: number): Promise<void> {
    const promoter = await this.findOrFail(id);
    await this.repository.delete(promoter);
  }

  public async deleteLogical(id: number): Promise<PromoterResponseDto> {
    const promoter = await this.findOrFail(id);
    const updated = await this.repository.update(promoter, { status: "inactive" });
    return toPromoterResponse(updated);
  }

  // ================== HELPERS ==================
  private async findOrFail(id: number): Promise<Promoter> {
    const promoter = await this.repository.findById(id);
    if (!promoter) {
      throw new AppError(404, "Promoter not found");
    }
    return promoter;
  }

  private async assertEmailAvailable(email: string, excludeId?: number): Promise<void> {
    const existing = await this.repository.findByEmail(email);
    if (existing && existing.get("id") !== excludeId) {
      throw new AppError(409, "contact_email is already in use");
    }
  }
}
