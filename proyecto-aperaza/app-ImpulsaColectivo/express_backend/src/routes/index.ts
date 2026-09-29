import { PromoterRoutes } from "../features/business/promoter/promoter.routes";
import { ContributorRoutes } from "../features/business/contributor/contributor.routes";

export class Routes {
  public promoterRoutes: PromoterRoutes = new PromoterRoutes();
    public contributorRoutes: ContributorRoutes = new ContributorRoutes();
}
