import { DatePipe } from '@angular/common';
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
import { Project, ProjectPayload } from '../../../core/models/project.model';
import { Promoter } from '../../../core/models/promoter.model';
import { NotificationService } from '../../../core/services/notification';
import { toApiMessage } from '../../../core/utils/api-error';
import { filterRows } from '../../../core/utils/filter-rows';
import { todayIso } from '../../../core/utils/iso-date';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../shared/ui/status-tag/status-tag';
import { PromoterApi } from '../../promoters/promoter-api';
import { ProjectApi } from '../project-api';
import { ProjectForm } from '../project-form/project-form';
import { PHASE_LABEL, PHASE_SEVERITY, ProjectPhase, projectPhase } from '../project-phase';

/**
 * Lista de proyectos con todas las operaciones del CRUD.
 *
 * Primera pantalla con una relación: carga proyectos y promotores en paralelo y
 * resuelve el nombre del promotor con un `Map` memorizado por `computed`.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-project-list',
  imports: [
    ButtonModule,
    DatePipe,
    DialogModule,
    EmptyState,
    InputTextModule,
    MessageModule,
    PageHeader,
    ProjectForm,
    StatusTag,
    TableModule,
    TagModule,
    TooltipModule,
  ],
  templateUrl: './project-list.html',
  styleUrl: './project-list.css',
})
export class ProjectList {
  private readonly api = inject(ProjectApi);
  private readonly promotersApi = inject(PromoterApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);

  /** Datos del backend. */
  readonly rows = signal<Project[]>([]);
  readonly promoters = signal<Promoter[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal('');

  /** Hoy, local, 'YYYY-MM-DD': base para calcular la fase de cada proyecto. */
  readonly today = todayIso();
  readonly phaseLabel = PHASE_LABEL;
  readonly phaseSeverity = PHASE_SEVERITY;

  /**
   * `id → nombre` construido una sola vez. Devuelve una función: el `computed`
   * rehace el `Map` solo cuando cambian los promotores y cada fila lo consulta.
   */
  readonly promoterName = computed(() => {
    const names = new Map(this.promoters().map((promoter) => [promoter.id, promoter.name]));
    return (id: number) => names.get(id) ?? `Promotor #${id}`;
  });

  /** Resultado de aplicar el buscador (título, descripción o nombre del promotor). */
  readonly visibleRows = computed(() => {
    const nameOf = this.promoterName();
    return filterRows(this.rows(), this.filter(), (project) => [
      project.title,
      project.description,
      nameOf(project.promoter_id),
    ]);
  });

  /** Proyectos en curso hoy; sustituye al contador de stock bajo de la guía. */
  readonly runningCount = computed(
    () => this.rows().filter((project) => projectPhase(project, this.today) === 'running').length,
  );

  readonly dialogVisible = signal(false);
  readonly editing = signal<Project | null>(null);
  readonly resetKey = signal(0);

  readonly title = computed(() => (this.editing() ? 'Editar proyecto' : 'Nuevo proyecto'));

  /** Solo promotores activos, más el actual al editar (aunque esté inactivo). */
  readonly promoterOptions = computed(() => {
    const currentId = this.editing()?.promoter_id;
    return this.promoters().filter(
      (promoter) => promoter.status === 'active' || promoter.id === currentId,
    );
  });

  constructor() {
    this.load();
  }

  phase(project: Project): ProjectPhase {
    return projectPhase(project, this.today);
  }

  /** Proyectos y promotores en paralelo: la tabla se pinta una sola vez. */
  load(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      projects: this.api.list(),
      promoters: this.promotersApi.list(),
    }).subscribe({
      next: ({ projects, promoters }) => {
        this.rows.set(projects);
        this.promoters.set(promoters);
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

  openEdit(project: Project): void {
    this.editing.set(project);
    this.resetKey.update((key) => key + 1);
    this.dialogVisible.set(true);
  }

  /** El mismo manejador para crear y editar: `editing()` decide el verbo. */
  save(payload: ProjectPayload): void {
    const current = this.editing();
    this.saving.set(true);

    const request = current ? this.api.update(current.id, payload) : this.api.create(payload);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success(current ? 'Proyecto actualizado' : 'Proyecto creado');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error('No se pudo guardar', toApiMessage(error));
      },
    });
  }

  /** Baja lógica: `PATCH /:id/deactivate`. */
  deactivate(project: Project): void {
    this.confirmation.confirm({
      header: 'Baja lógica',
      message: `¿Desactivar «${project.title}»? Su estado pasará a inactivo.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.deactivate(project.id).subscribe({
          next: () => {
            this.notify.warn('Proyecto desactivado');
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
  remove(project: Project): void {
    this.confirmation.confirm({
      header: 'Eliminar definitivamente',
      message: `Se borrará «${project.title}» de la base de datos. Esta acción no se puede deshacer.`,
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.api.remove(project.id).subscribe({
          next: () => {
            this.notify.success('Proyecto eliminado');
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
