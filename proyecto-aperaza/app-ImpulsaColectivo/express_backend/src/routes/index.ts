import { PromoterRoutes } from "../features/business/promoter/promoter.routes";
import { ContributorRoutes } from "../features/business/contributor/contributor.routes";
import { ProjectRoutes } from "../features/business/project/project.routes";
import { GoalRoutes } from "../features/business/goal/goal.routes"; 
import { RewardRoutes } from "../features/business/reward/reward.routes";  
import { ContributionRoutes } from "../features/business/contribution/contribution.routes";
import { PaymentTransactionRoutes } from "../features/business/payment-transaction/payment-transaction.routes";

export class Routes {
  public promoterRoutes: PromoterRoutes = new PromoterRoutes();
    public contributorRoutes: ContributorRoutes = new ContributorRoutes();
      public projectRoutes: ProjectRoutes = new ProjectRoutes();
        public goalRoutes: GoalRoutes = new GoalRoutes();
          public rewardRoutes: RewardRoutes = new RewardRoutes();
            public contributionRoutes: ContributionRoutes = new ContributionRoutes();
              public paymentTransactionRoutes: PaymentTransactionRoutes = new PaymentTransactionRoutes();
}
