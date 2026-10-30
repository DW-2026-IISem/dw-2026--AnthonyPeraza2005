import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SessionStore } from '../../../core/services/session-store';
import { grantFullAccess } from '../../../core/testing/access';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { Contribution, ContributionPayload } from '../../../core/models/contribution.model';
import { Contributor } from '../../../core/models/contributor.model';
import { Project } from '../../../core/models/project.model';
import { ContributionList } from './contribution-list';

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

// Los montos llegan como texto, igual que en el backend real.
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

const NUEVA: ContributionPayload = {
  amount: 120000,
  contribution_date: '2026-10-28',
  project_id: 1,
  contributor_id: 1,
  status: 'active',
};

describe('ContributionList', () => {
  let http: HttpTestingController;
  let confirmation: ConfirmationService;

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
    grantFullAccess(TestBed.inject(SessionStore));
    confirmation = TestBed.inject(ConfirmationService);
  });

  afterEach(() => http.verify());

  /** `forkJoin` lanza tres GET: se contestan los tres. */
  function responderCarga(
    contribuciones = CONTRIBUCIONES_DATA,
    proyectos = PROYECTOS_DATA,
    contribuyentes = CONTRIBUYENTES_DATA,
  ) {
    http.expectOne(CONTRIBUYENTES).flush({ contributors: contribuyentes });
    http.expectOne(PROYECTOS).flush({ projects: proyectos });
    http.expectOne(CONTRIBUCIONES).flush({ contributions: contribuciones });
  }

  async function crearLista() {
    const fixture = TestBed.createComponent(ContributionList);
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

  it('should load the three lists and render the contributions in the table', async () => {
    const { lista, compilado } = await crearLista();

    expect(lista.rows().length).toBe(3);
    expect(lista.projects().length).toBe(3);
    expect(lista.contributors().length).toBe(3);
    expect(lista.loading()).toBe(false);

    const texto = compilado.textContent ?? '';
    expect(texto).toContain('Biblioteca comunitaria Riohacha');
    expect(texto).toContain('María Fernanda Ortiz');
    expect(texto).toContain('3 contribuciones');
  });

  it('should show the backend error and an empty table when the load fails', async () => {
    const fixture = TestBed.createComponent(ContributionList);
    http.expectOne(CONTRIBUYENTES).flush({ contributors: [] });
    http.expectOne(PROYECTOS).flush({ projects: [] });
    http
      .expectOne(CONTRIBUCIONES)
      .flush({ error: 'Missing Bearer token' }, { status: 401, statusText: 'Unauthorized' });
    fixture.detectChanges();
    await fixture.whenStable();

    const lista = fixture.componentInstance;
    expect(lista.error()).toBe('Missing Bearer token');
    expect(lista.rows()).toEqual([]);
    expect(lista.loading()).toBe(false);
  });

  it('should resolve project and contributor names and fall back when unknown', async () => {
    const { lista } = await crearLista();

    expect(lista.projectTitle()(1)).toBe('Biblioteca comunitaria Riohacha');
    expect(lista.projectTitle()(99)).toBe('Proyecto #99');
    expect(lista.contributorName()(2)).toBe('Red Wayuu Emprende');
    expect(lista.contributorName()(99)).toBe('Contribuyente #99');
  });

  it('should convert text amounts to numbers for sorting', async () => {
    const { lista } = await crearLista();

    expect(lista.tableRows().map((row) => row.value)).toEqual([250000, 80000.5, 1000000]);
    expect(typeof lista.tableRows()[1].value).toBe('number');
  });

  it('should offer only active projects and contributors, plus the current ones when editing', async () => {
    const { lista } = await crearLista();

    expect(lista.projectOptions().map((p) => p.id)).toEqual([1, 2]);
    expect(lista.contributorOptions().map((c) => c.id)).toEqual([1, 2]);

    lista.openEdit(CONTRIBUCIONES_DATA[2]); // su proyecto (3) y contribuyente (3) están inactivos
    expect(lista.projectOptions().map((p) => p.id)).toEqual([1, 2, 3]);
    expect(lista.contributorOptions().map((c) => c.id)).toEqual([1, 2, 3]);
  });

  it('should filter locally by project title or contributor name without calling the backend', async () => {
    const { lista } = await crearLista();

    lista.filter.set('riohacha'); // título del proyecto
    expect(lista.visibleRows().map((c) => c.id)).toEqual([1]);

    lista.filter.set('wayuu'); // nombre del contribuyente
    expect(lista.visibleRows().map((c) => c.id)).toEqual([2]);

    http.expectNone(CONTRIBUCIONES);
    http.expectNone(PROYECTOS);
    http.expectNone(CONTRIBUYENTES);
  });

  it('should add up only the active contributions', async () => {
    const { lista } = await crearLista();

    expect(lista.activeCount()).toBe(2);
    expect(lista.activeTotal()).toBe(330000.5); // 250000.00 + 80000.50, sin la inactiva
  });

  it('should POST a new contribution with status and reload the three lists', async () => {
    const { lista } = await crearLista();

    lista.openCreate();
    expect(lista.dialogVisible()).toBe(true);
    expect(lista.title()).toBe('Nueva contribución');

    lista.save(NUEVA);

    const alta = http.expectOne(CONTRIBUCIONES);
    expect(alta.request.method).toBe('POST');
    expect(alta.request.body).toEqual(NUEVA);
    alta.flush({ contribution: { id: 4, ...NUEVA } });

    expect(lista.dialogVisible()).toBe(false);
    responderCarga(); // recarga posterior de las tres listas
  });

  it('should PATCH the edited contribution and send no status', async () => {
    const { lista } = await crearLista();

    lista.openEdit(CONTRIBUCIONES_DATA[0]);
    expect(lista.title()).toBe('Editar contribución');

    const cambio: ContributionPayload = {
      amount: 300000,
      contribution_date: '2026-10-05',
      project_id: 2,
      contributor_id: 1,
    };
    lista.save(cambio);

    const peticion = http.expectOne(`${CONTRIBUCIONES}/1`);
    expect(peticion.request.method).toBe('PATCH');
    expect(peticion.request.body).toEqual(cambio);
    peticion.flush({ contribution: CONTRIBUCIONES_DATA[0] });

    responderCarga();
  });

  it('should call deactivate after the confirmation is accepted', async () => {
    const { lista } = await crearLista();
    aceptarConfirmacion();

    lista.deactivate(CONTRIBUCIONES_DATA[0]);

    const baja = http.expectOne(`${CONTRIBUCIONES}/1/deactivate`);
    expect(baja.request.method).toBe('PATCH');
    baja.flush({ message: 'Contribution deactivated (logical delete)' });

    responderCarga(CONTRIBUCIONES_DATA.slice(1));
  });

  it('should call DELETE after the confirmation is accepted and not when it is rejected', async () => {
    const { lista } = await crearLista();

    // Rechazada: no hay petición.
    const rechazo = vi.spyOn(confirmation, 'confirm').mockImplementation(() => confirmation);
    lista.deactivate(CONTRIBUCIONES_DATA[0]);
    lista.remove(CONTRIBUCIONES_DATA[0]);
    http.expectNone(`${CONTRIBUCIONES}/1/deactivate`);
    http.expectNone(`${CONTRIBUCIONES}/1`);
    rechazo.mockRestore();

    // Aceptada: DELETE y recarga.
    aceptarConfirmacion();
    lista.remove(CONTRIBUCIONES_DATA[0]);

    const borrado = http.expectOne(`${CONTRIBUCIONES}/1`);
    expect(borrado.request.method).toBe('DELETE');
    borrado.flush({ message: 'Contribution deleted' });

    responderCarga(CONTRIBUCIONES_DATA.slice(1));
  });

  it('should keep the dialog open and show a toast when saving fails', async () => {
    const { lista } = await crearLista();
    const add = vi.spyOn(TestBed.inject(MessageService), 'add');

    lista.openCreate();
    lista.save(NUEVA);

    http
      .expectOne(CONTRIBUCIONES)
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
