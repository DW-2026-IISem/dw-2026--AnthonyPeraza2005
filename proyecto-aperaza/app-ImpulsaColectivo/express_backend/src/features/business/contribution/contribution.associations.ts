import { Contribution } from "./contribution.model";
import { Project } from "../project/project.model";
import { Contributor } from "../contributor/contributor.model";

Contribution.belongsTo(Project, { foreignKey: "project_id", as: "project" });
Project.hasMany(Contribution, { foreignKey: "project_id", as: "contributions" });

Contribution.belongsTo(Contributor, { foreignKey: "contributor_id", as: "contributor" });
Contributor.hasMany(Contribution, { foreignKey: "contributor_id", as: "contributions" });
