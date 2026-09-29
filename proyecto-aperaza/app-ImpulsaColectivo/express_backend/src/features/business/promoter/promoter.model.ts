import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../database/db";

export interface PromoterI {
  id?: number;
  name: string;
  description: string;
  contact_email: string;
  contact_phone: string;
  status: "active" | "inactive";
  createdAt?: Date;
  updatedAt?: Date;
}

export class Promoter extends Model {
  public id!: number;
  public name!: string;
  public description!: string;
  public contact_email!: string;
  public contact_phone!: string;
  public status!: "active" | "inactive";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Promoter.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Name cannot be empty" },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    contact_email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: "Contact email must be a valid email address" },
      },
    },
    contact_phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("active", "inactive"),
      defaultValue: "inactive",
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Promoter",
    tableName: "promoters",
    timestamps: true,
  }
);
