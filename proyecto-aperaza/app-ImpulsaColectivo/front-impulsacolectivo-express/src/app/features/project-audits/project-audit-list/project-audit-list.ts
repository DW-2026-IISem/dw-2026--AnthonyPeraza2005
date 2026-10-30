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
import { Project } from '../../../core/models/project.model';
import { ProjectAudit, ProjectAuditPayload } from '../../../core/models/project-audit.model';
import { NotificationService } from '../../../core/services/notification';
import { toApiMessage } from '../../../core/utils/api-error';
import { filterRows } from '../../../core/utils/filter-rows';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../shared/ui/status-tag/status-tag';
import { ProjectApi } from '../../projects/project-api';
import { ProjectAuditForm } from '../project-audit-form/project-audit-form';
import { ProjectAuditApi } from '../project-audit-api';

/**
 * Lista de auditorías de proyecto con todas las operaciones del CRUD.
 *
 * Carga auditorías y proyectos en paralelo y resuelve el título del proyecto
 * con un `Map` memorizado por `computed`.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-project-audit-list',
  imports: [
    ButtonModule,
    DialogModule,
    EmptyState,
    InputTextModule,
    MessageModule,
    PageHeader,
    ProjectAuditForm,
    StatusTag,
    TableModule,
    TagModule,
    TooltipModule,
  ],
  templateUrl: './project-audit-list.html',
  styleUrl: './project-audit-list.css',
})
export class ProjectAuditList {
  private readonly api = inject(ProjectAuditApi);
  private readonly projectsApi = inject(ProjectApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);

  /** Datos del backend. */
  readonly rows = signal<ProjectAudit[]>([]);
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

  /** Resultado de aplicar el buscador (acción, detalle, proyecto o fecha). */
  readonly visibleRows = computed(() => {
    const projectOf = this.projectTitle();
    return filterRows(this.rows(), this.filter(), (audit) => [
      audit.action,
      audit.detail,
      projectOf(audit.project_id),
      audit.audit_date,
    ]);
  });

  readonly activeCount = computed(
    () => this.rows().filter((audit) => audit.status === 'active').length,
  );

  readonly dialogVisible = signal(false);
  readonly editing = signal<ProjectAudit | null>(null);
  readonly resetKey = signal(0);

  readonly title = computed(() => (this.editing() ? 'Editar auditoría' : 'Nueva auditoría'));

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

  /** Auditorías y proyectos en paralelo: la tabla se pinta una sola vez. */
  load(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      audits: this.api.list(),
      projects: this.projectsApi.list(),
    }).subscribe({
      next: ({ audits, projects }) => {
        this.rows.set(audits);
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

  openEdit(audit: ProjectAudit): void {
    this.editing.set(audit);
    this.resetKey.update((key) => key + 1);
    this.dialogVisible.set(true);
  }

  /** El mismo manejador para crear y editar: `editing()` decide el verbo. */
  save(payload: ProjectAuditPayload): void {
    const current = this.editing();
    this.saving.set(true);

    const request = current ? this.api.update(current.id, payload) : this.api.create(payload);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success(current ? 'Auditoría actualizada' : 'Auditoría creada');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error('No se pudo guardar', toApiMessage(error));
      },
    });
  }

  /** Baja lógica: `PATCH /:id/deactivate`. */
  deactivate(audit: ProjectAudit): void {
    this.confirmation.confirm({
      header: 'Baja lógica',
      message: `¿Desactivar la auditoría #${audit.id}? Su estado pasará a inactivo.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.deactivate(audit.id).subscribe({
          next: () => {
            this.notify.warn('Auditoría desactivada');
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
  remove(audit: ProjectAudit): void {
    this.confirmation.confirm({
      header: 'Eliminar definitivamente',
      message: `Se borrará la auditoría #${audit.id} de la base de datos. Esta acción no se puede deshacer.`,
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.api.remove(audit.id).subscribe({
          next: () => {
            this.notify.success('Auditoría eliminada');
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
