import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { Contribution } from '../../../core/models/contribution.model';
import { Contributor } from '../../../core/models/contributor.model';
import {
  PaymentTransaction,
  PaymentTransactionPayload,
} from '../../../core/models/payment-transaction.model';
import { Project } from '../../../core/models/project.model';
import { PaymentTransactionList } from './payment-transaction-list';

const PAGOS = `${environment.apiUrl}/transacciones-pago`;
const CONTRIBUCIONES = `${environment.apiUrl}/contribuciones`;
const PROYECTOS = `${environment.apiUrl}/proyectos`;
const CONTRIBUYENTES = `${environment.apiUrl}/contribuyentes`;

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
  {
    id: 2,
    title: 'Huerta escolar Uribia',
    description: 'Huerta para el comedor de una escuela rural',
    start_date: '2026-10-01',
    end_date: '2027-03-31',
    promoter_id: 2,
    status: 'active',
  },
  {
    id: 3,
    title: 'Becas de robótica Maicao',
    description: 'Becas para talleres de robótica juvenil',
    start_date: '2026-10-01',
    end_date: '2027-03-31',
    promoter_id: 1,
    status: 'inactive',
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
  {
    id: 2,
    name: 'Red Wayuu Emprende',
    email: 'contacto@wayuuemprende.co',
    phone: '3001234567',
    status: 'active',
  },
  {
    id: 3,
    name: 'Carlos Andrés Pérez',
    email: 'carlos.perez@example.com',
    phone: null,
    status: 'inactive',
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
    project_id: 2,
    contributor_id: 2,
    status: 'active',
  },
  {
    id: 3,
    amount: '1000000.00',
    contribution_date: '2026-10-20',
    project_id: 3, // proyecto inactivo
    contributor_id: 3, // contribuyente inactivo
    status: 'inactive',
  },
];

// Los montos llegan como texto, igual que en el backend real.
const PAGOS_DATA: PaymentTransaction[] = [
  {
    id: 1,
    reference: 'NQ-2026-0001',
    payment_method: 'nequi',
    amount: '250000.00',
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
    amount: '1000000.00',
    transaction_date: '2026-10-21',
    contribution_id: 3, // contribución inactiva
    status: 'inactive',
  },
];

const NUEVO: PaymentTransactionPayload = {
  reference: 'NQ-2026-0004',
  payment_method: 'nequi',
  amount: 120000,
  transaction_date: '2026-10-28',
  contribution_id: 1,
  status: 'active',
};

