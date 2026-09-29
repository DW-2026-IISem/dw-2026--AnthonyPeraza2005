import { faker } from "@faker-js/faker";
import { Commission } from "./commission.model";
import { PaymentTransaction } from "../payment-transaction/payment-transaction.model";

/**
 * Seeder del feature Commission (tabla `commissions`).
 * Requiere transacciones de pago activas ya sembradas.
 */
export async function seedCommissions(count: number): Promise<number> {
  const existing = await Commission.count();
  if (existing > 0) {
    console.log(`Commission: ya existen ${existing} registros, se omite el seed.`);
    return 0;
  }

  const activePaymentTransactions = await PaymentTransaction.findAll({ where: { status: "active" } });

  if (activePaymentTransactions.length === 0) {
    console.log("Commission: no hay transacciones de pago activas, se omite el seed.");
    return 0;
  }

  let created = 0;
  for (let i = 0; i < count; i++) {
    const payment_transaction = faker.helpers.arrayElement(activePaymentTransactions);
    const percentage = Number(faker.finance.amount({ min: 1, max: 10, dec: 2 }));
    const baseAmount = Number(payment_transaction.get("amount"));

    await Commission.create({
      percentage,
      amount: Number(((baseAmount * percentage) / 100).toFixed(2)),
      calculation_date: faker.date.recent({ days: 60 }).toISOString().slice(0, 10),
      payment_transaction_id: payment_transaction.get("id") as number,
      status: "active",
    });
    created++;
  }

  console.log(`Commission: ${created} registros creados.`);
  return created;
}
