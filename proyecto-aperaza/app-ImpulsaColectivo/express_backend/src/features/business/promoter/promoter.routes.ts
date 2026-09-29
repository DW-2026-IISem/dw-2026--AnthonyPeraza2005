import { Application } from "express";
import { PromoterController } from "./promoter.controller";

export class PromoterRoutes {
  public promoterController: PromoterController = new PromoterController();

  public routes(app: Application): void {
    // ================== RUTAS SIN AUTENTICACIÓN / SIN MIDDLEWARE JWT ==================
    // (rellenar en ISS-03-B…E)
  }
}
