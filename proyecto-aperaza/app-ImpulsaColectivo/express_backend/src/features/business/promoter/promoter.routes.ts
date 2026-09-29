import { Application } from "express";
import { PromoterController } from "./promoter.controller";

export class PromoterRoutes {
  public promoterController: PromoterController = new PromoterController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN / SIN MIDDLEWARE JWT ==================
    // (rellenar en ISS-03-B…E)
        // getAll
    app
      .route("/api/promotores")
      .get(this.promoterController.getAll.bind(this.promoterController));

    // getOne
    app
      .route("/api/promotores/:id")
      .get(this.promoterController.getOne.bind(this.promoterController));
        // create
    app
      .route("/api/promotores")
      .post(this.promoterController.create.bind(this.promoterController));
  }
}
