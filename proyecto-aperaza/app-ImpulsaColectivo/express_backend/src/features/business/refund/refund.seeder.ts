import { faker } from "@faker-js/faker";
import { Refund } from "./refund.model";
import { Contribution } from "../contribution/contribution.model";

/**
 * Seeder del feature Refund (tabla `refunds`).
 * Requiere contribuciones activas ya sembradas.
 */
export async function seedRefunds(count: number): Promise<number> {
  const existing = await Refund.count();
  if (existing > 0) {
    console.log(`Refund: ya existen ${existing} registros, se omite el seed.`);
    return 0;
  }

  const activeContributions = await Contribution.findAll({ where: { status: "active" } });

  if (activeContributions.length === 0) {
    console.log("Refund: no hay contribuciones activas, se omite el seed.");
    return 0;
  }

  const reasons = [
    "El proyecto no alcanzó la meta de financiación",
    "Solicitud del contribuyente",
    "Cancelación del proyecto por el promotor",
    "Error en el monto de la contribución",
  ];

  let created = 0;
  for (let i = 0; i < count; i++) {
    const contribution = faker.helpers.arrayElement(activeContributions);

    await Refund.create({
      amount: Number(faker.finance.amount({ min: 10000, max: 300000, dec: 2 })),
      reason: faker.helpers.arrayElement(reasons),
      refund_date: faker.date.recent({ days: 60 }).toISOString().slice(0, 10),
      contribution_id: contribution.get("id") as number,
      status: "active",
    });
    created++;
  }

  console.log(`Refund: ${created} registros creados.`);
  return created;
}
