import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { Disbursement, DisbursementPayload } from '../../../core/models/disbursement.model';
import { Project } from '../../../core/models/project.model';
import { DisbursementList } from './disbursement-list';

const DESEMBOLSOS = `${environment.apiUrl}/desembolsos`;
const PROYECTOS = `${environment.apiUrl}/proyectos`;

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

// Los montos llegan como texto, igual que en el backend real.
const DESEMBOLSOS_DATA: Disbursement[] = [
  {
    id: 1,
    amount: '3000000.00',
    disbursement_date: '2026-10-15',
    method: 'Transferencia bancaria',
    project_id: 1,
    status: 'active',
  },
  {
    id: 2,
    amount: '1500000.50',
    disbursement_date: '2026-10-20',
    method: 'Nequi',
    project_id: 2,
    status: 'active',
  },
  {
    id: 3,
    amount: '8000000.00',
    disbursement_date: '2026-10-25',
    method: 'Consignación',
    project_id: 3, // proyecto inactivo
    status: 'inactive',
  },
];

const NUEVO: DisbursementPayload = {
  amount: 2000000,
  disbursement_date: '2026-10-28',
  method: 'Daviplata',
  project_id: 1,
  status: 'active',
};

describe('DisbursementList', () => {
  let http: HttpTestingController;
  let confirmation: ConfirmationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisbursementList],
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

  /** `forkJoin` lanza dos GET: se contestan los dos. */
  function responderCarga(desembolsos = DESEMBOLSOS_DATA) {
    http.expectOne(PROYECTOS).flush({ projects: PROYECTOS_DATA });
    http.expectOne(DESEMBOLSOS).flush({ disbursements: desembolsos });
  }

  async function crearLista() {
    const fixture = TestBed.createComponent(DisbursementList);
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

  it('should load disbursements and projects and render them in the table', async () => {
    const { lista, compilado } = await crearLista();

    expect(lista.rows().length).toBe(3);
    expect(lista.projects().length).toBe(3);
    expect(lista.loading()).toBe(false);

    const texto = compilado.textContent ?? '';
    expect(texto).toContain('Huerta escolar Uribia');
    expect(texto).toContain('Nequi');
    expect(texto).toContain('3 desembolsos');
  });

  it('should show the backend error and an empty table when the load fails', async () => {
    const fixture = TestBed.createComponent(DisbursementList);
    http.expectOne(PROYECTOS).flush({ projects: [] });
    http
      .expectOne(DESEMBOLSOS)
      .flush({ error: 'Missing Bearer token' }, { status: 401, statusText: 'Unauthorized' });
    fixture.detectChanges();
    await fixture.whenStable();

    const lista = fixture.componentInstance;
    expect(lista.error()).toBe('Missing Bearer token');
    expect(lista.rows()).toEqual([]);
    expect(lista.loading()).toBe(false);
  });

  it('should resolve the project title and fall back when it is unknown', async () => {
    const { lista } = await crearLista();

    expect(lista.projectTitle()(1)).toBe('Biblioteca comunitaria Riohacha');
    expect(lista.projectTitle()(99)).toBe('Proyecto #99');
  });

  it('should convert text amounts to numbers for sorting', async () => {
    const { lista } = await crearLista();

    expect(lista.tableRows().map((row) => row.value)).toEqual([3000000, 1500000.5, 8000000]);
  });

  it('should format an ISO date as DD/MM/YYYY without shifting the day', async () => {
    const { lista } = await crearLista();

    expect(lista.formatDate('2026-10-15')).toBe('15/10/2026');
    expect(lista.formatDate('2027-01-01')).toBe('01/01/2027');
  });

  it('should offer only active projects, plus the current one when editing', async () => {
    const { lista } = await crearLista();

    expect(lista.projectOptions().map((p) => p.id)).toEqual([1, 2]);

    lista.openEdit(DESEMBOLSOS_DATA[2]); // su proyecto (3) está inactivo
    expect(lista.projectOptions().map((p) => p.id)).toEqual([1, 2, 3]);
  });

  it('should filter locally by method or project name without calling the backend', async () => {
    const { lista } = await crearLista();

    lista.filter.set('nequi'); // método
    expect(lista.visibleRows().map((d) => d.id)).toEqual([2]);

    lista.filter.set('riohacha'); // título del proyecto
    expect(lista.visibleRows().map((d) => d.id)).toEqual([1]);

    http.expectNone(DESEMBOLSOS);
    http.expectNone(PROYECTOS);
  });

  it('should add up only the active disbursements', async () => {
    const { lista } = await crearLista();

    expect(lista.activeCount()).toBe(2);
    expect(lista.activeTotal()).toBe(4500000.5); // 3000000.00 + 1500000.50, sin la inactiva
  });

  it('should POST a new disbursement with status and reload both lists', async () => {
    const { lista } = await crearLista();

    lista.openCreate();
    expect(lista.dialogVisible()).toBe(true);
    expect(lista.title()).toBe('Nuevo desembolso');

    lista.save(NUEVO);

    const alta = http.expectOne(DESEMBOLSOS);
    expect(alta.request.method).toBe('POST');
    expect(alta.request.body).toEqual(NUEVO);
    alta.flush({ disbursement: { id: 4, ...NUEVO } });

    expect(lista.dialogVisible()).toBe(false);
    responderCarga();
  });

  it('should PATCH the edited disbursement and send no status', async () => {
    const { lista } = await crearLista();

    lista.openEdit(DESEMBOLSOS_DATA[0]);
    expect(lista.title()).toBe('Editar desembolso');

    const cambio: DisbursementPayload = {
      amount: 3200000,
      disbursement_date: '2026-10-16',
      method: 'Transferencia bancaria',
      project_id: 1,
    };
    lista.save(cambio);

    const peticion = http.expectOne(`${DESEMBOLSOS}/1`);
    expect(peticion.request.method).toBe('PATCH');
    expect(peticion.request.body).toEqual(cambio);
    peticion.flush({ disbursement: DESEMBOLSOS_DATA[0] });

    responderCarga();
  });

  it('should call deactivate and DELETE only after the confirmation is accepted', async () => {
    const { lista } = await crearLista();

    // Rechazada: no hay petición.
    const rechazo = vi.spyOn(confirmation, 'confirm').mockImplementation(() => confirmation);
    lista.deactivate(DESEMBOLSOS_DATA[0]);
    lista.remove(DESEMBOLSOS_DATA[0]);
    http.expectNone(`${DESEMBOLSOS}/1/deactivate`);
    http.expectNone(`${DESEMBOLSOS}/1`);
    rechazo.mockRestore();

    // Aceptada: baja lógica y recarga.
    const aceptado = aceptarConfirmacion();
    lista.deactivate(DESEMBOLSOS_DATA[0]);

    const baja = http.expectOne(`${DESEMBOLSOS}/1/deactivate`);
    expect(baja.request.method).toBe('PATCH');
    baja.flush({ message: 'Disbursement deactivated (logical delete)' });
    responderCarga(DESEMBOLSOS_DATA.slice(1));

    // Aceptada: baja física y recarga.
    lista.remove(DESEMBOLSOS_DATA[1]);

    const borrado = http.expectOne(`${DESEMBOLSOS}/2`);
    expect(borrado.request.method).toBe('DELETE');
    borrado.flush({ message: 'Disbursement deleted' });
    responderCarga(DESEMBOLSOS_DATA.slice(2));

    aceptado.mockRestore();
  });

  it('should keep the dialog open and show a toast when saving fails', async () => {
    const { lista } = await crearLista();
    const add = vi.spyOn(TestBed.inject(MessageService), 'add');

    lista.openCreate();
    lista.save(NUEVO);

    http
      .expectOne(DESEMBOLSOS)
      .flush(
        { error: 'El proyecto indicado no está activo' },
        { status: 400, statusText: 'Bad Request' },
      );

    expect(lista.dialogVisible()).toBe(true);
    expect(lista.saving()).toBe(false);
    expect(add).toHaveBeenCalledWith(
      expect.objectContaining({ severity: 'error', summary: 'No se pudo guardar' }),
    );
  });
});
