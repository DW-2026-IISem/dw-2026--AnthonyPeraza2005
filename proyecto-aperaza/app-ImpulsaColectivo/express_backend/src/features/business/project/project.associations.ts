import { Project } from "./project.model";
import { Promoter } from "../promoter/promoter.model";

Project.belongsTo(Promoter, { foreignKey: "promoter_id", as: "promoter" });
Promoter.hasMany(Project, { foreignKey: "promoter_id", as: "projects" });
