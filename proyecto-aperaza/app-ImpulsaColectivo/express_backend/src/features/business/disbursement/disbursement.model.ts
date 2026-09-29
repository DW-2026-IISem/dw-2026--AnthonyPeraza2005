import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../../database/db";

export interface DisbursementI {
  id: number;
  amount: number;
  disbursement_date: string;
  method: string;
  project_id: number;
  status: "active" | "inactive";
}

export interface DisbursementCreationI extends Optional<DisbursementI, "id" | "status"> {}

export class Disbursement
  extends Model<DisbursementI, DisbursementCreationI>
  implements DisbursementI
{
  public id!: number;
  public amount!: number;
  public disbursement_date!: string;
  public method!: string;
  public project_id!: number;
  public status!: "active" | "inactive";
}

Disbursement.init(
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
    disbursement_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    method: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    project_id: {
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
    modelName: "Disbursement",
    tableName: "disbursements",
    timestamps: true,
  }
);
