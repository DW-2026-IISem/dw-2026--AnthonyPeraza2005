import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SessionStore } from '../../../core/services/session-store';
import { grantFullAccess } from '../../../core/testing/access';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { Project, ProjectPayload } from '../../../core/models/project.model';
import { Promoter } from '../../../core/models/promoter.model';
import { ProjectList } from './project-list';

const PROYECTOS = `${environment.apiUrl}/proyectos`;
const PROMOTORES = `${environment.apiUrl}/promotores`;

const PROMOTORES_DATA: Promoter[] = [
  {
    id: 1,
    name: 'Fundación Semillas del Caribe',
    description: null,
    contact_email: 'contacto@semillas.org',
    contact_phone: null,
    status: 'active',
  },
  {
    id: 2,
    name: 'Cooperativa Mar y Sol',
    description: null,
    contact_email: 'info@marysol.co',
    contact_phone: null,
    status: 'active',
  },
  {
    id: 3,
    name: 'Colectivo Huerta Viva',
    description: null,
    contact_email: 'hola@huertaviva.org',
    contact_phone: null,
    status: 'inactive',
  },
];

// Fechas extremas para que la fase no dependa del día en que se corra la prueba.
const PROYECTOS_DATA: Project[] = [
  {
    id: 1,
    title: 'Biblioteca comunitaria Riohacha',
    description: 'Dotar de libros y mobiliario a una biblioteca barrial',
    start_date: '2000-01-01',
    end_date: '2999-12-31', // en curso
    promoter_id: 1,
    status: 'active',
  },
  {
    id: 2,
    title: 'Huerta escolar Uribia',
    description: 'Huerta para el comedor de una escuela rural',
    start_date: '2000-01-01',
    end_date: '2000-12-31', // finalizado
    promoter_id: 2,
    status: 'active',
  },
  {
    id: 3,
    title: 'Becas de robótica Maicao',
    description: 'Becas para talleres de robótica juvenil',
    start_date: '2999-01-01',
    end_date: '2999-12-31', // próximo
    promoter_id: 3,
    status: 'active',
  },
];

const NUEVO: ProjectPayload = {
  title: 'Panadería comunitaria Manaure',
  description: 'Horno industrial para mujeres artesanas',
  start_date: '2026-11-01',
  end_date: '2027-03-31',
  promoter_id: 1,
  status: 'active',
};

