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
import { Project } from '../../../core/models/project.model';
import { Reward, RewardPayload } from '../../../core/models/reward.model';
import { NotificationService } from '../../../core/services/notification';
import { toApiMessage } from '../../../core/utils/api-error';
import { filterRows } from '../../../core/utils/filter-rows';
import { HasPermission } from '../../../shared/directives/has-permission';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../shared/ui/status-tag/status-tag';
import { ProjectApi } from '../../projects/project-api';
import { RewardForm } from '../reward-form/reward-form';
import { RewardApi } from '../reward-api';

/** Fila de la tabla: la recompensa más su monto ya convertido a número. */
interface RewardRow extends Reward {
  value: number;
}

/**
 * Lista de recompensas con todas las operaciones del CRUD.
 *
 * Carga recompensas y proyectos en paralelo y resuelve el título del proyecto
 * con un `Map` memorizado por `computed`.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-reward-list',
  imports: [
    ButtonModule,
    HasPermission,
    CurrencyPipe,
    DialogModule,
    EmptyState,
    InputTextModule,
    MessageModule,
    PageHeader,
    RewardForm,
    StatusTag,
    TableModule,
    TagModule,
    TooltipModule,
  ],
  templateUrl: './reward-list.html',
  styleUrl: './reward-list.css',
})
export class RewardList {
  private readonly api = inject(RewardApi);
  private readonly projectsApi = inject(ProjectApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);

  /** Datos del backend. */
  readonly rows = signal<Reward[]>([]);
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

  /** El backend manda `min_amount` como texto: se ordena por `value`, un número. */
  readonly tableRows = computed<RewardRow[]>(() =>
    this.rows().map((reward) => ({ ...reward, value: Number(reward.min_amount) })),
  );

  /** Resultado de aplicar el buscador (título, descripción, proyecto o monto). */
  readonly visibleRows = computed(() => {
    const projectOf = this.projectTitle();
    return filterRows(this.tableRows(), this.filter(), (reward) => [
      reward.title,
      reward.description,
      projectOf(reward.project_id),
      String(reward.value),
    ]);
  });

  readonly activeCount = computed(
    () => this.rows().filter((reward) => reward.status === 'active').length,
  );

  readonly dialogVisible = signal(false);
  readonly editing = signal<Reward | null>(null);
  readonly resetKey = signal(0);

  readonly title = computed(() => (this.editing() ? 'Editar recompensa' : 'Nueva recompensa'));

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

  /** Recompensas y proyectos en paralelo: la tabla se pinta una sola vez. */
  load(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      rewards: this.api.list(),
      projects: this.projectsApi.list(),
    }).subscribe({
      next: ({ rewards, projects }) => {
        this.rows.set(rewards);
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

  openEdit(reward: Reward): void {
    this.editing.set(reward);
    this.resetKey.update((key) => key + 1);
    this.dialogVisible.set(true);
  }

  /** El mismo manejador para crear y editar: `editing()` decide el verbo. */
  save(payload: RewardPayload): void {
    const current = this.editing();
    this.saving.set(true);

    const request = current ? this.api.update(current.id, payload) : this.api.create(payload);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success(current ? 'Recompensa actualizada' : 'Recompensa creada');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error('No se pudo guardar', toApiMessage(error));
      },
    });
  }

  /** Baja lógica: `PATCH /:id/deactivate`. */
  deactivate(reward: Reward): void {
    this.confirmation.confirm({
      header: 'Baja lógica',
      message: `¿Desactivar «${reward.title}»? Su estado pasará a inactivo.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.deactivate(reward.id).subscribe({
          next: () => {
            this.notify.warn('Recompensa desactivada');
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
  remove(reward: Reward): void {
    this.confirmation.confirm({
      header: 'Eliminar definitivamente',
      message: `Se borrará «${reward.title}» de la base de datos. Esta acción no se puede deshacer.`,
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.api.remove(reward.id).subscribe({
          next: () => {
            this.notify.success('Recompensa eliminada');
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
