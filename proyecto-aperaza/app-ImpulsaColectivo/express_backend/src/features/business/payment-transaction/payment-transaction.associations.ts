import { PaymentTransaction } from "./payment-transaction.model";
import { Contribution } from "../contribution/contribution.model";

PaymentTransaction.belongsTo(Contribution, { foreignKey: "contribution_id", as: "contribution" });
Contribution.hasMany(PaymentTransaction, { foreignKey: "contribution_id", as: "payment_transactions" });
