export const createRewardsTableMigration = {
  name: 'create-rewards-table',
  async up(): Promise<void> {
    // Sequelize sync handles table creation in development.
    // Production: CREATE TABLE rewards (id, name, description, is_active, project_id, created_at, updated_at)
  },
  async down(): Promise<void> {
    // Production: DROP TABLE rewards
  },
};
