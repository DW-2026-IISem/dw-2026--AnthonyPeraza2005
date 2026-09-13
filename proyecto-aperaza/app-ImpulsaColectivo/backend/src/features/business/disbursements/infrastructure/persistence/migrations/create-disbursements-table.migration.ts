export const createDisbursementsTableMigration = {
  name: 'create-disbursements-table',
  async up(): Promise<void> {
    // Sequelize sync handles table creation in development.
    // Production: CREATE TABLE disbursements (id, name, description, is_active, project_id, created_at, updated_at)
  },
  async down(): Promise<void> {
    // Production: DROP TABLE disbursements
  },
};
