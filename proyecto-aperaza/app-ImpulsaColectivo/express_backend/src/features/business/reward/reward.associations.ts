import { Reward } from "./reward.model";
import { Project } from "../project/project.model";

Reward.belongsTo(Project, { foreignKey: "project_id", as: "project" });
Project.hasMany(Reward, { foreignKey: "project_id", as: "rewards" });
