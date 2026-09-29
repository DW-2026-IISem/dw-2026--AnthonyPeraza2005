import dotenv from "dotenv";
import express, { Application } from "express";
import morgan from "morgan";
var cors = require("cors");
import { sequelize, getDatabaseInfo, testConnection } from "../database/db";
import "../features/business/promoter/promoter.model";
import "../features/business/contributor/contributor.model";
import "../features/business/project/project.model";
import "../features/business/goal/goal.model";
import "../features/business/reward/reward.model";
import "../features/business/reward/reward.associations";
import "../features/business/contribution/contribution.model";
import "../features/business/contribution/contribution.associations";
import "../features/business/payment-transaction/payment-transaction.model";
import "../features/business/payment-transaction/payment-transaction.associations";
import "../features/business/commission/commission.model";
import "../features/business/commission/commission.associations";
import "../features/business/disbursement/disbursement.model";
import "../features/business/disbursement/disbursement.associations";
import "../features/business/refund/refund.model";
import "../features/business/refund/refund.associations";
import "../features/business/project-audit/project-audit.model";
import "../features/business/project-audit/project-audit.associations";
import "../features/business/goal/goal.associations";
import "../features/business/project/project.associations";
import { Routes } from "../routes/index";
import { setupSwagger } from "../swagger/index";

dotenv.config();

export class App {
  public app: Application;
    public routePrv: Routes = new Routes();

  constructor(private port?: number | string) {
    this.app = express();
    this.settings();
    this.middlewares();
    this.routes();
    this.docs();
    this.dbConnection();
  }

  private settings(): void {
    this.app.set('port', this.port || process.env.PORT || 4000);
  }

  private middlewares(): void {
    this.app.use(morgan('dev'));
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }

  private routes(): void {
    this.routePrv.promoterRoutes.routes(this.app);
    this.routePrv.contributorRoutes.routes(this.app);
    this.routePrv.projectRoutes.routes(this.app);
    this.routePrv.goalRoutes.routes(this.app);
    this.routePrv.rewardRoutes.routes(this.app);
    this.routePrv.contributionRoutes.routes(this.app);
    this.routePrv.paymentTransactionRoutes.routes(this.app);
    this.routePrv.commissionRoutes.routes(this.app);
    this.routePrv.disbursementRoutes.routes(this.app);
    this.routePrv.refundRoutes.routes(this.app);
    this.routePrv.projectAuditRoutes.routes(this.app);
    
  }
  private docs(): void {
    setupSwagger(this.app);
  }
  private async dbConnection(): Promise<void> {
        try {
      const dbInfo = getDatabaseInfo();
      console.log(`🔗 Intentando conectar a: ${dbInfo.engine.toUpperCase()}`);

      const isConnected = await testConnection();

      if (!isConnected) {
        throw new Error(`No se pudo conectar a la base de datos ${dbInfo.engine.toUpperCase()}`);
      }

      await sequelize.sync({ force: false, alter: true });
      console.log(`📦 Base de datos sincronizada exitosamente`);
    } catch (error) {
      console.error("❌ Error al conectar con la base de datos:", error);
      process.exit(1);
    }
  }

  async listen() {
    await this.app.listen(this.app.get('port'));
    console.log(`🚀 Servidor ejecutándose en puerto ${this.app.get('port')}`);
  }
}
