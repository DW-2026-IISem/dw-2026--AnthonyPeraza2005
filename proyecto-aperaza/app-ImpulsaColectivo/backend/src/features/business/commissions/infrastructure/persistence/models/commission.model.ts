import {
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { TransactionStatus } from '../../../../../../common/enums/transaction-status.enum';

@Table({ tableName: 'commissions', underscored: true, timestamps: false })
export class CommissionModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @ForeignKey(
    () =>
      require('../../../../projects/infrastructure/persistence/models/project.model')
        .ProjectModel,
  )
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare referenceId: number;

  @BelongsTo(
    () =>
      require('../../../../projects/infrastructure/persistence/models/project.model')
        .ProjectModel,
  )
  declare reference: unknown;

  @Column({ type: DataType.DATE, allowNull: false })
  declare date: Date;

  @Column({ type: DataType.DECIMAL(12, 2), allowNull: false })
  declare amount: number;

  @Column({
    type: DataType.ENUM(...Object.values(TransactionStatus)),
    allowNull: false,
    defaultValue: TransactionStatus.PENDIENTE,
  })
  declare status: TransactionStatus;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare notes: string | null;
}
