import { CurrencyPipe, DatePipe } from '@angular/common';
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
import { Contribution, ContributionPayload } from '../../../core/models/contribution.model';
import { Contributor } from '../../../core/models/contributor.model';
import { Project } from '../../../core/models/project.model';
import { NotificationService } from '../../../core/services/notification';
import { toApiMessage } from '../../../core/utils/api-error';
import { filterRows } from '../../../core/utils/filter-rows';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../shared/ui/status-tag/status-tag';
import { ContributorApi } from '../../contributors/contributor-api';
import { ProjectApi } from '../../projects/project-api';
import { ContributionApi } from '../contribution-api';
import { ContributionForm } from '../contribution-form/contribution-form';
import { ContributionDetail } from '../contribution-detail/contribution-detail';
import { CommissionApi } from '../../commissions/commission-api';
import { PaymentTransactionApi } from '../../payment-transactions/payment-transaction-api';
import { RefundApi } from '../../refunds/refund-api';
import { Commission } from '../../../core/models/commission.model';
import { PaymentTransaction } from '../../../core/models/payment-transaction.model';
import { Refund } from '../../../core/models/refund.model';

/** Fila de la tabla: la contribución más su monto ya convertido a número. */
interface ContributionRow extends Contribution {
  value: number;
}

/**
 * Lista de contribuciones con todas las operaciones del CRUD.
 *
 * Carga contribuciones, proyectos y contribuyentes en paralelo y resuelve los
 * nombres con `Map` memorizados por `computed`.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-contribution-list',
  imports: [
    ButtonModule,
    ContributionDetail,
    ContributionForm,
    CurrencyPipe,
    DatePipe,
    DialogModule,
    EmptyState,
    InputTextModule,
    MessageModule,
    PageHeader,
    StatusTag,
    TableModule,
    TagModule,
    TooltipModule,
  ],
  templateUrl: './contribution-list.html',
  styleUrl: './contribution-list.css',
})
export class ContributionList {
  private readonly api = inject(ContributionApi);
  private readonly projectsApi = inject(ProjectApi);
  private readonly contributorsApi = inject(ContributorApi);
  private readonly paymentsApi = inject(PaymentTransactionApi);
  private readonly commissionsApi = inject(CommissionApi);
  private readonly refundsApi = inject(RefundApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);

  /** Datos del backend. */
  readonly rows = signal<Contribution[]>([]);
  readonly projects = signal<Project[]>([]);
  readonly contributors = signal<Contributor[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal('');

  /** `id → título` construido una sola vez; devuelve una función de consulta. */
  readonly projectTitle = computed(() => {
    const titles = new Map(this.projects().map((project) => [project.id, project.title]));
    return (id: number) => titles.get(id) ?? `Proyecto #${id}`;
  });

  /** `id → nombre` construido una sola vez; devuelve una función de consulta. */
  readonly contributorName = computed(() => {
    const names = new Map(this.contributors().map((contributor) => [contributor.id, contributor.name]));
    return (id: number) => names.get(id) ?? `Contribuyente #${id}`;
  });

  /**
   * El backend manda `amount` como texto ("250000.00"). Ordenar por texto pondría
   * "80000.50" después de "250000.00": se ordena por `value`, que es un número.
   */
  readonly tableRows = computed<ContributionRow[]>(() =>
    this.rows().map((contribution) => ({ ...contribution, value: Number(contribution.amount) })),
  );

  /** Resultado de aplicar el buscador (proyecto, contribuyente, monto o fecha). */
  readonly visibleRows = computed(() => {
    const projectOf = this.projectTitle();
    const contributorOf = this.contributorName();
    return filterRows(this.tableRows(), this.filter(), (contribution) => [
      projectOf(contribution.project_id),
      contributorOf(contribution.contributor_id),
      String(contribution.value),
      contribution.contribution_date,
    ]);
  });

  /** Contribuciones activas: las únicas que pueden recibir pagos y reembolsos. */
  readonly activeCount = computed(
    () => this.rows().filter((contribution) => contribution.status === 'active').length,
  );

  /** Suma de las activas. Sustituye al contador de stock bajo de la guía. */
  readonly activeTotal = computed(() =>
    this.rows()
      .filter((contribution) => contribution.status === 'active')
      .reduce((sum, contribution) => sum + Number(contribution.amount), 0),
  );

  readonly dialogVisible = signal(false);
  readonly editing = signal<Contribution | null>(null);
  readonly resetKey = signal(0);

  readonly title = computed(() => (this.editing() ? 'Editar contribución' : 'Nueva contribución'));

  /** Solo proyectos activos, más el actual al editar (aunque esté inactivo). */
  readonly projectOptions = computed(() => {
    const currentId = this.editing()?.project_id;
    return this.projects().filter(
      (project) => project.status === 'active' || project.id === currentId,
    );
  });

  /** Solo contribuyentes activos, más el actual al editar. */
  readonly contributorOptions = computed(() => {
    const currentId = this.editing()?.contributor_id;
    return this.contributors().filter(
      (contributor) => contributor.status === 'active' || contributor.id === currentId,
    );
  });

  /** Estado del diálogo de detalle: sus datos se piden solo al abrirlo. */
  readonly detailVisible = signal(false);
  readonly detailLoading = signal(false);
  readonly detailContribution = signal<Contribution | null>(null);
  readonly detailPayments = signal<PaymentTransaction[]>([]);
  readonly detailCommissions = signal<Commission[]>([]);
  readonly detailRefunds = signal<Refund[]>([]);

  constructor() {
    this.load();
  }

  /** Pagos, comisiones y reembolsos del aporte; el backend no los anida. */
  openDetail(contribution: Contribution): void {
    this.detailContribution.set(contribution);
    this.detailPayments.set([]);
    this.detailCommissions.set([]);
    this.detailRefunds.set([]);
    this.detailLoading.set(true);
    this.detailVisible.set(true);

    forkJoin({
      payments: this.paymentsApi.list(),
      commissions: this.commissionsApi.list(),
      refunds: this.refundsApi.list(),
    }).subscribe({
      next: ({ payments, commissions, refunds }) => {
        const mine = payments.filter((payment) => payment.contribution_id === contribution.id);
        const mineIds = new Set(mine.map((payment) => payment.id));

        this.detailPayments.set(mine);
        this.detailCommissions.set(
          commissions.filter((commission) => mineIds.has(commission.payment_transaction_id)),
        );
        this.detailRefunds.set(refunds.filter((refund) => refund.contribution_id === contribution.id));
        this.detailLoading.set(false);
      },
      error: (error: unknown) => {
        this.detailLoading.set(false);
        this.detailVisible.set(false);
        this.notify.error('No se pudo cargar el detalle', toApiMessage(error));
      },
    });
  }

  /** Contribuciones, proyectos y contribuyentes en paralelo. */
  load(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      contributions: this.api.list(),
      projects: this.projectsApi.list(),
      contributors: this.contributorsApi.list(),
    }).subscribe({
      next: ({ contributions, projects, contributors }) => {
        this.rows.set(contributions);
        this.projects.set(projects);
        this.contributors.set(contributors);
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

  openEdit(contribution: Contribution): void {
    this.editing.set(contribution);
    this.resetKey.update((key) => key + 1);
    this.dialogVisible.set(true);
  }

  /** El mismo manejador para crear y editar: `editing()` decide el verbo. */
  save(payload: ContributionPayload): void {
    const current = this.editing();
    this.saving.set(true);

    const request = current ? this.api.update(current.id, payload) : this.api.create(payload);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success(current ? 'Contribución actualizada' : 'Contribución registrada');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error('No se pudo guardar', toApiMessage(error));
      },
    });
  }

  /** Baja lógica: `PATCH /:id/deactivate`. */
  deactivate(contribution: Contribution): void {
    this.confirmation.confirm({
      header: 'Baja lógica',
      message: `¿Desactivar el aporte #${contribution.id}? Dejará de poder recibir pagos y reembolsos.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.deactivate(contribution.id).subscribe({
          next: () => {
            this.notify.warn('Contribución desactivada');
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
  remove(contribution: Contribution): void {
    this.confirmation.confirm({
      header: 'Eliminar definitivamente',
      message: `Se borrará el aporte #${contribution.id} de la base de datos. Esta acción no se puede deshacer.`,
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.api.remove(contribution.id).subscribe({
          next: () => {
            this.notify.success('Contribución eliminada');
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
