import { CreationAttributes, Transaction } from "sequelize";
import { PaymentTransaction } from "./payment-transaction.model";

/**
 * Único punto del feature que habla con Sequelize.
 * El service nunca importa el modelo directamente.
 */
export class PaymentTransactionRepository {
  public async findAll(): Promise<PaymentTransaction[]> {
    return PaymentTransaction.findAll();
  }

  public async findById(id: number, transaction?: Transaction): Promise<PaymentTransaction | null> {
    return PaymentTransaction.findByPk(id, { transaction });
  }

  public async findByReference(reference: string): Promise<PaymentTransaction | null> {
    return PaymentTransaction.findOne({ where: { reference } });
  }

  public async create(data: CreationAttributes<PaymentTransaction>): Promise<PaymentTransaction> {
    return PaymentTransaction.create(data);
  }

  public async update(
    paymentTransaction: PaymentTransaction,
    data: Record<string, unknown>
  ): Promise<PaymentTransaction> {
    return paymentTransaction.update(data);
  }

  public async delete(paymentTransaction: PaymentTransaction): Promise<void> {
    await paymentTransaction.destroy();
  }
}
