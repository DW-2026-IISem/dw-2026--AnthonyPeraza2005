import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { Commission } from '../../../core/models/commission.model';
import { Contribution } from '../../../core/models/contribution.model';
import { Contributor } from '../../../core/models/contributor.model';
import { PaymentTransaction } from '../../../core/models/payment-transaction.model';
import { Project } from '../../../core/models/project.model';
import { Refund } from '../../../core/models/refund.model';
import { ContributionList } from './contribution-list';

const API = environment.apiUrl;
const CONTRIBUCIONES = `${API}/contribuciones`;
const PROYECTOS = `${API}/proyectos`;
const CONTRIBUYENTES = `${API}/contribuyentes`;
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

const CONTRIBUYENTES_DATA: Contributor[] = [
  {
    id: 1,
    name: 'María Fernanda Ortiz',
    email: 'maria.ortiz@example.com',
    phone: null,
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
  {
    id: 2,
    amount: '80000.50',
    contribution_date: '2026-10-12',
    project_id: 1,
    contributor_id: 1,
    status: 'active',
  },
];

// Los pagos 1 y 3 son del aporte 1; el pago 2 es del aporte 2.
const PAGOS_DATA: PaymentTransaction[] = [
  {
    id: 1,
    reference: 'NQ-2026-0001',
    payment_method: 'nequi',
    amount: '150000.00',
    transaction_date: '2026-10-06',
    contribution_id: 1,
    status: 'active',
  },
  {
    id: 2,
    reference: 'TR-2026-0002',
    payment_method: 'transferencia',
    amount: '80000.50',
    transaction_date: '2026-10-13',
    contribution_id: 2,
    status: 'active',
  },
  {
    id: 3,
    reference: 'NQ-2026-0003',
    payment_method: 'nequi',
    amount: '50000.00',
    transaction_date: '2026-10-08',
    contribution_id: 1,
    status: 'inactive',
  },
];

// La comisión 1 es del pago 1 (aporte 1); la comisión 2 es del pago 2 (aporte 2).
const COMISIONES_DATA: Commission[] = [
  {
    id: 1,
    percentage: '2.95',
    amount: '4425.00',
    calculation_date: '2026-10-07',
    payment_transaction_id: 1,
    status: 'active',
  },
  {
    id: 2,
    percentage: '5.00',
    amount: '4000.03',
    calculation_date: '2026-10-14',
    payment_transaction_id: 2,
    status: 'active',
  },
];

const REEMBOLSOS_DATA: Refund[] = [
  {
    id: 1,
    amount: '20000.00',
    reason: 'Aporte duplicado',
    refund_date: '2026-10-10',
    contribution_id: 1,
    status: 'active',
  },
  {
    id: 2,
    amount: '5000.00',
    reason: 'Error de digitación',
    refund_date: '2026-10-15',
    contribution_id: 2,
    status: 'active',
  },
];

describe('ContributionList · detalle del aporte', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContributionList],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        MessageService,
        ConfirmationService,
      ],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  async function crearLista() {
    const fixture = TestBed.createComponent(ContributionList);
    http.expectOne(CONTRIBUYENTES).flush({ contributors: CONTRIBUYENTES_DATA });
    http.expectOne(PROYECTOS).flush({ projects: PROYECTOS_DATA });
    http.expectOne(CONTRIBUCIONES).flush({ contributions: CONTRIBUCIONES_DATA });
    fixture.detectChanges();
    await fixture.whenStable();
    return { lista: fixture.componentInstance };
  }

  it('should not request payments, commissions or refunds until the detail is opened', async () => {
    await crearLista();

    http.expectNone(PAGOS);
    http.expectNone(COMISIONES);
    http.expectNone(REEMBOLSOS);
  });

  it('should load the three lists on demand and keep only the records of that contribution', async () => {
    const { lista } = await crearLista();

    lista.openDetail(CONTRIBUCIONES_DATA[0]);
    expect(lista.detailVisible()).toBe(true);
    expect(lista.detailLoading()).toBe(true);

    http.expectOne(PAGOS).flush({ payment_transactions: PAGOS_DATA });
    http.expectOne(COMISIONES).flush({ commissions: COMISIONES_DATA });
    http.expectOne(REEMBOLSOS).flush({ refunds: REEMBOLSOS_DATA });

    expect(lista.detailLoading()).toBe(false);
    expect(lista.detailPayments().map((p) => p.id)).toEqual([1, 3]);
    expect(lista.detailCommissions().map((c) => c.id)).toEqual([1]); // solo la del pago 1
    expect(lista.detailRefunds().map((r) => r.id)).toEqual([1]);
  });

  it('should close the dialog and show a toast when the detail fails to load', async () => {
    const { lista } = await crearLista();
    const add = vi.spyOn(TestBed.inject(MessageService), 'add');

    lista.openDetail(CONTRIBUCIONES_DATA[0]);

    // El error se contesta al final, después de las otras dos peticiones.
    http.expectOne(PAGOS).flush({ payment_transactions: [] });
    http.expectOne(COMISIONES).flush({ commissions: [] });
    http
      .expectOne(REEMBOLSOS)
      .flush({ error: 'Internal error' }, { status: 500, statusText: 'Server Error' });

    expect(lista.detailVisible()).toBe(false);
    expect(lista.detailLoading()).toBe(false);
    expect(add).toHaveBeenCalledWith(
      expect.objectContaining({ severity: 'error', summary: 'No se pudo cargar el detalle' }),
    );
  });
});
