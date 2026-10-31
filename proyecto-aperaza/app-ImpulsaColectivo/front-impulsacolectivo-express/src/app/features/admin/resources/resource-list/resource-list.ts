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
import {
  HTTP_METHODS,
  HttpMethod,
  Resource,
  ResourcePayload,
} from '../../../../core/models/resource.model';
import { NotificationService } from '../../../../core/services/notification';
import { toApiMessage } from '../../../../core/utils/api-error';
import { filterRows } from '../../../../core/utils/filter-rows';
import { methodSeverity } from '../../../../core/utils/http-method';
import { HasPermission } from '../../../../shared/directives/has-permission';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../../shared/ui/status-tag/status-tag';
import { ResourceApi } from '../resource-api';
import { ResourceForm } from '../resource-form/resource-form';

/**
 * Catálogo de recursos HTTP: los pares método + ruta que protege el RBAC.
 *
 * Crear un recurso no crea una pantalla ni una ruta: solo registra una
 * capacidad que después se concede a un rol en la pantalla Permisos.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-resource-list',
  imports: [
    ButtonModule,
    DialogModule,
    EmptyState,
    FormsModule,
    HasPermission,
    InputTextModule,
    MessageModule,
    PageHeader,
    ResourceForm,
    SelectModule,
    StatusTag,
    TableModule,
    TagModule,
    TooltipModule,
  ],
  templateUrl: './resource-list.html',
  styleUrl: './resource-list.css',
})
export class ResourceList {
  private readonly api = inject(ResourceApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);

  readonly rows = signal<Resource[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal('');
  readonly methodFilter = signal<HttpMethod | ''>('');

  readonly methodSeverity = methodSeverity;

  readonly methodOptions = [
    { label: 'Todos los métodos', value: '' },
    ...HTTP_METHODS.map((method) => ({ label: method, value: method })),
  ];

  /** Resultado de aplicar el buscador (ruta, descripción o método) y el filtro por método. */
  readonly visibleRows = computed(() => {
    const method = this.methodFilter();
    const filtered = filterRows(this.rows(), this.filter(), (resource) => [
      resource.path,
      resource.description ?? '',
      resource.method,
    ]);
    return method ? filtered.filter((resource) => resource.method === method) : filtered;
  });

  /** Cuántos recursos hay por método, en el orden de `HTTP_METHODS` y sin los que no aparecen. */
  readonly countsByMethod = computed(() => {
    const counts = new Map<HttpMethod, number>();
    for (const resource of this.rows()) {
      counts.set(resource.method, (counts.get(resource.method) ?? 0) + 1);
    }
    return HTTP_METHODS.filter((method) => counts.has(method)).map((method) => ({
      method,
      count: counts.get(method) ?? 0,
    }));
  });

  readonly dialogVisible = signal(false);
  readonly editing = signal<Resource | null>(null);
  readonly resetKey = signal(0);

  readonly title = computed(() => (this.editing() ? 'Editar recurso' : 'Nuevo recurso'));

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.api.list().subscribe({
      next: (resources) => {
        this.rows.set(resources);
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

  openEdit(resource: Resource): void {
    this.editing.set(resource);
    this.resetKey.update((key) => key + 1);
    this.dialogVisible.set(true);
  }

  /** El mismo manejador para crear y editar: `editing()` decide el verbo. */
  save(payload: ResourcePayload): void {
    const current = this.editing();
    this.saving.set(true);

    const request = current ? this.api.update(current.id, payload) : this.api.create(payload);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success(current ? 'Recurso actualizado' : 'Recurso creado');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error('No se pudo guardar', toApiMessage(error));
      },
    });
  }

  /** Baja lógica: `PATCH /:id/deactivate`. Es la forma habitual de retirar un recurso. */
  deactivate(resource: Resource): void {
    this.confirmation.confirm({
      header: 'Baja lógica',
      message: `¿Desactivar ${resource.method} ${resource.path}? Las concesiones que lo usan dejarán de autorizar esa ruta.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.deactivate(resource.id).subscribe({
          next: () => {
            this.notify.warn('Recurso desactivado');
            this.load();
          },
          error: (error: unknown) => {
            this.notify.error('No se pudo desactivar', toApiMessage(error));
          },
        });
      },
    });
  }

  /** Baja física: `DELETE /:id`. Rompe las concesiones históricas que apunten a este recurso. */
  remove(resource: Resource): void {
    this.confirmation.confirm({
      header: 'Eliminar definitivamente',
      message: `Se borrará ${resource.method} ${resource.path} de la base de datos y dejará huérfanas las concesiones que lo usen. Prefiere la baja lógica. Esta acción no se puede deshacer.`,
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.api.remove(resource.id).subscribe({
          next: () => {
            this.notify.success('Recurso eliminado');
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
