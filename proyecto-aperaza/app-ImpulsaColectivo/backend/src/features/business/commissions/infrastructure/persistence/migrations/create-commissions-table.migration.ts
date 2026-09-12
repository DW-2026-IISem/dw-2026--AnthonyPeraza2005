export const createCommissionsTableMigration = {
  name: 'create-commissions-table',
  async up(): Promise<void> {
    // Sequelize sync handles table creation in development.
    // Production: CREATE TABLE commissions (id, reference_id, date, amount, status, notes)
  },
  async down(): Promise<void> {
    // Production: DROP TABLE commissions
  },
};
