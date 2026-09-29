import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../../database/db";

export interface ContributionI {
  id: number;
  amount: number;
  contribution_date: string;
  project_id: number;
  contributor_id: number;
  status: "active" | "inactive";
}

export interface ContributionCreationI extends Optional<ContributionI, "id" | "status"> {}

export class Contribution
  extends Model<ContributionI, ContributionCreationI>
  implements ContributionI
{
  public id!: number;
  public amount!: number;
  public contribution_date!: string;
  public project_id!: number;
  public contributor_id!: number;
  public status!: "active" | "inactive";
}

Contribution.init(
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
    contribution_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    contributor_id: {
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
    modelName: "Contribution",
    tableName: "contributions",
    timestamps: true,
  }
);
