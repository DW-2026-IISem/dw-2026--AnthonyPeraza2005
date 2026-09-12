export const createPaymentTransactionsTableMigration = {
  name: 'create-payment_transactions-table',
  async up(): Promise<void> {
    // Sequelize sync handles table creation in development.
    // Production: CREATE TABLE payment_transactions (id, reference_id, date, amount, status, notes)
  },
  async down(): Promise<void> {
    // Production: DROP TABLE payment_transactions
  },
};
