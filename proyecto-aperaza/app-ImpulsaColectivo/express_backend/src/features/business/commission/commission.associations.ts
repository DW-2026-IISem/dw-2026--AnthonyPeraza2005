import { Commission } from "./commission.model";
import { PaymentTransaction } from "../payment-transaction/payment-transaction.model";

Commission.belongsTo(PaymentTransaction, {
  foreignKey: "payment_transaction_id",
  as: "payment_transaction",
});
PaymentTransaction.hasMany(Commission, {
  foreignKey: "payment_transaction_id",
  as: "commissions",
});
