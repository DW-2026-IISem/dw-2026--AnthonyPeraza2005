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
import { Contribution } from '../../../core/models/contribution.model';
import { Contributor } from '../../../core/models/contributor.model';
import {
  PaymentTransaction,
  PaymentTransactionPayload,
} from '../../../core/models/payment-transaction.model';
import { Project } from '../../../core/models/project.model';
import { NotificationService } from '../../../core/services/notification';
import { toApiMessage } from '../../../core/utils/api-error';
import { filterRows } from '../../../core/utils/filter-rows';
import { EmptyState } from '../../../shared/ui/empty-state/empty-state';
import { PageHeader } from '../../../shared/ui/page-header/page-header';
import { StatusTag } from '../../../shared/ui/status-tag/status-tag';
import { ContributionApi } from '../../contributions/contribution-api';
import { ContributorApi } from '../../contributors/contributor-api';
import { ProjectApi } from '../../projects/project-api';
import { PaymentTransactionApi } from '../payment-transaction-api';
import {
  ContributionOption,
  PaymentTransactionForm,
} from '../payment-transaction-form/payment-transaction-form';

/** Fila de la tabla: el pago más su monto ya convertido a número. */
interface PaymentRow extends PaymentTransaction {
  value: number;
}

/**
 * Lista de pagos con todas las operaciones del CRUD.
 *
 * Carga pagos, contribuciones, proyectos y contribuyentes en paralelo para
 * mostrar a qué aporte pertenece cada pago.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-payment-transaction-list',
  imports: [
    ButtonModule,
    CurrencyPipe,
    DatePipe,
    DialogModule,
    EmptyState,
    InputTextModule,
    MessageModule,
    PageHeader,
    PaymentTransactionForm,
    StatusTag,
    TableModule,
    TagModule,
    TooltipModule,
  ],
  templateUrl: './payment-transaction-list.html',
  styleUrl: './payment-transaction-list.css',
})
export class PaymentTransactionList {
  private readonly api = inject(PaymentTransactionApi);
  private readonly contributionsApi = inject(ContributionApi);
  private readonly projectsApi = inject(ProjectApi);
  private readonly contributorsApi = inject(ContributorApi);
  private readonly notify = inject(NotificationService);
  private readonly confirmation = inject(ConfirmationService);

  /** Datos del backend. */
  readonly rows = signal<PaymentTransaction[]>([]);
  readonly contributions = signal<Contribution[]>([]);
  readonly projects = signal<Project[]>([]);
  readonly contributors = signal<Contributor[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal<string | null>(null);
  readonly filter = signal('');

  /** `id de contribución → «#id · proyecto · contribuyente»`, construido una sola vez. */
  readonly contributionLabel = computed(() => {
    const projects = new Map(this.projects().map((project) => [project.id, project.title]));
    const contributors = new Map(
      this.contributors().map((contributor) => [contributor.id, contributor.name]),
    );
    const labels = new Map(
      this.contributions().map((contribution) => [
        contribution.id,
        `#${contribution.id} · ${projects.get(contribution.project_id) ?? `Proyecto #${contribution.project_id}`} · ${contributors.get(contribution.contributor_id) ?? `Contribuyente #${contribution.contributor_id}`}`,
      ]),
    );
    return (id: number) => labels.get(id) ?? `Aporte #${id}`;
  });

  /** El monto llega como texto: se ordena por `value`, que es un número. */
  readonly tableRows = computed<PaymentRow[]>(() =>
    this.rows().map((payment) => ({ ...payment, value: Number(payment.amount) })),
  );

  /** Resultado de aplicar el buscador (referencia, método, aporte, monto o fecha). */
  readonly visibleRows = computed(() => {
    const labelOf = this.contributionLabel();
    return filterRows(this.tableRows(), this.filter(), (payment) => [
      payment.reference,
      payment.payment_method,
      labelOf(payment.contribution_id),
      String(payment.value),
      payment.transaction_date,
    ]);
  });

  /** Pagos activos: los únicos que pueden recibir comisiones. */
  readonly activeCount = computed(
    () => this.rows().filter((payment) => payment.status === 'active').length,
  );

  /** Suma de los pagos activos. */
  readonly activeTotal = computed(() =>
    this.rows()
      .filter((payment) => payment.status === 'active')
      .reduce((sum, payment) => sum + Number(payment.amount), 0),
  );

  readonly dialogVisible = signal(false);
  readonly editing = signal<PaymentTransaction | null>(null);
  readonly resetKey = signal(0);

  readonly title = computed(() => (this.editing() ? 'Editar pago' : 'Nuevo pago'));

  /** Solo contribuciones activas, más la actual al editar (aunque esté inactiva). */
  readonly contributionOptions = computed<ContributionOption[]>(() => {
    const currentId = this.editing()?.contribution_id;
    const labelOf = this.contributionLabel();
    return this.contributions()
      .filter((contribution) => contribution.status === 'active' || contribution.id === currentId)
      .map((contribution) => ({ id: contribution.id, label: labelOf(contribution.id) }));
  });

  constructor() {
    this.load();
  }

  /** Pagos, contribuciones, proyectos y contribuyentes en paralelo. */
  load(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      payments: this.api.list(),
      contributions: this.contributionsApi.list(),
      projects: this.projectsApi.list(),
      contributors: this.contributorsApi.list(),
    }).subscribe({
      next: ({ payments, contributions, projects, contributors }) => {
        this.rows.set(payments);
        this.contributions.set(contributions);
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

  openEdit(payment: PaymentTransaction): void {
    this.editing.set(payment);
    this.resetKey.update((key) => key + 1);
    this.dialogVisible.set(true);
  }

  /** El mismo manejador para crear y editar: `editing()` decide el verbo. */
  save(payload: PaymentTransactionPayload): void {
    const current = this.editing();
    this.saving.set(true);

    const request = current ? this.api.update(current.id, payload) : this.api.create(payload);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogVisible.set(false);
        this.notify.success(current ? 'Pago actualizado' : 'Pago registrado');
        this.load();
      },
      error: (error: unknown) => {
        this.saving.set(false);
        this.notify.error('No se pudo guardar', toApiMessage(error));
      },
    });
  }

  /** Baja lógica: `PATCH /:id/deactivate`. */
  deactivate(payment: PaymentTransaction): void {
    this.confirmation.confirm({
      header: 'Baja lógica',
      message: `¿Desactivar el pago ${payment.reference}? Dejará de poder recibir comisiones.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Desactivar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.api.deactivate(payment.id).subscribe({
          next: () => {
            this.notify.warn('Pago desactivado');
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
  remove(payment: PaymentTransaction): void {
    this.confirmation.confirm({
      header: 'Eliminar definitivamente',
      message: `Se borrará el pago ${payment.reference} de la base de datos. Esta acción no se puede deshacer.`,
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.api.remove(payment.id).subscribe({
          next: () => {
            this.notify.success('Pago eliminado');
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
