import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SessionStore } from '../../core/services/session-store';
import { grantFullAccess } from '../../core/testing/access';
import { provideRouter } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Contribution } from '../../core/models/contribution.model';
import { Contributor } from '../../core/models/contributor.model';
import { PaymentTransaction } from '../../core/models/payment-transaction.model';
import { Project } from '../../core/models/project.model';
import { toIsoDate } from '../../core/utils/iso-date';
import { Dashboard } from './dashboard';

const PROYECTOS = `${environment.apiUrl}/proyectos`;
const CONTRIBUYENTES = `${environment.apiUrl}/contribuyentes`;
const CONTRIBUCIONES = `${environment.apiUrl}/contribuciones`;
const PAGOS = `${environment.apiUrl}/transacciones-pago`;

/** Fecha 'YYYY-MM-DD' a `n` días de hoy (negativo = pasado). */
function enDias(n: number): string {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + n);
  return toIsoDate(fecha);
}

const PROYECTOS_DATA: Project[] = [
  {
    id: 1,
    title: 'Biblioteca comunitaria Riohacha',
    description: 'Dotar de libros y mobiliario a una biblioteca barrial',
    start_date: enDias(-30),
    end_date: enDias(10), // en curso, cierra pronto
    promoter_id: 1,
    status: 'active',
  },
  {
    id: 2,
    title: 'Huerta escolar Uribia',
    description: 'Huerta para el comedor de una escuela rural',
    start_date: enDias(-30),
    end_date: enDias(100), // en curso, cierra lejos
    promoter_id: 2,
    status: 'active',
  },
  {
    id: 3,
    title: 'Becas de robótica Maicao',
    description: 'Becas para talleres de robótica juvenil',
    start_date: enDias(-200),
    end_date: enDias(-1), // finalizado
    promoter_id: 1,
    status: 'active',
  },
  {
    id: 4,
    title: 'Panadería comunitaria Manaure',
    description: 'Horno industrial para mujeres artesanas',
    start_date: enDias(5),
    end_date: enDias(50), // próximo
    promoter_id: 2,
    status: 'active',
  },
];

const CONTRIBUYENTES_DATA: Contributor[] = [
  { id: 1, name: 'María Fernanda Ortiz', email: 'maria.ortiz@example.com', phone: null, status: 'active' },
  { id: 2, name: 'Red Wayuu Emprende', email: 'contacto@wayuuemprende.co', phone: null, status: 'active' },
  { id: 3, name: 'Carlos Andrés Pérez', email: 'carlos.perez@example.com', phone: null, status: 'inactive' },
];

// Montos como texto. El aporte 4 está inactivo y no suma al total.
const CONTRIBUCIONES_DATA: Contribution[] = [
  { id: 1, amount: '100000.00', contribution_date: '2026-10-01', project_id: 1, contributor_id: 1, status: 'active' },
  { id: 2, amount: '200000.00', contribution_date: '2026-10-05', project_id: 1, contributor_id: 2, status: 'active' },
  { id: 3, amount: '50000.50', contribution_date: '2026-10-10', project_id: 2, contributor_id: 1, status: 'active' },
  { id: 4, amount: '500000.00', contribution_date: '2026-10-12', project_id: 2, contributor_id: 2, status: 'inactive' },
  { id: 5, amount: '75000.00', contribution_date: '2026-10-20', project_id: 1, contributor_id: 1, status: 'active' },
  { id: 6, amount: '25000.00', contribution_date: '2026-10-25', project_id: 2, contributor_id: 2, status: 'active' },
];

// El pago 3 está inactivo y no suma al total pagado.
const PAGOS_DATA: PaymentTransaction[] = [
  { id: 1, reference: 'NQ-2026-0001', payment_method: 'nequi', amount: '150000.00', transaction_date: '2026-10-06', contribution_id: 1, status: 'active' },
  { id: 2, reference: 'TR-2026-0002', payment_method: 'transferencia', amount: '25000.50', transaction_date: '2026-10-13', contribution_id: 2, status: 'active' },
  { id: 3, reference: 'NQ-2026-0003', payment_method: 'nequi', amount: '900000.00', transaction_date: '2026-10-21', contribution_id: 3, status: 'inactive' },
];

describe('Dashboard', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    grantFullAccess(TestBed.inject(SessionStore));
  });

  afterEach(() => http.verify());

  /** `forkJoin` lanza cuatro GET: se contestan los cuatro. */
  function responderCarga() {
    http.expectOne(PAGOS).flush({ payment_transactions: PAGOS_DATA });
    http.expectOne(CONTRIBUCIONES).flush({ contributions: CONTRIBUCIONES_DATA });
    http.expectOne(CONTRIBUYENTES).flush({ contributors: CONTRIBUYENTES_DATA });
    http.expectOne(PROYECTOS).flush({ projects: PROYECTOS_DATA });
  }

  async function crearPanel() {
    const fixture = TestBed.createComponent(Dashboard);
    responderCarga();
    fixture.detectChanges();
    await fixture.whenStable();

    return {
      fixture,
      panel: fixture.componentInstance,
      compilado: fixture.nativeElement as HTMLElement,
    };
  }

  it('should load the four lists and finish loading', async () => {
    const { panel } = await crearPanel();

    expect(panel.projects().length).toBe(4);
    expect(panel.contributors().length).toBe(3);
    expect(panel.contributions().length).toBe(6);
    expect(panel.payments().length).toBe(3);
    expect(panel.loading()).toBe(false);
  });

  it('should show the backend error and finish loading when a request fails', async () => {
    const fixture = TestBed.createComponent(Dashboard);
    http.expectOne(PAGOS).flush({ payment_transactions: [] });
    http.expectOne(CONTRIBUCIONES).flush({ contributions: [] });
    http.expectOne(CONTRIBUYENTES).flush({ contributors: [] });
    http
      .expectOne(PROYECTOS)
      .flush({ error: 'Missing Bearer token' }, { status: 401, statusText: 'Unauthorized' });
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.error()).toBe('Missing Bearer token');
    expect(fixture.componentInstance.loading()).toBe(false);
  });

  it('should derive the indicators counting only active records', async () => {
    const { panel } = await crearPanel();

    expect(panel.runningCount()).toBe(2);
    expect(panel.activeContributorCount()).toBe(2);
    expect(panel.activeContributions().length).toBe(5);
    expect(panel.totalRaised()).toBe(450000.5); // sin el aporte inactivo
    expect(panel.totalPaid()).toBe(175000.5); // sin el pago inactivo
  });

  it('should list only running projects that end within 30 days', async () => {
    const { panel } = await crearPanel();

    expect(panel.endingSoon().map((project) => project.id)).toEqual([1]);
    expect(panel.daysLeft(PROYECTOS_DATA[0])).toBe(10);
  });

  it('should list the five latest contributions, most recent first', async () => {
    const { panel } = await crearPanel();

    expect(panel.latestContributions().map((contribution) => contribution.id)).toEqual([
      6, 5, 4, 3, 2,
    ]);
  });

  it('should render the indicators and the ending-soon project', async () => {
    const { compilado } = await crearPanel();
    const texto = compilado.textContent ?? '';

    expect(texto).toContain('Proyectos en curso');
    expect(texto).toContain('Total recaudado');
    expect(texto).toContain('Biblioteca comunitaria Riohacha');
    expect(texto).toContain('Red Wayuu Emprende');
  });
});
