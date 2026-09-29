import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export interface GoalI {
  id?: number;
  description: string;
  target_amount: number;
  project_id: number;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

export class Goal extends Model {
  public id!: number;
  public description!: string;
  public target_amount!: number;
  public project_id!: number;
  public status!: "active" | "inactive";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Goal.init(
  {
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    target_amount: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false,
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "inactive",
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Goal",
    tableName: "goals",
    timestamps: true,
  }
);
