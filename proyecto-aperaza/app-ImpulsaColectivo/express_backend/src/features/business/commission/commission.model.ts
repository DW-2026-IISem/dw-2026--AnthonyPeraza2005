import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../../database/db";

export interface CommissionI {
  id: number;
  percentage: number;
  amount: number;
  calculation_date: string;
  payment_transaction_id: number;
  status: "active" | "inactive";
}

export interface CommissionCreationI extends Optional<CommissionI, "id" | "status"> {}

export class Commission
  extends Model<CommissionI, CommissionCreationI>
  implements CommissionI
{
  public id!: number;
  public percentage!: number;
  public amount!: number;
  public calculation_date!: string;
  public payment_transaction_id!: number;
  public status!: "active" | "inactive";
}

Commission.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    percentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false,
    },
    calculation_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    payment_transaction_id: {
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
    modelName: "Commission",
    tableName: "commissions",
    timestamps: true,
  }
);