describe('PaymentTransactionList', () => {
  let http: HttpTestingController;
  let confirmation: ConfirmationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentTransactionList],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        MessageService,
        ConfirmationService,
      ],
    }).compileComponents();

    http = TestBed.inject(HttpTestingController);
    confirmation = TestBed.inject(ConfirmationService);
  });

  afterEach(() => http.verify());

  /** `forkJoin` lanza cuatro GET: se contestan los cuatro. */
  function responderCarga(pagos = PAGOS_DATA) {
    http.expectOne(CONTRIBUYENTES).flush({ contributors: CONTRIBUYENTES_DATA });
    http.expectOne(PROYECTOS).flush({ projects: PROYECTOS_DATA });
    http.expectOne(CONTRIBUCIONES).flush({ contributions: CONTRIBUCIONES_DATA });
    http.expectOne(PAGOS).flush({ payment_transactions: pagos });
  }

  async function crearLista() {
    const fixture = TestBed.createComponent(PaymentTransactionList);
    responderCarga();
    fixture.detectChanges();
    await fixture.whenStable();

    return {
      fixture,
      lista: fixture.componentInstance,
      compilado: fixture.nativeElement as HTMLElement,
    };
  }

  function aceptarConfirmacion() {
    return vi.spyOn(confirmation, 'confirm').mockImplementation((config) => {
      config.accept?.();
      return confirmation;
    });
  }

  it('should load the four lists and render the payments in the table', async () => {
    const { lista, compilado } = await crearLista();

    expect(lista.rows().length).toBe(3);
    expect(lista.contributions().length).toBe(3);
    expect(lista.loading()).toBe(false);

    const texto = compilado.textContent ?? '';
    expect(texto).toContain('NQ-2026-0001');
    expect(texto).toContain('Biblioteca comunitaria Riohacha');
    expect(texto).toContain('3 pagos');
  });

  it('should show the backend error and an empty table when the load fails', async () => {
    const fixture = TestBed.createComponent(PaymentTransactionList);
    http.expectOne(CONTRIBUYENTES).flush({ contributors: [] });
    http.expectOne(PROYECTOS).flush({ projects: [] });
    http.expectOne(CONTRIBUCIONES).flush({ contributions: [] });
    http
      .expectOne(PAGOS)
      .flush({ error: 'Missing Bearer token' }, { status: 401, statusText: 'Unauthorized' });
    fixture.detectChanges();
    await fixture.whenStable();

    const lista = fixture.componentInstance;
    expect(lista.error()).toBe('Missing Bearer token');
    expect(lista.rows()).toEqual([]);
    expect(lista.loading()).toBe(false);
  });

  it('should build the contribution label and fall back when it is unknown', async () => {
    const { lista } = await crearLista();

    expect(lista.contributionLabel()(1)).toBe(
      '#1 · Biblioteca comunitaria Riohacha · María Fernanda Ortiz',
    );
    expect(lista.contributionLabel()(99)).toBe('Aporte #99');
  });

  it('should convert text amounts to numbers for sorting', async () => {
    const { lista } = await crearLista();

    expect(lista.tableRows().map((row) => row.value)).toEqual([250000, 80000.5, 1000000]);
  });

  it('should offer only active contributions, plus the current one when editing', async () => {
    const { lista } = await crearLista();

    expect(lista.contributionOptions().map((option) => option.id)).toEqual([1, 2]);

    lista.openEdit(PAGOS_DATA[2]); // su contribución (3) está inactiva
    expect(lista.contributionOptions().map((option) => option.id)).toEqual([1, 2, 3]);
  });

  it('should filter locally by reference, method or contribution without calling the backend', async () => {
    const { lista } = await crearLista();

    lista.filter.set('NQ-2026-0003');
    expect(lista.visibleRows().map((p) => p.id)).toEqual([3]);

    lista.filter.set('transferencia');
    expect(lista.visibleRows().map((p) => p.id)).toEqual([2]);

    lista.filter.set('wayuu'); // contribuyente dentro de la etiqueta del aporte
    expect(lista.visibleRows().map((p) => p.id)).toEqual([2]);

    http.expectNone(PAGOS);
    http.expectNone(CONTRIBUCIONES);
  });

  it('should add up only the active payments', async () => {
    const { lista } = await crearLista();

    expect(lista.activeCount()).toBe(2);
    expect(lista.activeTotal()).toBe(330000.5);
  });

  it('should POST a new payment with status and reload the four lists', async () => {
    const { lista } = await crearLista();

    lista.openCreate();
    expect(lista.title()).toBe('Nuevo pago');

    lista.save(NUEVO);

    const alta = http.expectOne(PAGOS);
    expect(alta.request.method).toBe('POST');
    expect(alta.request.body).toEqual(NUEVO);
    alta.flush({ payment_transaction: { id: 4, ...NUEVO } });

    expect(lista.dialogVisible()).toBe(false);
    responderCarga();
  });

  it('should PATCH the edited payment and send no status', async () => {
    const { lista } = await crearLista();

    lista.openEdit(PAGOS_DATA[0]);
    expect(lista.title()).toBe('Editar pago');

    const cambio: PaymentTransactionPayload = {
      reference: 'NQ-2026-0001',
      payment_method: 'nequi',
      amount: 260000,
      transaction_date: '2026-10-06',
      contribution_id: 1,
    };
    lista.save(cambio);

    const peticion = http.expectOne(`${PAGOS}/1`);
    expect(peticion.request.method).toBe('PATCH');
    expect(peticion.request.body).toEqual(cambio);
    peticion.flush({ payment_transaction: PAGOS_DATA[0] });

    responderCarga();
  });

  it('should call deactivate after the confirmation is accepted', async () => {
    const { lista } = await crearLista();
    aceptarConfirmacion();

    lista.deactivate(PAGOS_DATA[0]);

    const baja = http.expectOne(`${PAGOS}/1/deactivate`);
    expect(baja.request.method).toBe('PATCH');
    baja.flush({ message: 'Payment transaction deactivated (logical delete)' });

    responderCarga(PAGOS_DATA.slice(1));
  });

  it('should call DELETE after the confirmation is accepted and not when it is rejected', async () => {
    const { lista } = await crearLista();

    // Rechazada: no hay petición.
    const rechazo = vi.spyOn(confirmation, 'confirm').mockImplementation(() => confirmation);
    lista.deactivate(PAGOS_DATA[0]);
    lista.remove(PAGOS_DATA[0]);
    http.expectNone(`${PAGOS}/1/deactivate`);
    http.expectNone(`${PAGOS}/1`);
    rechazo.mockRestore();

    // Aceptada: DELETE y recarga.
    aceptarConfirmacion();
    lista.remove(PAGOS_DATA[0]);

    const borrado = http.expectOne(`${PAGOS}/1`);
    expect(borrado.request.method).toBe('DELETE');
    borrado.flush({ message: 'Payment transaction deleted' });

    responderCarga(PAGOS_DATA.slice(1));
  });

  it('should keep the dialog open and show a toast when the reference is duplicated', async () => {
    const { lista } = await crearLista();
    const add = vi.spyOn(TestBed.inject(MessageService), 'add');

    lista.openCreate();
    lista.save(NUEVO);

    http
      .expectOne(PAGOS)
      .flush({ error: 'reference is already in use' }, { status: 409, statusText: 'Conflict' });

    expect(lista.dialogVisible()).toBe(true);
    expect(lista.saving()).toBe(false);
    expect(add).toHaveBeenCalledWith(
      expect.objectContaining({ severity: 'error', summary: 'No se pudo guardar' }),
    );
  });
});
