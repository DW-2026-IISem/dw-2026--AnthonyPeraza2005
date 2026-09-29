import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../../database/db";

export interface PaymentTransactionI {
  id: number;
  reference: string;
  payment_method: string;
  amount: number;
  transaction_date: string;
  contribution_id: number;
  status: "active" | "inactive";
}

export interface PaymentTransactionCreationI
  extends Optional<PaymentTransactionI, "id" | "status"> {}

export class PaymentTransaction
  extends Model<PaymentTransactionI, PaymentTransactionCreationI>
  implements PaymentTransactionI
{
  public id!: number;
  public reference!: string;
  public payment_method!: string;
  public amount!: number;
  public transaction_date!: string;
  public contribution_id!: number;
  public status!: "active" | "inactive";
}

PaymentTransaction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    reference: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    payment_method: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false,
    },
    transaction_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    contribution_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      allowNull: false,
      defaultValue: "inactive",
    },
  },
  {
    sequelize,
    modelName: "PaymentTransaction",
    tableName: "payment_transactions",
    timestamps: true,
  }
);
