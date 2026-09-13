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

@Table({ tableName: 'refunds', underscored: true, timestamps: false })
export class RefundModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @ForeignKey(
    () =>
      require('../../../../contributions/infrastructure/persistence/models/contribution.model')
        .ContributionModel,
  )
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare referenceId: number;

  @BelongsTo(
    () =>
      require('../../../../contributions/infrastructure/persistence/models/contribution.model')
        .ContributionModel,
  )
  declare reference: unknown;

  @Column({ type: DataType.DATE, allowNull: false })
  declare date: Date;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare reason: string;

  @Column({ type: DataType.DECIMAL(12, 2), allowNull: false })
  declare total: number;

  @Column({
    type: DataType.ENUM(...Object.values(TransactionStatus)),
    allowNull: false,
    defaultValue: TransactionStatus.PENDIENTE,
  })
  declare status: TransactionStatus;
}
