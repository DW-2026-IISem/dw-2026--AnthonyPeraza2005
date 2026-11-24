import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { forkJoin } from 'rxjs';
import { Resource } from '../../../../core/models/resource.model';
import { Role } from '../../../../core/models/role.model';
import { NotificationService } from '../../../../core/services/notification';
import { SessionStore } from '../../../../core/services/session-store';
import { toApiMessage } from '../../../../core/utils/api-error';
import { whenAllowed } from '../../../../core/utils/when-allowed';
import { HasPermission } from '../../../../shared/directives/has-permission';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { ResourceApi } from '../../resources/resource-api';
import { ResourceRoleApi } from '../../resource-roles/resource-role-api';
import { RoleApi } from '../../roles/role-api';
import {
  CellState,
  MATRIX_COLUMNS,
  buildPermissionMatrix,
  cellState,
  countResources,
  sameSet,
  withCell,
} from '../permission-matrix';

/**
 * Matriz de permisos: elige un rol y marca qué operaciones puede ejecutar sobre cada
 * entidad. Guardar envía el conjunto COMPLETO de recursos marcados a
 * `POST /api/concesiones-rol` (`{ role_id, resource_ids }`); el backend deja al rol con
 * exactamente ese conjunto en una transacción.
 *
 * Esta pantalla solo administra concesiones: quien autoriza cada petición sigue siendo
 * el backend. Ocultar o deshabilitar controles aquí es UX, no seguridad.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-permission-matrix-page',
  imports: [
    ButtonModule,
    EmptyState,
    FormsModule,
    HasPermission,
    MessageModule,
    PageHeader,
    SelectModule,
    TagModule,
    TooltipModule,
  ],
  templateUrl: './permission-matrix-page.html',
  styleUrl: './permission-matrix-page.css',
})
export class PermissionMatrixPage {
  private readonly api = inject(ResourceRoleApi);
  private readonly rolesApi = inject(RoleApi);
  private readonly resourcesApi = inject(ResourceApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);
  private readonly session = inject(SessionStore);

  readonly columns = MATRIX_COLUMNS;

  readonly roles = signal<Role[]>([]);
  readonly resources = signal<Resource[]>([]);
  readonly selectedRoleId = signal<number | null>(null);

  /** IDs marcados ahora mismo en pantalla. */
  readonly selected = signal<ReadonlySet<number>>(new Set());
  /** IDs que el servidor tiene concedidos (activos y visibles) al rol elegido. */
  readonly saved = signal<ReadonlySet<number>>(new Set());

  /** Catálogo inicial (roles y recursos). */
  readonly loading = signal(true);
  /** Concesiones del rol elegido. */
  readonly loadingGrants = signal(false);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly saveMessage = signal<string | null>(null);

  readonly activeRoles = computed(() => this.roles().filter((role) => role.status === 'active'));
  readonly rows = computed(() => buildPermissionMatrix(this.resources()));
  readonly totalCount = computed(() => countResources(this.rows()));
  readonly selectedRole = computed(
    () => this.activeRoles().find((role) => role.id === this.selectedRoleId()) ?? null,
  );
  readonly dirty = computed(() => !sameSet(this.selected(), this.saved()));
  readonly busy = computed(() => this.loading() || this.loadingGrants() || this.saving());

  /** ¿El rol elegido es uno que tú tienes? Quitarle permisos puede dejarte sin acceso. */
  readonly isOwnRole = computed(() => {
    const role = this.selectedRole();
    return !!role && this.session.hasRole(role.name);
  });

  /** Se puede marcar casillas solo con permiso de guardar y sin nada en curso. */
  readonly editable = computed(
    () =>
      this.session.can('POST', '/api/concesiones-rol') &&
      this.selectedRole() !== null &&
      !this.busy(),
  );

  constructor() {
    this.load();
  }

  /** Roles y recursos en paralelo; cada lista solo si el rol puede leerla. */
  load(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      roles: whenAllowed(this.session.can('GET', '/api/roles'), this.rolesApi.list()),
      resources: whenAllowed(this.session.can('GET', '/api/recursos'), this.resourcesApi.list()),
    }).subscribe({
      next: ({ roles, resources }) => {
        this.roles.set(roles);
        this.resources.set(resources);
        this.loading.set(false);
        this.chooseRole(this.activeRoles()[0]?.id ?? null);
      },
      error: (error: unknown) => {
        this.error.set(toApiMessage(error));
        this.loading.set(false);
      },
    });
  }

  /** Cambia de rol: vacía la selección (sin casillas viejas) y carga las concesiones del nuevo. */
  chooseRole(roleId: number | null): void {
    this.selectedRoleId.set(roleId);
    this.saveMessage.set(null);
    this.selected.set(new Set());
    this.saved.set(new Set());
    this.loadingGrants.set(false);

    if (roleId !== null) {
      this.loadGrants(roleId);
    }
  }

  private loadGrants(roleId: number): void {
    this.loadingGrants.set(true);

    this.api.list({ role_id: roleId }).subscribe({
      next: (grants) => {
        // Si el usuario ya cambió de rol, esta respuesta es vieja: se descarta.
        if (this.selectedRoleId() !== roleId) {
          return;
        }
        // Solo cuentan las concesiones activas sobre recursos que la matriz muestra: si el
        // recurso está inactivo, el backend rechazaría el guardado con 400.
        const visible = new Set(
          this.resources()
            .filter((resource) => resource.status === 'active')
            .map((resource) => resource.id),
        );
        const ids = new Set(
          grants
            .filter((grant) => grant.status === 'active' && visible.has(grant.resource_id))
            .map((grant) => grant.resource_id),
        );
        this.saved.set(ids);
        this.selected.set(new Set(ids));
        this.loadingGrants.set(false);
      },
      error: (error: unknown) => {
        if (this.selectedRoleId() !== roleId) {
          return;
        }
        this.error.set(toApiMessage(error));
        this.loadingGrants.set(false);
      },
    });
  }

  state(cell: readonly Resource[]): CellState {
    return cellState(cell, this.selected());
  }

  /** Marca o desmarca todos los recursos que agrupa la casilla. */
  setCell(cell: readonly Resource[], event: Event): void {
    if (!this.editable()) {
      return;
    }
    const checked = (event.target as HTMLInputElement).checked;
    this.selected.set(withCell(cell, this.selected(), checked));
    this.saveMessage.set(null);
  }

  /** Rutas que agrupa la casilla, para el tooltip. */
  cellTooltip(cell: readonly Resource[]): string {
    return cell.map((resource) => `${resource.method} ${resource.path}`).join(' · ');
  }

  discard(): void {
    this.selected.set(new Set(this.saved()));
    this.saveMessage.set(null);
  }

  /** Guarda el conjunto completo; pide confirmación si el rol queda vacío o es uno tuyo. */
  save(): void {
    const role = this.selectedRole();
    if (!role || !this.dirty() || this.busy()) {
      return;
    }

    const avisos: string[] = [];
    if (this.selected().size === 0) {
      avisos.push('El rol quedará sin ningún permiso: sus usuarios no podrán usar nada.');
    }
    if (this.session.hasRole(role.name)) {
      avisos.push('Es un rol que tú tienes: podrías perder acceso a esta pantalla.');
    }

    if (avisos.length === 0) {
      this.persist(role);
      return;
    }

    this.confirmation.confirm({
      header: 'Guardar permisos',
      message: `¿Guardar los permisos del rol ${role.name}? ${avisos.join(' ')}`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Guardar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => this.persist(role),
    });
  }

  private persist(role: Role): void {
    this.saving.set(true);
    this.saveMessage.set(null);

    this.api.reconcile(role.id, [...this.selected()]).subscribe({
      next: (result) => {
        this.saving.set(false);
        this.saveMessage.set(
          `Cambios guardados. ${result.total_active} permisos activos para este rol.`,
        );
        this.notify.success('Permisos guardados');
        if (this.session.hasRole(role.name)) {
          this.notify.warn(
            'Cambiaste un rol que tú tienes: pulsa «Actualizar permisos» en tu perfil para ver el efecto',
          );
        }
        this.loadGrants(role.id);
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error('No se pudo guardar', toApiMessage(error));
      },
    });
  }
}
