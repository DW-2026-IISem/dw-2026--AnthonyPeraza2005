import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export interface RewardI {
  id?: number;
  title: string;
  description: string;
  min_amount: number;
  project_id: number;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

export class Reward extends Model {
  public id!: number;
  public title!: string;
  public description!: string;
  public min_amount!: number;
  public project_id!: number;
  public status!: "active" | "inactive";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Reward.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    min_amount: {
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
    modelName: "Reward",
    tableName: "rewards",
    timestamps: true,
  }
);
