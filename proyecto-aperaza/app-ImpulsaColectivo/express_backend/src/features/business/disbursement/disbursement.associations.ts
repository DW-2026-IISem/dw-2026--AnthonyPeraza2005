import { Disbursement } from "./disbursement.model";
import { Project } from "../project/project.model";

Disbursement.belongsTo(Project, { foreignKey: "project_id", as: "project" });
Project.hasMany(Disbursement, { foreignKey: "project_id", as: "disbursements" });
