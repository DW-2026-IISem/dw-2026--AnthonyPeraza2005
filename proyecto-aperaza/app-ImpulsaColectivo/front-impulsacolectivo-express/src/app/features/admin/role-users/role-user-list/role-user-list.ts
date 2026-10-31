import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { forkJoin } from 'rxjs';
import { RoleUser } from '../../../../core/models/role-user.model';
import { Role } from '../../../../core/models/role.model';
import { User } from '../../../../core/models/user.model';
import { NotificationService } from '../../../../core/services/notification';
import { SessionStore } from '../../../../core/services/session-store';
import { toApiMessage } from '../../../../core/utils/api-error';
import { whenAllowed } from '../../../../core/utils/when-allowed';
import { HasPermission } from '../../../../shared/directives/has-permission';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../../shared/ui/status-tag/status-tag';
import { RoleApi } from '../../roles/role-api';
import { UserApi } from '../../users/user-api';
import { RoleUserApi } from '../role-user-api';

/**
 * Asignaciones usuario ↔ rol (tabla `role_users`).
 *
 * No hay edición ni borrado físico: retirar un rol es una baja lógica y
 * reactivarlo es `PATCH /:id/reactivate`. `POST` hace create-or-reactivate si
 * el par ya existía inactivo.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-role-user-list',
  imports: [
    AvatarModule,
    ButtonModule,
    DialogModule,
    EmptyState,
    FormsModule,
    HasPermission,
    MessageModule,
    PageHeader,
    SelectModule,
    StatusTag,
    TableModule,
    TagModule,
    TooltipModule,
  ],
  templateUrl: './role-user-list.html',
  styleUrl: './role-user-list.css',
})
export class RoleUserList {
  private readonly api = inject(RoleUserApi);
  private readonly usersApi = inject(UserApi);
  private readonly rolesApi = inject(RoleApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);
  private readonly session = inject(SessionStore);

  readonly rows = signal<RoleUser[]>([]);
  readonly users = signal<User[]>([]);
  readonly roles = signal<Role[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);

  /** Filtros de la tabla (id o `null` para «todos»). */
  readonly userFilter = signal<number | null>(null);
  readonly roleFilter = signal<number | null>(null);

  readonly visibleRows = computed(() => {
    const userId = this.userFilter();
    const roleId = this.roleFilter();
    return this.rows().filter(
      (row) => (!userId || row.user_id === userId) && (!roleId || row.role_id === roleId),
    );
  });

  readonly activeCount = computed(
    () => this.rows().filter((row) => row.status === 'active').length,
  );

  /** Diálogo «Asignar rol». */
  readonly dialogVisible = signal(false);
  readonly selectedUser = signal<User | null>(null);
  readonly selectedRole = signal<Role | null>(null);

  readonly activeUsers = computed(() => this.users().filter((user) => user.status === 'active'));
  readonly activeRoles = computed(() => this.roles().filter((role) => role.status === 'active'));

  readonly canSave = computed(() => !!this.selectedUser() && !!this.selectedRole());

  /** ¿El usuario ya tiene ese rol activo? Un par inactivo no cuenta: el backend lo reactiva. */
  readonly duplicate = computed(() => {
    const user = this.selectedUser();
    const role = this.selectedRole();
    return (
      !!user &&
      !!role &&
      this.rows().some(
        (row) => row.status === 'active' && row.user_id === user.id && row.role_id === role.id,
      )
    );
  });

  constructor() {
    this.load();
  }

  /** Protección contra auto-bloqueo: no puedes retirarte tus propios roles. */
  isSelf(row: RoleUser): boolean {
    return this.session.user()?.id === row.user_id;
  }

  /** Asignaciones, usuarios y roles en paralelo; las dos últimas solo si el rol puede leerlas. */
  load(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      assignments: this.api.list(),
      users: whenAllowed(this.session.can('GET', '/api/usuarios'), this.usersApi.list()),
      roles: whenAllowed(this.session.can('GET', '/api/roles'), this.rolesApi.list()),
    }).subscribe({
      next: ({ assignments, users, roles }) => {
        this.rows.set(assignments);
        this.users.set(users);
        this.roles.set(roles);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.rows.set([]);
        this.error.set(toApiMessage(error));
        this.loading.set(false);
      },
    });
  }

  openAssign(): void {
    this.selectedUser.set(null);
    this.selectedRole.set(null);
    this.dialogVisible.set(true);
  }

  assign(): void {
    const user = this.selectedUser();
    const role = this.selectedRole();
    if (!user || !role || this.duplicate()) {
      return;
    }

    this.saving.set(true);
    this.api.create({ user_id: user.id, role_id: role.id }).subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success('Rol asignado');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error('No se pudo asignar', toApiMessage(error));
      },
    });
  }

  /** Retirar el rol: baja lógica `PATCH /:id/deactivate`. */
  withdraw(row: RoleUser): void {
    const aviso =
      row.role?.name === 'ADMIN'
        ? ' Es un rol de administración: asegúrate de que quede otro administrador activo.'
        : '';

    this.confirmation.confirm({
      header: 'Retirar rol',
      message: `¿Retirar el rol ${row.role?.name ?? '#' + row.role_id} a ${row.user?.username ?? 'usuario #' + row.user_id}? Dejará de recibir sus permisos.${aviso}`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Retirar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.deactivate(row.id).subscribe({
          next: () => {
            this.notify.warn('Rol retirado');
            this.load();
          },
          error: (error: unknown) => {
            this.notify.error('No se pudo retirar', toApiMessage(error));
          },
        });
      },
    });
  }

  /** Reactivar una asignación dada de baja: `PATCH /:id/reactivate`. */
  reactivate(row: RoleUser): void {
    this.api.reactivate(row.id).subscribe({
      next: () => {
        this.notify.success('Asignación reactivada');
        this.load();
      },
      error: (error: unknown) => {
        this.notify.error('No se pudo reactivar', toApiMessage(error));
      },
    });
  }
}
