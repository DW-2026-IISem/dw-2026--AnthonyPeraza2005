import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { Project } from '../../../core/models/project.model';
import { Reward, RewardPayload } from '../../../core/models/reward.model';
import { RewardList } from './reward-list';

const RECOMPENSAS = `${environment.apiUrl}/recompensas`;
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
const RECOMPENSAS_DATA: Reward[] = [
  {
    id: 1,
    title: 'Mención en el muro de aliados',
    description: 'Tu nombre en el muro de la biblioteca',
    min_amount: '20000.00',
    project_id: 1,
    status: 'active',
  },
  {
    id: 2,
    title: 'Kit de semillas nativas',
    description: 'Semillas para tu propia huerta',
    min_amount: '50000.50',
    project_id: 2,
    status: 'active',
  },
  {
    id: 3,
    title: 'Visita guiada a la huerta',
    description: 'Recorrido con las familias de la escuela',
    min_amount: '150000.00',
    project_id: 3, // proyecto inactivo
    status: 'inactive',
  },
];

const NUEVA: RewardPayload = {
  title: 'Camiseta del proyecto',
  description: 'Camiseta de algodón con el logo de la biblioteca',
  min_amount: 80000,
  project_id: 1,
  status: 'active',
};

describe('RewardList', () => {
  let http: HttpTestingController;
  let confirmation: ConfirmationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RewardList],
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
  function responderCarga(recompensas = RECOMPENSAS_DATA) {
    http.expectOne(PROYECTOS).flush({ projects: PROYECTOS_DATA });
    http.expectOne(RECOMPENSAS).flush({ rewards: recompensas });
  }

  async function crearLista() {
    const fixture = TestBed.createComponent(RewardList);
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

  it('should load rewards and projects and render them in the table', async () => {
    const { lista, compilado } = await crearLista();

    expect(lista.rows().length).toBe(3);
    expect(lista.projects().length).toBe(3);
    expect(lista.loading()).toBe(false);

    const texto = compilado.textContent ?? '';
    expect(texto).toContain('Kit de semillas nativas');
    expect(texto).toContain('Huerta escolar Uribia');
    expect(texto).toContain('3 recompensas');
  });

  it('should show the backend error and an empty table when the load fails', async () => {
    const fixture = TestBed.createComponent(RewardList);
    http.expectOne(PROYECTOS).flush({ projects: [] });
    http
      .expectOne(RECOMPENSAS)
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

    expect(lista.tableRows().map((row) => row.value)).toEqual([20000, 50000.5, 150000]);
  });

  it('should offer only active projects, plus the current one when editing', async () => {
    const { lista } = await crearLista();

    expect(lista.projectOptions().map((p) => p.id)).toEqual([1, 2]);

    lista.openEdit(RECOMPENSAS_DATA[2]); // su proyecto (3) está inactivo
    expect(lista.projectOptions().map((p) => p.id)).toEqual([1, 2, 3]);
  });

  it('should filter locally by title or project name without calling the backend', async () => {
    const { lista } = await crearLista();

    lista.filter.set('semillas'); // título
    expect(lista.visibleRows().map((r) => r.id)).toEqual([2]);

    lista.filter.set('riohacha'); // título del proyecto
    expect(lista.visibleRows().map((r) => r.id)).toEqual([1]);

    http.expectNone(RECOMPENSAS);
    http.expectNone(PROYECTOS);
  });

  it('should count the active rewards', async () => {
    const { lista } = await crearLista();

    expect(lista.activeCount()).toBe(2);
  });

  it('should POST a new reward with status and reload both lists', async () => {
    const { lista } = await crearLista();

    lista.openCreate();
    expect(lista.dialogVisible()).toBe(true);
    expect(lista.title()).toBe('Nueva recompensa');

    lista.save(NUEVA);

    const alta = http.expectOne(RECOMPENSAS);
    expect(alta.request.method).toBe('POST');
    expect(alta.request.body).toEqual(NUEVA);
    alta.flush({ reward: { id: 4, ...NUEVA } });

    expect(lista.dialogVisible()).toBe(false);
    responderCarga();
  });

  it('should PATCH the edited reward and send no status', async () => {
    const { lista } = await crearLista();

    lista.openEdit(RECOMPENSAS_DATA[0]);
    expect(lista.title()).toBe('Editar recompensa');

    const cambio: RewardPayload = {
      title: 'Mención en el muro de aliados',
      description: 'Tu nombre en el muro de la biblioteca',
      min_amount: 25000,
      project_id: 1,
    };
    lista.save(cambio);

    const peticion = http.expectOne(`${RECOMPENSAS}/1`);
    expect(peticion.request.method).toBe('PATCH');
    expect(peticion.request.body).toEqual(cambio);
    peticion.flush({ reward: RECOMPENSAS_DATA[0] });

    responderCarga();
  });

  it('should call deactivate after the confirmation is accepted', async () => {
    const { lista } = await crearLista();
    aceptarConfirmacion();

    lista.deactivate(RECOMPENSAS_DATA[0]);

    const baja = http.expectOne(`${RECOMPENSAS}/1/deactivate`);
    expect(baja.request.method).toBe('PATCH');
    baja.flush({ message: 'Reward deactivated (logical delete)' });

    responderCarga(RECOMPENSAS_DATA.slice(1));
  });

  it('should call DELETE after the confirmation is accepted and not when it is rejected', async () => {
    const { lista } = await crearLista();

    // Rechazada: no hay petición.
    const rechazo = vi.spyOn(confirmation, 'confirm').mockImplementation(() => confirmation);
    lista.deactivate(RECOMPENSAS_DATA[0]);
    lista.remove(RECOMPENSAS_DATA[0]);
    http.expectNone(`${RECOMPENSAS}/1/deactivate`);
    http.expectNone(`${RECOMPENSAS}/1`);
    rechazo.mockRestore();

    // Aceptada: DELETE y recarga.
    aceptarConfirmacion();
    lista.remove(RECOMPENSAS_DATA[0]);

    const borrado = http.expectOne(`${RECOMPENSAS}/1`);
    expect(borrado.request.method).toBe('DELETE');
    borrado.flush({ message: 'Reward deleted' });

    responderCarga(RECOMPENSAS_DATA.slice(1));
  });

  it('should keep the dialog open and show a toast when saving fails', async () => {
    const { lista } = await crearLista();
    const add = vi.spyOn(TestBed.inject(MessageService), 'add');

    lista.openCreate();
    lista.save(NUEVA);

    http
      .expectOne(RECOMPENSAS)
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
