import { AppError } from "../../../shared/errors/app-error";
import { PaymentTransactionRepository } from "./payment-transaction.repository";
import { ContributionRepository } from "../contribution/contribution.repository";
import { PaymentTransaction } from "./payment-transaction.model";
import {
  CreatePaymentTransactionDto,
  UpdatePaymentTransactionDto,
  PatchPaymentTransactionDto,
  PaymentTransactionResponseDto,
  toPaymentTransactionResponse,
} from "./dto";

export class PaymentTransactionService {
  public constructor(
    private readonly repository: PaymentTransactionRepository = new PaymentTransactionRepository(),
    private readonly contributionRepository: ContributionRepository = new ContributionRepository()
  ) {}

  public async getAll(): Promise<PaymentTransactionResponseDto[]> {
    const paymentTransactions = await this.repository.findAll();
    return paymentTransactions.map(toPaymentTransactionResponse);
  }

  public async getOne(id: number): Promise<PaymentTransactionResponseDto> {
    return toPaymentTransactionResponse(await this.findOrFail(id));
  }

  public async create(body: CreatePaymentTransactionDto): Promise<PaymentTransactionResponseDto> {
    await this.assertReferenceAvailable(body.reference);
    await this.assertActiveContribution(body.contribution_id);

    const paymentTransaction = await this.repository.create({
      reference: body.reference,
      payment_method: body.payment_method,
      amount: body.amount,
      transaction_date: body.transaction_date,
      contribution_id: body.contribution_id,
      status: body.status ?? "inactive",
    });

    return toPaymentTransactionResponse(paymentTransaction);
  }

  public async updatePut(
    id: number,
    body: UpdatePaymentTransactionDto
  ): Promise<PaymentTransactionResponseDto> {
    const paymentTransaction = await this.findOrFail(id);
    await this.assertReferenceAvailable(body.reference, id);
    await this.assertActiveContribution(body.contribution_id);

    const updated = await this.repository.update(paymentTransaction, {
      reference: body.reference,
      payment_method: body.payment_method,
      amount: body.amount,
      transaction_date: body.transaction_date,
      contribution_id: body.contribution_id,
      status: body.status,
    });

    return toPaymentTransactionResponse(updated);
  }

  public async updatePatch(
    id: number,
    body: PatchPaymentTransactionDto
  ): Promise<PaymentTransactionResponseDto> {
    const paymentTransaction = await this.findOrFail(id);

    if (body.reference !== undefined) {
      await this.assertReferenceAvailable(body.reference, id);
    }
    if (body.contribution_id !== undefined) {
      await this.assertActiveContribution(body.contribution_id);
    }

    const updated = await this.repository.update(paymentTransaction, body);
    return toPaymentTransactionResponse(updated);
  }

  public async deletePhysical(id: number): Promise<void> {
    const paymentTransaction = await this.findOrFail(id);
    await this.repository.delete(paymentTransaction);
  }

  public async deleteLogical(id: number): Promise<PaymentTransactionResponseDto> {
    const paymentTransaction = await this.findOrFail(id);
    const updated = await this.repository.update(paymentTransaction, { status: "inactive" });
    return toPaymentTransactionResponse(updated);
  }

  // ================== HELPERS ==================
  private async findOrFail(id: number): Promise<PaymentTransaction> {
    const paymentTransaction = await this.repository.findById(id);
    if (!paymentTransaction) {
      throw new AppError(404, "Payment transaction not found");
    }
    return paymentTransaction;
  }

  private async assertReferenceAvailable(reference: string, excludeId?: number): Promise<void> {
    const existing = await this.repository.findByReference(reference);
    if (existing && existing.get("id") !== excludeId) {
      throw new AppError(409, "reference is already in use");
    }
  }

  private async assertActiveContribution(contribution_id: number): Promise<void> {
    const contribution = await this.contributionRepository.findById(contribution_id);
    if (!contribution) {
      throw new AppError(404, "El contribution_id indicado no existe");
    }
    if (contribution.get("status") !== "active") {
      throw new AppError(400, "La contribución indicada no está activa");
    }
  }
}
