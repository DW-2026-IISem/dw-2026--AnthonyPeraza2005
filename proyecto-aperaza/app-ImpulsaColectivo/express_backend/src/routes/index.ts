import { PromoterRoutes } from "../features/business/promoter/promoter.routes";
import { ContributorRoutes } from "../features/business/contributor/contributor.routes";
import { ProjectRoutes } from "../features/business/project/project.routes";
import { GoalRoutes } from "../features/business/goal/goal.routes"; 
import { RewardRoutes } from "../features/business/reward/reward.routes";  
import { ContributionRoutes } from "../features/business/contribution/contribution.routes";
import { PaymentTransactionRoutes } from "../features/business/payment-transaction/payment-transaction.routes";
import { CommissionRoutes } from "../features/business/commission/commission.routes";
import { DisbursementRoutes } from "../features/business/disbursement/disbursement.routes";
import { RefundRoutes } from "../features/business/refund/refund.routes";
import { ProjectAuditRoutes } from "../features/business/project-audit/project-audit.routes";
import { UsersRoutes } from "../features/auth/users/users.routes";
import { RolesRoutes } from "../features/auth/roles/roles.routes";
import { ResourcesRoutes } from "../features/auth/resources/resources.routes";
import { RoleUsersRoutes } from "../features/auth/role-users/role-users.routes";
import { ResourceRolesRoutes } from "../features/auth/resource-roles/resource-roles.routes";
import { RefreshTokensRoutes } from "../features/auth/refresh-tokens/refresh-tokens.routes";

export class Routes {
  public promoterRoutes: PromoterRoutes = new PromoterRoutes();
    public contributorRoutes: ContributorRoutes = new ContributorRoutes();
      public projectRoutes: ProjectRoutes = new ProjectRoutes();
        public goalRoutes: GoalRoutes = new GoalRoutes();
          public rewardRoutes: RewardRoutes = new RewardRoutes();
            public contributionRoutes: ContributionRoutes = new ContributionRoutes();
              public paymentTransactionRoutes: PaymentTransactionRoutes = new PaymentTransactionRoutes();
                public commissionRoutes: CommissionRoutes = new CommissionRoutes();
                  public disbursementRoutes: DisbursementRoutes = new DisbursementRoutes();
                    public refundRoutes: RefundRoutes = new RefundRoutes();
                      public projectAuditRoutes: ProjectAuditRoutes = new ProjectAuditRoutes();
                        public usersRoutes: UsersRoutes = new UsersRoutes();
                          public rolesRoutes: RolesRoutes = new RolesRoutes();
                          public resourcesRoutes: ResourcesRoutes = new ResourcesRoutes();
                            public roleUsersRoutes: RoleUsersRoutes = new RoleUsersRoutes();
                             public resourceRolesRoutes: ResourceRolesRoutes = new ResourceRolesRoutes();
                               public refreshTokensRoutes: RefreshTokensRoutes = new RefreshTokensRoutes();
}
