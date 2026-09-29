import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../../database/db";

export interface RefundI {
  id: number;
  amount: number;
  reason: string;
  refund_date: string;
  contribution_id: number;
  status: "active" | "inactive";
}

export interface RefundCreationI extends Optional<RefundI, "id" | "status"> {}

export class Refund extends Model<RefundI, RefundCreationI> implements RefundI {
  public id!: number;
  public amount!: number;
  public reason!: string;
  public refund_date!: string;
  public contribution_id!: number;
  public status!: "active" | "inactive";
}

Refund.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    amount: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    refund_date: {
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
    modelName: "Refund",
    tableName: "refunds",
    timestamps: true,
  }
);
