import { Refund } from "./refund.model";
import { Contribution } from "../contribution/contribution.model";

Refund.belongsTo(Contribution, { foreignKey: "contribution_id", as: "contribution" });
Contribution.hasMany(Refund, { foreignKey: "contribution_id", as: "refunds" });
