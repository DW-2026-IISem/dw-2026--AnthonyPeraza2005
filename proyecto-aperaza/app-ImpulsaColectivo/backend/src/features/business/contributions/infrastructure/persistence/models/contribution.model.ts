import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

@Table({ tableName: 'contributions', underscored: true })
export class ContributionModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @Column({ type: DataType.STRING(150), allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare description: string | null;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  declare isActive: boolean;

  @ForeignKey(
    () =>
      require('../../../../projects/infrastructure/persistence/models/project.model')
        .ProjectModel,
  )
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare projectId: number;

  @BelongsTo(
    () =>
      require('../../../../projects/infrastructure/persistence/models/project.model')
        .ProjectModel,
  )
  declare project: unknown;

  @ForeignKey(
    () =>
      require('../../../../contributors/infrastructure/persistence/models/contributor.model')
        .ContributorModel,
  )
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare contributorId: number;

  @BelongsTo(
    () =>
      require('../../../../contributors/infrastructure/persistence/models/contributor.model')
        .ContributorModel,
  )
  declare contributor: unknown;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}
