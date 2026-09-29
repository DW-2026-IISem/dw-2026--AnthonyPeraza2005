import { faker } from "@faker-js/faker";
import { PaymentTransaction } from "./payment-transaction.model";
import { Contribution } from "../contribution/contribution.model";

/**
 * Seeder del feature PaymentTransaction (tabla `payment_transactions`).
 * Requiere contribuciones activas ya sembradas.
 */
export async function seedPaymentTransactions(count: number): Promise<number> {
  const existing = await PaymentTransaction.count();
  if (existing > 0) {
    console.log(`PaymentTransaction: ya existen ${existing} registros, se omite el seed.`);
    return 0;
  }

  const activeContributions = await Contribution.findAll({ where: { status: "active" } });

  if (activeContributions.length === 0) {
    console.log("PaymentTransaction: no hay contribuciones activas, se omite el seed.");
    return 0;
  }

  const methods = ["tarjeta_credito", "tarjeta_debito", "pse", "nequi", "transferencia"];

  let created = 0;
  for (let i = 0; i < count; i++) {
    const contribution = faker.helpers.arrayElement(activeContributions);

    await PaymentTransaction.create({
      reference: faker.string.alphanumeric(10).toUpperCase(),
      payment_method: faker.helpers.arrayElement(methods),
      amount: Number(faker.finance.amount({ min: 10000, max: 500000, dec: 2 })),
      transaction_date: faker.date.recent({ days: 60 }).toISOString().slice(0, 10),
      contribution_id: contribution.get("id") as number,
      status: "active",
    });
    created++;
  }

  console.log(`PaymentTransaction: ${created} registros creados.`);
  return created;
}
