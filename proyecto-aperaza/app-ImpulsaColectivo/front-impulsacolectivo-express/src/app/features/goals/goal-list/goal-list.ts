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
import { Goal, GoalPayload } from '../../../core/models/goal.model';
import { Project } from '../../../core/models/project.model';
import { NotificationService } from '../../../core/services/notification';
import { toApiMessage } from '../../../core/utils/api-error';
import { filterRows } from '../../../core/utils/filter-rows';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../shared/ui/status-tag/status-tag';
import { ProjectApi } from '../../projects/project-api';
import { GoalApi } from '../goal-api';
import { GoalForm } from '../goal-form/goal-form';

/** Fila de la tabla: la meta más su monto ya convertido a número. */
interface GoalRow extends Goal {
  value: number;
}

/**
 * Lista de metas con todas las operaciones del CRUD.
 *
 * Carga metas y proyectos en paralelo y resuelve el título del proyecto con un
 * `Map` memorizado por `computed`.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-goal-list',
  imports: [
    ButtonModule,
    CurrencyPipe,
    DialogModule,
    EmptyState,
    GoalForm,
    InputTextModule,
    MessageModule,
    PageHeader,
    StatusTag,
    TableModule,
    TagModule,
    TooltipModule,
  ],
  templateUrl: './goal-list.html',
  styleUrl: './goal-list.css',
})
export class GoalList {
  private readonly api = inject(GoalApi);
  private readonly projectsApi = inject(ProjectApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);

  /** Datos del backend. */
  readonly rows = signal<Goal[]>([]);
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

  /** El backend manda `target_amount` como texto: se ordena por `value`, un número. */
  readonly tableRows = computed<GoalRow[]>(() =>
    this.rows().map((goal) => ({ ...goal, value: Number(goal.target_amount) })),
  );

  /** Resultado de aplicar el buscador (descripción, proyecto o monto). */
  readonly visibleRows = computed(() => {
    const projectOf = this.projectTitle();
    return filterRows(this.tableRows(), this.filter(), (goal) => [
      goal.description,
      projectOf(goal.project_id),
      String(goal.value),
    ]);
  });

  readonly activeCount = computed(
    () => this.rows().filter((goal) => goal.status === 'active').length,
  );

  /** Suma de los montos objetivo de las metas activas. */
  readonly activeTarget = computed(() =>
    this.rows()
      .filter((goal) => goal.status === 'active')
      .reduce((sum, goal) => sum + Number(goal.target_amount), 0),
  );

  readonly dialogVisible = signal(false);
  readonly editing = signal<Goal | null>(null);
  readonly resetKey = signal(0);

  readonly title = computed(() => (this.editing() ? 'Editar meta' : 'Nueva meta'));

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

  /** Metas y proyectos en paralelo: la tabla se pinta una sola vez. */
  load(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      goals: this.api.list(),
      projects: this.projectsApi.list(),
    }).subscribe({
      next: ({ goals, projects }) => {
        this.rows.set(goals);
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

  openEdit(goal: Goal): void {
    this.editing.set(goal);
    this.resetKey.update((key) => key + 1);
    this.dialogVisible.set(true);
  }

  /** El mismo manejador para crear y editar: `editing()` decide el verbo. */
  save(payload: GoalPayload): void {
    const current = this.editing();
    this.saving.set(true);

    const request = current ? this.api.update(current.id, payload) : this.api.create(payload);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success(current ? 'Meta actualizada' : 'Meta creada');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error('No se pudo guardar', toApiMessage(error));
      },
    });
  }

  /** Baja lógica: `PATCH /:id/deactivate`. */
  deactivate(goal: Goal): void {
    this.confirmation.confirm({
      header: 'Baja lógica',
      message: `¿Desactivar la meta #${goal.id}? Su estado pasará a inactivo.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.deactivate(goal.id).subscribe({
          next: () => {
            this.notify.warn('Meta desactivada');
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
  remove(goal: Goal): void {
    this.confirmation.confirm({
      header: 'Eliminar definitivamente',
      message: `Se borrará la meta #${goal.id} de la base de datos. Esta acción no se puede deshacer.`,
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.api.remove(goal.id).subscribe({
          next: () => {
            this.notify.success('Meta eliminada');
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
