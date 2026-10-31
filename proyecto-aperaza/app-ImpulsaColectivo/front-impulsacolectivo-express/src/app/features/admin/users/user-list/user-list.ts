import { Component, computed, inject, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { EffectivePermission } from '../../../../core/models/auth.model';
import { User, UserPayload } from '../../../../core/models/user.model';
import { NotificationService } from '../../../../core/services/notification';
import { SessionStore } from '../../../../core/services/session-store';
import { toApiMessage } from '../../../../core/utils/api-error';
import { filterRows } from '../../../../core/utils/filter-rows';
import { methodSeverity } from '../../../../core/utils/http-method';
import { HasPermission } from '../../../../shared/directives/has-permission';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../../shared/ui/status-tag/status-tag';
import { UserApi } from '../user-api';
import { UserForm } from '../user-form/user-form';

/**
 * Administración de usuarios: CRUD completo más «Ver permisos».
 *
 * «Ver permisos» es la forma más rápida de diagnosticar un 403: muestra lo que
 * el backend evalúa de verdad (usuario → rol → concesión → recurso, todo activo).
 */
@Component({
  host: { class: 'block' },
  selector: 'app-user-list',
  imports: [
    AvatarModule,
    ButtonModule,
    DialogModule,
    EmptyState,
    HasPermission,
    InputTextModule,
    MessageModule,
    PageHeader,
    StatusTag,
    TableModule,
    TagModule,
    TooltipModule,
    UserForm,
  ],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList {
  private readonly api = inject(UserApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);
  private readonly session = inject(SessionStore);

  readonly rows = signal<User[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal('');

  readonly methodSeverity = methodSeverity;

  /** Resultado de aplicar el buscador (usuario o correo). */
  readonly visibleRows = computed(() =>
    filterRows(this.rows(), this.filter(), (user) => [user.username, user.email]),
  );

  readonly activeCount = computed(
    () => this.rows().filter((user) => user.status === 'active').length,
  );

  readonly dialogVisible = signal(false);
  readonly editing = signal<User | null>(null);
  readonly resetKey = signal(0);

  readonly title = computed(() => (this.editing() ? 'Editar usuario' : 'Nuevo usuario'));

  /** Diálogo «Ver permisos». */
  readonly accessVisible = signal(false);
  readonly accessLoading = signal(false);
  readonly accessUser = signal<User | null>(null);
  readonly access = signal<EffectivePermission[]>([]);

  /** Los roles no tienen endpoint propio: se derivan de `role_id` + `role_name` únicos. */
  readonly accessRoles = computed(() => {
    const byId = new Map<number, string>();
    for (const permission of this.access()) {
      byId.set(permission.role_id, permission.role_name);
    }
    return [...byId.entries()].map(([id, name]) => ({ id, name }));
  });

  constructor() {
    this.load();
  }

  /** Protección contra auto-bloqueo: no se puede dar de baja ni borrar la propia cuenta. */
  isSelf(user: User): boolean {
    return this.session.user()?.id === user.id;
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.api.list().subscribe({
      next: (users) => {
        this.rows.set(users);
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

  openEdit(user: User): void {
    this.editing.set(user);
    this.resetKey.update((key) => key + 1);
    this.dialogVisible.set(true);
  }

  /** El mismo manejador para crear y editar: `editing()` decide el verbo. */
  save(payload: UserPayload): void {
    const current = this.editing();
    this.saving.set(true);

    const request = current ? this.api.update(current.id, payload) : this.api.create(payload);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success(current ? 'Usuario actualizado' : 'Usuario creado');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error('No se pudo guardar', toApiMessage(error));
      },
    });
  }

  /** Permisos efectivos del usuario: `GET /api/usuarios/:id/permisos`. */
  openAccess(user: User): void {
    this.accessUser.set(user);
    this.access.set([]);
    this.accessLoading.set(true);
    this.accessVisible.set(true);

    this.api.permissions(user.id).subscribe({
      next: (permissions) => {
        this.access.set(permissions);
        this.accessLoading.set(false);
      },
      error: (error: unknown) => {
        this.accessLoading.set(false);
        this.accessVisible.set(false);
        this.notify.error('No se pudieron cargar los permisos', toApiMessage(error));
      },
    });
  }

  /** Baja lógica: `PATCH /:id/deactivate`. */
  deactivate(user: User): void {
    this.confirmation.confirm({
      header: 'Baja lógica',
      message: `¿Desactivar al usuario «${user.username}»? Su estado pasará a inactivo.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.deactivate(user.id).subscribe({
          next: () => {
            this.notify.warn('Usuario desactivado');
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
  remove(user: User): void {
    this.confirmation.confirm({
      header: 'Eliminar definitivamente',
      message: `Se borrará «${user.username}» de la base de datos. Esta acción no se puede deshacer.`,
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.api.remove(user.id).subscribe({
          next: () => {
            this.notify.success('Usuario eliminado');
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
