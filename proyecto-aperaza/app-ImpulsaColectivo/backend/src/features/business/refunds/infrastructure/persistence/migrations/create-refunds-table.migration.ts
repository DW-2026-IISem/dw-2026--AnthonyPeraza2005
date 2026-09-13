export const createRefundsTableMigration = {
  name: 'create-refunds-table',
  async up(): Promise<void> {
    // Sequelize sync handles table creation in development.
    // Production: CREATE TABLE refunds (id, reference_id, date, reason, total, status)
  },
  async down(): Promise<void> {
    // Production: DROP TABLE refunds
  },
};
