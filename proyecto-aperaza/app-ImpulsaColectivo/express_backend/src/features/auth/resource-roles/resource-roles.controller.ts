import { Request, Response } from "express";
import { AppError } from "../../../shared/errors/app-error";
import { BaseController } from "../../../shared/http/base-controller";
import { CreateResourceRoleDto, ReconcileResourceRolesDto } from "./dto";
import { ResourceRolesService } from "./resource-roles.service";

/**
 * Capa Controller del feature ResourceRoles.
 * Operaciones: getAll, getOne, grant (create), deactivate, reactivate.
 * `GET /api/concesiones-rol` acepta los filtros `?role_id=` y `?resource_id=`.
 */
export class ResourceRolesController extends BaseController {
  public constructor(
    private readonly service: ResourceRolesService = new ResourceRolesService()
  ) {
    super();
  }

  // ================== READ ==================
  public async getAll(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const grants = await this.service.getAll({
        role_id: toOptionalNumber(req.query.role_id),
        resource_id: toOptionalNumber(req.query.resource_id),
      });
      res.status(200).json({ grants });
    });
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const grant = await this.service.getOne(this.paramId(req));
      res.status(200).json({ grant });
    });
  }

  // ================== CREATE (conceder permiso) ==================
  public async grant(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      // Matriz completa: `{ role_id, resource_ids }` (la rama va ANTES de la individual).
      const body: unknown = req.body;
      if (isRecord(body) && body.resource_ids !== undefined) {
        const matrix = validateReconcileBody(body);
        const result = await this.service.saveRoleMatrix(matrix.role_id, matrix.resource_ids);
        res.status(200).json({ message: "Role permissions updated", result });
        return;
      }

      const grant = await this.service.grant(req.body as CreateResourceRoleDto);
      res.status(201).json({ message: "Resource granted to role", grant });
    });
  }

  // ================== STATE ==================
  /** Retirar el permiso (borrado lógico). */
  public async deactivate(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const grant = await this.service.deactivate(this.paramId(req));
      res.status(200).json({ message: "Grant deactivated (permission revoked)", grant });
    });
  }

  /** Reactivar la concesión. */
  public async reactivate(req: Request, res: Response): Promise<void> {
    await this.run(res, async () => {
      const grant = await this.service.reactivate(this.paramId(req));
      res.status(200).json({ message: "Grant reactivated", grant });
    });
  }
}

/** `true` si el valor es un objeto JSON (no `null` ni un arreglo). */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** `true` si el valor es un entero positivo. */
function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

/**
 * Valida la FORMA del cuerpo de la matriz: `{ role_id, resource_ids }`.
 * Las reglas de negocio (rol activo, recursos activos, protección de ADMIN) las
 * aplica el service; un tipo TypeScript no valida lo que llega por HTTP.
 */
function validateReconcileBody(body: Record<string, unknown>): ReconcileResourceRolesDto {
  if (body.resource_id !== undefined) {
    throw new AppError(400, "Send either resource_id or resource_ids, not both");
  }

  const roleId = body.role_id;
  if (!isPositiveInteger(roleId)) {
    throw new AppError(400, "role_id must be a positive integer");
  }

  const ids = body.resource_ids;
  if (!Array.isArray(ids) || !ids.every(isPositiveInteger)) {
    throw new AppError(400, "resource_ids must be an array of positive integers");
  }
  if (new Set(ids).size !== ids.length) {
    throw new AppError(400, "resource_ids must not contain duplicates");
  }

  return { role_id: roleId, resource_ids: ids };
}

/** Convierte un query param en número o `undefined` (sin lanzar por basura). */
function toOptionalNumber(value: unknown): number | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  if (typeof raw !== "string" || !/^\d+$/.test(raw)) return undefined;
  return Number(raw);
}