describe('ProjectList', () => {
  let http: HttpTestingController;
  let confirmation: ConfirmationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectList],
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
  function responderCarga(proyectos = PROYECTOS_DATA, promotores = PROMOTORES_DATA) {
    http.expectOne(PROMOTORES).flush({ promoters: promotores });
    http.expectOne(PROYECTOS).flush({ projects: proyectos });
  }

  async function crearLista(proyectos = PROYECTOS_DATA) {
    const fixture = TestBed.createComponent(ProjectList);
    responderCarga(proyectos);
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

  it('should load projects and promoters and render them in the table', async () => {
    const { lista, compilado } = await crearLista();

    expect(lista.rows().length).toBe(3);
    expect(lista.promoters().length).toBe(3);
    expect(lista.loading()).toBe(false);

    const texto = compilado.textContent ?? '';
    expect(texto).toContain('Biblioteca comunitaria Riohacha');
    expect(texto).toContain('Fundación Semillas del Caribe');
    expect(texto).toContain('3 proyectos');
  });

  it('should show the backend error and an empty table when the load fails', async () => {
    const fixture = TestBed.createComponent(ProjectList);
    http.expectOne(PROMOTORES).flush({ promoters: [] });
    http
      .expectOne(PROYECTOS)
      .flush({ error: 'Missing Bearer token' }, { status: 401, statusText: 'Unauthorized' });
    fixture.detectChanges();
    await fixture.whenStable();

    const lista = fixture.componentInstance;
    expect(lista.error()).toBe('Missing Bearer token');
    expect(lista.rows()).toEqual([]);
    expect(lista.loading()).toBe(false);
  });

  it('should resolve the promoter name and fall back when it is unknown', async () => {
    const { lista } = await crearLista();

    expect(lista.promoterName()(1)).toBe('Fundación Semillas del Caribe');
    expect(lista.promoterName()(99)).toBe('Promotor #99');
  });

  it('should offer only active promoters, plus the current one when editing', async () => {
    const { lista } = await crearLista();

    expect(lista.promoterOptions().map((p) => p.id)).toEqual([1, 2]);

    lista.openEdit(PROYECTOS_DATA[2]); // su promotor (3) está inactivo
    expect(lista.promoterOptions().map((p) => p.id)).toEqual([1, 2, 3]);
  });

  it('should filter locally by title or promoter name without calling the backend', async () => {
    const { lista } = await crearLista();

    lista.filter.set('maicao');
    expect(lista.visibleRows().map((p) => p.id)).toEqual([3]);

    lista.filter.set('mar y sol'); // nombre del promotor, no del proyecto
    expect(lista.visibleRows().map((p) => p.id)).toEqual([2]);

    http.expectNone(PROYECTOS);
    http.expectNone(PROMOTORES);
  });

  it('should count the running projects', async () => {
    const { lista } = await crearLista();

    expect(lista.phase(PROYECTOS_DATA[0])).toBe('running');
    expect(lista.phase(PROYECTOS_DATA[1])).toBe('finished');
    expect(lista.phase(PROYECTOS_DATA[2])).toBe('upcoming');
    expect(lista.runningCount()).toBe(1);
  });

  it('should POST a new project and reload both lists', async () => {
    const { lista } = await crearLista();

    lista.openCreate();
    expect(lista.dialogVisible()).toBe(true);
    expect(lista.title()).toBe('Nuevo proyecto');

    lista.save(NUEVO);

    const alta = http.expectOne(PROYECTOS);
    expect(alta.request.method).toBe('POST');
    expect(alta.request.body).toEqual(NUEVO);
    alta.flush({ project: { id: 4, ...NUEVO } });

    expect(lista.dialogVisible()).toBe(false);
    responderCarga(); // recarga posterior de ambas listas
  });

  it('should PATCH the edited project and send no status', async () => {
    const { lista } = await crearLista();

    lista.openEdit(PROYECTOS_DATA[0]);
    expect(lista.title()).toBe('Editar proyecto');

    const cambio: ProjectPayload = {
      title: 'Biblioteca comunitaria Riohacha',
      description: 'Dotar de libros y mobiliario a una biblioteca barrial',
      start_date: '2000-01-01',
      end_date: '2999-12-31',
      promoter_id: 2,
    };
    lista.save(cambio);

    const peticion = http.expectOne(`${PROYECTOS}/1`);
    expect(peticion.request.method).toBe('PATCH');
    expect(peticion.request.body).toEqual(cambio);
    peticion.flush({ project: PROYECTOS_DATA[0] });

    responderCarga();
  });

  it('should call deactivate after the confirmation is accepted', async () => {
    const { lista } = await crearLista();
    aceptarConfirmacion();

    lista.deactivate(PROYECTOS_DATA[0]);

    const baja = http.expectOne(`${PROYECTOS}/1/deactivate`);
    expect(baja.request.method).toBe('PATCH');
    baja.flush({ message: 'Project deactivated (logical delete)' });

    responderCarga(PROYECTOS_DATA.slice(1));
  });

  it('should call DELETE after the confirmation is accepted', async () => {
    const { lista } = await crearLista();
    aceptarConfirmacion();

    lista.remove(PROYECTOS_DATA[0]);

    const borrado = http.expectOne(`${PROYECTOS}/1`);
    expect(borrado.request.method).toBe('DELETE');
    borrado.flush({ message: 'Project deleted' });

    responderCarga(PROYECTOS_DATA.slice(1));
  });

  it('should not call the backend when the confirmation is rejected', async () => {
    const { lista } = await crearLista();
    vi.spyOn(confirmation, 'confirm').mockImplementation(() => confirmation);

    lista.deactivate(PROYECTOS_DATA[0]);
    lista.remove(PROYECTOS_DATA[0]);

    http.expectNone(`${PROYECTOS}/1/deactivate`);
    http.expectNone(`${PROYECTOS}/1`);
  });

  it('should keep the dialog open and show a toast when saving fails', async () => {
    const { lista } = await crearLista();
    const add = vi.spyOn(TestBed.inject(MessageService), 'add');

    lista.openCreate();
    lista.save(NUEVO);

    http
      .expectOne(PROYECTOS)
      .flush(
        { error: 'Validation error', detail: 'promoter_id does not exist' },
        { status: 400, statusText: 'Bad Request' },
      );

    expect(lista.dialogVisible()).toBe(true);
    expect(lista.saving()).toBe(false);
    expect(add).toHaveBeenCalledWith(
      expect.objectContaining({ severity: 'error', summary: 'No se pudo guardar' }),
    );
  });
});
