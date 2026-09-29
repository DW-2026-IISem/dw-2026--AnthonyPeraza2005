import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../../database/db";

export interface ProjectAuditI {
  id: number;
  action: string;
  detail: string;
  audit_date: string;
  project_id: number;
  status: "active" | "inactive";
}

export interface ProjectAuditCreationI extends Optional<ProjectAuditI, "id" | "status"> {}

export class ProjectAudit
  extends Model<ProjectAuditI, ProjectAuditCreationI>
  implements ProjectAuditI
{
  public id!: number;
  public action!: string;
  public detail!: string;
  public audit_date!: string;
  public project_id!: number;
  public status!: "active" | "inactive";
}

ProjectAudit.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    action: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    detail: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    audit_date: {
      type: DataTypes.DATEONLY,
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
    modelName: "ProjectAudit",
    tableName: "project_audits",
    timestamps: true,
  }
);
