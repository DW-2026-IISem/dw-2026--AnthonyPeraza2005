import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { forkJoin } from 'rxjs';
import { Contribution } from '../../core/models/contribution.model';
import { Contributor } from '../../core/models/contributor.model';
import { PaymentTransaction } from '../../core/models/payment-transaction.model';
import { Project } from '../../core/models/project.model';
import { toApiMessage } from '../../core/utils/api-error';
import { fromIsoDate, todayIso } from '../../core/utils/iso-date';
import { PageHeader } from '../../shared/ui/page-header/page-header';
import { StatusTag } from '../../shared/ui/status-tag/status-tag';
import { ContributionApi } from '../contributions/contribution-api';
import { ContributorApi } from '../contributors/contributor-api';
import { PaymentTransactionApi } from '../payment-transactions/payment-transaction-api';
import { projectPhase } from '../projects/project-phase';
import { ProjectApi } from '../projects/project-api';

/** Un proyecto en curso es «por terminar» si cierra en este número de días o menos. */
const ENDING_SOON_DAYS = 30;
const MS_PER_DAY = 86_400_000;

/**
 * Panel de resumen. No llama a un endpoint propio: pide cuatro listas en
 * paralelo y deriva todos los indicadores con `computed`.
 */
@Component({
  host: { class: 'block' },
  selector: 'app-dashboard',
  imports: [
    ButtonModule,
    CurrencyPipe,
    DatePipe,
    MessageModule,
    PageHeader,
    RouterLink,
    SkeletonModule,
    StatusTag,
    TagModule,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private readonly projectsApi = inject(ProjectApi);
  private readonly contributorsApi = inject(ContributorApi);
  private readonly contributionsApi = inject(ContributionApi);
  private readonly paymentsApi = inject(PaymentTransactionApi);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly projects = signal<Project[]>([]);
  readonly contributors = signal<Contributor[]>([]);
  readonly contributions = signal<Contribution[]>([]);
  readonly payments = signal<PaymentTransaction[]>([]);

  /** Hoy, local, 'YYYY-MM-DD': base para la fase de cada proyecto. */
  readonly today = todayIso();

  readonly projectTitle = computed(() => {
    const titles = new Map(this.projects().map((project) => [project.id, project.title]));
    return (id: number) => titles.get(id) ?? `Proyecto #${id}`;
  });

  readonly contributorName = computed(() => {
    const names = new Map(this.contributors().map((contributor) => [contributor.id, contributor.name]));
    return (id: number) => names.get(id) ?? `Contribuyente #${id}`;
  });

  readonly runningCount = computed(
    () => this.projects().filter((project) => projectPhase(project, this.today) === 'running').length,
  );

  readonly activeContributorCount = computed(
    () => this.contributors().filter((contributor) => contributor.status === 'active').length,
  );

  readonly activeContributions = computed(() =>
    this.contributions().filter((contribution) => contribution.status === 'active'),
  );

  /** Suma de los aportes activos. `amount` llega como texto: se pasa por `Number`. */
  readonly totalRaised = computed(() =>
    this.activeContributions().reduce((sum, contribution) => sum + Number(contribution.amount), 0),
  );

  /** Suma de los pagos activos. */
  readonly totalPaid = computed(() =>
    this.payments()
      .filter((payment) => payment.status === 'active')
      .reduce((sum, payment) => sum + Number(payment.amount), 0),
  );

  /** Proyectos en curso que cierran pronto, los más cercanos primero. */
  readonly endingSoon = computed(() =>
    this.projects()
      .filter(
        (project) =>
          projectPhase(project, this.today) === 'running' &&
          this.daysLeft(project) <= ENDING_SOON_DAYS,
      )
      .sort((a, b) => a.end_date.localeCompare(b.end_date))
      .slice(0, 5),
  );

  /** Últimos cinco aportes, los más recientes primero. */
  readonly latestContributions = computed(() =>
    [...this.contributions()]
      .sort(
        (a, b) =>
          b.contribution_date.localeCompare(a.contribution_date) || b.id - a.id,
      )
      .slice(0, 5),
  );

  constructor() {
    this.load();
  }

  /** Días que faltan para que cierre el proyecto (0 el último día). */
  daysLeft(project: Project): number {
    const end = fromIsoDate(project.end_date).getTime();
    const today = fromIsoDate(this.today).getTime();
    return Math.round((end - today) / MS_PER_DAY);
  }

  /** Cuatro peticiones en paralelo: el panel se pinta una sola vez. */
  load(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      projects: this.projectsApi.list(),
      contributors: this.contributorsApi.list(),
      contributions: this.contributionsApi.list(),
      payments: this.paymentsApi.list(),
    }).subscribe({
      next: ({ projects, contributors, contributions, payments }) => {
        this.projects.set(projects);
        this.contributors.set(contributors);
        this.contributions.set(contributions);
        this.payments.set(payments);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.error.set(toApiMessage(error));
        this.loading.set(false);
      },
    });
  }
}
