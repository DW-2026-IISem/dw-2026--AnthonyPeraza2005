import { Transaction } from "sequelize";
import { sequelize } from "../../database/db";

/**
 * Ejecuta `work` dentro de una transacción gestionada por Sequelize:
 * `commit` si termina bien, `rollback` si lanza.
 *
 * Los repositories reciben la transacción como parámetro opcional, de modo que
 * el service decide el alcance atómico y el repository sigue siendo la única
 * capa que toca Sequelize.
 */
export async function withTransaction<T>(work: (t: Transaction) => Promise<T>): Promise<T> {
  return sequelize.transaction(async (t) => work(t));
}
