import { AppError } from "../../../shared/errors/app-error";
import { PaymentTransactionRepository } from "../payment-transaction/payment-transaction.repository";
import { CommissionRepository } from "./commission.repository";
import {
  CreateCommissionDto,
  UpdateCommissionDto,
  PatchCommissionDto,
} from "./dto";

export class CommissionService {
  constructor(
    private readonly repository: CommissionRepository = new CommissionRepository(),
    private readonly paymentTransactionRepository: PaymentTransactionRepository = new PaymentTransactionRepository(),
  ) {}

  async getAll() {
    return this.repository.findAll();
  }

  async getOne(id: number) {
    return this.findOrFail(id);
  }

  async create(dto: CreateCommissionDto) {
    await this.assertActivePaymentTransaction(dto.payment_transaction_id);
    return this.repository.create({
      ...dto,
      status: dto.status ?? "inactive",
    });
  }

  async updatePut(id: number, dto: UpdateCommissionDto) {
    const commission = await this.findOrFail(id);
    await this.assertActivePaymentTransaction(dto.payment_transaction_id);
    return this.repository.update(commission, { ...dto });
  }

  async updatePatch(id: number, dto: PatchCommissionDto) {
    const commission = await this.findOrFail(id);
    if (dto.payment_transaction_id !== undefined) {
      await this.assertActivePaymentTransaction(dto.payment_transaction_id);
    }
    return this.repository.update(commission, { ...dto });
  }

  async deletePhysical(id: number): Promise<void> {
    const commission = await this.findOrFail(id);
    await this.repository.delete(commission);
  }

  async deleteLogical(id: number): Promise<void> {
    const commission = await this.findOrFail(id);
    await this.repository.update(commission, { status: "inactive" });
  }

  private async findOrFail(id: number) {
    const commission = await this.repository.findById(id);
    if (!commission) {
      throw new AppError(404, "Commission no encontrada");
    }
    return commission;
  }

  private async assertActivePaymentTransaction(paymentTransactionId: number): Promise<void> {
    const paymentTransaction = await this.paymentTransactionRepository.findById(paymentTransactionId);
    if (!paymentTransaction) {
      throw new AppError(404, "El payment_transaction_id indicado no existe");
    }
    if (paymentTransaction.status !== "active") {
      throw new AppError(400, "La transacción de pago indicada no está activa");
    }
  }
}
