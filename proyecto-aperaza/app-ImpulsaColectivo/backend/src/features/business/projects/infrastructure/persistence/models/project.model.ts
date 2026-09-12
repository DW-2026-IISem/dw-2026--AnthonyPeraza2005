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

@Table({ tableName: 'projects', underscored: true })
export class ProjectModel extends Model {
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
      require('../../../../promoters/infrastructure/persistence/models/promoter.model')
        .PromoterModel,
  )
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare promoterId: number;

  @BelongsTo(
    () =>
      require('../../../../promoters/infrastructure/persistence/models/promoter.model')
        .PromoterModel,
  )
  declare promoter: unknown;

  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
}
