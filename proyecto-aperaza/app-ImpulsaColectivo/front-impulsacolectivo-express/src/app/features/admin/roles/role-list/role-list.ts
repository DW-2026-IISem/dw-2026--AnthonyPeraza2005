import { Component, computed, inject, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { Role, RolePayload } from '../../../../core/models/role.model';
import { NotificationService } from '../../../../core/services/notification';
import { SessionStore } from '../../../../core/services/session-store';
import { toApiMessage } from '../../../../core/utils/api-error';
import { filterRows } from '../../../../core/utils/filter-rows';
import { HasPermission } from '../../../../shared/directives/has-permission';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../../shared/ui/status-tag/status-tag';
import { RoleApi } from '../role-api';
import { RoleForm } from '../role-form/role-form';

/**
 * Administración de roles. El nombre de un rol no autoriza nada por sí mismo:
 * lo que un rol puede hacer lo definen sus concesiones (pantalla Permisos).
 */
@Component({
  host: { class: 'block' },
  selector: 'app-role-list',
  imports: [
    ButtonModule,
    DialogModule,
    EmptyState,
    HasPermission,
    InputTextModule,
    MessageModule,
    PageHeader,
    RoleForm,
    StatusTag,
    TableModule,
    TagModule,
    TooltipModule,
  ],
  templateUrl: './role-list.html',
  styleUrl: './role-list.css',
})
export class RoleList {
  private readonly api = inject(RoleApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);
  private readonly session = inject(SessionStore);

  readonly rows = signal<Role[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal('');

  /** Resultado de aplicar el buscador (nombre o descripción). */
  readonly visibleRows = computed(() =>
    filterRows(this.rows(), this.filter(), (role) => [role.name, role.description ?? '']),
  );

  readonly activeCount = computed(
    () => this.rows().filter((role) => role.status === 'active').length,
  );

  readonly dialogVisible = signal(false);
  readonly editing = signal<Role | null>(null);
  readonly resetKey = signal(0);

  readonly title = computed(() => (this.editing() ? 'Editar rol' : 'Nuevo rol'));

  constructor() {
    this.load();
  }

  /**
   * Protección contra auto-bloqueo: un rol que tú mismo tienes no se da de baja
   * ni se elimina. Sin `ADMIN` activo, nadie podría volver a administrar el RBAC.
   */
  isOwnRole(role: Role): boolean {
    return this.session.hasRole(role.name);
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.api.list().subscribe({
      next: (roles) => {
        this.rows.set(roles);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.rows.set([]);
        this.error.set(toApiMessage(error));
        this.loading.set(false);
      },
    });
  }

  openCreate(): void {
    this.editing.set(null);
    this.resetKey.update((key) => key + 1);
    this.dialogVisible.set(true);
  }

  openEdit(role: Role): void {
    this.editing.set(role);
    this.resetKey.update((key) => key + 1);
    this.dialogVisible.set(true);
  }

  /** El mismo manejador para crear y editar: `editing()` decide el verbo. */
  save(payload: RolePayload): void {
    const current = this.editing();
    this.saving.set(true);

    const request = current ? this.api.update(current.id, payload) : this.api.create(payload);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success(current ? 'Rol actualizado' : 'Rol creado');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error('No se pudo guardar', toApiMessage(error));
      },
    });
  }

  /** Baja lógica: `PATCH /:id/deactivate`. */
  deactivate(role: Role): void {
    this.confirmation.confirm({
      header: 'Baja lógica',
      message: `¿Desactivar el rol «${role.name}»? Los usuarios que lo tengan perderán los permisos que les daba.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.deactivate(role.id).subscribe({
          next: () => {
            this.notify.warn('Rol desactivado');
            this.load();
          },
          error: (error: unknown) => {
            this.notify.error('No se pudo desactivar', toApiMessage(error));
          },
        });
      },
    });
  }

  /** Baja física: `DELETE /:id`. No se puede deshacer. */
  remove(role: Role): void {
    this.confirmation.confirm({
      header: 'Eliminar definitivamente',
      message: `Se borrará el rol «${role.name}» de la base de datos. Esta acción no se puede deshacer.`,
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.api.remove(role.id).subscribe({
          next: () => {
            this.notify.success('Rol eliminado');
            this.load();
          },
          error: (error: unknown) => {
            this.notify.error('No se pudo eliminar', toApiMessage(error));
          },
        });
      },
    });
  }
}
