import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  ResourceRole,
  ResourceRoleMatrixResult,
  ResourceRolePayload,
} from '../../../core/models/resource-role.model';
import { ReadCreateApi } from '../../../core/services/crud-api';

/**
 * /api/concesiones-rol → { grants } / { grant }
 * La tabla es `resource_roles`, pero la envoltura NO se llama `resource_roles`.
 * Solo GET, POST, deactivate y reactivate: no se edita ni se borra.
 */
@Injectable({ providedIn: 'root' })
export class ResourceRoleApi extends ReadCreateApi<ResourceRole, ResourceRolePayload> {
  constructor() {
    super('concesiones-rol', 'grants', 'grant');
  }

  /** Igual que `list()`, con filtros opcionales por query. */
  override list(filters?: { role_id?: number; resource_id?: number }): Observable<ResourceRole[]> {
    let params = new HttpParams();
    if (filters?.role_id) {
      params = params.set('role_id', filters.role_id);
    }
    if (filters?.resource_id) {
      params = params.set('resource_id', filters.resource_id);
    }
    return this.http
      .get<Record<string, ResourceRole[]>>(this.base, { params })
      .pipe(map((r) => r[this.plural]));
  }

  /**
   * Guarda la matriz completa de un rol: `POST /api/concesiones-rol` con
   * `{ role_id, resource_ids }`. El backend deja al rol con exactamente ese conjunto
   * (altas, reactivaciones y retiros en una transacción) y responde `{ message, result }`.
   */
  reconcile(roleId: number, resourceIds: number[]): Observable<ResourceRoleMatrixResult> {
    return this.http
      .post<{ result?: ResourceRoleMatrixResult }>(this.base, {
        role_id: roleId,
        resource_ids: resourceIds,
      })
      .pipe(map((response) => requiredResult(response)));
  }

  /** Reactiva una concesión dada de baja. */
  reactivate(id: number): Observable<unknown> {
    return this.http.patch(`${this.base}/${id}/reactivate`, {});
  }
}

/** La respuesta del guardado debe traer `result`; si no, el éxito no se puede anunciar. */
function requiredResult(
  response: { result?: ResourceRoleMatrixResult } | null,
): ResourceRoleMatrixResult {
  if (!response?.result) {
    throw new Error('La respuesta del servidor no incluye el resultado del guardado');
  }
  return response.result;
}
