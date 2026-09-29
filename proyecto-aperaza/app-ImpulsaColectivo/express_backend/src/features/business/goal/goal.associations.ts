import { Goal } from "./goal.model";
import { Project } from "../project/project.model";

Goal.belongsTo(Project, { foreignKey: "project_id", as: "project" });
Project.hasMany(Goal, { foreignKey: "project_id", as: "goals" });
