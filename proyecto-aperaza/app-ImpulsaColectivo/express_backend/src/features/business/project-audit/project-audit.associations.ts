import { ProjectAudit } from "./project-audit.model";
import { Project } from "../project/project.model";

ProjectAudit.belongsTo(Project, { foreignKey: "project_id", as: "project" });
Project.hasMany(ProjectAudit, { foreignKey: "project_id", as: "audits" });
