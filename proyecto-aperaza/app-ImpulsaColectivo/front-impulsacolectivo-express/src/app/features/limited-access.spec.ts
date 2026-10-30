import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../environments/environment';
import { Contribution } from '../core/models/contribution.model';
import { Project } from '../core/models/project.model';
import { SessionStore } from '../core/services/session-store';
import { grantAccess } from '../core/testing/access';
import { ContributionList } from './contributions/contribution-list/contribution-list';
import { Dashboard } from './dashboard/dashboard';
import { PaymentTransactionList } from './payment-transactions/payment-transaction-list/payment-transaction-list';
import { ProjectList } from './projects/project-list/project-list';

const API = environment.apiUrl;
const PROMOTORES = `${API}/promotores`;
const PROYECTOS = `${API}/proyectos`;
const CONTRIBUYENTES = `${API}/contribuyentes`;
const CONTRIBUCIONES = `${API}/contribuciones`;
const PAGOS = `${API}/transacciones-pago`;
const COMISIONES = `${API}/comisiones`;
const REEMBOLSOS = `${API}/reembolsos`;

const PROYECTOS_DATA: Project[] = [
  {
    id: 1,
    title: 'Biblioteca comunitaria Riohacha',
    description: 'Dotar de libros y mobiliario a una biblioteca barrial',
    start_date: '2026-10-01',
    end_date: '2027-02-28',
    promoter_id: 1,
    status: 'active',
  },
];

const CONTRIBUCIONES_DATA: Contribution[] = [
  {
    id: 1,
    amount: '250000.00',
    contribution_date: '2026-10-05',
    project_id: 1,
    contributor_id: 1,
    status: 'active',
  },
];

describe('Pantallas con acceso limitado', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        MessageService,
        ConfirmationService,
      ],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  /** Deja en la sesión solo los permisos de un rol limitado. */
  function conAcceso(...permisos: string[]) {
    grantAccess(TestBed.inject(SessionStore), ...permisos);
  }

  it('should load projects without asking for promoters when the role cannot read them', async () => {
    conAcceso('GET /api/proyectos');

    const fixture = TestBed.createComponent(ProjectList);
    http.expectOne(PROYECTOS).flush({ projects: PROYECTOS_DATA });
    http.expectNone(PROMOTORES);
    fixture.detectChanges();
    await fixture.whenStable();

    const lista = fixture.componentInstance;
    expect(lista.rows().length).toBe(1);
    expect(lista.error()).toBeNull();
    expect(lista.promoterName()(1)).toBe('Promotor #1');
  });

  it('should load contributions without asking for contributors when the role cannot read them', async () => {
    conAcceso('GET /api/proyectos', 'GET /api/contribuciones');

    const fixture = TestBed.createComponent(ContributionList);
    http.expectOne(CONTRIBUCIONES).flush({ contributions: CONTRIBUCIONES_DATA });
    http.expectOne(PROYECTOS).flush({ projects: PROYECTOS_DATA });
    http.expectNone(CONTRIBUYENTES);
    fixture.detectChanges();
    await fixture.whenStable();

    const lista = fixture.componentInstance;
    expect(lista.rows().length).toBe(1);
    expect(lista.error()).toBeNull();
    expect(lista.contributorName()(1)).toBe('Contribuyente #1');
  });

  it('should ask in the detail only for the lists the role can read', async () => {
    conAcceso(
      'GET /api/proyectos',
      'GET /api/contribuciones',
      'GET /api/transacciones-pago',
      'GET /api/reembolsos',
    );

    const fixture = TestBed.createComponent(ContributionList);
    http.expectOne(CONTRIBUCIONES).flush({ contributions: CONTRIBUCIONES_DATA });
    http.expectOne(PROYECTOS).flush({ projects: PROYECTOS_DATA });
    fixture.detectChanges();
    await fixture.whenStable();

    const lista = fixture.componentInstance;
    lista.openDetail(CONTRIBUCIONES_DATA[0]);

    http.expectOne(PAGOS).flush({ payment_transactions: [] });
    http.expectOne(REEMBOLSOS).flush({ refunds: [] });
    http.expectNone(COMISIONES);

    expect(lista.detailLoading()).toBe(false);
    expect(lista.detailVisible()).toBe(true);
    expect(lista.detailCommissions()).toEqual([]);
  });

  it('should load payments without asking for contributors when the role cannot read them', async () => {
    conAcceso('GET /api/transacciones-pago', 'GET /api/contribuciones', 'GET /api/proyectos');

    const fixture = TestBed.createComponent(PaymentTransactionList);
    http.expectOne(PAGOS).flush({ payment_transactions: [] });
    http.expectOne(CONTRIBUCIONES).flush({ contributions: CONTRIBUCIONES_DATA });
    http.expectOne(PROYECTOS).flush({ projects: PROYECTOS_DATA });
    http.expectNone(CONTRIBUYENTES);
    fixture.detectChanges();
    await fixture.whenStable();

    const lista = fixture.componentInstance;
    expect(lista.error()).toBeNull();
    expect(lista.contributionLabel()(1)).toBe(
      '#1 · Biblioteca comunitaria Riohacha · Contribuyente #1',
    );
  });

  it('should show only the project card when the role can read nothing else', async () => {
    conAcceso('GET /api/proyectos');

    const fixture = TestBed.createComponent(Dashboard);
    http.expectOne(PROYECTOS).flush({ projects: PROYECTOS_DATA });
    http.expectNone(CONTRIBUYENTES);
    http.expectNone(CONTRIBUCIONES);
    http.expectNone(PAGOS);
    fixture.detectChanges();
    await fixture.whenStable();

    const texto = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(texto).toContain('Proyectos en curso');
    expect(texto).not.toContain('Contribuyentes activos');
    expect(texto).not.toContain('Aportes activos');
    expect(texto).not.toContain('Últimos aportes');
  });

  it('should show contributions but neither contributors nor payments for a promoter-like role', async () => {
    conAcceso('GET /api/proyectos', 'GET /api/contribuciones');

    const fixture = TestBed.createComponent(Dashboard);
    http.expectOne(PROYECTOS).flush({ projects: PROYECTOS_DATA });
    http.expectOne(CONTRIBUCIONES).flush({ contributions: CONTRIBUCIONES_DATA });
    http.expectNone(CONTRIBUYENTES);
    http.expectNone(PAGOS);
    fixture.detectChanges();
    await fixture.whenStable();

    const texto = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(texto).toContain('Aportes activos');
    expect(texto).toContain('Total recaudado');
    expect(texto).toContain('Últimos aportes');
    expect(texto).not.toContain('Contribuyentes activos');
    expect(texto).not.toContain('Pagado:');
  });
});
