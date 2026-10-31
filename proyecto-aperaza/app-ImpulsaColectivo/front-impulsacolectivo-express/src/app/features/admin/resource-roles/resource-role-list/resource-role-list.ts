import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { forkJoin } from 'rxjs';
import { ResourceRole } from '../../../../core/models/resource-role.model';
import { Resource } from '../../../../core/models/resource.model';
import { Role } from '../../../../core/models/role.model';
import { NotificationService } from '../../../../core/services/notification';
import { SessionStore } from '../../../../core/services/session-store';
import { toApiMessage } from '../../../../core/utils/api-error';
import { filterRows } from '../../../../core/utils/filter-rows';
import { methodSeverity } from '../../../../core/utils/http-method';
import { whenAllowed } from '../../../../core/utils/when-allowed';
import { HasPermission } from '../../../../shared/directives/has-permission';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../../shared/ui/status-tag/status-tag';
import { ResourceApi } from '../../resources/resource-api';
import { RoleApi } from '../../roles/role-api';
import { ResourceRoleApi } from '../resource-role-api';

/**
 * Concesiones rol ↔ recurso (tabla `resource_roles`): cada fila ES un permiso.
 *
 * Regla de oro del RBAC: un usuario puede ejecutar `MÉTODO /ruta` solo si existe
 * la cadena usuario → rol → concesión → recurso, con todos los eslabones activos.
 * Revocar es una baja lógica y reactivar es `PATCH /:id/reactivate`.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-resource-role-list',
  imports: [
    ButtonModule,
    DialogModule,
    EmptyState,
    FormsModule,
    HasPermission,
    InputTextModule,
    MessageModule,
    PageHeader,
    SelectModule,
    StatusTag,
    TableModule,
    TagModule,
    TooltipModule,
  ],
  templateUrl: './resource-role-list.html',
  styleUrl: './resource-role-list.css',
})
export class ResourceRoleList {
  private readonly api = inject(ResourceRoleApi);
  private readonly rolesApi = inject(RoleApi);
  private readonly resourcesApi = inject(ResourceApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);
  private readonly session = inject(SessionStore);

  readonly rows = signal<ResourceRole[]>([]);
  readonly roles = signal<Role[]>([]);
  readonly resources = signal<Resource[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  readonly filter = signal('');
  readonly roleFilter = signal<number | null>(null);

  readonly methodSeverity = methodSeverity;

  /** Resultado del buscador (ruta, método, descripción o rol) y del filtro por rol. */
  readonly visibleRows = computed(() => {
    const roleId = this.roleFilter();
    const filtered = filterRows(this.rows(), this.filter(), (grant) => [
      grant.resource?.path ?? '',
      grant.resource?.method ?? '',
      grant.resource?.description ?? '',
      grant.role?.name ?? '',
    ]);
    return roleId ? filtered.filter((grant) => grant.role_id === roleId) : filtered;
  });

  readonly activeCount = computed(
    () => this.rows().filter((grant) => grant.status === 'active').length,
  );

  /** Diálogo «Conceder permiso». */
  readonly dialogVisible = signal(false);
  readonly selectedRole = signal<Role | null>(null);
  readonly selectedResource = signal<Resource | null>(null);

  readonly activeRoles = computed(() => this.roles().filter((role) => role.status === 'active'));
  readonly activeResources = computed(() =>
    this.resources().filter((resource) => resource.status === 'active'),
  );

  readonly canSave = computed(() => !!this.selectedRole() && !!this.selectedResource());

  /** ¿El rol ya tiene ese recurso concedido y activo? Un par inactivo no cuenta: el backend lo reactiva. */
  readonly duplicate = computed(() => {
    const role = this.selectedRole();
    const resource = this.selectedResource();
    return (
      !!role &&
      !!resource &&
      this.rows().some(
        (grant) =>
          grant.status === 'active' &&
          grant.role_id === role.id &&
          grant.resource_id === resource.id,
      )
    );
  });

  constructor() {
    this.load();
  }

  /** ¿La concesión es de un rol que tú tienes? Revocarla puede dejarte sin acceso. */
  isOwnRole(grant: ResourceRole): boolean {
    return this.session.hasRole(grant.role?.name ?? '');
  }

  /** Concesiones, roles y recursos en paralelo; los dos últimos solo si el rol puede leerlos. */
  load(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      grants: this.api.list(),
      roles: whenAllowed(this.session.can('GET', '/api/roles'), this.rolesApi.list()),
      resources: whenAllowed(this.session.can('GET', '/api/recursos'), this.resourcesApi.list()),
    }).subscribe({
      next: ({ grants, roles, resources }) => {
        this.rows.set(grants);
        this.roles.set(roles);
        this.resources.set(resources);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.rows.set([]);
        this.error.set(toApiMessage(error));
        this.loading.set(false);
      },
    });
  }

  openGrant(): void {
    this.selectedRole.set(null);
    this.selectedResource.set(null);
    this.dialogVisible.set(true);
  }

  grant(): void {
    const role = this.selectedRole();
    const resource = this.selectedResource();
    if (!role || !resource || this.duplicate()) {
      return;
    }

    this.saving.set(true);
    this.api.create({ role_id: role.id, resource_id: resource.id }).subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success('Permiso concedido');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error('No se pudo conceder', toApiMessage(error));
      },
    });
  }

  /** Revocar el permiso: baja lógica `PATCH /:id/deactivate`. */
  revoke(grant: ResourceRole): void {
    const aviso = this.isOwnRole(grant)
      ? ' Es un rol que tú tienes: podrías perder acceso a esta pantalla.'
      : '';

    this.confirmation.confirm({
      header: 'Revocar permiso',
      message: `¿Revocar ${grant.resource?.method ?? ''} ${grant.resource?.path ?? ''} al rol ${grant.role?.name ?? '#' + grant.role_id}? Sus usuarios dejarán de poder ejecutar esa operación.${aviso}`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Revocar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.deactivate(grant.id).subscribe({
          next: () => {
            this.notify.warn('Permiso revocado');
            this.load();
          },
          error: (error: unknown) => {
            this.notify.error('No se pudo revocar', toApiMessage(error));
          },
        });
      },
    });
  }

  /** Reactivar una concesión dada de baja: `PATCH /:id/reactivate`. */
  reactivate(grant: ResourceRole): void {
    this.api.reactivate(grant.id).subscribe({
      next: () => {
        this.notify.success('Permiso reactivado');
        this.load();
      },
      error: (error: unknown) => {
        this.notify.error('No se pudo reactivar', toApiMessage(error));
      },
    });
  }
}
