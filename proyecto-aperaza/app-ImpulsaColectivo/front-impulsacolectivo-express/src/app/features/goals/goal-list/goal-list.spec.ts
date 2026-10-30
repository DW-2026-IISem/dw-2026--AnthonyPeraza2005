import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SessionStore } from '../../../core/services/session-store';
import { grantFullAccess } from '../../../core/testing/access';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { Goal, GoalPayload } from '../../../core/models/goal.model';
import { Project } from '../../../core/models/project.model';
import { GoalList } from './goal-list';

const METAS = `${environment.apiUrl}/metas`;
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
const METAS_DATA: Goal[] = [
  {
    id: 1,
    description: 'Comprar 500 libros infantiles para la biblioteca',
    target_amount: '5000000.00',
    project_id: 1,
    status: 'active',
  },
  {
    id: 2,
    description: 'Instalar el sistema de riego por goteo',
    target_amount: '3500000.50',
    project_id: 2,
    status: 'active',
  },
  {
    id: 3,
    description: 'Dotar el laboratorio de robótica',
    target_amount: '12000000.00',
    project_id: 3, // proyecto inactivo
    status: 'inactive',
  },
];

const NUEVA: GoalPayload = {
  description: 'Construir un horno comunitario',
  target_amount: 2000000,
  project_id: 1,
  status: 'active',
};

describe('GoalList', () => {
  let http: HttpTestingController;
  let confirmation: ConfirmationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoalList],
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

  /** `forkJoin` lanza dos GET: se contestan los dos. */
  function responderCarga(metas = METAS_DATA) {
    http.expectOne(PROYECTOS).flush({ projects: PROYECTOS_DATA });
    http.expectOne(METAS).flush({ goals: metas });
  }

  async function crearLista() {
    const fixture = TestBed.createComponent(GoalList);
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

  it('should load goals and projects and render them in the table', async () => {
    const { lista, compilado } = await crearLista();

    expect(lista.rows().length).toBe(3);
    expect(lista.projects().length).toBe(3);
    expect(lista.loading()).toBe(false);

    const texto = compilado.textContent ?? '';
    expect(texto).toContain('Instalar el sistema de riego por goteo');
    expect(texto).toContain('Huerta escolar Uribia');
    expect(texto).toContain('3 metas');
  });

  it('should show the backend error and an empty table when the load fails', async () => {
    const fixture = TestBed.createComponent(GoalList);
    http.expectOne(PROYECTOS).flush({ projects: [] });
    http
      .expectOne(METAS)
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

    expect(lista.tableRows().map((row) => row.value)).toEqual([5000000, 3500000.5, 12000000]);
  });

  it('should offer only active projects, plus the current one when editing', async () => {
    const { lista } = await crearLista();

    expect(lista.projectOptions().map((p) => p.id)).toEqual([1, 2]);

    lista.openEdit(METAS_DATA[2]); // su proyecto (3) está inactivo
    expect(lista.projectOptions().map((p) => p.id)).toEqual([1, 2, 3]);
  });

  it('should filter locally by description or project name without calling the backend', async () => {
    const { lista } = await crearLista();

    lista.filter.set('riego'); // descripción
    expect(lista.visibleRows().map((g) => g.id)).toEqual([2]);

    lista.filter.set('riohacha'); // título del proyecto
    expect(lista.visibleRows().map((g) => g.id)).toEqual([1]);

    http.expectNone(METAS);
    http.expectNone(PROYECTOS);
  });

  it('should add up only the target amounts of the active goals', async () => {
    const { lista } = await crearLista();

    expect(lista.activeCount()).toBe(2);
    expect(lista.activeTarget()).toBe(8500000.5); // 5000000.00 + 3500000.50, sin la inactiva
  });

  it('should POST a new goal with status and reload both lists', async () => {
    const { lista } = await crearLista();

    lista.openCreate();
    expect(lista.dialogVisible()).toBe(true);
    expect(lista.title()).toBe('Nueva meta');

    lista.save(NUEVA);

    const alta = http.expectOne(METAS);
    expect(alta.request.method).toBe('POST');
    expect(alta.request.body).toEqual(NUEVA);
    alta.flush({ goal: { id: 4, ...NUEVA } });

    expect(lista.dialogVisible()).toBe(false);
    responderCarga();
  });

  it('should PATCH the edited goal and send no status', async () => {
    const { lista } = await crearLista();

    lista.openEdit(METAS_DATA[0]);
    expect(lista.title()).toBe('Editar meta');

    const cambio: GoalPayload = {
      description: 'Comprar 600 libros infantiles para la biblioteca',
      target_amount: 6000000,
      project_id: 1,
    };
    lista.save(cambio);

    const peticion = http.expectOne(`${METAS}/1`);
    expect(peticion.request.method).toBe('PATCH');
    expect(peticion.request.body).toEqual(cambio);
    peticion.flush({ goal: METAS_DATA[0] });

    responderCarga();
  });

  it('should call deactivate after the confirmation is accepted', async () => {
    const { lista } = await crearLista();
    aceptarConfirmacion();

    lista.deactivate(METAS_DATA[0]);

    const baja = http.expectOne(`${METAS}/1/deactivate`);
    expect(baja.request.method).toBe('PATCH');
    baja.flush({ message: 'Goal deactivated (logical delete)' });

    responderCarga(METAS_DATA.slice(1));
  });

  it('should call DELETE after the confirmation is accepted and not when it is rejected', async () => {
    const { lista } = await crearLista();

    // Rechazada: no hay petición.
    const rechazo = vi.spyOn(confirmation, 'confirm').mockImplementation(() => confirmation);
    lista.deactivate(METAS_DATA[0]);
    lista.remove(METAS_DATA[0]);
    http.expectNone(`${METAS}/1/deactivate`);
    http.expectNone(`${METAS}/1`);
    rechazo.mockRestore();

    // Aceptada: DELETE y recarga.
    aceptarConfirmacion();
    lista.remove(METAS_DATA[0]);

    const borrado = http.expectOne(`${METAS}/1`);
    expect(borrado.request.method).toBe('DELETE');
    borrado.flush({ message: 'Goal deleted' });

    responderCarga(METAS_DATA.slice(1));
  });

  it('should keep the dialog open and show a toast when saving fails', async () => {
    const { lista } = await crearLista();
    const add = vi.spyOn(TestBed.inject(MessageService), 'add');

    lista.openCreate();
    lista.save(NUEVA);

    http
      .expectOne(METAS)
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
