import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { forkJoin } from 'rxjs';
import { Disbursement, DisbursementPayload } from '../../../core/models/disbursement.model';
import { Project } from '../../../core/models/project.model';
import { NotificationService } from '../../../core/services/notification';
import { toApiMessage } from '../../../core/utils/api-error';
import { filterRows } from '../../../core/utils/filter-rows';
import { HasPermission } from '../../../shared/directives/has-permission';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../shared/ui/status-tag/status-tag';
import { ProjectApi } from '../../projects/project-api';
import { DisbursementApi } from '../disbursement-api';
import { DisbursementForm } from '../disbursement-form/disbursement-form';

/** Fila de la tabla: el desembolso más su monto ya convertido a número. */
interface DisbursementRow extends Disbursement {
  value: number;
}

/**
 * Lista de desembolsos con todas las operaciones del CRUD.
 *
 * Carga desembolsos y proyectos en paralelo y resuelve el título del proyecto
 * con un `Map` memorizado por `computed`.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-disbursement-list',
  imports: [
    ButtonModule,
    HasPermission,
    CurrencyPipe,
    DialogModule,
    DisbursementForm,
    EmptyState,
    InputTextModule,
    MessageModule,
    PageHeader,
    StatusTag,
    TableModule,
    TagModule,
    TooltipModule,
  ],
  templateUrl: './disbursement-list.html',
  styleUrl: './disbursement-list.css',
})
export class DisbursementList {
  private readonly api = inject(DisbursementApi);
  private readonly projectsApi = inject(ProjectApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);

  /** Datos del backend. */
  readonly rows = signal<Disbursement[]>([]);
  readonly projects = signal<Project[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal('');

  /** `id → título` construido una sola vez; devuelve una función de consulta. */
  readonly projectTitle = computed(() => {
    const titles = new Map(this.projects().map((project) => [project.id, project.title]));
    return (id: number) => titles.get(id) ?? `Proyecto #${id}`;
  });

  /** El backend manda `amount` como texto: se ordena por `value`, un número. */
  readonly tableRows = computed<DisbursementRow[]>(() =>
    this.rows().map((item) => ({ ...item, value: Number(item.amount) })),
  );

  /** Resultado de aplicar el buscador (proyecto, método, fecha o monto). */
  readonly visibleRows = computed(() => {
    const projectOf = this.projectTitle();
    return filterRows(this.tableRows(), this.filter(), (item) => [
      projectOf(item.project_id),
      item.method,
      item.disbursement_date,
      String(item.value),
    ]);
  });

  readonly activeCount = computed(
    () => this.rows().filter((item) => item.status === 'active').length,
  );

  /** Suma de los desembolsos activos. */
  readonly activeTotal = computed(() =>
    this.rows()
      .filter((item) => item.status === 'active')
      .reduce((sum, item) => sum + Number(item.amount), 0),
  );

  readonly dialogVisible = signal(false);
  readonly editing = signal<Disbursement | null>(null);
  readonly resetKey = signal(0);

  readonly title = computed(() => (this.editing() ? 'Editar desembolso' : 'Nuevo desembolso'));

  /** Solo proyectos activos, más el actual al editar (aunque esté inactivo). */
  readonly projectOptions = computed(() => {
    const currentId = this.editing()?.project_id;
    return this.projects().filter(
      (project) => project.status === 'active' || project.id === currentId,
    );
  });

  constructor() {
    this.load();
  }

  /**
   * 'YYYY-MM-DD' → 'DD/MM/YYYY' sin pasar por `Date`: `DatePipe` leería la
   * cadena como UTC y en Colombia mostraría el día anterior.
   */
  formatDate(iso: string): string {
    const [year, month, day] = iso.split('-');
    return `${day}/${month}/${year}`;
  }

  /** Desembolsos y proyectos en paralelo: la tabla se pinta una sola vez. */
  load(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      disbursements: this.api.list(),
      projects: this.projectsApi.list(),
    }).subscribe({
      next: ({ disbursements, projects }) => {
        this.rows.set(disbursements);
        this.projects.set(projects);
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

  openEdit(item: Disbursement): void {
    this.editing.set(item);
    this.resetKey.update((key) => key + 1);
    this.dialogVisible.set(true);
  }

  /** El mismo manejador para crear y editar: `editing()` decide el verbo. */
  save(payload: DisbursementPayload): void {
    const current = this.editing();
    this.saving.set(true);

    const request = current ? this.api.update(current.id, payload) : this.api.create(payload);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success(current ? 'Desembolso actualizado' : 'Desembolso creado');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error('No se pudo guardar', toApiMessage(error));
      },
    });
  }

  /** Baja lógica: `PATCH /:id/deactivate`. */
  deactivate(item: Disbursement): void {
    this.confirmation.confirm({
      header: 'Baja lógica',
      message: `¿Desactivar el desembolso #${item.id}? Su estado pasará a inactivo.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.deactivate(item.id).subscribe({
          next: () => {
            this.notify.warn('Desembolso desactivado');
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
  remove(item: Disbursement): void {
    this.confirmation.confirm({
      header: 'Eliminar definitivamente',
      message: `Se borrará el desembolso #${item.id} de la base de datos. Esta acción no se puede deshacer.`,
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.api.remove(item.id).subscribe({
          next: () => {
            this.notify.success('Desembolso eliminado');
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
