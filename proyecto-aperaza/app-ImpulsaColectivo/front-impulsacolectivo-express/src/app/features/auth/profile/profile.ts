import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { HttpMethod } from '../../../core/models/resource.model';
import { AuthService } from '../../../core/services/auth';
import { NotificationService } from '../../../core/services/notification';
import { SessionStore } from '../../../core/services/session-store';
import { filterRows } from '../../../core/utils/filter-rows';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../shared/ui/status-tag/status-tag';

type MethodSeverity = 'info' | 'success' | 'warn' | 'danger' | 'secondary';

/**
 * Perfil de la sesión: cuenta, roles y permisos efectivos.
 *
 * Solo lee del `SessionStore`; únicamente «Actualizar permisos» y «Cerrar
 * sesión» hablan con el backend, a través de `AuthService`.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-profile',
  imports: [
    ButtonModule,
    EmptyState,
    InputTextModule,
    PageHeader,
    StatusTag,
    TableModule,
    TagModule,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  private readonly session = inject(SessionStore);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notify = inject(NotificationService);

  readonly user = this.session.user;
  readonly roleNames = this.session.roleNames;
  readonly permissions = this.session.permissions;
  readonly permissionCount = this.session.permissionCount;

  readonly filter = signal('');
  readonly refreshing = signal(false);

  /** Resultado de aplicar el buscador (método, ruta, descripción o rol). */
  readonly visibleRows = computed(() =>
    filterRows(this.permissions(), this.filter(), (permission) => [
      permission.method,
      permission.path,
      permission.description ?? '',
      permission.role_name,
    ]),
  );

  /** Color de la etiqueta según lo que hace el método. */
  methodSeverity(method: HttpMethod): MethodSeverity {
    switch (method) {
      case 'GET':
        return 'info';
      case 'POST':
        return 'success';
      case 'PUT':
      case 'PATCH':
        return 'warn';
      case 'DELETE':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  /** Vuelve a pedir perfil y permisos: útil si un administrador cambió el rol. */
  refresh(): void {
    this.refreshing.set(true);

    this.auth.me().subscribe({
      next: () => {
        this.refreshing.set(false);
        this.notify.success('Permisos actualizados');
      },
      error: () => this.refreshing.set(false),
    });
  }

  logout(): void {
    this.auth.logout().subscribe(() => {
      void this.router.navigate(['/login']);
    });
  }
}
